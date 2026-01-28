import React, { useState } from 'react';
import './App.css'; 
import EmployeeForm from './components/EmployeeForm';
import EmployeeTable from './components/EmployeeTable';
import logoCidenet from './assets/logoCidenet.png';

function App() {
  const [refresh, setRefresh] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState(null);

  // Notifica que hubo un cambio (creación, edición o eliminación)
  const handleDataChange = () => {
    setRefresh(prev => !prev);
    setEditingEmployee(null); // Limpia el modo edición
  };

  // Captura el empleado seleccionado en la tabla para editarlo
  const handleEditRequest = (employee) => {
    setEditingEmployee(employee);
  };

  return (
    <div className="App">
      <header className="main-header">
        <img src={logoCidenet} alt="Logo Cidenet" className="header-logo" />
        <h1 className="main-title">Sistema de Gestión de Empleados</h1>
      </header>
      
      <main className="main-content">
        <section className="form-section">
          <EmployeeForm 
            onEmployeeCreated={handleDataChange} 
            editingEmployee={editingEmployee} 
          />
        </section>

        <section className="table-section">
          <EmployeeTable 
            refresh={refresh} 
            onEdit={handleEditRequest} 
          />
        </section>
      </main>
    </div>
  );
}

export default App;