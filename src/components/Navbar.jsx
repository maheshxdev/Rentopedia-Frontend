import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { FaUserCircle, FaBars, FaTimes } from "react-icons/fa";
import { useUser } from "../context/UserData";
import axios from "axios";

const Navbar = () => {
  const { user, setUser } = useUser();
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await axios.post("https://rentopedia-backend.onrender.com/api/auth/logout", {}, { withCredentials: true });
    } catch (err) {
      console.error("Logout failed:", err);
    }
    setUser("");
    navigate("/login");
  };

  return (
    <nav className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 w-full shadow-lg px-6 py-3 fixed top-0 z-[999]">
      <div className="flex justify-between items-center text-white">
        {/* Logo */}
        <Link to="/" className="text-2xl font-bold tracking-wide hover:opacity-90 transition">
          Rentopedia
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center space-x-6">
          {user && (
            <>
              <Link to="/" className="hover:text-yellow-300 transition">Home</Link>
              <Link to="/add-property" className="hover:text-yellow-300 transition">Add Rentals</Link>
              <Link to="/contact" className="hover:text-yellow-300 transition">Contact</Link>
            </>
          )}

          {!user ? (
            <>
              <Link to="/login" className="hover:text-yellow-300 transition">Login</Link>
              <Link to="/register" className="hover:text-yellow-300 transition">Register</Link>
            </>
          ) : (
            <div className="relative">
              <button
                className="text-2xl focus:outline-none hover:opacity-80"
                onClick={() => setDropdownOpen(!dropdownOpen)}
              >
                <FaUserCircle />
              </button>
              {dropdownOpen && (
                <div
                  className="absolute right-0 mt-2 w-44 bg-white text-gray-800 border rounded-md shadow-lg py-2 z-50"
                  onClick={() => setDropdownOpen(false)}
                >
                  <Link to="/dashboard" className="block px-4 py-2 text-sm hover:bg-gray-100">Dashboard</Link>
                  <Link to="/settings" className="block px-4 py-2 text-sm hover:bg-gray-100">Settings</Link>
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-gray-100"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Mobile Hamburger */}
        <button
          className="md:hidden text-2xl focus:outline-none hover:opacity-90"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <FaTimes /> : <FaBars />}
        </button>
      </div>

      {/* Mobile Dropdown */}
      {menuOpen && (
        <div
          className="md:hidden mt-3 flex flex-col space-y-3 bg-gradient-to-b from-blue-700 via-indigo-700 to-purple-700 p-4 rounded-lg text-white"
          onClick={() => setMenuOpen(false)}
        >
          {user && (
            <>
              <Link to="/" className="hover:text-yellow-300">Home</Link>
              <Link to="/add-property" className="hover:text-yellow-300">Add Rentals</Link>
              <Link to="/contact" className="hover:text-yellow-300">Contact</Link>
            </>
          )}

          {!user ? (
            <>
              <Link to="/login" className="hover:text-yellow-300">Login</Link>
              <Link to="/register" className="hover:text-yellow-300">Register</Link>
            </>
          ) : (
            <>
              <Link to="/dashboard" className="hover:text-yellow-300">Dashboard</Link>
              <Link to="/settings" className="hover:text-yellow-300">Settings</Link>
              <button
                onClick={handleLogout}
                className="text-red-300 hover:text-red-400 text-left"
              >
                Logout
              </button>
            </>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
