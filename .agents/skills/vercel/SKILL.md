---
name: vercel
description: >-
  Guía completa y flujos de trabajo para desplegar, gestionar dominios, configurar variables de entorno
  y monitorear aplicaciones web en Vercel utilizando Vercel CLI y Git integrations.
---

# Vercel Deployment & Management Skill

Esta skill proporciona flujos de trabajo estandarizados y comandos para desplegar y administrar aplicaciones en Vercel.

## 1. Métodos de Despliegue

### A. Despliegue Automático vía Git (Recomendado)
1. Conectar el repositorio de GitHub en [vercel.com](https://vercel.com/new).
2. Cada `git push` a la rama `main` despliega automáticamente a Producción.
3. Los Pull Requests generan URLs de Preview automáticas.

### B. Despliegue mediante Vercel CLI
Para desplegar desde la terminal:

```bash
# Despliegue de Preview / Desarrollo
npx vercel

# Despliegue directo a Producción
npx vercel --prod
```

## 2. Configuración para Proyectos Vite / Vue
Para aplicaciones SPA (Single Page Applications) como Vue/Vite, crear un archivo `vercel.json` en la raíz si se requiere reescritura de rutas:

```json
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

## 3. Comandos Útiles de Vercel CLI

- **Iniciar sesión:** `npx vercel login`
- **Vincular proyecto existente:** `npx vercel link`
- **Gestionar variables de entorno:**
  - Listar: `npx vercel env ls`
  - Agregar: `npx vercel env add NOMBRE_VARIABLE`
  - Descargar a local: `npx vercel env pull .env.local`
- **Ver registros en vivo (Logs):** `npx vercel logs <deployment-url>`
- **Dominios:** `npx vercel domains ls`

## 4. Diagnóstico de Errores Comunes
- **Build Failed:** Verificar que `npm run build` funcione localmente antes de desplegar.
- **Rutas 404 en subpáginas:** Asegurar el archivo `vercel.json` con la regla de reescritura SPA hacia `/index.html`.
