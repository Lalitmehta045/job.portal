# Implementation Plan: Job Portal

## Overview

This implementation plan breaks down the Job Portal application into discrete coding tasks following the MVC architecture pattern. The backend uses Node.js with Express.js and MongoDB, while the frontend uses React.js with Context API for state management. Tasks are organized to build incrementally, starting with core infrastructure, then backend services, followed by frontend components, and finally integration.

## Tasks

- [x] 1. Backend project setup and configuration
  - [x] 1.1 Initialize Node.js project and install dependencies
    - Create package.json with Express v4, Mongoose v8, JWT, bcryptjs, express-validator, helmet, cors, express-rate-limit, multer, cloudinary, dotenv
    - Set up project structure: server.js, config/, models/, middleware/, controllers/, routes/
    - _Requirements: 21.4, 22.1_
  
  - [x] 1.2 Create environment configuration module
    - Create config/env.js to load and validate environment variables
    - Validate required variables: MONGODB_URI, JWT_SECRET, CLOUDINARY credentials, PORT, NODE_ENV
    - _Requirements: 22.2, 22.3, 22.4, 22.5, 22.6_
  
  - [x] 1.3 Create database connection module
    - Create config/db.js with MongoDB connection logic using Mongoose
    - Implement connection error handling and success logging
    - Enable Mongoose strict mode
    - _Requirements: 21.1, 21.2, 21.3, 21.5_
  
  - [x] 1.4 Set up Express server with security middleware
    - Create server.js with Express app initialization
    - Configure helmet for security headers
    - Configure cors for cross-origin requests
    - Configure express.json() for body parsing
    - Set up rate limiting: 5 req/15min for auth routes, 100 req/15min for general routes
    - _Requirements: 16.1, 16.2, 16.3, 16.4, 16.5, 16.6_

- [x] 2. Database models with validation
  - [x] 2.1 Create User model with schema validation
    - Define User schema with name, email, password, role, isBlocked, profile, createdAt fields
    - Add email format validation and unique constraint
    - Add password minimum length validation (8 characters)
    - Add role enumeration: jobSeeker, employer, admin
    - Add pre-save hook to hash password using bcryptjs (10 salt rounds)
    - Initialize profile object with empty skills array for jobSeeker role
    - _Requirements: 1.1, 1.3, 1.4, 1.5, 1.6, 1.7, 24.1, 24.2, 24.4, 24.6_
  
  - [x] 2.2 Create Job model with schema validation
    - Define Job schema with title, description, company, location, salary, skillsRequired, employerId, isActive, createdAt
    - Add salary min/max validation with custom validator
    - Add skillsRequired array validation (at least one skill)
    - Add indexes on employerId, isActive, createdAt
    - _Requirements: 3.2, 3.3, 24.1, 24.3, 24.6_
  
  - [x] 2.3 Create Application model with schema validation
    - Define Application schema with jobId, applicantId, status, appliedAt
    - Add status enumeration: pending, accepted, rejected
    - Add compound unique index on (jobId, applicantId)
    - Add indexes on applicantId and jobId
    - _Requirements: 5.1, 5.3, 5.4, 24.1, 24.2, 24.6_
  
  - [x] 2.4 Create SavedJob model with schema validation
    - Define SavedJob schema with userId, jobId, savedAt
    - Add compound unique index on (userId, jobId)
    - Add index on userId
    - _Requirements: 7.1, 7.3, 24.1, 24.6_

- [x] 3. Authentication middleware and utilities
  - [x] 3.1 Create JWT authentication middleware
    - Create middleware/auth.js with protect() function
    - Extract JWT from Authorization header (Bearer token format)
    - Verify token signature and expiration using JWT_SECRET
    - Attach user object to req.user
    - Return 401 error for invalid/missing/expired tokens
    - _Requirements: 2.6, 2.7, 17.5_
  
  - [x] 3.2 Create role-based authorization middleware
    - Create authorize(...roles) function in middleware/auth.js
    - Check req.user.role against allowed roles array
    - Return 403 error if role not authorized
    - _Requirements: 3.7, 5.6, 6.5, 7.7, 8.7, 9.5, 10.7, 12.6, 13.4, 14.7, 17.6_
  
  - [x] 3.3 Create validation middleware for authentication
    - Create middleware/validation.js with validateRegister() function
    - Validate name, email, password, role fields using express-validator
    - Validate email format and password minimum length
    - Validate role is one of: jobSeeker, employer, admin
    - Create validateLogin() function for email and password
    - Return 400 with validation errors
    - _Requirements: 15.1, 15.2, 15.3, 15.5, 15.6, 15.7, 17.4_

