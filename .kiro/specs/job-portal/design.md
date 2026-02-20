# Design Document: Job Portal

## Overview

The Job Portal is a full-stack web application that connects job seekers with employers through a secure, role-based platform. The system implements a three-tier architecture with a React frontend, Express.js REST API backend, and MongoDB database.

The application serves three distinct user personas:
- **Job Seekers**: Browse jobs, apply to positions, manage profiles and resumes, track application status
- **Employers**: Post job listings, manage postings, review applicants, update application statuses
- **Administrators**: Oversee platform operations, manage users, moderate content, view analytics

Key technical characteristics:
- Stateless authentication using JWT tokens with 7-day expiration
- Role-based access control enforced at both API and route levels
- File upload handling via Cloudinary for resume storage
- Comprehensive input validation and security hardening
- Real-time analytics dashboard with visual charts

## Architecture

### System Architecture

The application follows a traditional three-tier architecture:

```
┌─────────────────────────────────────────────────────────────┐
│                     Client Layer (React)                     │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │ Job Seeker   │  │  Employer    │  │    Admin     │      │
│  │   Pages      │  │   Pages      │  │   Pages      │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
│         │                  │                  │              │
│         └──────────────────┴──────────────────┘              │
│                           │                                  │
│                  ┌────────▼────────┐                         │
│                  │  AuthContext    │                         │
│                  │  Axios Client   │                         │
│                  └────────┬────────┘                         │
└───────────────────────────┼──────────────────────────────────┘
                            │ HTTPS/REST
┌───────────────────────────▼──────────────────────────────────┐
│                  Application Layer (Express)                 │
│  ┌──────────────────────────────────────────────────────┐   │
│  │              Middleware Pipeline                      │   │
│  │  helmet → cors → rate-limit → auth → validation      │   │
│  └──────────────────────────────────────────────────────┘   │
│         │                                                     │
│  ┌──────▼───────────────────────────────────────────────┐   │
│  │                  Route Handlers                       │   │
│  │  /auth  /jobs  /apply  /saved  /admin               │   │
│  └──────┬───────────────────────────────────────────────┘   │
│         │                                                     │
│  ┌──────▼───────────────────────────────────────────────┐   │
│  │                   Controllers                         │   │
│  │  Auth  Job  Application  SavedJob  Admin            │   │
│  └──────┬───────────────────────────────────────────────┘   │
└─────────┼───────────────────────────────────────────────────┘
          │
┌─────────▼───────────────────────────────────────────────────┐
│              Data Layer (MongoDB + Cloudinary)               │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │    User      │  │     Job      │  │ Application  │      │
│  │  Collection  │  │  Collection  │  │  Collection  │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
│  ┌──────────────┐                                            │
│  │  SavedJob    │         ┌──────────────────┐              │
│  │  Collection  │         │   Cloudinary     │              │
│  └──────────────┘         │  (Resume Files)  │              │
│                           └──────────────────┘              │
└─────────────────────────────────────────────────────────────┘
```

### Authentication Flow

```
┌──────────┐                                    ┌──────────┐
│  Client  │                                    │  Server  │
└────┬─────┘                                    └────┬─────┘
     │                                                │
     │  POST /api/v1/auth/register                   │
     │  { name, email, password, role }              │
     ├──────────────────────────────────────────────►│
     │                                                │
     │                                         ┌──────▼──────┐
     │                                         │ Hash password│
     │                                         │ Create user  │
     │                                         └──────┬──────┘
     │                                                │
     │  { user, token }                              │
     │◄──────────────────────────────────────────────┤
     │                                                │
     │  POST /api/v1/auth/login                      │
     │  { email, password }                          │
     ├──────────────────────────────────────────────►│
     │                                                │
     │                                         ┌──────▼──────┐
     │                                         │ Verify pass  │
     │                                         │ Check blocked│
     │                                         │ Generate JWT │
     │                                         └──────┬──────┘
     │                                                │
     │  { user, token }                              │
     │◄──────────────────────────────────────────────┤
     │                                                │
     │  Store token in localStorage                  │
     │                                                │
     │  GET /api/v1/jobs                             │
     │  Authorization: Bearer <token>                │
     ├──────────────────────────────────────────────►│
     │                                                │
     │                                         ┌──────▼──────┐
     │                                         │ Verify JWT   │
     │                                         │ Extract user │
     │                                         └──────┬──────┘
     │                                                │
     │  { jobs: [...] }                              │
     │◄──────────────────────────────────────────────┤
     │                                                │
```

### Request Processing Pipeline

Every API request flows through this middleware pipeline:

1. **Security Layer**: helmet (security headers) → cors (CORS policy)
2. **Rate Limiting**: express-rate-limit (5 req/15min for auth, 100 req/15min for general)
3. **Body Parsing**: express.json() for JSON payloads
4. **Authentication**: JWT verification middleware (protected routes only)
5. **Authorization**: Role-based access control (role-specific routes only)
6. **Validation**: express-validator for input validation
7. **Controller**: Business logic execution
8. **Error Handler**: Centralized error handling with appropriate status codes

