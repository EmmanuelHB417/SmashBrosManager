import os
import sqlite3

RUTA_BASE_DATOS = os.getenv(
    "DATABASE_PATH",
    os.path.join(os.path.dirname(__file__), "smashbros.db")
)

def obtener_conexion():
    conexion = sqlite3.connect(RUTA_BASE_DATOS)
    conexion.row_factory = sqlite3.Row
    return conexion

def crear_tabla():
    conexion = obtener_conexion()
    conexion.execute("""
        CREATE TABLE IF NOT EXISTS personajes (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            nombre TEXT NOT NULL,
            franquicia TEXT NOT NULL,
            tipo_luchador TEXT NOT NULL,
            habilidad TEXT NOT NULL,
            escenario TEXT NOT NULL
        )
    """)
    conexion.commit()
    conexion.close()
