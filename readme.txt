FORMA React + Vite

This project has been converted from the original static HTML/CSS/JS site into a React + Vite application.

Run:

npm install
npm run dev
npm run build

Cloudflare R2 uploads:

- The upload API lives in workers/src/worker.js at /api/upload.
- If the frontend is served by the Cloudflare Worker, /api/upload works as a relative path.
- If the frontend is served by Vercel or Vite dev server, set VITE_UPLOAD_ENDPOINT to the deployed Worker upload URL.
- Example: VITE_UPLOAD_ENDPOINT=https://maedin-decor.YOUR_SUBDOMAIN.workers.dev/api/upload

Notes:

- The visual identity, original CSS, Bootstrap classes, Swiper/AOS/Jarallax hooks, hover effects, and page markup were preserved as closely as possible.
- React Router handles the existing legacy paths:
  /, /about.html, /services.html, /shop.html, /single-product.html, /blog.html,
  /single-post.html, /cart.html, /checkout.html, /login.html, /admin.html, /contact.html
- Shared Header, Footer, video modal, and legacy plugin initialization now live under src/components.
- The old static HTML files and original source assets were preserved in .codex-forma/legacy-static for reference.
- Public runtime assets are under public/images, public/css, public/js, and public/style.css.