## Components and Interfaces

### Backend Components

#### 1. Authentication Service (controllers/authController.js)

**Responsibilities:**
- User registration with password hashing
- User login with credential verification
- JWT token generation and validation
- User profile retrieval and updates

**Key Functions:**
```javascript
register(req, res)
  Input: { name, email, password, role }
  Output: { user, token }
  
login(req, res)
  Input: { email, password }
  Output: { user, token }
  
getMe(req, res)
  Input: JWT token (via middleware)
  Output: { user }
  
updateProfile(req, res)
  Input: { skills, experience, education }
  Output: { user }
```

#### 2. Job Service (controllers/jobController.js)

**Responsibilities:**
- Job listing creation and management
- Job search with filtering
- Job activation/deactivation

**Key Functions:**
```javascript
createJob(req, res)
  Input: { title, description, company, location, salary, skillsRequired }
  Output: { job }
  
getJobs(req, res)
  Input: Query params { location, skills, minSalary, maxSalary, company }
  Output: { jobs }
  
getMyJobs(req, res)
  Input: JWT token (via middleware)
  Output: { jobs }
  
updateJob(req, res)
  Input: jobId, { title, description, location, salary, skillsRequired }
  Output: { job }
  
deleteJob(req, res)
  Input: jobId
  Output: { message }
```

#### 3. Application Service (controllers/applicationController.js)

**Responsibilities:**
- Job application submission
- Application status management
- Applicant retrieval for employers

**Key Functions:**
```javascript
applyToJob(req, res)
  Input: jobId
  Output: { application }
  
getMyApplications(req, res)
  Input: JWT token (via middleware)
  Output: { applications }
  
getJobApplicants(req, res)
  Input: jobId
  Output: { applicants }
  
updateApplicationStatus(req, res)
  Input: applicationId, { status }
  Output: { application }
```

#### 4. Saved Job Service (controllers/savedJobController.js)

**Responsibilities:**
- Save/bookmark job listings
- Retrieve saved jobs
- Remove saved jobs

**Key Functions:**
```javascript
saveJob(req, res)
  Input: jobId
  Output: { savedJob }
  
getSavedJobs(req, res)
  Input: JWT token (via middleware)
  Output: { savedJobs }
  
removeSavedJob(req, res)
  Input: jobId
  Output: { message }
```

#### 5. Admin Service (controllers/adminController.js)

**Responsibilities:**
- User management and blocking
- Platform-wide job management
- Analytics and statistics

**Key Functions:**
```javascript
getAllUsers(req, res)
  Output: { users }
  
toggleUserBlock(req, res)
  Input: userId, { isBlocked }
  Output: { user }
  
getAllJobs(req, res)
  Output: { jobs }
  
deleteAnyJob(req, res)
  Input: jobId
  Output: { message }
  
getStats(req, res)
  Output: { totalUsers, usersByRole, totalJobs, totalApplications, 
            applicationsByStatus, recentRegistrations, recentJobs }
```

#### 6. File Upload Service (middleware/upload.js + controllers/authController.js)

**Responsibilities:**
- Resume file upload to Cloudinary
- File validation (type, size)
- URL storage in user profile

**Key Functions:**
```javascript
uploadResume(req, res)
  Input: File (multipart/form-data)
  Output: { resumeUrl }
```

**Configuration:**
- Multer for multipart parsing
- Cloudinary SDK for file storage
- File type validation: PDF, DOC, DOCX
- Size limit: 5MB

#### 7. Middleware Components

**Authentication Middleware (middleware/auth.js):**
```javascript
protect(req, res, next)
  - Extracts JWT from Authorization header
  - Verifies token signature and expiration
  - Attaches user object to req.user
  - Returns 401 if invalid/missing token
```

**Authorization Middleware (middleware/auth.js):**
```javascript
authorize(...roles)(req, res, next)
  - Checks req.user.role against allowed roles
  - Returns 403 if role not authorized
```

**Validation Middleware (middleware/validation.js):**
```javascript
validateRegister(req, res, next)
validateLogin(req, res, next)
validateJob(req, res, next)
validateApplication(req, res, next)
  - Uses express-validator for field validation
  - Returns 400 with error details if validation fails
```

### Frontend Components

#### 1. Authentication Context (context/AuthContext.jsx)

**Responsibilities:**
- Global authentication state management
- Token persistence in localStorage
- Login/logout/register operations

**State:**
```javascript
{
  user: { id, name, email, role, profile },
  token: string,
  loading: boolean,
  isAuthenticated: boolean
}
```

**Methods:**
```javascript
login(email, password)
register(name, email, password, role)
logout()
loadUser()
```

