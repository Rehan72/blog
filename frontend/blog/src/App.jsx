import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  Link,
} from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import Navbar from "./components/Navbar";
import Login from "./pages/Login";
import Register from "./pages/Register";
import BlogList from "./pages/BlogList";
import BlogDetail from "./pages/BlogDetail";
import CreateBlog from "./pages/CreateBlog";
import EditBlog from "./pages/EditBlog";
import { Feather, Heart } from "lucide-react";

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="glass-card p-8 text-center animate-fade-in">
          <div className="w-10 h-10 border-2 border-[var(--color-accent-primary)] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-[var(--color-text-muted)] text-sm">Loading...</p>
        </div>
      </div>
    );
  return user ? children : <Navigate to="/login" />;
};

const Footer = () => (
  <footer className="py-12 mt-20 border-t border-slate-900 bg-slate-950/50">
    <div className="max-w-7xl mx-auto px-6 lg:px-12">
      <div className="flex flex-col md:flex-row justify-between items-center gap-8">
        <div className="flex flex-col items-center md:items-start gap-3">
          <div className="flex items-center gap-2 text-white font-display font-bold text-lg">
            <Feather size={20} className="text-indigo-500" />
            <span>BlogVerse</span>
          </div>
          <p className="text-slate-500 text-sm max-w-xs text-center md:text-left">
            Empowering voices to share stories that matter. Join our community of thoughtful writers today.
          </p>
        </div>

        <div className="flex gap-8">
          <div className="flex flex-col gap-3">
            <h4 className="text-xs font-bold uppercase tracking-widest text-slate-400">Platform</h4>
            <Link to="/" className="text-sm text-slate-500 hover:text-white transition-colors">Explore</Link>
            <Link to="/login" className="text-sm text-slate-500 hover:text-white transition-colors">Sign in</Link>
          </div>
          <div className="flex flex-col gap-3">
            <h4 className="text-xs font-bold uppercase tracking-widest text-slate-400">Resources</h4>
            <a href="#" className="text-sm text-slate-500 hover:text-white transition-colors">Guidelines</a>
            <a href="#" className="text-sm text-slate-500 hover:text-white transition-colors">Privacy</a>
          </div>
        </div>
      </div>
      
      <div className="divider opacity-10" />
      
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-slate-600">
        <p>&copy; {new Date().getFullYear()} BlogVerse Inc. All rights reserved.</p>
        <p className="flex items-center gap-1.5">
          Crafted with <Heart size={12} className="text-rose-500 fill-rose-500" /> for the curious mind.
        </p>
      </div>
    </div>
  </footer>
);

const AppRoutes = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<BlogList />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/blog/:id" element={<BlogDetail />} />
          <Route
            path="/create"
            element={
              <ProtectedRoute>
                <CreateBlog />
              </ProtectedRoute>
            }
          />
          <Route
            path="/edit/:id"
            element={
              <ProtectedRoute>
                <EditBlog />
              </ProtectedRoute>
            }
          />
        </Routes>
      </main>
      <Footer />
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppRoutes />
      </Router>
    </AuthProvider>
  );
}

export default App;
