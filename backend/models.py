from pydantic import BaseModel, Field

class PersonajeCrear(BaseModel):
    nombre: str = Field(min_length=1, max_length=100)
    franquicia: str = Field(min_length=1, max_length=100)
    tipo_luchador: str = Field(min_length=1, max_length=80)
    habilidad: str = Field(min_length=1, max_length=120)
    escenario: str = Field(min_length=1, max_length=120)

class Personaje(PersonajeCrear):
    id: int
