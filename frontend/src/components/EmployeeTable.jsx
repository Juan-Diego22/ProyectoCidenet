import React, { useEffect, useState } from 'react';
import { getEmployees } from '../services/api';

const EmployeeTable = ({ refresh }) => {
  const [employees, setEmployees] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(0);

  useEffect(() => {
    const loadData = async () => {
      try {
        const response = await getEmployees(page);
        setEmployees(response.data);
      } catch (error) {
        console.error("Error al cargar empleados", error);
      }
    };
    loadData();
  }, [page, refresh]);

  const filteredEmployees = employees.filter(emp => 
    emp.primer_nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    emp.primer_apellido.toLowerCase().includes(searchTerm.toLowerCase()) ||
    emp.numero_identificacion.includes(searchTerm)
  );

  return (
    <div className="card">
      <div className="table-header">
        <h2>Colaboradores</h2>
        <input 
          type="text" 
          className="input-field" 
          style={{ width: '250px' }} 
          placeholder=" Buscar..." 
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <table className="data-table">
        <thead>
          <tr>
            <th>Nombre</th>
            <th>ID</th>
            <th>Email</th>
            <th>Área</th>
            <th>Estado</th>
          </tr>
        </thead>
        <tbody>
          {filteredEmployees.map((emp) => (
            <tr key={emp.id}>
              <td><strong>{emp.primer_nombre} {emp.primer_apellido}</strong></td>
              <td>{emp.numero_identificacion}</td>
              <td style={{ color: 'var(--primary)' }}>{emp.correo_electronico}</td>
              <td>{emp.area}</td>
              <td><span className="status-badge">{emp.estado}</span></td>
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