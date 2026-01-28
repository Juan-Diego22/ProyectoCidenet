import React, { useState } from 'react';
import './App.css'; // Asegúrate de tener este import para los nuevos estilos
import EmployeeForm from './components/EmployeeForm';
import EmployeeTable from './components/EmployeeTable';

function App() {
  const [refresh, setRefresh] = useState(false);

  // Función para notificar a la tabla que debe recargarse
  const handleEmployeeCreated = () => {
    setRefresh(prev => !prev);
  };

  return (
    <div className="App">
      <header>
        <h1 className="main-title">Sistema de Gestión de Empleados</h1>
      </header>
      
      {/* Usamos 'main-content' para activar el diseño de dos columnas */}
      <main className="main-content">
        <section className="form-section">
          <EmployeeForm onEmployeeCreated={handleEmployeeCreated} />
        </section>

        <section className="table-section">
          <EmployeeTable refresh={refresh} />
        </section>
      </main>
    </div>
  );
}

export default App;