- [ ] 4. Authentication controller and routes
  - [x] 4.1 Create authentication controller
    - Create controllers/authController.js with register() function
    - Implement user registration: check duplicate email, create user with hashed password
    - Implement login() function: verify credentials, check isBlocked, generate JWT (7-day expiration)
    - Implement getMe() function: return authenticated user details
    - Implement updateProfile() function: update skills, experience, education for jobSeeker
    - Add try-catch error handling with appropriate status codes
    - _Requirements: 1.1, 1.2, 2.1, 2.2, 2.3, 2.4, 9.1, 9.2, 9.3, 9.4, 17.1, 17.2, 17.3_
  
  - [-] 4.2 Write unit tests for authentication controller
    - Test successful registration and login flows
    - Test duplicate email error
    - Test invalid credentials error
    - Test blocked user login error
    - _Requirements: 1.2, 2.2, 2.3_
  
  - [x] 4.3 Create authentication routes
    - Create routes/authRoutes.js
    - Define POST /register with validateRegister middleware
    - Define POST /login with validateLogin middleware
    - Define GET /me with protect middleware
    - Define PUT /profile with protect and authorize('jobSeeker') middleware
    - Mount routes in server.js at /api/v1/auth
    - _Requirements: 1.1, 2.1, 9.1, 9.5_

- [ ] 5. File upload service for resume management
  - [x] 5.1 Configure Cloudinary and Multer
    - Create config/cloudinary.js with Cloudinary configuration
    - Create middleware/upload.js with Multer configuration
    - Set file size limit to 5MB
    - Set file type filter for PDF, DOC, DOCX
    - _Requirements: 8.3, 8.4, 22.4_
  
  - [x] 5.2 Create resume upload endpoint
    - Add uploadResume() function to authController.js
    - Upload file to Cloudinary using configured SDK
    - Update user profile.resumeUrl with Cloudinary URL
    - Return descriptive error if upload fails
    - _Requirements: 8.1, 8.2, 8.5, 8.6_
  
  - [x] 5.3 Add resume upload route
    - Add POST /upload-resume route to authRoutes.js
    - Apply protect, authorize('jobSeeker'), and upload.single('resume') middleware
    - _Requirements: 8.1, 8.7_

- [ ] 6. Job service controller and routes
  - [x] 6.1 Create job validation middleware
    - Add validateJob() function to middleware/validation.js
    - Validate title, description, company, location, skillsRequired are present
    - Validate salary.min and salary.max are numbers
    - Validate salary.min <= salary.max
    - _Requirements: 3.2, 3.3, 15.1, 15.4_
  
  - [x] 6.2 Create job controller
    - Create controllers/jobController.js with createJob() function
    - Set employerId to authenticated user ID and isActive to true
    - Implement getJobs() function with filtering: location, skills, salary range, company
    - Sort jobs by createdAt descending and populate employerId with name and company
    - Implement getMyJobs() function: return jobs where employerId matches authenticated user
    - Implement updateJob() function: verify ownership, update allowed fields
    - Implement deleteJob() function: verify ownership, set isActive to false
    - Add try-catch error handling with appropriate status codes
    - _Requirements: 3.1, 3.4, 3.5, 3.6, 4.1, 4.2, 4.3, 4.4, 4.5, 4.6, 4.7, 10.1, 10.2, 10.5, 10.6, 17.1, 17.2, 17.3, 17.7_
  
  - [~] 6.3 Write unit tests for job controller
    - Test job creation with valid data
    - Test job filtering by location, skills, salary
    - Test ownership verification for update and delete
    - _Requirements: 3.1, 4.1, 10.2_
  
  - [x] 6.4 Create job routes
    - Create routes/jobRoutes.js
    - Define GET /jobs (public)
    - Define POST /jobs with protect, authorize('employer'), validateJob middleware
    - Define GET /my-jobs with protect, authorize('employer') middleware
    - Define PUT /:id with protect, authorize('employer'), validateJob middleware
    - Define DELETE /:id with protect, authorize('employer') middleware
    - Mount routes in server.js at /api/v1/jobs
    - _Requirements: 3.1, 3.7, 4.1, 10.1, 10.2, 10.4, 10.7_

