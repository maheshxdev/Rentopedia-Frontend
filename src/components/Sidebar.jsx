// src/components/Sidebar.jsx
import { Link } from 'react-router-dom';

const Sidebar = () => {
  return (
    <aside className="bg-white shadow-md w-64 min-h-screen p-4 space-y-4">
      <h2 className="text-xl font-bold mb-6">Dashboard</h2>
      <Link to="/dashboard" className="block text-gray-700 hover:text-purple-600">Home</Link>
      <Link to="/add-property" className="block text-gray-700 hover:text-purple-600">Add Property</Link>
      <Link to="/properties" className="block text-gray-700 hover:text-purple-600">All Properties</Link>
    </aside>
  );
};

export default Sidebar;
