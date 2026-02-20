import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Register = () => {
  const navigate = useNavigate();
  const { register, isAuthenticated, user } = useAuth();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: '',
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Redirect if already authenticated
  if (isAuthenticated && user) {
    const dashboardPath = {
      jobSeeker: '/jobseeker/dashboard',
      employer: '/employer/dashboard',
      admin: '/admin/dashboard',
    }[user.role];

    if (dashboardPath) {
      navigate(dashboardPath, { replace: true });
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters long';
    }
    if (!formData.role) newErrors.role = 'Please select a role';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    setErrors({});

    try {
      const result = await register(
        formData.name,
        formData.email,
        formData.password,
        formData.role
      );

      if (result.success) {
        const dashboardPath = {
          jobSeeker: '/jobseeker/dashboard',
          employer: '/employer/dashboard',
          admin: '/admin/dashboard',
        }[result.user.role];
        navigate(dashboardPath || '/', { replace: true });
      } else {
        setErrors({ general: result.error });
      }
    } catch (error) {
      setErrors({ general: 'An unexpected error occurred. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#050015] relative overflow-hidden py-12 px-4">
      {/* Soft Backdrop */}
      <div className="fixed inset-0 -z-0 pointer-events-none">
        <div className="absolute left-1/2 top-20 -translate-x-1/2 w-[600px] h-[400px] bg-gradient-to-tr from-indigo-800/20 to-transparent rounded-full blur-[120px]" />
        <div className="absolute right-12 bottom-10 w-[400px] h-[300px] bg-gradient-to-bl from-indigo-700/20 to-transparent rounded-full blur-[100px]" />
      </div>

      <div className="relative z-10 w-full max-w-[450px] group">
        <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-500 to-indigo-600 rounded-2xl blur opacity-20 group-hover:opacity-30 transition duration-1000"></div>

        <form
          onSubmit={handleSubmit}
          className="relative w-full text-center bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-10 shadow-2xl"
        >
          <h1 className="text-white text-4xl font-berkshire mb-2">Join Us</h1>
          <p className="text-gray-400 text-sm mb-10">Create your account to get started</p>

          {errors.general && (
            <div className="mb-6 px-4 py-2 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm animate-pulse">
              {errors.general}
            </div>
          )}

          <div className="space-y-4">
            {/* Name Input */}
            <div className="flex items-center w-full bg-white/5 ring-1 ring-white/10 focus-within:ring-2 focus-within:ring-indigo-500/50 h-14 rounded-full overflow-hidden pl-6 gap-3 transition-all duration-300">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="text-white/50" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="8" r="5" /> <path d="M20 21a8 8 0 0 0-16 0" />
              </svg>
              <input
                type="text"
                name="name"
                placeholder="Full Name"
                className="w-full bg-transparent text-white placeholder-white/40 border-none outline-none text-sm"
                value={formData.name}
                onChange={handleChange}
                required
                disabled={isSubmitting}
              />
            </div>
            {errors.name && <p className="text-left text-xs text-red-400 pl-4">{errors.name}</p>}

            {/* Email Input */}
            <div className="flex items-center w-full bg-white/5 ring-1 ring-white/10 focus-within:ring-2 focus-within:ring-indigo-500/50 h-14 rounded-full overflow-hidden pl-6 gap-3 transition-all duration-300">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="text-white/50" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="m22 7-8.991 5.727a2 2 0 0 1-2.009 0L2 7" />
                <rect x="2" y="4" width="20" height="16" rx="2" />
              </svg>
              <input
                type="email"
                name="email"
                placeholder="Email address"
                className="w-full bg-transparent text-white placeholder-white/40 border-none outline-none text-sm"
                value={formData.email}
                onChange={handleChange}
                required
                disabled={isSubmitting}
              />
            </div>
            {errors.email && <p className="text-left text-xs text-red-400 pl-4">{errors.email}</p>}

            {/* Password Input */}
            <div className="flex items-center w-full bg-white/5 ring-1 ring-white/10 focus-within:ring-2 focus-within:ring-indigo-500/50 h-14 rounded-full overflow-hidden pl-6 gap-3 transition-all duration-300">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="text-white/50" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
              <input
                type="password"
                name="password"
                placeholder="Password (min 8 chars)"
                className="w-full bg-transparent text-white placeholder-white/40 border-none outline-none text-sm"
                value={formData.password}
                onChange={handleChange}
                required
                disabled={isSubmitting}
              />
            </div>
            {errors.password && <p className="text-left text-xs text-red-400 pl-4">{errors.password}</p>}

            {/* Role selection */}
            <div className="flex items-center w-full bg-white/5 ring-1 ring-white/10 focus-within:ring-2 focus-within:ring-indigo-500/50 h-14 rounded-full overflow-hidden px-6 gap-3 transition-all duration-300 relative">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="text-white/50" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M22 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" />
              </svg>
              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="w-full bg-transparent text-white placeholder-white/40 border-none outline-none text-sm appearance-none cursor-pointer"
                required
                disabled={isSubmitting}
              >
                <option value="" className="bg-[#050015]">Select Role</option>
                <option value="jobSeeker" className="bg-[#050015]">Job Seeker</option>
                <option value="employer" className="bg-[#050015]">Employer</option>
              </select>
              <div className="absolute right-6 pointer-events-none">
                <svg className="w-4 h-4 text-white/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
            {errors.role && <p className="text-left text-xs text-red-400 pl-4">{errors.role}</p>}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="mt-10 w-full h-14 rounded-full text-white bg-indigo-600 hover:bg-indigo-500 transition-all font-bold shadow-lg shadow-indigo-500/20 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Creating Account...' : 'Sign Up'}
          </button>

          <p className="text-gray-400 text-sm mt-8">
            Already have an account?
            <Link to="/login" className="text-indigo-400 hover:text-indigo-300 font-bold ml-2 transition-colors">
              Login here
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Register;
