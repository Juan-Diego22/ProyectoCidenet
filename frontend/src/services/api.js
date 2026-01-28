import axios from 'axios';

const api = axios.create({
    baseURL: 'http://127.0.0.1:8000/api/v1'
});

export const getEmployees = (page = 0) => 
    api.get(`/employees/?skip=${page * 10}&limit=10`);

export const createEmployee = (data) => 
    api.post('/employees/', data);

export const updateEmployee = (id, data) => {
  // Crear copia de data sin el campo 'id'
  const dataToSend = { ...data };
  delete dataToSend.id;
  
  return api.put(`/employees/${id}`, dataToSend);
};

export const deleteEmployee = (id) => api.delete(`/employees/${id}`);

export default api;