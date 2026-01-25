document.addEventListener('DOMContentLoaded', async () => {
    console.log("History Page Loaded (New Design)");

    // Define weather/risk helpers
    const getRiskBadge = (vds) => {
        // vds is numeric 0-X. 
        // 0-0.5 Low, 0.5-1.0 Medium, > 1.0 High
        let label = 'BAIXO';
        let classes = 'bg-green-50 text-green-700 border-green-200';

        if (vds > 1.0) {
            label = 'ALTO';
            classes = 'bg-red-50 text-red-700 border-red-200';
        } else if (vds > 0.5) {
            label = 'MÉDIO';
            classes = 'bg-amber-50 text-amber-700 border-amber-200';
        }

        return `<span class="px-2 py-1 rounded text-[10px] font-bold border ${classes}">${label}</span>`;
    };

    const formatDate = (dateStr) => {
        // Handle "YYYY-MM-DD HH:MM:SS" or "YYYY-MM-DDTHH:MM:SS"
        if (dateStr.indexOf('T') === -1) dateStr = dateStr.replace(' ', 'T');
        try {
            const d = new Date(dateStr);
            if (isNaN(d.getTime())) return dateStr;
            return d.toLocaleString('pt-BR', { day: '2-digit', month: '2-digit', year: '2-digit', hour: '2-digit', minute: '2-digit' });
        } catch (e) { return dateStr; }
    };

    // Update Date Header
    const dateEl = document.getElementById('header-date');
    if (dateEl) {
        const now = new Date();
        dateEl.innerText = now.toLocaleDateString() + ' - Hoje';
    }

    const tbody = document.getElementById('history-table-body');
    const footerCount = document.getElementById('footer-count');

    async function loadHistory() {
        try {
            // Using /api/relatorios/analise to get the VDS calculation included
            const res = await fetch('/api/relatorios/analise?dias=30');
            const json = await res.json();
            const data = json.vds || [];

            if (data.length === 0) {
                tbody.innerHTML = '<tr><td colspan="6" class="px-5 py-8 text-center text-text-secondary">Nenhum dado encontrado.</td></tr>';
                return;
            }

            tbody.innerHTML = '';
            // Reverse to show newest first? API usually returns chronological.
            // Let's reverse for "Latest on top"
            const reversedData = [...data].reverse();

            reversedData.forEach(row => {
                const tr = document.createElement('tr');
                tr.className = "group hover:bg-slate-50/80 transition-colors border-b border-gray-50 last:border-0";

                // MOCK INTERVENTION for Demo purposes if random criteria met (or just empty)
                const hasIntervention = false; // row.vds > 1.5 ? true : false;

                tr.innerHTML = `
                    <td class="px-5 py-4 font-mono text-text-secondary text-xs">${formatDate(row.data_hora)}</td>
                    <td class="px-5 py-4">
                        <div class="flex items-center gap-4">
                            <div class="flex items-center gap-1.5 font-medium text-text-primary">
                                <span class="material-symbols-outlined text-coral-muted text-[16px]">device_thermostat</span>
                                ${row.temperatura.toFixed(1)}°C
                            </div>
                            <div class="w-px h-3 bg-border-light"></div>
                            <div class="flex items-center gap-1.5 font-medium text-text-primary">
                                <span class="material-symbols-outlined text-slate-blue text-[16px]">water_drop</span>
                                ${row.umidade.toFixed(1)}%
                            </div>
                        </div>
                    </td>
                    <td class="px-5 py-4">
                        <div class="flex items-center gap-2 text-text-secondary">
                             <!-- Mock Web Data for History (since we don't store historical API data yet) -->
                             <span class="material-symbols-outlined text-[18px] text-amber-muted">partly_cloudy_day</span>
                             <span>--</span>
                        </div>
                    </td>
                    <td class="px-5 py-4">
                        <div class="flex items-center gap-2">
                           ${getRiskBadge(row.vds)}
                           <span class="text-xs text-text-secondary">(${row.vds.toFixed(2)})</span>
                        </div>
                    </td>
                    <td class="px-5 py-4">
                        ${hasIntervention ?
                        `<div class="flex items-center gap-2 text-text-primary font-medium">
                                <span class="material-symbols-outlined text-slate-400 text-[16px]">agriculture</span>
                                Tratamento
                            </div>`
                        :
                        `<span class="text-slate-400 italic text-xs">Nenhuma ação</span>`
                    }
                    </td>
                    <td class="px-5 py-4 text-right">
                        <button class="text-sage hover:text-green-700 text-xs font-bold opacity-0 group-hover:opacity-100 transition-opacity uppercase tracking-wide">
                            Detalhes
                        </button>
                    </td>
                `;
                tbody.appendChild(tr);
            });

            if (footerCount) footerCount.innerText = `Mostrando ${data.length} registros`;

        } catch (e) {
            console.error("Error loading history:", e);
            tbody.innerHTML = '<tr><td colspan="6" class="px-5 py-8 text-center text-red-500">Erro ao carregar dados. Verifique a conexão.</td></tr>';
        }
    }

    loadHistory();
    // Refresh every 30s
    setInterval(loadHistory, 30000);
});
