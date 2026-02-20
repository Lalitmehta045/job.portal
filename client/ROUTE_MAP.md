# Job Portal - Route Map

## Application Route Structure

```
Job Portal Application
│
├── 🌐 Public Routes (No Authentication)
│   ├── / ........................... Home Page
│   ├── /login ...................... Login Page
│   └── /register ................... Registration Page
│
├── 👤 Job Seeker Routes (Role: jobSeeker)
│   ├── /jobseeker/dashboard ........ Dashboard Overview
│   ├── /jobseeker/jobs ............. Browse All Jobs
│   ├── /jobseeker/jobs/:id ......... Job Details & Apply
│   ├── /jobseeker/applied .......... Application History
│   ├── /jobseeker/saved ............ Saved Jobs
│   └── /jobseeker/profile .......... Profile & Resume Management
│
├── 🏢 Employer Routes (Role: employer)
│   ├── /employer/dashboard ......... Dashboard Overview
│   ├── /employer/post-job .......... Create New Job Posting
│   ├── /employer/my-jobs ........... Manage Posted Jobs
│   └── /employer/jobs/:id/applicants View Job Applicants
│
├── 👨‍💼 Admin Routes (Role: admin)
│   ├── /admin/dashboard ............ Analytics Dashboard
│   ├── /admin/users ................ User Management
│   └── /admin/jobs ................. Job Management
│
└── 🔄 Catch-all
    └── * ........................... Redirect to Home

```

## Route Protection Matrix

| Route Pattern | Authentication | Role Required | Redirect if Unauthorized |
|--------------|----------------|---------------|-------------------------|
| `/` | ❌ No | None | N/A |
| `/login` | ❌ No | None | N/A |
| `/register` | ❌ No | None | N/A |
| `/jobseeker/*` | ✅ Yes | jobSeeker | `/login` or role dashboard |
| `/employer/*` | ✅ Yes | employer | `/login` or role dashboard |
| `/admin/*` | ✅ Yes | admin | `/login` or role dashboard |
| `*` (unknown) | ❌ No | None | `/` |

## Navigation Flow Diagrams

### Unauthenticated User Flow
```
User visits /jobseeker/dashboard
         ↓
ProtectedRoute checks authentication
         ↓
isAuthenticated = false
         ↓
Redirect to /login
```

### Wrong Role Access Flow
```
Job Seeker visits /employer/dashboard
         ↓
ProtectedRoute checks authentication
         ↓
isAuthenticated = true ✅
         ↓
ProtectedRoute checks role
         ↓
user.role = 'jobSeeker' ❌ (not in ['employer'])
         ↓
Redirect to /jobseeker/dashboard
```

### Successful Access Flow
```
Job Seeker visits /jobseeker/jobs
         ↓
ProtectedRoute checks authentication
         ↓
isAuthenticated = true ✅
         ↓
ProtectedRoute checks role
         ↓
user.role = 'jobSeeker' ✅ (in ['jobSeeker'])
         ↓
Render Jobs component
```

## Component Hierarchy

```
App
├── AuthProvider (Context)
│   └── Router
│       └── Routes
│           ├── Route (/) → Home
│           ├── Route (/login) → Login
│           ├── Route (/register) → Register
│           │
│           ├── Route (/jobseeker/dashboard)
│           │   └── ProtectedRoute (jobSeeker)
│           │       └── JobSeekerDashboard
│           │
│           ├── Route (/jobseeker/jobs)
│           │   └── ProtectedRoute (jobSeeker)
│           │       └── Jobs
│           │
│           ├── Route (/jobseeker/jobs/:id)
│           │   └── ProtectedRoute (jobSeeker)
│           │       └── JobDetails
│           │
│           ├── Route (/jobseeker/applied)
│           │   └── ProtectedRoute (jobSeeker)
│           │       └── Applied
│           │
│           ├── Route (/jobseeker/saved)
│           │   └── ProtectedRoute (jobSeeker)
│           │       └── Saved
│           │
│           ├── Route (/jobseeker/profile)
│           │   └── ProtectedRoute (jobSeeker)
│           │       └── Profile
│           │
│           ├── Route (/employer/dashboard)
│           │   └── ProtectedRoute (employer)
│           │       └── EmployerDashboard
│           │
│           ├── Route (/employer/post-job)
│           │   └── ProtectedRoute (employer)
│           │       └── PostJob
│           │
│           ├── Route (/employer/my-jobs)
│           │   └── ProtectedRoute (employer)
│           │       └── MyJobs
│           │
│           ├── Route (/employer/jobs/:id/applicants)
│           │   └── ProtectedRoute (employer)
│           │       └── Applicants
│           │
│           ├── Route (/admin/dashboard)
│           │   └── ProtectedRoute (admin)
│           │       └── AdminDashboard
│           │
│           ├── Route (/admin/users)
│           │   └── ProtectedRoute (admin)
│           │       └── Users
│           │
│           ├── Route (/admin/jobs)
│           │   └── ProtectedRoute (admin)
│           │       └── AdminJobs
│           │
│           └── Route (*) → Navigate to /
```

