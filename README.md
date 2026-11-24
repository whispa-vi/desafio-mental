# Desafío Mental

Parcial II — Plataformas de Desarrollo (Da Vinci).

Nueva versión de la plataforma de preguntas y respuestas del Parcial I: el frontend en **React** y el backend en **Node.js + Express** con una **API REST**. Los usuarios, las preguntas y las partidas se guardan en una base de datos en el servidor.

## Tecnologías

| Parte | Tecnologías |
|---|---|
| Backend | Node.js, Express 5, Prisma 6 (ORM), SQLite, Joi (validación), bcrypt (contraseñas), jsonwebtoken (JWT), cors, nodemon |
| Frontend | React 19, Vite 8, React Router 7 (Context API, hooks propios, React Portal para las ventanas modales) |
| Pruebas de la API | Colección de Postman en `postman/` |

## Requisitos

- **Node.js 20.12 o superior** (el servidor usa `process.loadEnvFile()` para leer `.env`). Verificar con `node -v`.
- **npm** (se instala junto con Node.js).

No hace falta instalar ninguna base de datos ni Docker: SQLite guarda los datos en un archivo que se crea automáticamente.

## Estructura

```
desafio_mental_web_js/
├── backend/              API REST (Express + Prisma + SQLite)
│   ├── prisma/           esquema, migraciones y datos iniciales (seed)
│   └── src/              código del servidor (patrón MVC)
├── frontend/             aplicación React (Vite)
│   └── src/
│       ├── api/          cliente HTTP y una función por endpoint
│       ├── context/      sesión del usuario (AuthContext)
│       ├── hooks/        useAuth, useFetch, useTimer
│       ├── components/   componentes reutilizables y rutas protegidas
│       ├── pages/        pantallas del juego
│       ├── panel/        panel de administración (/panel)
│       └── utils/        formato de fechas y duración
└── postman/              colección y entorno de Postman para probar la API
```

Para usar la aplicación hay que tener **los dos servidores iniciados a la vez**, cada uno en su propia terminal: primero el backend y después el frontend.

## Instalación y ejecución del backend

Todos los comandos se ejecutan **dentro de la carpeta `backend`**.

```bash
cd backend
```

**1. Instalar las dependencias**

```bash
npm install
```

Si npm muestra un aviso sobre `install-scripts` (bcrypt, prisma), se puede ignorar: el proyecto funciona igual.

**2. Crear el archivo de configuración `.env`** a partir del ejemplo:

```bash
# Windows (PowerShell o CMD)
copy .env.example .env

# macOS / Linux
cp .env.example .env
```

Contenido de `.env`:

| Variable | Para qué sirve | Valor del ejemplo |
|---|---|---|
| `DATABASE_URL` | Ubicación de la base de datos SQLite | `file:./dev.db` |
| `JWT_SECRET` | Clave para firmar los tokens de sesión | cambiarla por un texto largo propio |
| `PORT` (opcional) | Puerto del servidor | `3000` si no se indica |

**3. Crear la base de datos y cargar los datos iniciales**

```bash
npx prisma migrate dev
```

Este comando crea `prisma/dev.db`, aplica las migraciones (tablas), genera el cliente de Prisma y ejecuta el seed: **25 preguntas en 4 categorías** (las del Parcial I) y el **usuario administrador**.

**4. Iniciar el servidor**

```bash
npm run dev
```

Debe aparecer `Servidor escuchando en http://localhost:3000`. Comprobación rápida: abrir <http://localhost:3000/api> en el navegador → `{"message":"API Desafío Mental funcionando"}`.

### Usuario administrador

| Usuario | Contraseña | Rol |
|---|---|---|
| `admin` | `Admin1234` | ADMIN |

El inicio de sesión es con **nombre de usuario** y contraseña. El registro público crea solo usuarios con rol USER; el administrador se crea con el seed. El panel de administración está en `/panel/login` (ver más abajo).

### Scripts del backend

| Comando | Qué hace |
|---|---|
| `npm run dev` | Inicia el servidor con nodemon (se reinicia al guardar cambios) |
| `npm run db:reset` | Borra todos los datos, vuelve a crear las tablas y carga el seed |
| `npx prisma db seed` | Vuelve a cargar preguntas y administrador (sin duplicar) |
| `npx prisma studio` | Abre una vista web de la base de datos |

