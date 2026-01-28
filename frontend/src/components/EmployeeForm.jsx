import React, { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { createEmployee, updateEmployee } from '../services/api';

const EmployeeForm = ({ onEmployeeCreated, editingEmployee }) => {
  const getTimestamp = () => {
    const d = new Date();
    return `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}/${d.getFullYear()} ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}:${String(d.getSeconds()).padStart(2, '0')}`;
  };

  // Convertir fecha ISO a formato YYYY-MM-DD para input
  const formatDateToInput = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  // Calcular fecha mínima (hace 30 días) y máxima (hoy)
  const getDateRange = () => {
    const today = new Date();
    const minDate = new Date(today);
    minDate.setDate(minDate.getDate() - 30);

    const formatDate = (date) => {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    };

    return {
      min: formatDate(minDate),
      max: formatDate(today)
    };
  };

  const [formData, setFormData] = useState({
    primer_apellido: '', segundo_apellido: '', primer_nombre: '',
    otros_nombres: '', pais_empleo: '', tipo_identificacion: '',
    numero_identificacion: '', fecha_ingreso: '', area: '',
    fecha_registro: getTimestamp(),
    fecha_edicion: '',
    correo_electronico: ''
  });

  useEffect(() => {
    if (editingEmployee) {
      setFormData({ 
        ...editingEmployee,
        fecha_ingreso: formatDateToInput(editingEmployee.fecha_ingreso),
        fecha_edicion: getTimestamp() 
      });
    } else {
      setFormData({
        primer_apellido: '', segundo_apellido: '', primer_nombre: '',
        otros_nombres: '', pais_empleo: '', tipo_identificacion: '',
        numero_identificacion: '', fecha_ingreso: '', area: '',
        fecha_registro: getTimestamp(),
        fecha_edicion: '',
        correo_electronico: ''
      });
    }
  }, [editingEmployee]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    const fieldsToUp = ['primer_apellido', 'segundo_apellido', 'primer_nombre', 'otros_nombres'];
    let val = fieldsToUp.includes(name) ? value.toUpperCase() : value;
    
    const updatedData = { ...formData, [name]: val };
    
    setFormData(updatedData);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingEmployee) {
        const id = editingEmployee.id;
        await updateEmployee(id, formData);
        alert(`Empleado actualizado correctamente`);
      } else {
        await createEmployee(formData);
        alert(`Empleado creado correctamente`);
      }
      setFormData({
        primer_apellido: '', segundo_apellido: '', primer_nombre: '',
        otros_nombres: '', pais_empleo: '', tipo_identificacion: '',
        numero_identificacion: '', fecha_ingreso: '', area: '',
        fecha_registro: getTimestamp(),
        fecha_edicion: ''
      });
      onEmployeeCreated();
    } catch (err) {
      console.error(`Error al ${editingEmployee ? 'actualizar' : 'crear'} empleado:`, err.response?.data?.detail || err.message);
      alert(`Error al ${editingEmployee ? 'actualizar' : 'crear'} empleado: ${err.response?.data?.detail || err.message}`);
    }
  };
  
  return (
    <div className="card">
      <h2 className="form-title">{editingEmployee ? 'Edición de Empleados' : 'Registro de Personal'}</h2>
      <form onSubmit={handleSubmit} className="employee-form">
        <div className="form-group">
          <label>Primer Apellido *</label>
          <input className="input-field" name="primer_apellido" value={formData.primer_apellido} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label>Segundo Apellido *</label>
          <input className="input-field" name="segundo_apellido" value={formData.segundo_apellido} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label>Primer Nombre *</label>
          <input className="input-field" name="primer_nombre" value={formData.primer_nombre} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label>Otros Nombres</label>
          <input className="input-field" name="otros_nombres" value={formData.otros_nombres} onChange={handleChange} />
        </div>
        <div className="form-group">
          <label>País de Empleo *</label>
          <select className="input-field" name="pais_empleo" value={formData.pais_empleo} onChange={handleChange} required>
            <option value="">Seleccione...</option>
            <option value="Colombia">Colombia</option>
            <option value="Estados Unidos">Estados Unidos</option>
          </select>
        </div>
        <div className="form-group">
          <label>Tipo Identificación *</label>
          <select className="input-field" name="tipo_identificacion" value={formData.tipo_identificacion} onChange={handleChange} required>
            <option value="">Seleccione...</option>
            <option value="Cedula de Ciudadania">Cédula de Ciudadanía</option>
            <option value="Cedula de Extranjeria">Cédula de Extranjería</option>
            <option value="Pasaporte">Pasaporte</option>
            <option value="Permiso Especial">Permiso Especial</option>
          </select>
        </div>
        <div className="form-group">
          <label>Número de Identificación *</label>
          <input className="input-field" name="numero_identificacion" value={formData.numero_identificacion} onChange={handleChange} required />
        </div>

        {/* Mostrar correo electrónico regenerado en edición */}
        {editingEmployee && (
          <div className="form-group">
            <label>Correo Electrónico (Se regenerará automáticamente)</label>
            <input 
              className="input-field" 
              type="text" 
              value={formData.correo_electronico} 
              readOnly 
              style={{ backgroundColor: '#f0f0f0', cursor: 'not-allowed' }}
            />
            <small style={{ color: '#666', marginTop: '5px', display: 'block' }}>
              ⓘ Si cambias nombre, apellido o país, el correo se regenerará automáticamente asignando un número secuencial si es necesario.
            </small>
          </div>
        )}
        
        <div className="form-group">
          <label>Fecha de Ingreso *</label>
          <DatePicker
            selected={formData.fecha_ingreso ? new Date(formData.fecha_ingreso) : null}
            onChange={(date) => {
              if (date) {
                const year = date.getFullYear();
                const month = String(date.getMonth() + 1).padStart(2, '0');
                const day = String(date.getDate()).padStart(2, '0');
                setFormData({ ...formData, fecha_ingreso: `${year}-${month}-${day}` });
              }
            }}
            minDate={new Date(getDateRange().min)}
            maxDate={new Date(getDateRange().max)}
            dateFormat="dd/MM/yyyy"
            placeholderText="Selecciona una fecha"
            className="input-field"
            required
          />
          <small style={{ color: '#666', marginTop: '5px', display: 'block' }}>
            ⓘ Máximo 30 días de antigüedad. Rango: {getDateRange().min} a {getDateRange().max}
          </small>
        </div>

        <div className="form-group">
          <label>Área *</label>
          <select className="input-field" name="area" value={formData.area} onChange={handleChange} required>
            <option value="">Seleccione...</option>
            <option value="Administracion">Administración</option>
            <option value="Financiera">Financiera</option>
            <option value="Compras">Compras</option>
            <option value="Infraestructura">Infraestructura</option>
            <option value="Operacion">Operación</option>
            <option value="Talento Humano">Talento Humano</option>
            <option value="Servicios Varios">Servicios Varios</option>
          </select>
        </div>

        {/* REGLA: Etiqueta dinámica (Registro vs Edición) */}
        {editingEmployee ? (
          <div className="form-group">
            <label>Fecha y Hora de Edición (Sistema)</label>
            <input className="input-field" type="text" value={formData.fecha_edicion} readOnly style={{backgroundColor: '#eee'}} />
          </div>
        ) : (
          <div className="form-group">
            <label>Fecha y Hora de Registro (Sistema)</label>
            <input className="input-field" type="text" value={formData.fecha_registro} readOnly style={{backgroundColor: '#eee'}} />
          </div>
        )}

        <button type="submit" className="btn-primary">
          {editingEmployee ? 'Guardar Cambios' : 'Registrar Empleado'}
        </button>
      </form>
    </div>
  );
};

export default EmployeeForm;