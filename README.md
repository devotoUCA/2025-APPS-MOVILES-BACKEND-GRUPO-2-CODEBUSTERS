# MindGarden Backend

Backend del proyecto MindGarden - Aplicación móvil de gestión de tareas y bienestar.

## 🛠️ Tecnologías

- **Node.js** + **Express** - Servidor y API
- **TypeScript** - Lenguaje
- **Prisma** - Base de datos
- **SQLite** - Almacenamiento local

## 📦 Instalación

### 1. Requisitos previos
Asegurate de tener instalado:
- **Node.js** (versión 18 o superior)
- **npm** (viene con Node.js)

### 2. Clonar el repositorio
```bash
git clone https://github.com/devotoUCA/2025-APPS-MOVILES-BACKEND-GRUPO-2-CODEBUSTERS.git
cd 2025-APPS-MOVILES-BACKEND-GRUPO-2-CODEBUSTERS
```

### 3. Instalar dependencias
```bash
npm install
```

3.5. Variables de entorno 
Antes de inicializar la base de datos, es obligatorio crear un archivo de configuración.
Creá un archivo llamado .env en la raíz del proyecto y agregá la siguiente línea:

DATABASE_URL="file:./dev.db"

### 4. Configurar la base de datos

Ejecutá este comando para crear la base de datos y las tablas:
```bash
npx prisma migrate dev --name init
```

### 5. Cargar datos de prueba (opcional pero recomendado)

Esto crea un jugador y algunas tareas de ejemplo:
```bash
npm run seed
```

## ▶️ Ejecutar el proyecto

### Iniciar el servidor
```bash
npm run dev
```

Deberías ver algo como:
```
Servidor corriendo en http://localhost:3000
```

### Probar que funciona

Abrí tu navegador y entrá a:
```
http://localhost:3000
```

Deberías ver: `{"message": "Backend funcionando!"}`

Para ver las tareas de prueba:
```
http://localhost:3000/api/tasks
```

## 🗄️ Ver y editar la base de datos

Si querés ver los datos guardados en una interfaz visual:
```bash
npx prisma studio
```

Esto abre una página web donde podés ver y modificar todas las tablas.

## 🔄 Reiniciar la base de datos

Si necesitás empezar de cero:
```bash
# Borrar la base de datos
del prisma\dev.db

# Recrear todo
npx prisma migrate dev --name init
npm run seed
```

## 📝 Comandos útiles

| Comando | Descripción |
|---------|-------------|
| `npm run dev` | Inicia el servidor (con recarga automática) |
| `npm run seed` | Carga datos de prueba |
| `npx prisma studio` | Abre interfaz para ver/editar datos |
| `npx prisma generate` | Regenera el cliente (si cambiaste el schema) |

## 🌐 API

El backend tiene dos endpoints principales:

**GET /api/tasks** - Obtiene todas las tareas  
**POST /api/tasks** - Crea una nueva tarea

Para usarlos desde el frontend, configurá la URL en `config/api.ts` con la IP de tu computadora.

## 📁 Estructura
```
├── prisma/
│   ├── schema.prisma    # Definición de tablas
│   ├── seed.ts          # Datos de prueba
│   └── dev.db           # Base de datos (se crea automáticamente)
├── src/
│   ├── controllers/     # Lógica de las funciones
│   ├── routes/          # Rutas de la API
│   └── index.ts         # Archivo principal
└── package.json
```

## ❓ Problemas comunes

### El servidor no arranca
- Verificá que no tengas otro programa usando el puerto 3000
- Asegurate de haber ejecutado `npm install`

### Error con Prisma
- Ejecutá `npx prisma generate`
- Si persiste, borrá `node_modules` y ejecutá `npm install` de nuevo

### El frontend no se conecta
- Verificá que el backend esté corriendo (`npm run dev`)
- Cambiá `localhost` por la IP de tu computadora en el archivo `config/api.ts` del frontend
- Asegurate de que tu celular/emulador y tu compu estén en la misma WiFi

## 👥 Equipo

**Grupo 2 - CodeBusters**  
Universidad Católica Argentina  
Programación de Aplicaciones Móviles - 2025

---

💡 **Tip:** Dejá el servidor corriendo mientras desarrollás el frontend. Se recarga automáticamente cuando hacés cambios.
