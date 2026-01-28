from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.schemas.employee_schema import EmployeeCreate, EmployeeRead
from app.repositories import employee_repository
from app.models.employee import Employee

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