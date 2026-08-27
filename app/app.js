const DEMO_PATIENTS = {
    "patient-1": {
        name: "Carlos Martínez García",
        gender: "Hombre",
        age: 68,
        psa: [
            { date: "15/01/2023", value: 3.2, selected: true },
            { date: "20/06/2023", value: 3.9, selected: true },
            { date: "10/11/2023", value: 5.1, selected: true },
            { date: "05/03/2024", value: 6.8, selected: true },
            { date: "22/07/2024", value: 8.9, selected: true },
            { date: "18/11/2024", value: 12.4, selected: true }
        ],
        events: [
            { fecha: "15/01/2023", tipo: "DIAGNÓSTICO", color: "#3b82f6", detalle: "Inicio de seguimiento activo" },
            { fecha: "10/11/2023", tipo: "BIOPSIA", color: "#f59e0b", detalle: "Biopsia de próstata (Gleason 3+4)" },
            { fecha: "15/03/2024", tipo: "RADIOTERAPIA", color: "#8b5cf6", detalle: "Inicio de Radioterapia Externa" },
            { fecha: "15/03/2024", tipo: "T. HORMONAL", color: "#10b981", detalle: "Bloqueo Androgénico (Leuprorelina)" }
        ]
    },
    "patient-2": {
        name: "Manuel Navarro Ruiz",
        gender: "Hombre",
        age: 64,
        psa: [
            { date: "10/05/2022", value: 14.5, selected: true },
            { date: "14/09/2022", value: 8.2, selected: true },
            { date: "18/02/2023", value: 2.1, selected: true },
            { date: "05/08/2023", value: 0.4, selected: true },
            { date: "20/02/2024", value: 0.1, selected: true },
            { date: "15/09/2024", value: 0.05, selected: true }
        ],
        events: [
            { fecha: "10/05/2022", tipo: "DIAGNÓSTICO", color: "#3b82f6", detalle: "Adenocarcinoma de próstata estadio II" },
            { fecha: "01/06/2022", tipo: "PROSTATECTOMÍA", color: "#ec4899", detalle: "Prostatectomía Radical Laparoscópica" },
            { fecha: "18/02/2023", tipo: "REVISIÓN", color: "#10b981", detalle: "Respuesta bioquímica completa" }
        ]
    },
    "patient-3": {
        name: "Antonio Fernández López",
        gender: "Hombre",
        age: 73,
        psa: [
            { date: "01/03/2023", value: 4.1, selected: true },
            { date: "15/07/2023", value: 4.3, selected: true },
            { date: "01/12/2023", value: 4.2, selected: true },
            { date: "10/04/2024", value: 4.5, selected: true },
            { date: "20/08/2024", value: 4.4, selected: true }
        ],
        events: [
            { fecha: "01/03/2023", tipo: "REVISIÓN", color: "#10b981", detalle: "Hiperplasia Benigna de Próstata (HBP) estable" }
        ]
    }
};

let currentPatient = null;
let chartInstance = null;
let activeTab = 'grafica';
let showAverageLine = true;
let showProjectionOnChart = true;
let showOverlayStats = true;
let projectionMonths = 6;
let calculatedPSADT = null;
let calculatedPSAV = null;
let predictedPSA = null;

window.addEventListener("DOMContentLoaded", () => {
    loadPatient("patient-1");
});

function onPatientSelect(id) {
    loadPatient(id);
}

function loadPatient(id) {
    currentPatient = JSON.parse(JSON.stringify(DEMO_PATIENTS[id]));
    document.getElementById("patientName").innerText = currentPatient.name;
    document.getElementById("patientGender").innerText = currentPatient.gender;
    document.getElementById("patientAge").innerText = currentPatient.age + " años";

    renderCheckboxes();
    renderHistoryTable();
    updateKinetics();
}

