import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import App from './App';
import * as AuthContext from './context/AuthContext';

// Mock all page components
vi.mock('./pages/Login', () => ({
  default: () => <div>Login Page</div>
}));

vi.mock('./pages/Register', () => ({
  default: () => <div>Register Page</div>
}));

vi.mock('./pages/jobseeker/Dashboard', () => ({
  default: () => <div>Job Seeker Dashboard</div>
}));

vi.mock('./pages/jobseeker/Jobs', () => ({
  default: () => <div>Jobs Page</div>
}));

vi.mock('./pages/jobseeker/JobDetails', () => ({
  default: () => <div>Job Details Page</div>
}));

vi.mock('./pages/jobseeker/Applied', () => ({
  default: () => <div>Applied Jobs Page</div>
}));

vi.mock('./pages/jobseeker/Saved', () => ({
  default: () => <div>Saved Jobs Page</div>
}));

vi.mock('./pages/jobseeker/Profile', () => ({
  default: () => <div>Profile Page</div>
}));

vi.mock('./pages/employer/Dashboard', () => ({
  default: () => <div>Employer Dashboard</div>
}));

vi.mock('./pages/employer/PostJob', () => ({
  default: () => <div>Post Job Page</div>
}));

vi.mock('./pages/employer/MyJobs', () => ({
  default: () => <div>My Jobs Page</div>
}));

vi.mock('./pages/employer/Applicants', () => ({
  default: () => <div>Applicants Page</div>
}));

vi.mock('./pages/admin/Dashboard', () => ({
  default: () => <div>Admin Dashboard</div>
}));

vi.mock('./pages/admin/Users', () => ({
  default: () => <div>Users Management Page</div>
}));

vi.mock('./pages/admin/Jobs', () => ({
  default: () => <div>Jobs Management Page</div>
}));

