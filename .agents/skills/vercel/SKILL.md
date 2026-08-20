---
name: vercel
description: Procedimientos y comandos para desplegar, configurar dominios, gestionar variables de entorno y administrar proyectos en Vercel mediante Vercel CLI.
---

# Vercel Deployment & Management Skill

Esta skill permite al agente interactuar con Vercel para desplegar aplicaciones web (Vite, Vue, Next.js), configurar dominios personalizados y gestionar proyectos.

---

## 1. Comandos Principales de Vercel CLI

### A. Despliegue en Vista Previa (Preview)
Despliega el estado actual del proyecto en un entorno de prueba temporal:
```bash
npx vercel
```

### B. Despliegue en Producción (Production)
Despliega directamente a la URL de producción principal:
```bash
npx vercel --prod
```

### C. Enlazar Proyecto Existente
Conecta el directorio local con un proyecto ya creado en el dashboard de Vercel:
```bash
npx vercel link
```

### D. Gestión de Variables de Entorno
```bash
# Agregar una variable de entorno
npx vercel env add NOMBRE_VARIABLE

# Listar variables de entorno
npx vercel env ls

# Descargar variables locales (.env.local)
npx vercel env pull
```

---

## 2. Configuración Recomendada para Proyectos Vite (`vercel.json`)
Para aplicaciones Single Page Applications (SPA) con Vue 3 / Vite, se debe incluir un archivo `vercel.json` en la raíz del proyecto para redireccionar todas las rutas al `index.html`:

```json
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

---

## 3. Integración con Git (GitHub CI/CD)
Cuando el repositorio de GitHub está conectado a Vercel:
1. Cada `git push origin main` dispara automáticamente un despliegue a **Producción**.
2. Cada `pull request` o rama secundaria genera un **Preview Deployment** único.