#### 2. Protected Route Component (routes/ProtectedRoute.jsx)

**Responsibilities:**
- Route-level authentication check
- Role-based access control
- Redirect to login or appropriate dashboard

**Props:**
```javascript
{
  component: Component,
  allowedRoles: string[],
  ...rest
}
```

#### 3. Axios Client (api/axios.js)

**Configuration:**
- Base URL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api/v1'
- Request interceptor: Adds Authorization header with token
- Response interceptor: Handles 401 by clearing auth and redirecting

#### 4. Page Components

**Job Seeker Pages:**
- Dashboard: Overview of saved jobs and applications
- Jobs: Browse and search job listings
- JobDetails: View single job with apply button
- Applied: View application history with status
- Saved: View saved/bookmarked jobs
- Profile: Edit profile (skills, experience, education, resume)

**Employer Pages:**
- Dashboard: Overview of posted jobs and applicants
- PostJob: Form to create new job listing
- MyJobs: List of employer's jobs with edit/delete
- Applicants: View applicants for a specific job with status update

**Admin Pages:**
- Dashboard: Analytics charts and statistics
- Users: List all users with block/unblock actions
- Jobs: List all jobs with delete action

**Shared Pages:**
- Login: Authentication form
- Register: Registration form with role selection

### API Endpoints

**Base URL:** `/api/v1`

**Authentication Routes:**
```
POST   /auth/register          Public
POST   /auth/login             Public
GET    /auth/me                Protected
PUT    /auth/profile           Protected (jobSeeker)
POST   /auth/upload-resume     Protected (jobSeeker)
```

**Job Routes:**
```
GET    /jobs                   Public
POST   /jobs                   Protected (employer)
GET    /jobs/my-jobs           Protected (employer)
PUT    /jobs/:id               Protected (employer, owner)
DELETE /jobs/:id               Protected (employer, owner)
```

**Application Routes:**
```
POST   /apply/:jobId           Protected (jobSeeker)
GET    /my-applications        Protected (jobSeeker)
GET    /jobs/:jobId/applicants Protected (employer, owner)
PUT    /application/:id/status Protected (employer, owner)
```

**Saved Job Routes:**
```
POST   /saved/:jobId           Protected (jobSeeker)
GET    /saved                  Protected (jobSeeker)
DELETE /saved/:jobId           Protected (jobSeeker)
```

**Admin Routes:**
```
GET    /admin/users            Protected (admin)
PUT    /admin/users/:id/block  Protected (admin)
GET    /admin/jobs             Protected (admin)
DELETE /admin/jobs/:id         Protected (admin)
GET    /admin/stats            Protected (admin)
```

## Data Models

### User Model

```javascript
{
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  },
  password: {
    type: String,
    required: true,
    minlength: 8,
    select: false  // Exclude from queries by default
  },
  role: {
    type: String,
    enum: ['jobSeeker', 'employer', 'admin'],
    required: true
  },
  isBlocked: {
    type: Boolean,
    default: false
  },
  profile: {
    skills: {
      type: [String],
      default: []
    },
    experience: {
      type: String,
      default: ''
    },
    education: {
      type: String,
      default: ''
    },
    resumeUrl: {
      type: String,
      default: ''
    }
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}
```

**Indexes:**
- email: unique index for fast lookup and duplicate prevention

**Middleware:**
- Pre-save hook: Hash password using bcryptjs with salt rounds = 10

### Job Model

```javascript
{
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  company: {
    type: String,
    required: true,
    trim: true
  },
  location: {
    type: String,
    required: true,
    trim: true
  },
  salary: {
    min: {
      type: Number,
      required: true,
      min: 0
    },
    max: {
      type: Number,
      required: true,
      min: 0,
      validate: {
        validator: function(value) {
          return value >= this.salary.min;
        },
        message: 'Maximum salary must be >= minimum salary'
      }
    }
  },
  skillsRequired: {
    type: [String],
    required: true,
    validate: {
      validator: function(arr) {
        return arr.length > 0;
      },
      message: 'At least one skill is required'
    }
  },
  employerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  isActive: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}
```

**Indexes:**
- employerId: for fast employer job queries
- isActive: for filtering active jobs
- createdAt: for sorting by date

### Application Model

```javascript
{
  jobId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Job',
    required: true
  },
  applicantId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'accepted', 'rejected'],
    default: 'pending'
  },
  appliedAt: {
    type: Date,
    default: Date.now
  }
}
```

**Indexes:**
- Compound index on (jobId, applicantId): unique constraint to prevent duplicate applications
- applicantId: for fast user application queries
- jobId: for fast job applicant queries

### SavedJob Model

```javascript
{
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  jobId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Job',
    required: true
  },
  savedAt: {
    type: Date,
    default: Date.now
  }
}
```

**Indexes:**
- Compound index on (userId, jobId): unique constraint to prevent duplicate saves
- userId: for fast user saved job queries

