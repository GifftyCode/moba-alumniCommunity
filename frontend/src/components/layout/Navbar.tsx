import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu, X, GraduationCap, User, LogOut, Settings } from "lucide-react";
import { useAuthStore } from "../../store/authStore";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { isAuthenticated, user, logout } = useAuthStore();
  const navigate = useNavigate();

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50 border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <div className="bg-primary-600 p-2 rounded-lg">
              <GraduationCap className="text-white w-5 h-5" />
            </div>
            <span className="font-serif font-bold text-xl text-gray-800">
              AlumniConnect
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            <Link
              to="/"
              className="text-gray-600 hover:text-primary-600 font-medium transition-colors"
            >
              Home
            </Link>
            <Link
              to="/alumni"
              className="text-gray-600 hover:text-primary-600 font-medium transition-colors"
            >
              Alumni Directory
            </Link>
            <Link
              to="/news"
              className="text-gray-600 hover:text-primary-600 font-medium transition-colors"
            >
              News
            </Link>
            <Link
              to="/gists"
              className="text-gray-600 hover:text-primary-600 font-medium transition-colors"
            >
              Gists
            </Link>
            <Link
              to="/community"
              className="text-gray-600 hover:text-primary-600 font-medium transition-colors"
            >
              Community
            </Link>
          </div>

          {/* Auth Buttons */}
          <div className="hidden md:flex items-center gap-3">
            {isAuthenticated ? (
              <div className="flex items-center gap-3">
                {user?.role === "admin" && (
                  <button
                    onClick={() => navigate("/admin")}
                    className="flex items-center gap-1 text-sm text-primary-600 hover:text-primary-700 font-medium"
                  >
                    <Settings className="w-4 h-4" />
                    Admin
                  </button>
                )}
                <button
                  onClick={() => navigate("/profile")}
                  className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 px-3 py-2 rounded-lg transition-colors"
                >
                  <User className="w-4 h-4 text-gray-600" />
                  <span className="text-sm font-medium text-gray-700">
                    {user?.firstName}
                  </span>
                </button>
                <button
                  onClick={logout}
                  className="flex items-center gap-1 text-sm text-red-500 hover:text-red-600 font-medium"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </button>
              </div>
            ) : (
              <>
                <Link to="/login" className="btn-secondary text-sm py-2">
                  Login
                </Link>
                <Link to="/register" className="btn-primary text-sm py-2">
                  Join Us
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button className="md:hidden p-2" onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden py-4 border-t border-gray-100">
            <div className="flex flex-col gap-4">
              <Link
                to="/"
                className="text-gray-600 font-medium"
                onClick={() => setIsOpen(false)}
              >
                Home
              </Link>
              <Link
                to="/alumni"
                className="text-gray-600 font-medium"
                onClick={() => setIsOpen(false)}
              >
                Alumni Directory
              </Link>
              <Link
                to="/news"
                className="text-gray-600 font-medium"
                onClick={() => setIsOpen(false)}
              >
                News
              </Link>
              <Link
                to="/gists"
                className="text-gray-600 font-medium"
                onClick={() => setIsOpen(false)}
              >
                Gists
              </Link>
              <Link
                to="/community"
                className="text-gray-600 font-medium"
                onClick={() => setIsOpen(false)}
              >
                Community
              </Link>
              {isAuthenticated ? (
                <>
                  <Link
                    to="/profile"
                    className="text-gray-600 font-medium"
                    onClick={() => setIsOpen(false)}
                  >
                    My Profile
                  </Link>
                  {user?.role === "admin" && (
                    <Link
                      to="/admin"
                      className="text-primary-600 font-medium"
                      onClick={() => setIsOpen(false)}
                    >
                      Admin Panel
                    </Link>
                  )}
                  <button
                    onClick={logout}
                    className="text-red-500 font-medium text-left"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <div className="flex gap-3 pt-2">
                  <Link
                    to="/login"
                    className="btn-secondary text-sm"
                    onClick={() => setIsOpen(false)}
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="btn-primary text-sm"
                    onClick={() => setIsOpen(false)}
                  >
                    Join Us
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
