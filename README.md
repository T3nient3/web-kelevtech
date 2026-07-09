# web.kelevtech

Landing page de KelevTech Web / Studio — HTML + CSS + JS puro.

## Estructura

```
web.kelevtech/
├── index.html
├── css/
│   └── style.css
├── js/
│   └── script.js
├── assets/        (logo, favicon, imágenes)
└── README.md
```

## Antes de publicar

1. **Número de WhatsApp**: reemplaza `56900000000` por tu número real (formato `569XXXXXXXX`, sin `+` ni espacios) en:
   - `index.html` → los 3 enlaces `wa.me`
   - `js/script.js` → constante `WHATSAPP_NUMBER`
2. **Logo / favicon**: coloca tus archivos en `assets/` y enlázalos en el `<head>` de `index.html`.
3. Revisa los precios y textos de la sección de planes si cambian.

## Ver el sitio en local

Abre `index.html` directamente en el navegador, o desde VS Code con la extensión **Live Server** (clic derecho → "Open with Live Server").

## Desplegar en Vercel

1. Sube la carpeta a un repositorio de GitHub.
2. En [vercel.com](https://vercel.com), "Add New Project" → importa el repo.
3. Framework Preset: **Other** (sitio estático, sin build command).
4. Conecta el dominio `kelevtech.cl` desde la pestaña **Domains** del proyecto en Vercel.

## Paleta de colores

| Uso | Valor |
|---|---|
| Fondo | `#0A0A0A` |
| Fondo elevado (cards) | `#121212` |
| Texto principal | `#FFFFFF` |
| Texto secundario | `#A1A1AA` |
| Acento (CTA) | `#F5A623` |