- [ ] 7. Application service controller and routes
  - [x] 7.1 Create application validation middleware
    - Add validateApplication() function to middleware/validation.js
    - Validate status is one of: pending, accepted, rejected
    - _Requirements: 6.2, 15.5_
  
  - [x] 7.2 Create application controller
    - Create controllers/applicationController.js with applyToJob() function
    - Verify job exists and is active, check for duplicate application
    - Set status to pending and appliedAt to current timestamp
    - Implement getMyApplications() function: return applications for authenticated user, populate job details, sort by appliedAt descending
    - Implement getJobApplicants() function: verify job ownership, populate applicant details including profile and resumeUrl
    - Implement updateApplicationStatus() function: verify job ownership, update status
    - Add try-catch error handling with appropriate status codes
    - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5, 5.7, 6.1, 6.3, 6.4, 11.1, 11.2, 11.3, 11.4, 11.5, 23.1, 23.2, 23.3, 23.4, 17.1, 17.2, 17.3_
  
  - [~] 7.3 Write unit tests for application controller
    - Test successful job application
    - Test duplicate application error
    - Test ownership verification for status update
    - _Requirements: 5.2, 6.3_
  
  - [x] 7.4 Create application routes
    - Create routes/applicationRoutes.js
    - Define POST /apply/:jobId with protect, authorize('jobSeeker') middleware
    - Define GET /my-applications with protect, authorize('jobSeeker') middleware
    - Define GET /jobs/:jobId/applicants with protect, authorize('employer') middleware
    - Define PUT /application/:id/status with protect, authorize('employer'), validateApplication middleware
    - Mount routes in server.js at /api/v1
    - _Requirements: 5.1, 5.6, 6.1, 6.5, 11.1, 11.6, 23.1, 23.5_

- [ ] 8. Saved jobs service controller and routes
  - [x] 8.1 Create saved job controller
    - Create controllers/savedJobController.js with saveJob() function
    - Verify job exists, check for duplicate saved job
    - Set savedAt to current timestamp
    - Implement getSavedJobs() function: return saved jobs for authenticated user, populate job details
    - Implement removeSavedJob() function: delete saved job record
    - Add try-catch error handling with appropriate status codes
    - _Requirements: 7.1, 7.2, 7.3, 7.4, 7.5, 7.6, 17.1, 17.2, 17.3_
  
  - [~] 8.2 Write unit tests for saved job controller
    - Test saving a job successfully
    - Test duplicate saved job error
    - Test removing a saved job
    - _Requirements: 7.2, 7.5_
  
  - [x] 8.3 Create saved job routes
    - Create routes/savedJobRoutes.js
    - Define POST /saved/:jobId with protect, authorize('jobSeeker') middleware
    - Define GET /saved with protect, authorize('jobSeeker') middleware
    - Define DELETE /saved/:jobId with protect, authorize('jobSeeker') middleware
    - Mount routes in server.js at /api/v1
    - _Requirements: 7.1, 7.4, 7.5, 7.7_

