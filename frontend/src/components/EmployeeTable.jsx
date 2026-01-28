import React, { useEffect, useState, useCallback } from 'react';
import { getEmployees, deleteEmployee } from '../services/api';

const EmployeeTable = ({ refresh, onEdit }) => {
  const [employees, setEmployees] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(0);

  const loadData = useCallback(async () => {
    try {
      const response = await getEmployees(page);
      setEmployees(response.data);
    } catch (error) {
      console.error("Error al cargar empleados", error);
    }
  }, [page]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    loadData();
  }, [loadData, refresh]);

  const handleDelete = async (id) => {
    const confirmed = window.confirm("¿Está seguro de que desea eliminar el empleado? Sí / No");
    if (confirmed) {
      try {
        await deleteEmployee(id);
        alert("Empleado eliminado correctamente");
        loadData();
      } catch (err) {
        console.error("Error al eliminar:", err);
        alert("Error al eliminar");
      }
    }
  };

  const filteredEmployees = employees.filter(emp => {
    if (!searchTerm) return true;
    const s = searchTerm.toString().toLowerCase();
    const fields = [
      emp.primer_nombre,
      emp.otros_nombres,
      emp.primer_apellido,
      emp.segundo_apellido,
      emp.tipo_identificacion,
      emp.numero_identificacion,
      emp.pais_empleo,
      emp.correo_electronico,
      emp.estado
    ];
    return fields.some(f => f && f.toString().toLowerCase().includes(s));
  });

  return (
    <div className="card">
      <div className="table-header">
        <h2>Colaboradores</h2>
        <input 
          type="text" className="input-field" style={{ width: '300px' }} 
          placeholder="Buscar por nombre, apellidos, ID, email, país o estado..." 
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <table className="data-table">
        <thead>
          <tr>
            <th>Nombre</th>
            <th>ID</th>
            <th>Email</th>
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {filteredEmployees.map((emp) => (
            <tr key={emp.id}>
              <td><strong>{emp.primer_nombre} {emp.primer_apellido}</strong></td>
              <td>{emp.numero_identificacion}</td>
              <td style={{ color: 'var(--primary)' }}>{emp.correo_electronico}</td>
              <td><span className="status-badge">{emp.estado || 'ACTIVO'}</span></td>
              <td>
                <div className="actions-cell">
                  <button className="btn-edit" onClick={() => onEdit(emp)}>Editar</button>
                  <button className="btn-delete" onClick={() => handleDelete(emp.id)}>Eliminar</button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="pagination">
        <button className="btn-pagination" disabled={page === 0} onClick={() => setPage(page - 1)}>Anterior</button>
        <span>Pág. {page + 1}</span>
        <button className="btn-pagination" disabled={employees.length < 10} onClick={() => setPage(page + 1)}>Siguiente</button>
      </div>
    </div>
  );
};

export default EmployeeTable;