## Instalación y ejecución del frontend

En **otra terminal** (el backend tiene que seguir funcionando), dentro de la carpeta `frontend`:

```bash
cd frontend
npm install
npm run dev
```

Abrir <http://localhost:5173> en el navegador.

El frontend se conecta a `http://localhost:3000/api`. Si el backend usa otra dirección o puerto, crear `frontend/.env` a partir de `frontend/.env.example` y cambiar `VITE_API_URL`; después reiniciar `npm run dev`.

| Comando | Qué hace |
|---|---|
| `npm run dev` | Inicia la aplicación en modo desarrollo |
| `npm run build` | Genera la versión de producción en `dist/` |
| `npm run preview` | Sirve la versión de `dist/` para probarla |

### Pantallas

| Ruta | Pantalla | Acceso |
|---|---|---|
| `/login`, `/registro` | Inicio de sesión y registro | sin sesión |
| `/` | Menú: estadísticas, nueva partida, porcentaje por categoría | con sesión |
| `/partida/:id` | Partida: 15 s por pregunta, corrección durante 2 s, «Salir» con confirmación | con sesión |
| `/resultados/:id` | Resultados y repaso de las respuestas | con sesión |
| `/historial` | Historial con resumen y filtros por categoría y estado | con sesión |
| `/ranking` | Top 10 de partidas completadas | con sesión |

- La sesión se guarda en el navegador (solo el token) y se recupera al volver a entrar; «Cerrar sesión» la termina.
- Las rutas con sesión redirigen al login. La protección real está en el backend (401/403).

### Panel de administración

Interfaz aparte, con su propio inicio de sesión y menú lateral. Solo entran usuarios con rol ADMIN (un jugador recibe «Esta cuenta no tiene permisos de administrador»).

| Ruta | Pantalla |
|---|---|
| `/panel/login` | Inicio de sesión del panel |
| `/panel` | Resumen: preguntas activas, categorías, jugadores; preguntas por categoría |
| `/panel/preguntas` | Tabla de preguntas con filtro por categoría y búsqueda; eliminar con confirmación |
| `/panel/preguntas/nueva` | Crear pregunta |
| `/panel/preguntas/:id` | Modificar pregunta |
| `/panel/usuarios` | Usuarios registrados y su rol |

Dirección: <http://localhost:5173/panel/login> (usuario `admin`, contraseña `Admin1234`).
- Si se recarga la página durante una partida, esa partida queda registrada como abandonada (igual que en el Parcial I).

## API REST

Base: `http://localhost:3000/api`. Las rutas protegidas necesitan el encabezado `Authorization: Bearer <token>` (el token se obtiene en el login).

### Autenticación y usuarios

| Método | Ruta | Acceso | Descripción |
|---|---|---|---|
| POST | `/auth/register` | público | Registro (`username`, `email`, `password`, `confirmPassword`) |
| POST | `/auth/login` | público | Inicio de sesión → `{ token, user }` |
| GET | `/auth/profile` | con sesión | Datos del usuario del token (recuperar la sesión) |
| GET | `/users` | ADMIN | Lista de usuarios |

### Preguntas

| Método | Ruta | Acceso | Descripción |
|---|---|---|---|
| GET | `/questions/categories` | con sesión | Categorías y cantidad de preguntas en cada una |
| GET | `/questions?category=` | ADMIN | Banco de preguntas (filtro opcional por categoría) |
| GET | `/questions/:id` | ADMIN | Una pregunta |
| POST | `/questions` | ADMIN | Crear pregunta |
| PUT | `/questions/:id` | ADMIN | Modificar pregunta (se pueden enviar solo los campos a cambiar) |
| DELETE | `/questions/:id` | ADMIN | Eliminar pregunta |

### Partidas, historial, estadísticas y ranking

