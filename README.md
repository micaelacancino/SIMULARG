# SIMULARG

SIMULARG es una aplicación web desarrollada para simular procesos de logística y tratamiento de residuos electrónicos. Permite analizar recorridos de recolección, tiempos de procesamiento, costos estimados y la distribución de equipos según su destino final: reciclaje o reacondicionamiento.

---

## Funcionalidades

- Inicio de sesión con usuarios definidos localmente.
- Simulación logística de hasta 60 días.
- Visualización de rutas de recolección por zona.
- Mapa interactivo con puntos de recolección.
- Tablas de resultados por zona.
- Gráficos de apoyo para el análisis logístico.
- Simulación del tratamiento de equipos recibidos.
- Clasificación de equipos por tipo.
- Cálculo de tiempos de procesamiento y cantidad de empleados necesarios.
- Reportes gráficos de reciclaje y reacondicionamiento.

---

## Tecnologías utilizadas

- React
- Vite
- React Router
- Bootstrap
- Leaflet
- React Leaflet
- MUI X Charts
- Netlify

---

## Despliegue

El proyecto se encuentra configurado para su despliegue en Netlify.

---

## Usuario de acceso

Para ingresar al sistema, utilizar las siguientes credenciales:

| Usuario | Contraseña |
|----------|------------|
| fnallim | reciclarg2026 |

---

## Estructura del proyecto

```text
src/
├── componentes/
├── css/
├── helpers/
└── simulador/
```

### Descripción de carpetas

- **componentes/**: contiene las vistas y componentes reutilizables de la aplicación.
- **css/**: contiene los archivos de estilos utilizados por la interfaz.
- **helpers/**: contiene datos auxiliares y funciones de apoyo.
- **simulador/**: contiene la lógica principal de la simulación.

---

## Objetivo

El objetivo de SIMULARG es brindar una herramienta de apoyo para el análisis y la toma de decisiones en procesos de gestión de residuos electrónicos, permitiendo evaluar escenarios logísticos y operativos mediante simulación.
