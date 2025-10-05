# Gallery Backend

## Requisitos
- Node.js
- npm

## Instalación
npm install
npx prisma migrate dev
npm run seed

## Ejecución
npm run dev

## Endpoints
GET /products → lista todos los productos  
POST /products → crea un nuevo producto

## Configuración frontend
Actualizar `API_URL` en `src/config.ts` con la URL del backend.