| Método | Ruta | Acceso | Descripción |
|---|---|---|---|
| POST | `/games` | con sesión | Iniciar partida (`category`, `amount`: 5 o 10) → primera pregunta |
| POST | `/games/:id/answers` | con sesión | Responder la pregunta actual (`questionId`, `selectedIndex`: 0–3 o `null` si se acabó el tiempo) |
| PATCH | `/games/:id/abandon` | con sesión | Abandonar la partida |
| GET | `/games/:id` | con sesión | Resultado de una partida terminada |
| GET | `/games/history?category=&status=` | con sesión | Historial propio (`status`: `completada` o `abandonada`) |
| GET | `/stats/me` | con sesión | Estadísticas del menú |
| GET | `/stats/me/categories/:category` | con sesión | Porcentaje de aciertos en una categoría |
| GET | `/ranking` | con sesión | Top 10 de partidas completadas |

### Códigos de respuesta

Todas las respuestas de error tienen el formato `{ "message": "..." }` (los errores de validación agregan `errors` con el detalle por campo).

| Código | Significado |
|---|---|
| 200 / 201 | Correcto / recurso creado |
| 400 | Datos inválidos |
| 401 | Sin sesión, token inválido o vencido, credenciales incorrectas |
| 403 | El rol no permite la operación |
| 404 | Ruta o recurso inexistente |
| 409 | Conflicto: usuario o email ya registrado, preguntas insuficientes, partida terminada, pregunta ya respondida |
| 500 | Error interno del servidor |

## Probar la API con Postman

1. En Postman: **Import** → seleccionar los dos archivos de `postman/`:
   - `desafio_mental.postman_collection.json` — las solicitudes con sus pruebas;
   - `desafio_mental.postman_environment.json` — el entorno con `baseUrl` y los tokens.
2. Elegir el entorno **«Desafío Mental — local»** (arriba a la derecha).
3. Con el servidor iniciado, ejecutar las carpetas **en orden** (0 → 8) o toda la colección con **Run collection**. El login (carpeta 2) guarda los tokens en el entorno y las carpetas siguientes los usan.

La colección tiene 58 solicitudes con pruebas automáticas. Al ejecutarla por segunda vez, la solicitud 1.1 (registro) devuelve 409 porque el usuario de prueba ya existe; para empezar de cero: `npm run db:reset`.

## Decisiones de diseño

- **Las respuestas correctas solo las conoce el servidor.** Las preguntas se envían al jugador de a una y sin la respuesta correcta; el servidor valida cada respuesta, calcula puntaje y rachas, y no acepta respuestas fuera de tiempo (15 s por pregunta más un margen de 3 s), repetidas ni de otra pregunta.
- **La partida termina sola** al responder la última pregunta; no existe una ruta para «terminar» antes de tiempo.
- **Las reglas del Parcial I se conservan:** selección de preguntas sin repetir dentro de la partida, mensajes según porcentaje, historial con filtros, ranking (puntaje ↓, duración ↑, fecha ↑). Las funciones de estadística (recursión y composición) están en `backend/src/utils/stats.js`.
- **Una partida sin terminar** queda registrada como abandonada cuando el usuario inicia otra.
- **Eliminar una pregunta** la oculta (`active = false`) en lugar de borrarla, para no romper el historial de partidas que ya la usaron.
- **Arquitectura MVC:** rutas → middlewares (validación, autenticación, autorización) → controladores → modelos → Prisma.

## Problemas frecuentes

| Mensaje | Solución |
|---|---|
| `Falta JWT_SECRET en el archivo .env` | Crear `.env` (paso 2) y completar `JWT_SECRET` |
| `ENOENT ... .env` | Ejecutar los comandos dentro de `backend/` |
| `EADDRINUSE :::3000` | El puerto está ocupado: cerrar el otro servidor o definir `PORT=3001` en `.env` |
| `EPERM: operation not permitted, rename ... query_engine` (Windows) | Detener el servidor (`Ctrl+C`), ejecutar `npx prisma generate` y volver a iniciarlo |
| `connect ECONNREFUSED 127.0.0.1:3000` (Postman) | El servidor no está iniciado: `npm run dev` |
| «No se pudo conectar con el servidor» (en la aplicación) | El backend no está iniciado o usa otro puerto: `npm run dev` en `backend/` o revisar `VITE_API_URL` |
