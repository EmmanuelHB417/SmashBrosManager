# Smash Bros Manager

Aplicación web académica para administrar un roster inspirado en Super Smash Bros. Ultimate. Incluye una interfaz renovada, ejemplos precargables de luchadores y operaciones CRUD conectadas a una API con almacenamiento SQLite.

## Tecnologías
- Python
- FastAPI
- SQLite
- Pydantic
- HTML, CSS y JavaScript
- Git y GitHub
- Vercel (frontend)

## Funcionalidades
- Interfaz colorida inspirada en la estética de Super Smash Bros. Ultimate.
- Tarjetas de ejemplo para Mario, Link, Kirby y Pikachu; el botón carga sus datos en el formulario para que se puedan editar antes de guardar.
- Registrar personajes.
- Consultar el roster desde SQLite.
- Buscar por nombre o franquicia.
- Editar personajes existentes.
- Eliminar personajes.
- Validación básica de campos y manejo de errores.

## Estructura
```text
SmashBrosManager/
├── backend/
│   ├── main.py
│   ├── database.py
│   ├── models.py
│   └── requirements.txt
├── frontend/
│   ├── index.html
│   ├── estilos.css
│   └── funciones.js
├── diagramas/
│   └── modelo_base_datos.png
├── .gitignore
└── README.md
```

## Ejecutar en local

Requiere Python 3.10 o superior.

1. Abre una terminal en la carpeta del proyecto.
2. Crea un entorno virtual:
   - Windows: `py -m venv .venv`
   - Actívalo: `.venv\\Scripts\\activate`
3. Instala las dependencias:
   `pip install -r backend/requirements.txt`
4. Inicia la API:
   - Windows: `cd backend`
   - `uvicorn main:app --reload`
5. Abre `http://127.0.0.1:8000/docs` para comprobar los endpoints.
6. Abre `frontend/index.html` en el navegador. Si el navegador bloquea las peticiones desde `file://`, utiliza una extensión de servidor local de VS Code o ejecuta `python -m http.server 5500` dentro de `frontend` y visita `http://127.0.0.1:5500`.
7. La base de datos `smashbros.db` se crea automáticamente en `backend` al iniciar FastAPI.

## Endpoints
| Método | Ruta | Función |
|---|---|---|
| GET | `/personajes` | Listar todos |
| GET | `/personajes/{id}` | Consultar uno |
| POST | `/personajes` | Registrar |
| PUT | `/personajes/{id}` | Actualizar |
| DELETE | `/personajes/{id}` | Eliminar |

La documentación interactiva de FastAPI se encuentra en `/docs`.

## GitHub
1. Crea un repositorio nuevo en GitHub.
2. Abre una terminal en la carpeta raíz del proyecto.
3. Ejecuta:
   ```bash
   git init
   git add .
   git commit -m "Proyecto inicial Smash Bros Manager"
   git branch -M main
   git remote add origin https://github.com/TU-USUARIO/SmashBrosManager.git
   git push -u origin main
   ```
4. Sustituye `TU-USUARIO` por tu usuario de GitHub.

## Publicación y limitaciones de Vercel

El frontend estático puede publicarse en Vercel configurando `frontend` como directorio raíz del proyecto. Sin embargo, Vercel no debe tratarse como un servidor persistente para una base SQLite guardada en un archivo local. Los entornos serverless pueden ser temporales y no garantizan que las escrituras locales se conserven entre ejecuciones.

Para una aplicación pública funcional:
1. Publica el backend FastAPI en un servicio que soporte Python y configura su almacenamiento persistente.
2. Configura `FRONTEND_ORIGINS` en el backend con el dominio real de Vercel.
3. En `frontend/funciones.js`, cambia `API_URL` por la URL HTTPS pública del backend.
4. Publica el frontend en Vercel.

Si el requisito es mantener SQLite, el backend debe ejecutarse en un entorno con disco persistente o con un volumen persistente correctamente configurado. Si el alojamiento elegido no ofrece ese almacenamiento, consulta al docente si acepta una base de datos administrada persistente. No basta con publicar el frontend: el backend también debe estar accesible y conectado a la base de datos.

## Diagrama de base de datos
Consulta `diagramas/modelo_base_datos.png`.

## Nota académica
Este proyecto es una base funcional para estudiar la separación frontend/API/base de datos. Antes de entregar, prueba crear, listar, editar y eliminar registros y confirma que los cambios persisten después de reiniciar el backend.


## Configuración de Vercel (frontend estático)

El archivo `vercel.json` es una configuración inicial para servir archivos estáticos desde `frontend`. La configuración de despliegue puede requerir ajustes según la configuración actual del proyecto en Vercel; prueba el despliegue antes de entregar. El backend FastAPI no queda desplegado por publicar únicamente estos archivos.

## Referencias del contenido del juego
- Nintendo. (s. f.). *Super Smash Bros. Ultimate: Luchadores*. https://www.smashbros.com/es_LA/fighter/01.html
- El emblema incluido en la interfaz es una adaptación gráfica propia inspirada en la identidad visual del juego; no es un recurso oficial de Nintendo.

Este es un proyecto de fans/académico, no oficial ni afiliado a Nintendo.
