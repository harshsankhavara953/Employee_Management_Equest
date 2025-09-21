const Sidebar = ({ setActiveTab }) => {
    const menuItems = [
      { key: "overview", label: "System Overview" },
      { key: "employees", label: "Employee Management" },
      { key: "departments", label: "Departments" },
      { key: "designations", label: "Designations" },
      { key: "leaveTypes", label: "Leave Types" },
      { key: "reports", label: "Reports & Analytics" },
      { key: "settings", label: "Security & Settings" },
    ];
  
    return (
      <aside className="w-64 bg-white shadow-md p-4">
        <h2 className="text-xl font-bold mb-6">Admin Dashboard</h2>
        <ul>
          {menuItems.map(item => (
            <li
              key={item.key}
              className="p-2 hover:bg-gray-200 cursor-pointer rounded"
              onClick={() => setActiveTab(item.key)}
            >
              {item.label}
            </li>
          ))}
        </ul>
      </aside>
    );
  };
  
  export default Sidebar;
  