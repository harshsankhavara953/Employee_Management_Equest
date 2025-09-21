import { useEffect, useState } from "react";
import api from "../../utils/api";

const Employees = () => {
  const [employees, setEmployees] = useState([]);

  useEffect(() => {
    api.get("/employees").then(res => setEmployees(res.data));
  }, []);

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Manage Employees</h2>
      <table className="w-full border">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-2 border">ID</th>
            <th className="p-2 border">Name</th>
            <th className="p-2 border">Department</th>
            <th className="p-2 border">Status</th>
          </tr>
        </thead>
        <tbody>
          {employees.map(emp => (
            <tr key={emp.id}>
              <td className="p-2 border">{emp.id}</td>
              <td className="p-2 border">{emp.name}</td>
              <td className="p-2 border">{emp.department?.name}</td>
              <td className="p-2 border">{emp.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Employees;