describe('App Routes', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Public Routes', () => {
    beforeEach(() => {
      vi.spyOn(AuthContext, 'useAuth').mockReturnValue({
        user: null,
        token: null,
        loading: false,
        isAuthenticated: false,
        login: vi.fn(),
        register: vi.fn(),
        logout: vi.fn(),
        loadUser: vi.fn(),
      });
    });

    it('should render home page at root path', () => {
      render(
        <MemoryRouter initialEntries={['/']}>
          <App />
        </MemoryRouter>
      );
      expect(screen.getByText(/Welcome to Job Portal/i)).toBeInTheDocument();
    });

    it('should render login page at /login', () => {
      render(
        <MemoryRouter initialEntries={['/login']}>
          <App />
        </MemoryRouter>
      );
      expect(screen.getByText('Login Page')).toBeInTheDocument();
    });

    it('should render register page at /register', () => {
      render(
        <MemoryRouter initialEntries={['/register']}>
          <App />
        </MemoryRouter>
      );
      expect(screen.getByText('Register Page')).toBeInTheDocument();
    });
  });

  describe('Job Seeker Protected Routes', () => {
    beforeEach(() => {
      vi.spyOn(AuthContext, 'useAuth').mockReturnValue({
        user: { id: '1', name: 'Test User', email: 'test@test.com', role: 'jobSeeker' },
        token: 'test-token',
        loading: false,
        isAuthenticated: true,
        login: vi.fn(),
        register: vi.fn(),
        logout: vi.fn(),
        loadUser: vi.fn(),
      });
    });

    it('should render job seeker dashboard at /jobseeker/dashboard', () => {
      render(
        <MemoryRouter initialEntries={['/jobseeker/dashboard']}>
          <App />
        </MemoryRouter>
      );
      expect(screen.getByText('Job Seeker Dashboard')).toBeInTheDocument();
    });

    it('should render jobs page at /jobseeker/jobs', () => {
      render(
        <MemoryRouter initialEntries={['/jobseeker/jobs']}>
          <App />
        </MemoryRouter>
      );
      expect(screen.getByText('Jobs Page')).toBeInTheDocument();
    });

    it('should render job details page at /jobseeker/jobs/:id', () => {
      render(
        <MemoryRouter initialEntries={['/jobseeker/jobs/123']}>
          <App />
        </MemoryRouter>
      );
      expect(screen.getByText('Job Details Page')).toBeInTheDocument();
    });

    it('should render applied jobs page at /jobseeker/applied', () => {
      render(
        <MemoryRouter initialEntries={['/jobseeker/applied']}>
          <App />
        </MemoryRouter>
      );
      expect(screen.getByText('Applied Jobs Page')).toBeInTheDocument();
    });

    it('should render saved jobs page at /jobseeker/saved', () => {
      render(
        <MemoryRouter initialEntries={['/jobseeker/saved']}>
          <App />
        </MemoryRouter>
      );
      expect(screen.getByText('Saved Jobs Page')).toBeInTheDocument();
    });

    it('should render profile page at /jobseeker/profile', () => {
      render(
        <MemoryRouter initialEntries={['/jobseeker/profile']}>
          <App />
        </MemoryRouter>
      );
      expect(screen.getByText('Profile Page')).toBeInTheDocument();
    });
  });

  describe('Employer Protected Routes', () => {
    beforeEach(() => {
      vi.spyOn(AuthContext, 'useAuth').mockReturnValue({
        user: { id: '2', name: 'Employer User', email: 'employer@test.com', role: 'employer' },
        token: 'test-token',
        loading: false,
        isAuthenticated: true,
        login: vi.fn(),
        register: vi.fn(),
        logout: vi.fn(),
        loadUser: vi.fn(),
      });
    });

    it('should render employer dashboard at /employer/dashboard', () => {
      render(
        <MemoryRouter initialEntries={['/employer/dashboard']}>
          <App />
        </MemoryRouter>
      );
      expect(screen.getByText('Employer Dashboard')).toBeInTheDocument();
    });

    it('should render post job page at /employer/post-job', () => {
      render(
        <MemoryRouter initialEntries={['/employer/post-job']}>
          <App />
        </MemoryRouter>
      );
      expect(screen.getByText('Post Job Page')).toBeInTheDocument();
    });

    it('should render my jobs page at /employer/my-jobs', () => {
      render(
        <MemoryRouter initialEntries={['/employer/my-jobs']}>
          <App />
        </MemoryRouter>
      );
      expect(screen.getByText('My Jobs Page')).toBeInTheDocument();
    });

    it('should render applicants page at /employer/jobs/:id/applicants', () => {
      render(
        <MemoryRouter initialEntries={['/employer/jobs/123/applicants']}>
          <App />
        </MemoryRouter>
      );
      expect(screen.getByText('Applicants Page')).toBeInTheDocument();
    });
  });

  describe('Admin Protected Routes', () => {
    beforeEach(() => {
      vi.spyOn(AuthContext, 'useAuth').mockReturnValue({
        user: { id: '3', name: 'Admin User', email: 'admin@test.com', role: 'admin' },
        token: 'test-token',
        loading: false,
        isAuthenticated: true,
        login: vi.fn(),
        register: vi.fn(),
        logout: vi.fn(),
        loadUser: vi.fn(),
      });
    });

    it('should render admin dashboard at /admin/dashboard', () => {
      render(
        <MemoryRouter initialEntries={['/admin/dashboard']}>
          <App />
        </MemoryRouter>
      );
      expect(screen.getByText('Admin Dashboard')).toBeInTheDocument();
    });

    it('should render users management page at /admin/users', () => {
      render(
        <MemoryRouter initialEntries={['/admin/users']}>
          <App />
        </MemoryRouter>
      );
      expect(screen.getByText('Users Management Page')).toBeInTheDocument();
    });

    it('should render jobs management page at /admin/jobs', () => {
      render(
        <MemoryRouter initialEntries={['/admin/jobs']}>
          <App />
        </MemoryRouter>
      );
      expect(screen.getByText('Jobs Management Page')).toBeInTheDocument();
    });
  });

  describe('Route Protection', () => {
    it('should redirect unauthenticated users to login for protected routes', () => {
      vi.spyOn(AuthContext, 'useAuth').mockReturnValue({
        user: null,
        token: null,
        loading: false,
        isAuthenticated: false,
        login: vi.fn(),
        register: vi.fn(),
        logout: vi.fn(),
        loadUser: vi.fn(),
      });

      render(
        <MemoryRouter initialEntries={['/jobseeker/dashboard']}>
          <App />
        </MemoryRouter>
      );
      expect(screen.getByText('Login Page')).toBeInTheDocument();
    });

    it('should redirect job seeker to their dashboard when accessing employer routes', () => {
      vi.spyOn(AuthContext, 'useAuth').mockReturnValue({
        user: { id: '1', name: 'Test User', email: 'test@test.com', role: 'jobSeeker' },
        token: 'test-token',
        loading: false,
        isAuthenticated: true,
        login: vi.fn(),
        register: vi.fn(),
        logout: vi.fn(),
        loadUser: vi.fn(),
      });

      render(
        <MemoryRouter initialEntries={['/employer/dashboard']}>
          <App />
        </MemoryRouter>
      );
      expect(screen.getByText('Job Seeker Dashboard')).toBeInTheDocument();
    });

    it('should redirect employer to their dashboard when accessing admin routes', () => {
      vi.spyOn(AuthContext, 'useAuth').mockReturnValue({
        user: { id: '2', name: 'Employer User', email: 'employer@test.com', role: 'employer' },
        token: 'test-token',
        loading: false,
        isAuthenticated: true,
        login: vi.fn(),
        register: vi.fn(),
        logout: vi.fn(),
        loadUser: vi.fn(),
      });

      render(
        <MemoryRouter initialEntries={['/admin/dashboard']}>
          <App />
        </MemoryRouter>
      );
      expect(screen.getByText('Employer Dashboard')).toBeInTheDocument();
    });
  });

  describe('Catch-all Route', () => {
    it('should redirect unknown routes to home page', () => {
      vi.spyOn(AuthContext, 'useAuth').mockReturnValue({
        user: null,
        token: null,
        loading: false,
        isAuthenticated: false,
        login: vi.fn(),
        register: vi.fn(),
        logout: vi.fn(),
        loadUser: vi.fn(),
      });

      render(
        <MemoryRouter initialEntries={['/unknown-route']}>
          <App />
        </MemoryRouter>
      );
      expect(screen.getByText(/Welcome to Job Portal/i)).toBeInTheDocument();
    });
  });
});
