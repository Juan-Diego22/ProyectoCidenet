from sqlalchemy.orm import Session
from app.models.employee import Employee
from app.schemas.employee_schema import EmployeeCreate
from app.services.email_service import obtener_correo_unico

def create_employee(db: Session, employee_data: EmployeeCreate):
    # Obtener correos para validar unicidad 
    existentes = db.query(Employee.correo_electronico).all()
    lista_correos = [e[0] for e in existentes]
    
    correo_final = obtener_correo_unico(
        nombre=employee_data.primer_nombre,
        apellido=employee_data.primer_apellido,
        pais=employee_data.pais_empleo,
        correos_existentes=lista_correos
    )
    
    db_employee = Employee(
        **employee_data.dict(),
        correo_electronico=correo_final,
        estado="Activo" # No modificable por usuario 
    )
    
    db.add(db_employee)
    db.commit()
    db.refresh(db_employee)
    return db_employee

def get_employees(db: Session, skip: int = 0, limit: int = 10):
    # .offset(skip) se salta los registros ya vistos
    # .limit(limit) solo trae la cantidad permitida (10)
    return db.query(Employee).offset(skip).limit(limit).all()