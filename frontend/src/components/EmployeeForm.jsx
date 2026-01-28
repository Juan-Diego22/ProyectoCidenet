import React, { useState } from 'react';
import { createEmployee } from '../services/api';

const EmployeeForm = ({ onEmployeeCreated }) => {
  const [formData, setFormData] = useState({
    primer_apellido: '',
    segundo_apellido: '',
    primer_nombre: '',
    otros_nombres: '',
    pais_empleo: '',
    tipo_identificacion: '',
    numero_identificacion: '',
    fecha_ingreso: '',
    area: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Validación: Convertir a MAYÚSCULAS y limitar a 20 caracteres
    let formattedValue = value.toUpperCase();
    
    // Restricción de longitud excepto para ID y Fecha
    if (name !== 'numero_identificacion' && name !== 'fecha_ingreso') {
      formattedValue = formattedValue.substring(0, 20);
    }

    setFormData({ ...formData, [name]: formattedValue });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createEmployee(formData);
      alert("¡Empleado registrado con éxito!");
      onEmployeeCreated(); // Notifica a App.jsx para refrescar la tabla
      
      // Resetear el formulario
      setFormData({
        primer_apellido: '', segundo_apellido: '', primer_nombre: '',
        otros_nombres: '', pais_empleo: '', tipo_identificacion: '',
        numero_identificacion: '', fecha_ingreso: '', area: ''
      });
    } catch (error) {
      const errorMsg = error.response?.data?.detail || "Error en el registro";
      alert("Error: " + errorMsg);
    }
  };

  return (
    <div className="card">
      <h2 className="form-title">Registro de Personal</h2>
      <form onSubmit={handleSubmit} className="employee-form">
        
        <div className="form-group">
          <label>Primer Apellido *</label>
          <input 
            className="input-field"
            name="primer_apellido" 
            value={formData.primer_apellido} 
            onChange={handleChange} 
            required 
          />
        </div>

        <div className="form-group">
          <label>Segundo Apellido *</label>
          <input 
            className="input-field"
            name="segundo_apellido" 
            value={formData.segundo_apellido} 
            onChange={handleChange} 
            required 
          />
        </div>

        <div className="form-group">
          <label>Primer Nombre *</label>
          <input 
            className="input-field"
            name="primer_nombre" 
            value={formData.primer_nombre} 
            onChange={handleChange} 
            required 
          />
        </div>

        <div className="form-group">
          <label>Otros Nombres</label>
          <input 
            className="input-field"
            name="otros_nombres" 
            value={formData.otros_nombres} 
            onChange={handleChange} 
          />
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
          <input 
            className="input-field"
            name="numero_identificacion" 
            value={formData.numero_identificacion} 
            onChange={handleChange} 
            required 
          />
        </div>

        <div className="form-group">
          <label>Fecha de Ingreso *</label>
          <input 
            className="input-field"
            type="date" 
            name="fecha_ingreso" 
            value={formData.fecha_ingreso} 
            onChange={handleChange} 
            required 
          />
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

        <button type="submit" className="btn-primary">Registrar Empleado</button>
      </form>
    </div>
  );
};

export default EmployeeForm;