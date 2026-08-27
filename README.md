# 🔬 PSA Kinetics & Oncology Tracker — SMART on FHIR App

Aplicación clínica interactiva **SMART on FHIR** para el seguimiento y cálculo de cinética de biomarcadores oncológicos (**Antígeno Prostático Específico - PSA**) en pacientes con sospecha o diagnóstico de cáncer de próstata.

---

## 🌟 Características Principales

* **Estándar SMART on FHIR (HL7 FHIR R4)**: Compatible con cualquier EHR / Historia Clínica Electrónica moderna (Epic, Cerner, HAPI FHIR, SMART Health IT Sandbox).
* **Gráfica Temporal de PSA**: Visualización interactiva con Chart.js con soporte de escalas temporales y umbrales clínicos.
* **Correlación con Hitos Clínicos**: Mapeo de biopsias, cirugías (prostatectomía), radioterapia y bloqueos androgénicos.
* **Calculadora de Cinética Oncológica**:
  * **PSA Velocity (PSAV)**: Medida en `ng/mL/mes` y `ng/mL/año` mediante regresión lineal.
  * **PSA Doubling Time (PSADT)**: Tiempo de duplicación calculado por regresión logarítmica exponencial.
* **Modo Demo Integrado**: Permite probar la aplicación interactivamente sin necesidad de conectar a un EHR (ideal para demostraciones y portfolios).

---

## 🚀 Cómo probarlo en Local

1. Abre una terminal en la carpeta del proyecto.
2. Inicia un servidor web local:
   ```bash
   npx serve .
   ```
   *(O usando la extensión Live Server de VS Code).*
3. Abre tu navegador en `http://localhost:3000/index.html`.

---

## 🌐 Cómo publicarlo en tu GitHub Pages

1. Sube el código a un nuevo repositorio público de GitHub:
   ```bash
   git init
   git add .
   git commit -m "feat: initial commit - PSA Oncology SMART on FHIR App"
   git branch -M main
   git remote add origin https://github.com/<TU_USUARIO>/psa-tracker-smart-app.git
   git push -u origin main
   ```
2. En GitHub ve a **Settings ➡️ Pages**.
3. En **Branch**, selecciona `main` y la carpeta `/ (root)`, luego pulsa **Save**.
4. ¡Tu aplicación estará publicada y disponible para todo el mundo en `https://<TU_USUARIO>.github.io/psa-tracker-smart-app`!

---

## 👨‍💻 Autor
Desarrollado como proyecto de innovación eHealth y estándares HL7 FHIR.
