document.addEventListener('DOMContentLoaded', function () {
    console.log("Dashboard Loaded");

    // Initialize Chart
    let mainChart = null;
    try {
        if (typeof Chart === 'undefined') throw new Error("Chart.js not loaded");

        const ctx = document.getElementById('mainChart').getContext('2d');
        mainChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: [],
                datasets: [
                    {
                        label: 'Temperatura (°C)',
                        data: [],
                        borderColor: '#ED8936',
                        backgroundColor: 'rgba(237, 137, 54, 0.1)',
                        yAxisID: 'y',
                        tension: 0.4,
                        fill: true
                    },
                    {
                        label: 'Umidade (%)',
                        data: [],
                        borderColor: '#276749',
                        backgroundColor: 'rgba(39, 103, 73, 0.1)',
                        yAxisID: 'y1',
                        tension: 0.4,
                        fill: true
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                interaction: {
                    mode: 'index',
                    intersect: false,
                },
                scales: {
                    y: {
                        type: 'linear',
                        display: true,
                        position: 'left',
                        title: { display: true, text: 'Temperatura' }
                    },
                    y1: {
                        type: 'linear',
                        display: true,
                        position: 'right',
                        grid: { drawOnChartArea: false },
                        title: { display: true, text: 'Umidade' }
                    },
                    x: {
                        type: 'time',
                        time: {
                            unit: 'minute',
                            displayFormats: {
                                minute: 'HH:mm'
                            }
                        },
                        title: { display: true, text: 'Horário' }
                    }
                }
            }
        });
    } catch (e) {
        console.error("Chart Init Error:", e);
        // Continue execution so dropdowns still load
    }

    // Function to fetch data
    async function fetchData() {
        try {
            const response = await fetch('/api/historico');
            const data = await response.json();

            if (!data || data.length === 0) return;

            // Update Arrays for Chart
            const labels = [];
            const temps = [];
            const umids = [];

            // Sort data by time if needed (usually DB returns sorted)
            data.forEach(reading => {
                // Fix Date Format (Space -> T) for Safari/Cross-Browser compatibility
                let dateStr = reading.data_hora;
                if (dateStr && typeof dateStr === 'string' && dateStr.indexOf('T') === -1) {
                    dateStr = dateStr.replace(' ', 'T');
                }
                const date = new Date(dateStr);

                labels.push(date);
                temps.push(reading.temperatura);
                umids.push(reading.umidade);
            });

            // Update Chart
            if (mainChart) {
                mainChart.data.labels = labels;
                mainChart.data.datasets[0].data = temps;
                mainChart.data.datasets[1].data = umids;
                mainChart.update();
            }

            // Update Current Values (Last Reading)
            const last = data[data.length - 1];
            if (last) {
                document.getElementById('val-temp').innerText = last.temperatura.toFixed(1);
                document.getElementById('val-umid').innerText = last.umidade.toFixed(1);

                let lastDateStr = last.data_hora;
                if (lastDateStr && typeof lastDateStr === 'string' && lastDateStr.indexOf('T') === -1) {
                    lastDateStr = lastDateStr.replace(' ', 'T');
                }
                document.getElementById('last-update').innerText = 'Última atualização: ' + new Date(lastDateStr).toLocaleTimeString();

                // Simple Risk Calculation (Mockup)
                // In future this should come from API /api/risk
                let risk = "BAIXO";
                if (last.temperatura > 25 && last.umidade > 80) risk = "ALTO";
                else if (last.temperatura > 20 && last.umidade > 70) risk = "MÉDIO";

                const riskEl = document.getElementById('val-risco');
                if (riskEl) riskEl.innerText = risk;
            }

        } catch (error) {
            console.error('Error fetching data:', error);
        }
    }

    // --- Dropdown Management & Configuration ---
    let configData = null;

    async function loadConfig() {
        try {
            const res = await fetch('/api/config');
            configData = await res.json();

            // Populate Plants
            const selPlanta = document.getElementById('sel-planta');
            if (selPlanta) {
                selPlanta.innerHTML = '';
                configData.plantas.forEach(p => {
                    const opt = document.createElement('option');
                    opt.value = p;
                    opt.innerText = p;
                    selPlanta.appendChild(opt);
                });
                // Trigger change to populate dependent dropdowns
                selPlanta.addEventListener('change', updateDropdowns);
                updateDropdowns(); // Initial call
            }

            // Populate Diseases (Initial)
            const selDoenca = document.getElementById('sel-doenca');
            if (selDoenca) {
                selDoenca.innerHTML = '';
                configData.doencas.forEach(d => {
                    const opt = document.createElement('option');
                    opt.value = d;
                    opt.innerText = d;
                    selDoenca.appendChild(opt);
                });
            }

        } catch (e) {
            console.error("Error loading config:", e);
        }
    }

    function updateDropdowns() {
        if (!configData) return;

        const selPlanta = document.getElementById('sel-planta');
        const selEstadio = document.getElementById('sel-estadio');

        if (!selPlanta || !selEstadio) return;

        const planta = selPlanta.value;
        const estadios = configData.estadios_por_planta[planta] || [];

        selEstadio.innerHTML = '';
        estadios.forEach(e => {
            const opt = document.createElement('option');
            opt.value = e;
            opt.innerText = e;
            selEstadio.appendChild(opt);
        });
    }

    // Initialize
    loadConfig();
    fetchData();
    fetchPrediction(); // New call
    setInterval(fetchData, 5000); // Poll every 5 seconds

    // --- Weather Prediction ---
    async function fetchPrediction() {
        try {
            const resp = await fetch('/api/previsao');
            const data = await resp.json();

            if (data.tendencia) {
                // Update Prediction Card
                const elTrend = document.getElementById('val-risco-futuro');
                const elContext = document.querySelector('#card-previsao p.text-gray-500'); // "Tendência para amanhã" fallback

                if (elTrend) elTrend.innerText = data.tendencia;

                // Add details if possible (tooltip or subtitle)
                if (data.detalhes && elContext) {
                    elContext.innerText = `${data.detalhes}`;
                    elContext.title = "Previsão para amanhã (Open-Meteo)";
                }
            }
        } catch (e) {
            console.error("Prediction Fetch Error:", e);
        }
    }
});
