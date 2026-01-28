from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.schemas.employee_schema import EmployeeCreate, EmployeeRead, EmployeeUpdate
from app.repositories import employee_repository
from app.models.employee import Employee
from app.services.email_service import obtener_correo_unico

router = APIRouter()

@router.post("/employees/", response_model=EmployeeRead)
def register_employee(employee: EmployeeCreate, db: Session = Depends(get_db)):
    # Validar que no exista mismo Tipo + Número ID [cite: 17]
    db_emp = db.query(employee_repository.Employee).filter(
        employee_repository.Employee.tipo_identificacion == employee.tipo_identificacion,
        employee_repository.Employee.numero_identificacion == employee.numero_identificacion
    ).first()
    
    if db_emp:
        raise HTTPException(status_code=400, detail="Identificación ya registrada")
        
    return employee_repository.create_employee(db=db, employee_data=employee)


# Obtener todos los empleados (Para la tabla de React)
@router.get("/employees/", response_model=list[EmployeeRead])
def get_all_employees(skip: int = 0, limit: int = 10, db: Session = Depends(get_db)):
    # El skip y limit permiten la paginación que pide la prueba
    return employee_repository.get_employees(db, skip=skip, limit=limit)

# Eliminar un empleado
@router.delete("/employees/{employee_id}")
def delete_employee(employee_id: int, db: Session = Depends(get_db)):
    db_emp = db.query(employee_repository.Employee).filter(employee_repository.Employee.id == employee_id).first()
    if not db_emp:
        raise HTTPException(status_code=404, detail="Empleado no encontrado")
    
    db.delete(db_emp)
    db.commit()
    return {"message": "Registro eliminado con éxito"}

# Actualizar un empleado
@router.put("/employees/{employee_id}", response_model=EmployeeRead)
def update_employee(employee_id: int, employee_data: EmployeeUpdate, db: Session = Depends(get_db)):
    db_emp = db.query(employee_repository.Employee).filter(employee_repository.Employee.id == employee_id).first()
    if not db_emp:
        raise HTTPException(status_code=404, detail="Empleado no encontrado")
    
    # Actualizar solo los campos que vienen en el request
    update_data = employee_data.dict(exclude_unset=True)
    
    # Si se cambia nombre, apellido o país, regenerar correo con lógica de unicidad
    campos_correo = ['primer_nombre', 'primer_apellido', 'pais_empleo']
    debe_regenerar_correo = any(campo in update_data for campo in campos_correo)
    
    for field, value in update_data.items():
        if field != 'fecha_registro' and value is not None:
            setattr(db_emp, field, value)
    
    # Si se debe regenerar el correo, aplicar lógica de unicidad
    if debe_regenerar_correo:
        # Obtener todos los correos existentes EXCEPTO el del empleado actual
        correos_existentes = db.query(Employee.correo_electronico).filter(
            Employee.id != employee_id
        ).all()
        lista_correos = [e[0] for e in correos_existentes]
        
        # Regenerar correo único
        correo_nuevo = obtener_correo_unico(
            nombre=db_emp.primer_nombre,
            apellido=db_emp.primer_apellido,
            pais=db_emp.pais_empleo,
            correos_existentes=lista_correos
        )
        db_emp.correo_electronico = correo_nuevo
    
    db.commit()
    db.refresh(db_emp)
    return db_emp