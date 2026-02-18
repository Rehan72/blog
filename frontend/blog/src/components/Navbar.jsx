import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  Home,
  PenSquare,
  LogOut,
  LogIn,
  UserPlus,
  Menu,
  X,
  Feather,
} from "lucide-react";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className={`glass-nav ${scrolled ? "scrolled" : ""}`}>
      <div className="max-w-6xl mx-auto px-6 lg:px-12 flex justify-between items-center h-16 transition-all duration-300">
        {/* Brand */}
        <Link
          to="/"
          className="flex items-center gap-2 text-xl font-display font-bold text-white no-underline group"
        >
          <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center group-hover:bg-indigo-500 transition-colors">
            <Feather size={18} className="text-white" />
          </div>
          <span>BlogVerse</span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-8">
          <Link
            to="/"
            className={`text-sm font-medium transition-colors hover:text-white ${isActive("/") ? "text-white" : "text-slate-400"}`}
          >
            Explore
          </Link>

          {user ? (
            <div className="flex items-center gap-6">
              <Link
                to="/create"
                className="glass-btn glass-btn-primary py-2 px-5 text-sm"
              >
                <PenSquare size={16} />
                Write a Story
              </Link>

              <div className="h-4 w-px bg-slate-800" />

              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 group cursor-pointer">
                  <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-xs font-bold text-indigo-400">
                    {user.username?.charAt(0).toUpperCase()}
                  </div>
                  <span className="text-sm font-medium text-slate-300 group-hover:text-white transition-colors">
                    {user.username}
                  </span>
                </div>
                
                <button
                  onClick={handleLogout}
                  className="p-2 text-slate-400 hover:text-rose-400 transition-colors"
                  title="Logout"
                >
                  <LogOut size={18} />
                </button>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-4">
              <Link
                to="/login"
                className="text-sm font-medium text-slate-300 hover:text-white transition-colors"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="glass-btn glass-btn-primary py-2 px-6 text-sm"
              >
                Get Started
              </Link>
            </div>
          )}
        </div>

        {/* Mobile menu button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 rounded-lg text-slate-400 hover:text-white transition-colors"
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-0 top-16 bg-slate-950 z-40 animate-fade-in-up">
          <div className="flex flex-col p-8 gap-8">
            <Link to="/" className="text-2xl font-display font-bold">
              Explore
            </Link>
            
            {user ? (
              <>
                <Link to="/create" className="text-2xl font-display font-bold">
                  Write a Story
                </Link>
                <div className="divider opacity-20" />
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-indigo-600 flex items-center justify-center text-xl font-bold">
                    {user.username?.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="text-xl font-bold">{user.username}</p>
                    <button onClick={handleLogout} className="text-rose-400 text-sm">Sign out</button>
                  </div>
                </div>
              </>
            ) : (
              <>
                <Link to="/login" className="text-2xl font-display font-bold">
                  Login
                </Link>
                <Link to="/register" className="glass-btn glass-btn-primary text-xl py-4">
                  Get Started
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
