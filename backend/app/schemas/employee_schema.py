from pydantic import BaseModel, Field, field_validator
from datetime import date, datetime
from typing import Optional
import re

class EmployeeBase(BaseModel):
    # Validaciones: Solo A-Z, sin acentos ni Ñ
    # Usamos expresiones regulares (regex) para garantizar esto
    primer_apellido: str = Field(..., max_length=20, pattern=r"^[A-Z ]+$")
    segundo_apellido: str = Field(..., max_length=20, pattern=r"^[A-Z ]+$")
    primer_nombre: str = Field(..., max_length=20, pattern=r"^[A-Z ]+$")
    otros_nombres: Optional[str] = Field(None, max_length=50, pattern=r"^[A-Z ]*$")
    
    pais_empleo: str # Colombia o Estados Unidos
    tipo_identificacion: str #
    numero_identificacion: str = Field(..., max_length=20, pattern=r"^[a-zA-Z0-9-]+$") #
    
    fecha_ingreso: date #
    area: str #

    @field_validator('fecha_ingreso')
    @classmethod
    def validar_fecha(cls, v: date):
        hoy = date.today()
        # Regla: No superior a hoy, pero sí hasta un mes menor
        if v > hoy:
            raise ValueError('La fecha de ingreso no puede ser futura')
        diferencia_dias = (hoy - v).days
        if diferencia_dias > 30:
            raise ValueError('La fecha de ingreso no puede tener más de un mes de antigüedad')
        return v

# Se usa para el registro (lo que envía el usuario)
class EmployeeCreate(EmployeeBase):
    pass 

# Se usa para la actualización (permite cambiar correo y otros campos)
class EmployeeUpdate(BaseModel):
    primer_apellido: Optional[str] = Field(None, max_length=20, pattern=r"^[A-Z ]+$")
    segundo_apellido: Optional[str] = Field(None, max_length=20, pattern=r"^[A-Z ]+$")
    primer_nombre: Optional[str] = Field(None, max_length=20, pattern=r"^[A-Z ]+$")
    otros_nombres: Optional[str] = Field(None, max_length=50, pattern=r"^[A-Z ]*$")
    
    pais_empleo: Optional[str] = None
    tipo_identificacion: Optional[str] = None
    numero_identificacion: Optional[str] = Field(None, max_length=20, pattern=r"^[a-zA-Z0-9-]+$")
    
    fecha_ingreso: Optional[date] = None
    area: Optional[str] = None
    correo_electronico: Optional[str] = None
    
    @field_validator('fecha_ingreso')
    @classmethod
    def validar_fecha(cls, v: date):
        if v is None:
            return v
        hoy = date.today()
        if v > hoy:
            raise ValueError('La fecha de ingreso no puede ser futura')
        diferencia_dias = (hoy - v).days
        if diferencia_dias > 30:
            raise ValueError('La fecha de ingreso no puede tener más de un mes de antigüedad')
        return v

# Se usa para la respuesta (lo que el sistema devuelve con datos automáticos)
class EmployeeRead(EmployeeBase):
    id: int
    correo_electronico: str # Generado automáticamente
    estado: str # Siempre "Activo" al inicio
    fecha_registro: datetime #

    class Config:
        from_attributes = True