## ProtectedRoute Logic

```javascript
ProtectedRoute Component
├── Check loading state
│   └── If loading → Show "Loading..."
│
├── Check authentication
│   └── If !isAuthenticated → Navigate to /login
│
├── Check role authorization
│   ├── If role not in allowedRoles
│   │   └── Navigate to role-specific dashboard:
│   │       ├── jobSeeker → /jobseeker/dashboard
│   │       ├── employer → /employer/dashboard
│   │       └── admin → /admin/dashboard
│   │
│   └── If authorized → Render children
```

## Role-Based Dashboard Mapping

| User Role | Default Dashboard |
|-----------|------------------|
| jobSeeker | `/jobseeker/dashboard` |
| employer | `/employer/dashboard` |
| admin | `/admin/dashboard` |

## Requirements Mapping

| Requirement | Implementation | Status |
|------------|----------------|--------|
| 19.1: Redirect unauthenticated users to login | ProtectedRoute checks `isAuthenticated` | ✅ |
| 19.2: Redirect wrong role to appropriate dashboard | ProtectedRoute checks `allowedRoles` | ✅ |
| 19.3: ProtectedRoute wraps protected pages | All protected routes use ProtectedRoute | ✅ |
| 19.4: Check authentication from AuthContext | Uses `useAuth()` hook | ✅ |
| 19.5: Check role matches required role | Compares `user.role` with `allowedRoles` | ✅ |
| 19.6: Render page when authorized | Returns `children` when checks pass | ✅ |

## Testing Checklist

### Manual Testing Steps

1. **Public Routes**
   - [ ] Visit `/` - should show home page
   - [ ] Visit `/login` - should show login form
   - [ ] Visit `/register` - should show registration form

2. **Authentication Protection**
   - [ ] Visit `/jobseeker/dashboard` without login - should redirect to `/login`
   - [ ] Visit `/employer/dashboard` without login - should redirect to `/login`
   - [ ] Visit `/admin/dashboard` without login - should redirect to `/login`

3. **Job Seeker Role**
   - [ ] Register/login as job seeker
   - [ ] Should redirect to `/jobseeker/dashboard`
   - [ ] Navigate to `/jobseeker/jobs` - should work
   - [ ] Navigate to `/jobseeker/applied` - should work
   - [ ] Navigate to `/jobseeker/saved` - should work
   - [ ] Navigate to `/jobseeker/profile` - should work
   - [ ] Try to visit `/employer/dashboard` - should redirect to `/jobseeker/dashboard`
   - [ ] Try to visit `/admin/dashboard` - should redirect to `/jobseeker/dashboard`

4. **Employer Role**
   - [ ] Logout and register/login as employer
   - [ ] Should redirect to `/employer/dashboard`
   - [ ] Navigate to `/employer/post-job` - should work
   - [ ] Navigate to `/employer/my-jobs` - should work
   - [ ] Try to visit `/jobseeker/dashboard` - should redirect to `/employer/dashboard`
   - [ ] Try to visit `/admin/dashboard` - should redirect to `/employer/dashboard`

5. **Admin Role**
   - [ ] Logout and register/login as admin
   - [ ] Should redirect to `/admin/dashboard`
   - [ ] Navigate to `/admin/users` - should work
   - [ ] Navigate to `/admin/jobs` - should work
   - [ ] Try to visit `/jobseeker/dashboard` - should redirect to `/admin/dashboard`
   - [ ] Try to visit `/employer/dashboard` - should redirect to `/admin/dashboard`

6. **Unknown Routes**
   - [ ] Visit `/unknown-route` - should redirect to `/`
   - [ ] Visit `/random/path` - should redirect to `/`

## Summary

✅ **17 routes total** (3 public + 13 protected + 1 catch-all)
✅ **All routes properly connected** in App.jsx
✅ **All protected routes wrapped** with ProtectedRoute
✅ **All role checks correctly configured**
✅ **All requirements satisfied** (19.1, 19.2, 19.3)
✅ **Frontend server running** at http://localhost:5173/

**Task 18.1 Status: COMPLETE** ✅
