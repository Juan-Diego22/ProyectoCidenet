from sqlalchemy import Column, Integer, String, Date, DateTime, UniqueConstraint
from datetime import datetime
from ..database import Base

class Employee(Base):
    __tablename__ = "employees"

    id = Column(Integer, primary_key=True, index=True)
    
    # Datos Personales
    primer_apellido = Column(String(20), nullable=False)
    segundo_apellido = Column(String(20), nullable=False) 
    primer_nombre = Column(String(20), nullable=False)
    otros_nombres = Column(String(50), nullable=True)
    pais_empleo = Column(String, nullable=False)
    tipo_identificacion = Column(String, nullable=False) 
    numero_identificacion = Column(String(20), nullable=False)
    
    # Generados Automáticamente
    correo_electronico = Column(String(300), unique=True, nullable=False) 
    fecha_ingreso = Column(Date, nullable=False)  
    area = Column(String, nullable=False)
    estado = Column(String, default="Activo") 
    fecha_registro = Column(DateTime, default=datetime.now) 

    # Restricción: No 2 empleados con mismo número y tipo de ID 
    __table_args__ = (
        UniqueConstraint('tipo_identificacion', 'numero_identificacion', name='_tipo_num_uc'),
    )