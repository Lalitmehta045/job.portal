import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import logo from '../assets/logo_job.png';

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
    setIsMobileMenuOpen(false);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  // Role-specific navigation links
  const getNavLinks = () => {
    if (!isAuthenticated || !user) {
      return [
        { to: '/login', label: 'Login', isButton: true },
        { to: '/register', label: 'Register', isButton: true },
      ];
    }

    switch (user.role) {
      case 'jobSeeker':
        return [
          { to: '/jobseeker/dashboard', label: 'Dashboard' },
          { to: '/jobseeker/jobs', label: 'Browse Jobs' },
          { to: '/jobseeker/applied', label: 'My Applications' },
          { to: '/jobseeker/saved', label: 'Saved Jobs' },
          { to: '/jobseeker/profile', label: 'Profile' },
        ];
      case 'employer':
        return [
          { to: '/employer/dashboard', label: 'Dashboard' },
          { to: '/employer/post-job', label: 'Post Job' },
          { to: '/employer/my-jobs', label: 'My Jobs' },
        ];
      case 'admin':
        return [
          { to: '/admin/dashboard', label: 'Dashboard' },
          { to: '/admin/users', label: 'Users' },
          { to: '/admin/jobs', label: 'Jobs' },
        ];
      default:
        return [];
    }
  };

  const navLinks = getNavLinks();

  const AnimatedButton = ({ to, label, onClick, className = "" }) => {
    const content = (
      <div className={`relative inline-block p-0.5 rounded-full overflow-hidden hover:scale-105 transition duration-300 active:scale-100 before:content-[''] before:absolute before:inset-0 before:bg-[conic-gradient(from_0deg,_#00F5FF,_#00F5FF30,_#00F5FF)] button-wrapper ${className}`}>
        <button className="relative z-10 bg-gray-800 text-white rounded-full px-6 py-2 font-medium text-sm whitespace-nowrap w-full">
          {label}
        </button>
      </div>
    );

    if (to) {
      return <Link to={to} onClick={closeMobileMenu}>{content}</Link>;
    }
    return <div onClick={onClick} className="cursor-pointer">{content}</div>;
  };

  return (
    <div className="absolute top-0 left-0 w-full z-50 px-4 md:px-16 lg:px-24 xl:px-32 flex justify-center">
      <nav className="flex items-center w-full max-w-7xl px-6 py-4 text-white bg-transparent transition-all">
        {/* Logo */}
        <Link to="/" className="flex items-center shrink-0" onClick={closeMobileMenu}>
          <img src={logo} alt="Job Portal Logo" className="h-20 w-auto drop-shadow-sm" />
        </Link>

        {/* Desktop Navigation Links */}
        <div className="hidden md:flex items-center gap-7 ml-10">
          {navLinks.map((link) => (
            !link.isButton && (
              <Link
                key={link.to}
                to={link.to}
                className="relative overflow-hidden h-6 group text-sm font-medium"
              >
                <span className="block group-hover:-translate-y-full transition-transform duration-300">
                  {link.label}
                </span>
                <span className="block absolute top-full left-0 group-hover:translate-y-[-100%] transition-transform duration-300 text-indigo-600">
                  {link.label}
                </span>
              </Link>
            )
          ))}
        </div>

        {/* Desktop Actions */}
        <div className="hidden ml-auto md:flex items-center gap-4">
          {navLinks.filter(l => l.isButton).map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={`${link.label === 'Register' || link.label === 'Get started'
                ? 'bg-indigo-600 text-white hover:shadow-[0px_0px_30px_7px_rgba(79,70,229,0.4)]'
                : 'border border-slate-200 hover:bg-slate-50'} px-6 py-2 rounded-full text-sm font-bold transition-all duration-300 active:scale-95`}
            >
              {link.label}
            </Link>
          ))}

          {isAuthenticated && (
            <button
              onClick={handleLogout}
              className="px-6 py-2 rounded-full text-sm font-bold text-red-500 border border-red-100 hover:bg-red-50 transition-all active:scale-95"
            >
              Logout
            </button>
          )}
        </div>

        {/* Mobile menu toggle */}
        <button
          aria-label="menu-btn"
          type="button"
          onClick={toggleMobileMenu}
          className="ml-auto md:hidden active:scale-90 transition p-2 text-gray-600"
        >
          {isMobileMenuOpen ? (
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 6 6 18" /><path d="m6 6 12 12" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 12h16" /><path d="M4 18h16" /><path d="M4 6h16" />
            </svg>
          )}
        </button>

        {/* Mobile Navigation Menu */}
        {isMobileMenuOpen && (
          <div className="mobile-menu absolute top-20 left-0 w-full bg-white/95 backdrop-blur-lg p-8 md:hidden shadow-2xl rounded-3xl border border-slate-100 flex flex-col items-center gap-6 animate-in zoom-in-95 fade-in duration-300">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                onClick={closeMobileMenu}
                className={`${link.isButton ? 'w-full text-center py-3 bg-indigo-600 text-white rounded-full' : 'text-lg font-medium text-gray-700'}`}
              >
                {link.label}
              </Link>
            ))}
            {isAuthenticated && (
              <button
                onClick={handleLogout}
                className="w-full py-3 text-red-500 font-bold border-t border-gray-50 mt-2"
              >
                Logout
              </button>
            )}
          </div>
        )}
      </nav>
    </div>
  );
};

export default Navbar;
