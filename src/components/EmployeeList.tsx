import React, { useState, useEffect } from 'react';
import axios, { AxiosResponse } from 'axios';
import './EmployeeList.css';

interface Employee {
  id: number;
  name: string;
  role: string;
  email: string;
  phone: string;
}

const EmployeeList: React.FC = () => {
    console.log('Rendering EmployeeList component');
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        setLoading(true);
        const response: AxiosResponse<Employee[]> = await axios.get('/api/employees');
        setEmployees(response.data);
      } catch (error) {
        setError('Error fetching employees: ' + error);
      } finally {
        setLoading(false);
      }
    };

    fetchEmployees();
  }, []);

  if (loading) {
    return <div className="loading-message">Loading...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  return (
    <div className="employee-list">
      <h2>Liste over medarbejdere</h2>
      <table>
        <thead>
          <tr>
            <th>Navn</th>
            <th>Rolle</th>
            <th>Email</th>
            <th>Telefon</th>
          </tr>
        </thead>
        <tbody>
          {employees.map((employee) => (
            <tr key={employee.id}>
              <td>{employee.name}</td>
              <td>{employee.role}</td>
              <td>{employee.email}</td>
              <td>{employee.phone}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default EmployeeList;