- [ ] 9. Admin service controller and routes
  - [x] 9.1 Create admin controller
    - Create controllers/adminController.js with getAllUsers() function
    - Return all users with name, email, role, isBlocked, createdAt
    - Implement toggleUserBlock() function: update isBlocked field
    - Implement getAllJobs() function: return all jobs regardless of employer
    - Implement deleteAnyJob() function: set isActive to false for any job
    - Implement getStats() function: aggregate total users by role, total active jobs, total applications, applications by status, recent registrations, recent job postings
    - Add try-catch error handling with appropriate status codes
    - _Requirements: 12.1, 12.2, 12.3, 12.4, 13.1, 13.2, 13.3, 14.1, 14.2, 14.3, 14.4, 14.5, 14.6, 17.1, 17.2, 17.3_
  
  - [~] 9.2 Write unit tests for admin controller
    - Test user blocking/unblocking
    - Test statistics aggregation
    - Test admin job deletion
    - _Requirements: 12.3, 12.4, 13.2_
  
  - [x] 9.3 Create admin routes
    - Create routes/adminRoutes.js
    - Define GET /users with protect, authorize('admin') middleware
    - Define PUT /users/:id/block with protect, authorize('admin') middleware
    - Define GET /jobs with protect, authorize('admin') middleware
    - Define DELETE /jobs/:id with protect, authorize('admin') middleware
    - Define GET /stats with protect, authorize('admin') middleware
    - Mount routes in server.js at /api/v1/admin
    - _Requirements: 12.1, 12.6, 13.1, 13.4, 14.1, 14.7_

- [x] 10. Checkpoint - Backend API complete
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 11. Frontend project setup and configuration
  - [x] 11.1 Initialize React project and install dependencies
    - Create React app with Vite or Create React App
    - Install dependencies: react-router-dom v6, axios, recharts, tailwindcss v3
    - Set up project structure: src/context/, api/, components/, pages/, routes/, App.jsx
    - _Requirements: 18.1, 20.1, 25.1, 26.1_
  
  - [x] 11.2 Configure Tailwind CSS
    - Initialize Tailwind CSS configuration
    - Add Tailwind directives to main CSS file
    - Configure responsive breakpoints
    - _Requirements: 25.1, 25.2_
  
  - [x] 11.3 Create Axios client with interceptors
    - Create src/api/axios.js with configured Axios instance
    - Set base URL to API endpoint (environment variable or localhost:5000/api/v1)
    - Add request interceptor to include JWT token in Authorization header (Bearer format)
    - Add response interceptor to handle 401 responses: clear auth state and redirect to login
    - _Requirements: 20.1, 20.2, 20.3, 20.4, 20.5_