function setActiveTab(tab) {
    activeTab = tab;
    document.querySelectorAll(".lyra-modal-tab-btn").forEach(btn => btn.classList.remove("lyra-active"));
    document.getElementById("tabBtn-" + tab).classList.add("lyra-active");

    if (tab === 'calculadora') {
        document.getElementById("calcSection").style.display = "block";
    } else {
        document.getElementById("calcSection").style.display = "none";
    }

    renderChart();
}

function setProjectionMonths(m) {
    projectionMonths = Number(m);
    document.querySelectorAll(".lyra-chip-btn").forEach(btn => {
        btn.classList.toggle("active", btn.dataset.months == m);
    });
    updateKinetics();
}

function renderCheckboxes() {
    const container = document.getElementById("psaCheckboxes");
    container.innerHTML = "";

    currentPatient.psa.forEach((p, idx) => {
        const label = document.createElement("label");
        label.className = "lyra-calc-checkbox-label";
        label.innerHTML = `
            <input type="checkbox" ${p.selected ? 'checked' : ''} onchange="togglePoint(${idx})">
            <span class="lyra-calc-date">${p.date}:</span>
            <span class="lyra-calc-val">${p.value} ng/mL</span>
        `;
        container.appendChild(label);
    });
}

function renderHistoryTable() {
    const tbody = document.getElementById("historyTableBody");
    tbody.innerHTML = "";

    const combined = [];
    currentPatient.psa.forEach(p => {
        combined.push({
            fecha: p.date,
            tipo: "Medición PSA",
            valor: p.value + " ng/mL",
            detalle: "Antígeno Prostático Específico",
            color: "#0284c7",
            isEvent: false
        });
    });

    currentPatient.events.forEach(e => {
        combined.push({
            fecha: e.fecha,
            tipo: e.tipo,
            valor: "—",
            detalle: e.detalle,
            color: e.color,
            isEvent: true
        });
    });

    // Ordenar descendente
    combined.sort((a, b) => {
        const dA = parseDateString(a.fecha);
        const dB = parseDateString(b.fecha);
        return dB.getTime() - dA.getTime();
    });

    combined.forEach(item => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
            <td><strong>${item.fecha}</strong></td>
            <td><span class="lyra-badge" style="background-color: ${item.color}15; color: ${item.color}; border: 1px solid ${item.color}40;">${item.tipo}</span></td>
            <td><strong style="color: ${item.isEvent ? '#94a3b8' : '#0284c7'};">${item.valor}</strong></td>
            <td style="color: #64748b;">${item.detalle}</td>
        `;
        tbody.appendChild(tr);
    });
}

function togglePoint(idx) {
    currentPatient.psa[idx].selected = !currentPatient.psa[idx].selected;
    updateKinetics();
}

function parseDateString(dStr) {
    const parts = dStr.split('/');
    return new Date(parseInt(parts[2]), parseInt(parts[1]) - 1, parseInt(parts[0]));
}

function updateKinetics() {
    const selected = currentPatient.psa.filter(p => p.selected);

    if (selected.length < 2) {
        calculatedPSADT = null;
        calculatedPSAV = null;
        predictedPSA = null;
    } else {
        const t0 = parseDateString(selected[0].date).getTime() / (1000 * 60 * 60 * 24 * 365.25);
        const points = selected.map(p => {
            const t = (parseDateString(p.date).getTime() / (1000 * 60 * 60 * 24 * 365.25)) - t0;
            return { t, y: p.value, lnY: Math.log(p.value > 0 ? p.value : 0.001) };
        });

        const n = points.length;
        const sumT = points.reduce((acc, p) => acc + p.t, 0);
        const sumY = points.reduce((acc, p) => acc + p.y, 0);
        const sumLnY = points.reduce((acc, p) => acc + p.lnY, 0);
        const sumT2 = points.reduce((acc, p) => acc + (p.t * p.t), 0);
        const sumTLnY = points.reduce((acc, p) => acc + (p.t * p.lnY), 0);
        const sumTY = points.reduce((acc, p) => acc + (p.t * p.y), 0);

        const denom = (n * sumT2 - sumT * sumT);
        if (Math.abs(denom) > 1e-9) {
            calculatedPSAV = (n * sumTY - sumT * sumY) / denom; // ng/mL/año
            const slopeLn = (n * sumTLnY - sumT * sumLnY) / denom;
            
            if (slopeLn > 0.001) {
                const psadtYears = Math.log(2) / slopeLn;
                calculatedPSADT = psadtYears * 12; // meses
                
                // Proyección exponencial
                const lastPoint = selected[selected.length - 1];
                const deltaYears = projectionMonths / 12;
                predictedPSA = lastPoint.value * Math.exp(slopeLn * deltaYears);
            } else {
                calculatedPSADT = null;
                predictedPSA = null;
            }
        }
    }

    // Actualizar UI
    const psavEl = document.getElementById("resPSAV");
    const psadtEl = document.getElementById("resPSADT");
    const predEl = document.getElementById("resPredicted");

    if (calculatedPSAV !== null) {
        const perMonth = (calculatedPSAV / 12).toFixed(2);
        psavEl.innerHTML = `${perMonth} <span class="lyra-res-unit">ng/mL/mes</span> <span class="lyra-res-sub">(${calculatedPSAV.toFixed(2)} ng/mL/año)</span>`;
    } else {
        psavEl.innerHTML = `<span class="lyra-disabled">—</span>`;
    }

    if (calculatedPSADT !== null) {
        psadtEl.innerHTML = `${calculatedPSADT.toFixed(1)} <span class="lyra-res-unit">meses</span> <span class="lyra-res-sub">(${(calculatedPSADT / 12).toFixed(2)} años)</span>`;
    } else if (calculatedPSAV !== null && calculatedPSAV <= 0) {
        psadtEl.innerHTML = `<span class="lyra-stable">Estable / En Descenso</span>`;
    } else {
        psadtEl.innerHTML = `<span class="lyra-disabled">—</span>`;
    }

    if (predictedPSA !== null) {
        predEl.innerHTML = `${predictedPSA.toFixed(2)} <span class="lyra-res-unit">ng/mL</span> <span class="lyra-res-sub">(a ${projectionMonths} meses)</span>`;
    } else {
        predEl.innerHTML = `<span class="lyra-disabled">—</span>`;
    }

    renderChart();
}

function onTogglesChange() {
    showAverageLine = document.getElementById("toggleAvg").checked;
    showProjectionOnChart = document.getElementById("toggleProj").checked;
    showOverlayStats = document.getElementById("toggleStats").checked;
    renderChart();
}

function renderChart() {
    const canvas = document.getElementById("lyraModalChartCanvas");
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

    const psaSource = currentPatient.psa;
    const eventSource = currentPatient.events;

    let allDates = Array.from(new Set([
        ...psaSource.map(d => d.date),
        ...eventSource.map(e => e.fecha)
    ])).sort((a, b) => {
        const dA = parseDateString(a);
        const dB = parseDateString(b);
        return dA.getTime() - dB.getTime();
    });

    if (showProjectionOnChart && predictedPSA !== null && psaSource.length > 0) {
        const lastDate = parseDateString(psaSource[psaSource.length - 1].date);
        const projDate = new Date(lastDate);
        projDate.setMonth(projDate.getMonth() + projectionMonths);
        const projDateStr = ("0" + projDate.getDate()).slice(-2) + "/" + ("0" + (projDate.getMonth() + 1)).slice(-2) + "/" + projDate.getFullYear();
        if (!allDates.includes(projDateStr)) {
            allDates.push(projDateStr);
        }
    }

    const colorPSA = '#0284c7';
    const gradient = ctx.createLinearGradient(0, 0, 0, 300);
    gradient.addColorStop(0, 'rgba(2, 132, 199, 0.25)');
    gradient.addColorStop(1, 'rgba(2, 132, 199, 0.0)');

    // Vertical Event Lines Plugin (Líneas verticales de colores para procedimientos)
    const verticalEventLinesPlugin = {
        id: 'verticalEventLines',
        afterDatasetsDraw: (chart) => {
            const drawCtx = chart.ctx;
            const xAxis = chart.scales.x;
            const yAxis = chart.scales.y;

            eventSource.forEach(evt => {
                const xPixel = xAxis.getPixelForValue(evt.fecha);
                if (xPixel !== undefined && !isNaN(xPixel)) {
                    drawCtx.save();
                    drawCtx.beginPath();
                    drawCtx.setLineDash([4, 4]);
                    drawCtx.lineWidth = 1.5;
                    drawCtx.strokeStyle = evt.color;
                    drawCtx.moveTo(xPixel, yAxis.top);
                    drawCtx.lineTo(xPixel, yAxis.bottom);
                    drawCtx.stroke();

                    // Dibujar icono/caja superior
                    drawCtx.fillStyle = evt.color;
                    drawCtx.beginPath();
                    drawCtx.arc(xPixel, yAxis.top + 8, 4, 0, 2 * Math.PI);
                    drawCtx.fill();
                    drawCtx.restore();
                }
            });
        }
    };

    // Horizontal Threshold Line (4.0 ng/mL)
    const horizontalAverageLinePlugin = {
        id: 'horizontalAverageLine',
        afterDatasetsDraw: (chart) => {
            if (!showAverageLine) return;
            const drawCtx = chart.ctx;
            const yAxis = chart.scales.y;
            const xAxis = chart.scales.x;

            const yPixel = yAxis.getPixelForValue(4.0);
            if (yPixel !== undefined && !isNaN(yPixel) && yPixel >= yAxis.top && yPixel <= yAxis.bottom) {
                drawCtx.save();
                drawCtx.beginPath();
                drawCtx.setLineDash([6, 6]);
                drawCtx.lineWidth = 1.5;
                drawCtx.strokeStyle = '#ef4444';
                drawCtx.moveTo(xAxis.left, yPixel);
                drawCtx.lineTo(xAxis.right, yPixel);
                drawCtx.stroke();

                drawCtx.fillStyle = '#ef4444';
                drawCtx.font = '600 10px Outfit, sans-serif';
                drawCtx.fillText('Umbral Normal (4.0 ng/mL)', xAxis.right - 130, yPixel - 6);
                drawCtx.restore();
            }
        }
    };

    // Interpolación de datos reales para que los eventos coincidan
    const datasetData = allDates.map(date => {
        const real = psaSource.find(d => d.date === date);
        if (real) return { x: date, y: real.value };

        const targetTime = parseDateString(date).getTime();
        let prev = null, next = null;
        for (const d of psaSource) {
            const t = parseDateString(d.date).getTime();
            if (t < targetTime) prev = d;
            else if (t > targetTime && !next) next = d;
        }

        if (prev && next) {
            const pT = parseDateString(prev.date).getTime();
            const nT = parseDateString(next.date).getTime();
            const factor = (targetTime - pT) / (nT - pT);
            return { x: date, y: prev.value + (next.value - prev.value) * factor };
        } else if (prev) {
            return { x: date, y: prev.value };
        }
        return { x: date, y: null };
    });

    const datasets = [{
        label: 'PSA',
        data: datasetData,
        borderColor: colorPSA,
        backgroundColor: gradient,
        borderWidth: 2.5,
        tension: 0.3,
        fill: true,
        spanGaps: true,
        pointRadius: (ctx) => {
            const date = allDates[ctx.dataIndex];
            const isReal = psaSource.some(d => d.date === date);
            return isReal ? 5 : 0;
        },
        pointBackgroundColor: '#ffffff',
        pointBorderColor: colorPSA,
        pointBorderWidth: 2,
        pointHoverRadius: 7
    }];

    // Proyección a futuro
    if (showProjectionOnChart && predictedPSA !== null && psaSource.length > 0) {
        const lastReal = psaSource[psaSource.length - 1];
        const lastDate = parseDateString(lastReal.date);
        const projDate = new Date(lastDate);
        projDate.setMonth(projDate.getMonth() + projectionMonths);
        const projDateStr = ("0" + projDate.getDate()).slice(-2) + "/" + ("0" + (projDate.getMonth() + 1)).slice(-2) + "/" + projDate.getFullYear();

        const projData = allDates.map(date => {
            if (date === lastReal.date) return { x: date, y: lastReal.value };
            if (date === projDateStr) return { x: date, y: predictedPSA };
            return { x: date, y: null };
        });

        datasets.push({
            label: 'Predicción PSA',
            data: projData,
            borderColor: '#8b5cf6',
            borderWidth: 2.5,
            borderDash: [6, 4],
            tension: 0,
            fill: false,
            spanGaps: true,
            pointRadius: (ctx) => (allDates[ctx.dataIndex] === projDateStr ? 7 : 0),
            pointBackgroundColor: '#ffffff',
            pointBorderColor: '#8b5cf6',
            pointBorderWidth: 2,
            pointHoverRadius: 9
        });
    }

    if (chartInstance) {
        chartInstance.destroy();
    }

    chartInstance = new Chart(ctx, {
        type: 'line',
        data: {
            labels: allDates,
            datasets: datasets
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            interaction: { mode: 'index', intersect: false },
            scales: {
                x: {
                    grid: { color: '#f1f5f9' },
                    ticks: { color: '#64748b', font: { family: 'Outfit, Inter, sans-serif', size: 10 } }
                },
                y: {
                    grid: { color: '#f1f5f9' },
                    ticks: { color: '#64748b', font: { family: 'Outfit, Inter, sans-serif', size: 10 } },
                    title: { display: true, text: 'PSA (ng/mL)', font: { weight: '600', size: 11 } }
                }
            },
            plugins: {
                legend: { display: false },
                tooltip: {
                    backgroundColor: 'rgba(15, 23, 42, 0.95)',
                    titleColor: '#ffffff',
                    bodyColor: '#ffffff',
                    padding: 10,
                    cornerRadius: 8,
                    callbacks: {
                        title: (items) => items[0].label,
                        label: (context) => {
                            const date = context.label;
                            const lines = [];

                            if (context.dataset.label === 'Predicción PSA') {
                                lines.push(`Predicción PSA: ${context.raw?.y?.toFixed(2)} ng/mL (+${projectionMonths} meses)`);
                                return lines;
                            }

                            const realVal = psaSource.find(d => d.date === date);
                            if (realVal) lines.push(`PSA: ${realVal.value} ng/mL`);

                            const evts = eventSource.filter(e => e.fecha === date);
                            evts.forEach(evt => {
                                lines.push(`[${evt.tipo}] ${evt.detalle}`);
                            });

                            return lines;
                        }
                    }
                }
            }
        },
        plugins: [verticalEventLinesPlugin, horizontalAverageLinePlugin]
    });

    // Actualizar overlay stats en la gráfica
    const overlay = document.getElementById("chartOverlayStats");
    if (showOverlayStats && calculatedPSAV !== null) {
        overlay.style.display = "block";
        document.getElementById("overlayPSAV").innerText = (calculatedPSAV / 12).toFixed(2) + " ng/mL/mes";
        document.getElementById("overlayPSADT").innerText = calculatedPSADT ? calculatedPSADT.toFixed(1) + " meses" : "Estable";
        document.getElementById("overlayCount").innerText = `Calculado con ${currentPatient.psa.filter(p => p.selected).length} medidas`;
    } else {
        overlay.style.display = "none";
    }
}
