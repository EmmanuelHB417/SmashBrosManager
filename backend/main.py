import os
from contextlib import asynccontextmanager

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware

from database import crear_tabla, obtener_conexion
from models import Personaje, PersonajeCrear

@asynccontextmanager
async def lifespan(app: FastAPI):
    crear_tabla()
    yield

app = FastAPI(
    title="Smash Bros Manager API",
    description="API CRUD para administrar personajes de Super Smash Bros.",
    version="1.0.0",
    lifespan=lifespan
)

origenes = os.getenv("FRONTEND_ORIGINS", "*").split(",")
app.add_middleware(
    CORSMiddleware,
    allow_origins=[origen.strip() for origen in origenes],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def inicio():
    return {"mensaje": "Smash Bros Manager API funcionando", "documentacion": "/docs"}

@app.get("/personajes", response_model=list[Personaje])
def listar_personajes():
    conexion = obtener_conexion()
    filas = conexion.execute("SELECT * FROM personajes ORDER BY id DESC").fetchall()
    conexion.close()
    return [dict(fila) for fila in filas]

@app.get("/personajes/{personaje_id}", response_model=Personaje)
def obtener_personaje(personaje_id: int):
    conexion = obtener_conexion()
    fila = conexion.execute(
        "SELECT * FROM personajes WHERE id = ?", (personaje_id,)
    ).fetchone()
    conexion.close()
    if fila is None:
        raise HTTPException(status_code=404, detail="Personaje no encontrado")
    return dict(fila)

@app.post("/personajes", response_model=Personaje, status_code=201)
def crear_personaje(personaje: PersonajeCrear):
    datos = personaje.model_dump()
    conexion = obtener_conexion()
    cursor = conexion.execute("""
        INSERT INTO personajes (nombre, franquicia, tipo_luchador, habilidad, escenario)
        VALUES (?, ?, ?, ?, ?)
    """, (
        datos["nombre"], datos["franquicia"], datos["tipo_luchador"],
        datos["habilidad"], datos["escenario"]
    ))
    conexion.commit()
    fila = conexion.execute(
        "SELECT * FROM personajes WHERE id = ?", (cursor.lastrowid,)
    ).fetchone()
    conexion.close()
    return dict(fila)

@app.put("/personajes/{personaje_id}", response_model=Personaje)
def actualizar_personaje(personaje_id: int, personaje: PersonajeCrear):
    datos = personaje.model_dump()
    conexion = obtener_conexion()
    cursor = conexion.execute("""
        UPDATE personajes
        SET nombre = ?, franquicia = ?, tipo_luchador = ?, habilidad = ?, escenario = ?
        WHERE id = ?
    """, (
        datos["nombre"], datos["franquicia"], datos["tipo_luchador"],
        datos["habilidad"], datos["escenario"], personaje_id
    ))
    conexion.commit()
    if cursor.rowcount == 0:
        conexion.close()
        raise HTTPException(status_code=404, detail="Personaje no encontrado")
    fila = conexion.execute(
        "SELECT * FROM personajes WHERE id = ?", (personaje_id,)
    ).fetchone()
    conexion.close()
    return dict(fila)

@app.delete("/personajes/{personaje_id}")
def eliminar_personaje(personaje_id: int):
    conexion = obtener_conexion()
    cursor = conexion.execute("DELETE FROM personajes WHERE id = ?", (personaje_id,))
    conexion.commit()
    conexion.close()
    if cursor.rowcount == 0:
        raise HTTPException(status_code=404, detail="Personaje no encontrado")
    return {"mensaje": "Personaje eliminado correctamente"}
