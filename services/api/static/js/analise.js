document.addEventListener('DOMContentLoaded', async () => {
    console.log("Analysis Page Loaded (Enhanced)");

    // Constants
    const COLORS = {
        sage: '#74C69D',
        slateBlue: '#64748B',
        coral: '#E76F51',
        amber: '#E9C46A',
        danger: '#EF4444'
    };

    // Update Date Header
    const dateEl = document.getElementById('header-date');
    if (dateEl) {
        const now = new Date();
        dateEl.innerText = now.toLocaleDateString() + ' - Hoje';
    }

    // Initialize Chart
    let chartComparison = null;
    const ctx = document.getElementById('chartComparison');

    if (ctx) {
        chartComparison = new Chart(ctx.getContext('2d'), {
            type: 'line',
            data: {
                labels: [],
                datasets: [
                    {
                        label: 'Risco VDS',
                        data: [],
                        type: 'line', // Changed to Line for "Curve" effect
                        backgroundColor: 'rgba(231, 111, 81, 0.2)', // Coral transparent area
                        borderColor: COLORS.coral,
                        borderWidth: 2,
                        pointRadius: 0, // Clean look, no dots
                        fill: true,
                        tension: 0.4,
                        yAxisID: 'y_vds',
                        order: 3 // Draw first (behind)
                    },
                    {
                        label: 'Temperatura (°C)',
                        data: [],
                        borderColor: COLORS.sage,
                        backgroundColor: COLORS.sage,
                        borderWidth: 3,
                        tension: 0.4,
                        pointRadius: 2,
                        fill: false,
                        yAxisID: 'y_temp',
                        order: 1 // Draw on top
                    },
                    {
                        label: 'Umidade (%)',
                        data: [],
                        borderColor: COLORS.slateBlue,
                        backgroundColor: COLORS.slateBlue,
                        borderWidth: 2,
                        borderDash: [5, 5],
                        tension: 0.4,
                        pointRadius: 0,
                        fill: false,
                        yAxisID: 'y_umid',
                        order: 2
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
                    y_temp: {
                        type: 'linear',
                        display: true,
                        position: 'left',
                        title: { display: true, text: 'Temperatura (°C)', color: COLORS.sage, font: { weight: 'bold' } },
                        grid: { color: '#f1f5f9' },
                        suggestedMin: 10,
                        suggestedMax: 40
                    },
                    y_umid: {
                        type: 'linear',
                        display: true,
                        position: 'right',
                        title: { display: true, text: 'Umidade (%)', color: COLORS.slateBlue, font: { weight: 'bold' } },
                        grid: { drawOnChartArea: false },
                        min: 0,
                        max: 100
                    },
                    y_vds: {
                        type: 'linear',
                        display: true, // Keep distinct but maybe minimal
                        position: 'right',
                        min: 0,
                        max: 5, // Fixed Scale for Risk
                        grid: { drawOnChartArea: false },
                        title: { display: true, text: 'Índice de Risco', color: COLORS.coral, font: { weight: 'bold' } },
                        ticks: { color: COLORS.coral },
                        display: false // HIDING Axis labels to reduce clutter as requested
                    }
                },
                plugins: {
                    legend: {
                        position: 'top',
                        align: 'end',
                        labels: { usePointStyle: true, boxWidth: 8, padding: 20 }
                    },
                    tooltip: {
                        backgroundColor: 'rgba(255, 255, 255, 0.9)',
                        titleColor: '#1e293b',
                        bodyColor: '#475569',
                        borderColor: '#e2e8f0',
                        borderWidth: 1,
                        padding: 10,
                        callbacks: {
                            label: function (context) {
                                let label = context.dataset.label || '';
                                if (label) {
                                    label += ': ';
                                }
                                if (context.parsed.y !== null) {
                                    label += context.parsed.y.toFixed(1);
                                }
                                return label;
                            }
                        }
                    }
                }
            }
        });
    }

    // Load Dropdowns (Config)
    async function loadConfig() {
        try {
            const res = await fetch('/api/config');
            const data = await res.json();

            // Populate Planta
            const selPlanta = document.getElementById('sel-planta');
            if (selPlanta && data.plantas) {
                // Keep first default option
                selPlanta.innerHTML = '<option value="">Cultura</option>';
                data.plantas.forEach(p => {
                    const opt = document.createElement('option');
                    opt.value = p; opt.innerText = p;
                    selPlanta.appendChild(opt);
                });
            }

            // Populate Doenca
            const selDoenca = document.getElementById('sel-doenca');
            if (selDoenca && data.doencas) {
                selDoenca.innerHTML = '<option value="">Patógeno</option>';
                data.doencas.forEach(d => {
                    const opt = document.createElement('option');
                    opt.value = d; opt.innerText = d;
                    selDoenca.appendChild(opt);
                });
            }
        } catch (e) { console.error("Config Load Error", e); }
    }

    // Call loadConfig immediately
    loadConfig();

    // Fetch and Update Data
    async function updateDashboard() {
        try {
            // 1. Fetch Analyzed History (includes VDS)
            // Ideally we'd pass selected filters as query params: /api/relatorios/analise?planta=X&doenca=Y
            const resHist = await fetch('/api/relatorios/analise?dias=30');
            const jsonHist = await resHist.json();
            const dataHist = jsonHist.vds || [];

            if (dataHist.length > 0) {
                const last = dataHist[dataHist.length - 1];

                // Update Cards (Status Atual)
                const valTemp = document.getElementById('val-temp-atual');
                if (valTemp) valTemp.innerHTML = `${last.temperatura.toFixed(1)}<span class="text-xs text-text-secondary ml-1">°C</span>`;

                const valUmid = document.getElementById('val-umid-atual');
                if (valUmid) valUmid.innerText = `${last.umidade.toFixed(1)}% Umidade`;

                // Update Chart (Last 48 points for trend)
                if (chartComparison) {
                    const recentData = dataHist.slice(-48);

                    const labels = recentData.map(d => {
                        let dateStr = d.data_hora;
                        if (dateStr.indexOf('T') === -1) dateStr = dateStr.replace(' ', 'T');
                        // Format: DD/MM HH:mm
                        const dateObj = new Date(dateStr);
                        return `${dateObj.getDate().toString().padStart(2, '0')}/${(dateObj.getMonth() + 1).toString().padStart(2, '0')} ${dateObj.getHours().toString().padStart(2, '0')}:${dateObj.getMinutes().toString().padStart(2, '0')}`;
                    });

                    chartComparison.data.labels = labels;
                    chartComparison.data.datasets[1].data = recentData.map(d => d.temperatura); // Index 1 is Temp
                    chartComparison.data.datasets[2].data = recentData.map(d => d.umidade);    // Index 2 is Umid
                    chartComparison.data.datasets[0].data = recentData.map(d => d.vds);        // Index 0 is VDS (Background)
                    chartComparison.update();
                }

                // Calculate Accumulated GDD 
                // APPROXIMATION: Sum max(0, (Tmean - 10)) / 24 for hourly data points
                let gddSum = 0;
                dataHist.forEach(d => {
                    const t = d.temperatura;
                    const gddHour = Math.max(0, (t - 10)) / 24;
                    gddSum += gddHour;
                });

                const lblGddAcum = document.getElementById('lbl-gdd-acumulado');
                if (lblGddAcum) lblGddAcum.innerText = gddSum.toFixed(1);

                const targetGDD = 1500; // Mock target
                const progressPct = Math.min(100, (gddSum / targetGDD) * 100);
                const progressBar = document.getElementById('bar-progresso-safra');
                if (progressBar) progressBar.style.width = `${progressPct}%`;
            }

            // 2. Fetch Prediction
            const resPrev = await fetch('/api/previsao');
            const dataPrev = await resPrev.json();

            if (dataPrev.tendencia) {
                const txtTitulo = document.getElementById('txt-previsao-titulo');
                if (txtTitulo) txtTitulo.innerText = dataPrev.tendencia;

                const gddLabel = document.getElementById('lbl-gdd');
                if (gddLabel) gddLabel.innerText = `GDD Diário Previsto: ${dataPrev.gdd_previsto?.toFixed(1) || '--'}`;

                // Update Risk Card
                if (dataPrev.vds_previsto !== undefined) {
                    const valVds = document.getElementById('val-vds-previsto');
                    if (valVds) valVds.innerText = dataPrev.vds_previsto.toFixed(2);

                    const lblRisco = document.getElementById('lbl-risco-nivel');
                    if (lblRisco) {
                        lblRisco.innerText = dataPrev.risco;
                        if (dataPrev.risco === 'ALTO') lblRisco.className = "text-[10px] font-bold text-white bg-coral-muted px-1.5 py-0.5 rounded uppercase mb-1";
                        else if (dataPrev.risco === 'MÉDIO') lblRisco.className = "text-[10px] font-bold text-white bg-amber-muted px-1.5 py-0.5 rounded uppercase mb-1";
                        else lblRisco.className = "text-[10px] font-bold text-white bg-sage px-1.5 py-0.5 rounded uppercase mb-1";
                    }
                }
            }

        } catch (e) {
            console.error("Error updating analysis dashboard:", e);
        }
    }

    // React to filters
    const selPlanta = document.getElementById('sel-planta');
    if (selPlanta) selPlanta.addEventListener('change', updateDashboard);

    const selDoenca = document.getElementById('sel-doenca');
    if (selDoenca) selDoenca.addEventListener('change', updateDashboard);

    updateDashboard();
    setInterval(updateDashboard, 15000);
});
