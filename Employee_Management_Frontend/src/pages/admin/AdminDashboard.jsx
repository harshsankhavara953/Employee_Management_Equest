


import React from 'react'
import Logout from '../auth/Logout.jsx'
import { useState } from "react";
import Employees from "./Employees";
import Departments from "./Departments";
import Designations from "./Designations";
import LeaveTypes from "./LeaveTypes";
import Reports from "./Reports";
import Settings from "./Settings";

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("overview");

  const renderContent = () => {
    switch (activeTab) {
      case "employees": return <Employees />;
      case "departments": return <Departments />;
      case "designations": return <Designations />;
      case "leaveTypes": return <LeaveTypes />;
      case "reports": return <Reports />;
      case "settings": return <Settings />;
      default:
        return (
          <div className="p-6">
            <h2 className="text-2xl font-bold mb-4">System Overview</h2>
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-white p-4 shadow rounded">👥 Users: 120</div>
              <div className="bg-white p-4 shadow rounded">🏢 Departments: 8</div>
              <div className="bg-white p-4 shadow rounded">📊 Active Employees: 95</div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar setActiveTab={setActiveTab} />
      <main className="flex-1 p-6">{renderContent()}</main>
    </div>
  );
};

export default AdminDashboard;
