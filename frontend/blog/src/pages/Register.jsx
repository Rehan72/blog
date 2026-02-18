import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../services/api";
import {
  User,
  Mail,
  Lock,
  ArrowRight,
  AlertCircle,
  Loader2,
  CheckCircle2,
  Feather,
  Eye,
  EyeOff,
} from "lucide-react";

const Register = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const response = await api.signup(formData);
      if (response.message) {
        navigate("/login");
      } else {
        setError(response.error || "Registration failed");
      }
    } catch {
      setError("An error occurred during registration");
    } finally {
      setLoading(false);
    }
  };

  // Simple password strength
  const getPasswordStrength = () => {
    const pwd = formData.password;
    if (!pwd) return { label: "", level: 0 };
    if (pwd.length < 4) return { label: "Too short", level: 1 };
    if (pwd.length < 6) return { label: "Weak", level: 1 };
    if (pwd.length < 8) return { label: "Fair", level: 2 };
    const hasUpper = /[A-Z]/.test(pwd);
    const hasNumber = /[0-9]/.test(pwd);
    const hasSpecial = /[^A-Za-z0-9]/.test(pwd);
    const score = [hasUpper, hasNumber, hasSpecial].filter(Boolean).length;
    if (score >= 2 && pwd.length >= 8) return { label: "Strong", level: 3 };
    return { label: "Good", level: 2 };
  };

  const strength = getPasswordStrength();
  const strengthColors = ["", "text-rose-500", "text-amber-500", "text-emerald-500"];
  const strengthBgColors = ["", "bg-rose-500", "bg-amber-500", "bg-emerald-500"];
  const strengthWidths = ["0%", "33%", "66%", "100%"];

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-6 py-12 relative overflow-hidden">
      {/* Background Decorative Element */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-violet-600/10 blur-[140px] rounded-full -z-10" />

      <div className="w-full max-w-lg animate-fade-in-up">
        <div className="glass-card p-10 md:p-14 space-y-10">
          {/* Header */}
          <div className="text-center space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-violet-600 flex items-center justify-center mx-auto mb-6 shadow-xl shadow-violet-600/20">
              <Feather size={24} className="text-white" />
            </div>
            <h1 className="text-4xl font-display font-bold text-white leading-tight">
              Create your <span className="text-violet-400">Profile</span>.
            </h1>
            <p className="text-slate-400 font-medium">
              Join our community and start sharing your unique stories today.
            </p>
          </div>

          {/* Error */}
          {error && (
            <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center gap-3 text-rose-400 text-sm animate-shake">
              <AlertCircle size={18} />
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="form-group">
              <label htmlFor="username" className="glass-label">
                Username
              </label>
              <div className="relative">
                <User size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type="text"
                  id="username"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  required
                  placeholder="TheStoryteller"
                  className="glass-input pl-12 h-14"
                  autoComplete="username"
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="email" className="glass-label">
                Email Address
              </label>
              <div className="relative">
                <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  placeholder="writer@example.com"
                  className="glass-input pl-12 h-14"
                  autoComplete="email"
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="password" className="glass-label">
                Password
              </label>
              <div className="relative">
                <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  placeholder="Minimum 8 characters"
                  className="glass-input pl-12 pr-12 h-14"
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>

              {/* Password strength */}
              {formData.password && (
                <div className="mt-4 animate-fade-in space-y-2">
                  <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-widest">
                    <span className="text-slate-500">Strength</span>
                    <span className={`${strengthColors[strength.level]}`}>{strength.label}</span>
                  </div>
                  <div className="h-1 bg-slate-900 rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all duration-500 ${strengthBgColors[strength.level]}`}
                      style={{ width: strengthWidths[strength.level] }}
                    />
                  </div>
                </div>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full h-14 glass-btn glass-btn-primary text-base disabled:opacity-50 disabled:cursor-not-allowed group shadow-xl shadow-indigo-600/10"
            >
              {loading ? (
                <>
                  <Loader2 size={20} className="animate-spin" />
                  Creating Account...
                </>
              ) : (
                <>
                  Create Account
                  <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          {/* Footer link */}
          <div className="divider opacity-10" />
          <p className="text-center text-slate-500 font-medium">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-white hover:text-violet-400 font-bold transition-colors"
            >
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
