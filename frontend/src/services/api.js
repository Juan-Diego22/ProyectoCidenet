import axios from 'axios';

const api = axios.create({
    baseURL: 'http://127.0.0.1:8000/api/v1'
});

export const getEmployees = (page = 0) => 
    api.get(`/employees/?skip=${page * 10}&limit=10`); // Paginación de 10 en 10

export const createEmployee = (data) => 
    api.post('/employees/', data); // Registro de empleado

export default api;