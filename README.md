# PSA Kinetics & Oncology Tracker — SMART on FHIR App

Aplicación clínica interactiva **SMART on FHIR** para el seguimiento dinámico y cálculo de cinética de biomarcadores oncológicos (**Antígeno Prostático Específico - PSA**) en pacientes con sospecha, seguimiento o diagnóstico de cáncer de próstata.

🔗 **Demo en vivo:** [https://jasernagarcia.github.io/psa-tracker-smart-app/](https://jasernagarcia.github.io/psa-tracker-smart-app/)

---

## Características Principales

* **Estándar SMART on FHIR (HL7 FHIR R4)**: Compatible con cualquier Historia Clínica Electrónica moderna (Epic, Cerner, HAPI FHIR, SMART Health IT Sandbox).
* **Gráfica Temporal de PSA**: Visualización interactiva con Chart.js con soporte de escalas temporales, interpolación de fechas y umbrales clínicos (4.0 ng/mL).
* **Correlación con Hitos Clínicos y Procedimientos**: Mapeo temporal de biopsias, cirugías (prostatectomía radical), radioterapia y bloqueos androgénicos.
* **Calculadora de Cinética Oncológica**:
  * **PSA Velocity (PSAV)**: Medida en `ng/mL/mes` y `ng/mL/año` calculada mediante regresión lineal.
  * **PSA Doubling Time (PSADT)**: Tiempo de duplicación calculado por regresión logarítmica exponencial.
  * **Simulador de Proyección a Futuro**: Estimación del PSA a +3, +6, +12 y +24 meses.
* **Filtrado Dinámico de Mediciones**: Permite seleccionar o excluir tomas de PSA para recalcular la pendiente en tiempo real.
* **Modo Demo Integrado**: Casos clínicos precargados para interactuar de inmediato sin requerir conexión EHR activa.

---

## Estructura del Proyecto

* `index.html`: Vista principal de la aplicación con dashboard clínico y modal de simulación.
* `launch.html`: Endpoint de autenticación OAuth2 para EHRs basados en SMART on FHIR.
* `app/app.js`: Lógica clínica, consultas FHIR y modelos matemáticos de cinética de PSA.
* `app/style.css`: Estilos visuales del dashboard médico.
* `lib/`: Librerías cliente FHIR y Chart.js con adaptador de fechas.

---

## Cómo probarlo en Local

1. Clona el repositorio:
   ```bash
   git clone https://github.com/jasernagarcia/psa-tracker-smart-app.git
   cd psa-tracker-smart-app
   ```
2. Inicia un servidor web local:
   ```bash
   npx serve .
   ```
3. Abre tu navegador en `http://localhost:3000/index.html`.

---

## Tecnologías Utilizadas

* **HL7 FHIR R4 / SMART on FHIR**
* **JavaScript (ES6+)**
* **Chart.js** + `chartjs-adapter-date-fns`
* **CSS3 / Responsive UI**

---

## Autor
**Jose Antonio Serna García** — [GitHub Profile](https://github.com/jasernagarcia)