- [ ] 12. Authentication context and protected routes
  - [x] 12.1 Create AuthContext with state management
    - Create src/context/AuthContext.jsx with user, token, loading, isAuthenticated state
    - Implement login() function: call API, store token in localStorage, update state
    - Implement register() function: call API, store token in localStorage, update state
    - Implement logout() function: clear localStorage and state
    - Implement loadUser() function: retrieve token from localStorage, validate with API
    - Call loadUser() on context initialization
    - _Requirements: 18.1, 18.2, 18.3, 18.4, 18.5, 18.6, 18.7_
  
  - [~] 12.2 Write unit tests for AuthContext
    - Test login flow and token storage
    - Test logout flow and state clearing
    - Test token retrieval on app load
    - _Requirements: 18.5, 18.6, 18.7_
  
  - [x] 12.3 Create ProtectedRoute component
    - Create src/routes/ProtectedRoute.jsx
    - Check authentication status from AuthContext
    - Check user role matches allowedRoles prop
    - Redirect to login if unauthenticated
    - Redirect to role-appropriate dashboard if wrong role
    - Render component if authorized
    - _Requirements: 19.1, 19.2, 19.3, 19.4, 19.5, 19.6_
  
  - [x] 12.4 Set up React Router with protected routes
    - Create src/App.jsx with React Router configuration
    - Define public routes: /, /login, /register
    - Define protected routes with ProtectedRoute wrapper for each role
    - Configure role-specific route groups: /jobseeker/*, /employer/*, /admin/*
    - _Requirements: 19.1, 19.2_

- [ ] 13. Shared components and layout
  - [x] 13.1 Create Navbar component
    - Create src/components/Navbar.jsx with responsive navigation
    - Display role-specific navigation links
    - Include logout button for authenticated users
    - Use Tailwind responsive classes for mobile menu
    - _Requirements: 25.2, 25.3_
  
  - [x] 13.2 Create form input components
    - Create reusable Input, Select, TextArea components with Tailwind styling
    - Ensure mobile-friendly form controls
    - _Requirements: 25.4_
  
  - [x] 13.3 Create loading and error components
    - Create Loading spinner component
    - Create ErrorMessage component for displaying errors
    - _Requirements: 25.2_

- [ ] 14. Authentication pages
  - [x] 14.1 Create Login page
    - Create src/pages/Login.jsx with email and password form
    - Use AuthContext login() function
    - Display validation errors
    - Redirect to role-appropriate dashboard on success
    - _Requirements: 18.2, 19.1_
  
  - [x] 14.2 Create Register page
    - Create src/pages/Register.jsx with name, email, password, role form
    - Use AuthContext register() function
    - Include role selection dropdown: jobSeeker, employer, admin
    - Display validation errors
    - Redirect to role-appropriate dashboard on success
    - _Requirements: 18.4, 19.1_

- [ ] 15. Job Seeker pages
  - [x] 15.1 Create Job Seeker Dashboard page
    - Create src/pages/jobseeker/Dashboard.jsx
    - Display overview of saved jobs count and applications count
    - Show recent applications with status
    - _Requirements: 23.1, 23.2, 23.3_
  
  - [x] 15.2 Create Jobs browsing page
    - Create src/pages/jobseeker/Jobs.jsx
    - Fetch and display all active jobs
    - Implement filter form: location, skills, salary range, company
    - Display job cards with title, company, location, salary
    - Add "View Details" button for each job
    - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5, 25.5_
  
  - [x] 15.3 Create Job Details page
    - Create src/pages/jobseeker/JobDetails.jsx
    - Display full job information including description and required skills
    - Add "Apply" button that calls application API
    - Add "Save Job" button that calls saved job API
    - Handle duplicate application and saved job errors
    - _Requirements: 5.1, 5.2, 7.1, 7.2_
  
  - [x] 15.4 Create Applied Jobs page
    - Create src/pages/jobseeker/Applied.jsx
    - Fetch and display user's applications with job details
    - Show application status with color coding
    - Sort by appliedAt descending
    - _Requirements: 23.1, 23.2, 23.3, 23.4, 25.5_
  
  - [x] 15.5 Create Saved Jobs page
    - Create src/pages/jobseeker/Saved.jsx
    - Fetch and display user's saved jobs
    - Add "Remove" button for each saved job
    - Add "View Details" button for each job
    - _Requirements: 7.4, 7.5, 25.5_
  
  - [x] 15.6 Create Profile page
    - Create src/pages/jobseeker/Profile.jsx
    - Display and edit skills (array input), experience, education
    - Add resume upload form with file input
    - Display current resume URL if exists
    - Call profile update and resume upload APIs
    - _Requirements: 8.1, 8.2, 9.1, 9.2, 9.3, 9.4, 9.6, 25.4_

- [ ] 16. Employer pages
  - [x] 16.1 Create Employer Dashboard page
    - Create src/pages/employer/Dashboard.jsx
    - Display overview of posted jobs count and total applicants count
    - Show recent applications for employer's jobs
    - _Requirements: 10.1, 11.1_
  
  - [x] 16.2 Create Post Job page
    - Create src/pages/employer/PostJob.jsx
    - Create form with title, description, company, location, salary (min/max), skillsRequired
    - Validate salary min <= max
    - Call job creation API
    - Redirect to My Jobs on success
    - _Requirements: 3.1, 3.2, 3.3, 25.4_
  
  - [x] 16.3 Create My Jobs page
    - Create src/pages/employer/MyJobs.jsx
    - Fetch and display employer's jobs
    - Add "Edit" and "Delete" buttons for each job
    - Implement inline edit or modal for job updates
    - Call update and delete APIs
    - _Requirements: 10.1, 10.2, 10.5, 10.6, 25.5_
  
  - [x] 16.4 Create Applicants page
    - Create src/pages/employer/Applicants.jsx
    - Fetch and display applicants for a specific job
    - Show applicant name, email, skills, experience, education, resumeUrl
    - Add status dropdown for each applicant: pending, accepted, rejected
    - Call status update API on dropdown change
    - _Requirements: 11.1, 11.2, 11.3, 11.4, 11.5, 6.1, 25.5_

- [ ] 17. Admin pages
  - [x] 17.1 Create Admin Dashboard page with charts
    - Create src/pages/admin/Dashboard.jsx
    - Fetch platform statistics from admin API
    - Display total users, jobs, applications counts
    - Create bar chart for users by role using Recharts
    - Create pie chart for application status distribution using Recharts
    - Create line chart for registration trends using Recharts
    - Create line chart for job posting trends using Recharts
    - _Requirements: 14.1, 14.2, 14.3, 14.4, 14.5, 14.6, 26.1, 26.2, 26.3, 26.4, 26.5_
  
  - [~] 17.2 Write integration tests for Admin Dashboard
    - Test statistics data fetching and display
    - Test chart rendering with mock data
    - _Requirements: 14.1, 26.1_
  
  - [x] 17.3 Create Users Management page
    - Create src/pages/admin/Users.jsx
    - Fetch and display all users in a table
    - Show name, email, role, isBlocked status, createdAt
    - Add "Block/Unblock" toggle button for each user
    - Call user block API on toggle
    - _Requirements: 12.1, 12.2, 12.3, 12.4, 25.5_
  
  - [x] 17.4 Create Jobs Management page
    - Create src/pages/admin/Jobs.jsx
    - Fetch and display all jobs in a table
    - Show title, company, employer name, location, isActive status
    - Add "Delete" button for each job
    - Call admin job delete API
    - _Requirements: 13.1, 13.2, 13.3, 25.5_

- [ ] 18. Final integration and testing
  - [x] 18.1 Connect all routes in App.jsx
    - Wire all page components to their respective routes
    - Ensure ProtectedRoute wraps all protected pages with correct roles
    - Test navigation between all pages
    - _Requirements: 19.1, 19.2, 19.3_
  
  - [~] 18.2 Test authentication flow end-to-end
    - Test registration for all three roles
    - Test login and logout
    - Test token persistence across page refreshes
    - Test protected route redirects
    - _Requirements: 1.1, 2.1, 18.5, 18.6, 18.7, 19.1_
  
  - [~] 18.3 Test Job Seeker workflows
    - Test browsing and filtering jobs
    - Test applying to jobs and viewing application status
    - Test saving and removing saved jobs
    - Test profile and resume management
    - _Requirements: 4.1, 5.1, 7.1, 8.1, 9.1_
  
  - [~] 18.4 Test Employer workflows
    - Test posting new jobs
    - Test viewing and managing posted jobs
    - Test viewing applicants and updating application status
    - _Requirements: 3.1, 10.1, 11.1, 6.1_
  
  - [~] 18.5 Test Admin workflows
    - Test viewing all users and blocking/unblocking
    - Test viewing all jobs and deleting
    - Test analytics dashboard with charts
    - _Requirements: 12.1, 12.3, 13.1, 14.1_
  
  - [~] 18.6 Test error handling and edge cases
    - Test validation errors for all forms
    - Test duplicate email registration
    - Test duplicate job application
    - Test unauthorized access attempts
    - Test rate limiting
    - _Requirements: 1.2, 5.2, 15.7, 16.3, 16.5, 17.4, 17.5, 17.6_

- [ ] 19. Checkpoint - Full application complete
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 20. Deployment preparation
  - [~] 20.1 Create environment variable documentation
    - Document all required environment variables for backend and frontend
    - Create .env.example files for both projects
    - _Requirements: 22.1, 22.2, 22.3, 22.4, 22.5, 22.6_
  
  - [~] 20.2 Add production build scripts
    - Add build scripts to package.json for both projects
    - Configure production environment settings
    - _Requirements: 22.6_
  
  - [~] 20.3 Create README documentation
    - Document project setup instructions
    - Document API endpoints and usage
    - Document deployment steps
    - _Requirements: 21.1, 22.1_

## Notes

- Tasks marked with `*` are optional and can be skipped for faster MVP
- Each task references specific requirements for traceability
- Checkpoints ensure incremental validation at major milestones
- Backend tasks (1-10) should be completed before frontend tasks (11-20)
- Testing tasks validate core functionality and can be executed in parallel with development
- All authentication and authorization logic must be thoroughly tested before moving to frontend
- File upload functionality requires Cloudinary account setup before implementation
