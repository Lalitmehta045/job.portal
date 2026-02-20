# Requirements Document

## Introduction

The Job Portal is a web-based platform that connects job seekers with employers. The system supports three distinct user roles: job seekers who can browse and apply for jobs, employers who can post and manage job listings, and administrators who oversee the entire platform. The system provides secure authentication, role-based access control, resume management, application tracking, and analytics capabilities.

## Glossary

- **Job_Portal**: The complete web application system including frontend and backend components
- **Authentication_Service**: The subsystem responsible for user registration, login, and JWT token management
- **Job_Service**: The subsystem responsible for creating, reading, updating, and deleting job listings
- **Application_Service**: The subsystem responsible for managing job applications and their status
- **Saved_Job_Service**: The subsystem responsible for managing saved/bookmarked jobs
- **Admin_Service**: The subsystem responsible for platform administration and analytics
- **File_Upload_Service**: The subsystem responsible for handling resume uploads via Cloudinary
- **Authorization_Middleware**: The component that validates JWT tokens and enforces role-based access
- **Validation_Middleware**: The component that validates incoming request data
- **Job_Seeker**: A user with role "jobSeeker" who can browse and apply for jobs
- **Employer**: A user with role "employer" who can post and manage job listings
- **Administrator**: A user with role "admin" who has full platform control
- **JWT_Token**: JSON Web Token used for stateless authentication
- **Application_Status**: An enumeration with values: pending, accepted, rejected
- **User_Role**: An enumeration with values: jobSeeker, employer, admin
- **Resume**: A PDF or document file uploaded by a Job_Seeker stored in Cloudinary
- **Protected_Route**: A frontend route that requires authentication to access
- **Rate_Limiter**: Security middleware that restricts request frequency per IP address

## Requirements

### Requirement 1: User Registration

**User Story:** As a new user, I want to register an account with my role selection, so that I can access role-specific features of the platform.

#### Acceptance Criteria

1. WHEN a registration request is received with valid name, email, password, and role, THE Authentication_Service SHALL create a new user account with hashed password
2. WHEN a registration request is received with an email that already exists, THE Authentication_Service SHALL return an error indicating duplicate email
3. THE Authentication_Service SHALL validate that the role field contains only values from User_Role enumeration
4. THE Authentication_Service SHALL validate that the password is at least 8 characters long
5. THE Authentication_Service SHALL validate that the email follows standard email format
6. WHEN a user account is created, THE Authentication_Service SHALL initialize the isBlocked field to false
7. WHEN a user account is created with jobSeeker role, THE Authentication_Service SHALL initialize an empty profile object with empty skills array

### Requirement 2: User Authentication

**User Story:** As a registered user, I want to log in securely, so that I can access my account and role-specific features.

#### Acceptance Criteria

1. WHEN a login request is received with valid email and password, THE Authentication_Service SHALL return a JWT_Token valid for 7 days
2. WHEN a login request is received with invalid credentials, THE Authentication_Service SHALL return an authentication error
3. WHEN a login request is received for a blocked user account, THE Authentication_Service SHALL return an error indicating account is blocked
4. THE Authentication_Service SHALL compare the provided password with the hashed password using bcryptjs
5. THE JWT_Token SHALL contain the user ID and role as payload claims
6. WHEN a valid JWT_Token is provided, THE Authorization_Middleware SHALL extract and verify the user identity
7. WHEN an invalid or expired JWT_Token is provided, THE Authorization_Middleware SHALL return an authentication error

### Requirement 3: Job Listing Creation

**User Story:** As an Employer, I want to post job listings with detailed information, so that Job_Seekers can discover and apply for positions.

#### Acceptance Criteria

1. WHEN an authenticated Employer submits a job creation request, THE Job_Service SHALL create a new job listing with the provided details
2. THE Job_Service SHALL validate that title, description, company, location, and skillsRequired fields are present
3. THE Job_Service SHALL validate that salary minimum is less than or equal to salary maximum
4. WHEN a job listing is created, THE Job_Service SHALL set the employerId to the authenticated user's ID
5. WHEN a job listing is created, THE Job_Service SHALL set isActive to true
6. WHEN a job listing is created, THE Job_Service SHALL set createdAt to the current timestamp
7. WHEN a non-Employer user attempts to create a job listing, THE Authorization_Middleware SHALL return an authorization error

### Requirement 4: Job Listing Retrieval

**User Story:** As a Job_Seeker, I want to browse available job listings with filtering options, so that I can find relevant opportunities.

#### Acceptance Criteria

1. WHEN a job listing retrieval request is received, THE Job_Service SHALL return all active job listings
2. THE Job_Service SHALL support filtering by location query parameter
3. THE Job_Service SHALL support filtering by skills query parameter
4. THE Job_Service SHALL support filtering by salary range query parameters
5. THE Job_Service SHALL support filtering by company query parameter
6. THE Job_Service SHALL return job listings sorted by createdAt in descending order
7. THE Job_Service SHALL populate the employerId field with employer name and company information

### Requirement 5: Job Application Submission

**User Story:** As a Job_Seeker, I want to apply for job listings, so that employers can consider me for positions.

#### Acceptance Criteria

1. WHEN an authenticated Job_Seeker submits an application for a job, THE Application_Service SHALL create a new application record
2. WHEN a Job_Seeker attempts to apply for the same job twice, THE Application_Service SHALL return an error indicating duplicate application
3. WHEN an application is created, THE Application_Service SHALL set the status to pending
4. WHEN an application is created, THE Application_Service SHALL set appliedAt to the current timestamp
5. THE Application_Service SHALL validate that the referenced job exists and is active
6. WHEN a non-Job_Seeker user attempts to apply for a job, THE Authorization_Middleware SHALL return an authorization error
7. WHEN an application is created, THE Application_Service SHALL store the applicantId and jobId references

### Requirement 6: Application Status Management

**User Story:** As an Employer, I want to update application statuses, so that I can manage the hiring process and communicate decisions to applicants.

#### Acceptance Criteria

1. WHEN an authenticated Employer updates an application status, THE Application_Service SHALL update the status field
2. THE Application_Service SHALL validate that the new status is one of: pending, accepted, rejected
3. THE Application_Service SHALL validate that the application belongs to a job owned by the authenticated Employer
4. WHEN an Employer attempts to update an application for a job they do not own, THE Application_Service SHALL return an authorization error
5. WHEN a non-Employer user attempts to update an application status, THE Authorization_Middleware SHALL return an authorization error

### Requirement 7: Saved Jobs Management

**User Story:** As a Job_Seeker, I want to save job listings for later review, so that I can organize my job search.

#### Acceptance Criteria

1. WHEN an authenticated Job_Seeker saves a job, THE Saved_Job_Service SHALL create a saved job record
2. WHEN a Job_Seeker attempts to save the same job twice, THE Saved_Job_Service SHALL return an error indicating duplicate saved job
3. WHEN a saved job record is created, THE Saved_Job_Service SHALL set savedAt to the current timestamp
4. WHEN an authenticated Job_Seeker requests their saved jobs, THE Saved_Job_Service SHALL return all saved jobs for that user
5. WHEN an authenticated Job_Seeker removes a saved job, THE Saved_Job_Service SHALL delete the saved job record
6. THE Saved_Job_Service SHALL validate that the referenced job exists
7. WHEN a non-Job_Seeker user attempts to save a job, THE Authorization_Middleware SHALL return an authorization error

### Requirement 8: Resume Upload and Management

**User Story:** As a Job_Seeker, I want to upload and manage my resume, so that employers can review my qualifications.

#### Acceptance Criteria

1. WHEN an authenticated Job_Seeker uploads a resume file, THE File_Upload_Service SHALL upload the file to Cloudinary
2. WHEN a resume upload succeeds, THE File_Upload_Service SHALL store the Cloudinary URL in the user's profile resumeUrl field
3. THE File_Upload_Service SHALL validate that the uploaded file is a PDF or document format
4. THE File_Upload_Service SHALL validate that the file size does not exceed 5 megabytes
5. WHEN a resume upload fails, THE File_Upload_Service SHALL return a descriptive error message
6. WHEN a Job_Seeker uploads a new resume, THE File_Upload_Service SHALL replace the existing resumeUrl
7. WHEN a non-Job_Seeker user attempts to upload a resume, THE Authorization_Middleware SHALL return an authorization error

### Requirement 9: Job Seeker Profile Management

**User Story:** As a Job_Seeker, I want to manage my profile information including skills, experience, and education, so that employers can evaluate my qualifications.

#### Acceptance Criteria

1. WHEN an authenticated Job_Seeker updates their profile, THE Authentication_Service SHALL update the profile object
2. THE Authentication_Service SHALL validate that skills is an array of strings
3. THE Authentication_Service SHALL allow updating experience as a string field
4. THE Authentication_Service SHALL allow updating education as a string field
5. WHEN a non-Job_Seeker user attempts to update profile fields, THE Authorization_Middleware SHALL return an authorization error
6. WHEN a Job_Seeker retrieves their profile, THE Authentication_Service SHALL return all profile fields including resumeUrl

### Requirement 10: Employer Job Management

**User Story:** As an Employer, I want to view and manage my posted jobs, so that I can control which positions are actively recruiting.

#### Acceptance Criteria

1. WHEN an authenticated Employer requests their jobs, THE Job_Service SHALL return all jobs where employerId matches the authenticated user
2. WHEN an authenticated Employer updates a job, THE Job_Service SHALL validate that the job belongs to the authenticated Employer
3. WHEN an Employer attempts to update a job they do not own, THE Job_Service SHALL return an authorization error
4. WHEN an authenticated Employer deletes a job, THE Job_Service SHALL validate that the job belongs to the authenticated Employer
5. WHEN an Employer deletes a job, THE Job_Service SHALL set isActive to false instead of removing the record
6. THE Job_Service SHALL allow updating title, description, location, salary, and skillsRequired fields
7. WHEN a non-Employer user attempts to update or delete a job, THE Authorization_Middleware SHALL return an authorization error

### Requirement 11: Employer Applicant Viewing

**User Story:** As an Employer, I want to view all applicants for my job postings, so that I can review candidates and make hiring decisions.

#### Acceptance Criteria

1. WHEN an authenticated Employer requests applicants for a job, THE Application_Service SHALL return all applications for that job
2. THE Application_Service SHALL validate that the job belongs to the authenticated Employer
3. THE Application_Service SHALL populate applicant details including name, email, and profile information
4. THE Application_Service SHALL include the application status and appliedAt timestamp
5. THE Application_Service SHALL include the applicant's resumeUrl if available
6. WHEN an Employer attempts to view applicants for a job they do not own, THE Application_Service SHALL return an authorization error

### Requirement 12: Administrator User Management

**User Story:** As an Administrator, I want to view and manage all user accounts, so that I can moderate the platform and handle policy violations.

#### Acceptance Criteria

1. WHEN an authenticated Administrator requests all users, THE Admin_Service SHALL return all user accounts
2. THE Admin_Service SHALL include user name, email, role, isBlocked status, and registration date
3. WHEN an authenticated Administrator blocks a user, THE Admin_Service SHALL set the isBlocked field to true
4. WHEN an authenticated Administrator unblocks a user, THE Admin_Service SHALL set the isBlocked field to false
5. WHEN a blocked user attempts to log in, THE Authentication_Service SHALL return an error indicating account is blocked
6. WHEN a non-Administrator user attempts to access user management, THE Authorization_Middleware SHALL return an authorization error

### Requirement 13: Administrator Job Management

**User Story:** As an Administrator, I want to view and remove any job listing, so that I can enforce platform policies and remove inappropriate content.

#### Acceptance Criteria

1. WHEN an authenticated Administrator requests all jobs, THE Admin_Service SHALL return all job listings regardless of employer
2. WHEN an authenticated Administrator deletes a job, THE Admin_Service SHALL set the isActive field to false
3. THE Admin_Service SHALL allow deleting jobs regardless of employerId ownership
4. WHEN a non-Administrator user attempts to access admin job management, THE Authorization_Middleware SHALL return an authorization error

### Requirement 14: Administrator Analytics Dashboard

**User Story:** As an Administrator, I want to view platform statistics and analytics, so that I can monitor platform health and growth.

#### Acceptance Criteria

1. WHEN an authenticated Administrator requests platform statistics, THE Admin_Service SHALL return total user count by role
2. THE Admin_Service SHALL return total active job listings count
3. THE Admin_Service SHALL return total applications count
4. THE Admin_Service SHALL return application status distribution counts
5. THE Admin_Service SHALL return recent user registration trends
6. THE Admin_Service SHALL return recent job posting trends
7. WHEN a non-Administrator user attempts to access analytics, THE Authorization_Middleware SHALL return an authorization error

### Requirement 15: Request Validation

**User Story:** As a platform operator, I want all API requests validated, so that invalid data is rejected before processing.

#### Acceptance Criteria

1. WHEN a request is received at any endpoint, THE Validation_Middleware SHALL validate all required fields are present
2. WHEN a request contains invalid data types, THE Validation_Middleware SHALL return a descriptive validation error
3. THE Validation_Middleware SHALL validate email format for all email fields
4. THE Validation_Middleware SHALL validate that numeric fields contain valid numbers
5. THE Validation_Middleware SHALL validate that enumeration fields contain only allowed values
6. THE Validation_Middleware SHALL sanitize string inputs to prevent injection attacks
7. WHEN validation fails, THE Validation_Middleware SHALL return a 400 status code with error details

### Requirement 16: Security Headers and Rate Limiting

**User Story:** As a platform operator, I want security protections enabled, so that the application is protected from common web vulnerabilities.

#### Acceptance Criteria

1. THE Job_Portal SHALL use helmet middleware to set security-related HTTP headers
2. THE Job_Portal SHALL use cors middleware to control cross-origin resource sharing
3. THE Rate_Limiter SHALL limit authentication endpoints to 5 requests per 15 minutes per IP address
4. THE Rate_Limiter SHALL limit general API endpoints to 100 requests per 15 minutes per IP address
5. WHEN rate limit is exceeded, THE Rate_Limiter SHALL return a 429 status code
6. THE Job_Portal SHALL use express-rate-limit for rate limiting implementation

### Requirement 17: Error Handling

**User Story:** As a developer, I want consistent error handling across all endpoints, so that errors are properly logged and communicated to clients.

#### Acceptance Criteria

1. WHEN an error occurs in any controller, THE Job_Portal SHALL catch the error using try-catch blocks
2. WHEN an error occurs, THE Job_Portal SHALL log the error details to the console
3. WHEN an error occurs, THE Job_Portal SHALL return an appropriate HTTP status code
4. WHEN a validation error occurs, THE Job_Portal SHALL return a 400 status code
5. WHEN an authentication error occurs, THE Job_Portal SHALL return a 401 status code
6. WHEN an authorization error occurs, THE Job_Portal SHALL return a 403 status code
7. WHEN a resource is not found, THE Job_Portal SHALL return a 404 status code
8. WHEN an internal server error occurs, THE Job_Portal SHALL return a 500 status code with a generic error message

### Requirement 18: Frontend Authentication Context

**User Story:** As a frontend developer, I want a centralized authentication context, so that user state is managed consistently across the application.

#### Acceptance Criteria

1. THE Job_Portal SHALL provide an AuthContext that stores the current user and JWT_Token
2. THE AuthContext SHALL provide a login function that calls the authentication API and stores the token
3. THE AuthContext SHALL provide a logout function that clears the stored token and user state
4. THE AuthContext SHALL provide a register function that calls the registration API
5. THE AuthContext SHALL persist the JWT_Token in localStorage
6. WHEN the application loads, THE AuthContext SHALL retrieve the token from localStorage and validate it
7. WHEN the token is invalid or expired, THE AuthContext SHALL clear the stored token and user state

### Requirement 19: Frontend Protected Routes

**User Story:** As a frontend developer, I want route protection based on authentication and roles, so that unauthorized users cannot access restricted pages.

#### Acceptance Criteria

1. WHEN an unauthenticated user attempts to access a protected route, THE Job_Portal SHALL redirect to the login page
2. WHEN an authenticated user with incorrect role attempts to access a role-specific route, THE Job_Portal SHALL redirect to their role-appropriate dashboard
3. THE Job_Portal SHALL provide a ProtectedRoute component that wraps protected pages
4. THE ProtectedRoute component SHALL check authentication status from AuthContext
5. THE ProtectedRoute component SHALL check user role matches required role for the route
6. WHEN authentication check passes, THE ProtectedRoute component SHALL render the requested page

### Requirement 20: Frontend API Client Configuration

**User Story:** As a frontend developer, I want a configured Axios instance, so that API requests include authentication headers automatically.

#### Acceptance Criteria

1. THE Job_Portal SHALL provide a configured Axios instance with base URL set to the API endpoint
2. THE Axios instance SHALL include an interceptor that adds the JWT_Token to request headers
3. THE Axios instance SHALL include an interceptor that handles 401 responses by clearing authentication state
4. WHEN a 401 response is received, THE Axios instance SHALL redirect to the login page
5. THE Axios instance SHALL set the Authorization header format as "Bearer {token}"

### Requirement 21: Database Connection Management

**User Story:** As a backend developer, I want reliable database connection handling, so that the application can recover from connection issues.

#### Acceptance Criteria

1. WHEN the application starts, THE Job_Portal SHALL connect to MongoDB using the connection string from environment variables
2. WHEN the database connection succeeds, THE Job_Portal SHALL log a success message
3. WHEN the database connection fails, THE Job_Portal SHALL log the error and exit the process
4. THE Job_Portal SHALL use Mongoose version 8 for database operations
5. THE Job_Portal SHALL enable strict mode for Mongoose schemas

### Requirement 22: Environment Configuration

**User Story:** As a deployment engineer, I want environment-based configuration, so that the application can run in different environments without code changes.

#### Acceptance Criteria

1. THE Job_Portal SHALL read configuration from environment variables
2. THE Job_Portal SHALL require MONGODB_URI environment variable for database connection
3. THE Job_Portal SHALL require JWT_SECRET environment variable for token signing
4. THE Job_Portal SHALL require CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET for file uploads
5. THE Job_Portal SHALL use PORT environment variable with default value 5000
6. THE Job_Portal SHALL use NODE_ENV environment variable to determine production or development mode

### Requirement 23: Job Seeker Application History

**User Story:** As a Job_Seeker, I want to view my application history with current status, so that I can track my job search progress.

#### Acceptance Criteria

1. WHEN an authenticated Job_Seeker requests their applications, THE Application_Service SHALL return all applications for that user
2. THE Application_Service SHALL populate job details including title, company, and location
3. THE Application_Service SHALL include the application status and appliedAt timestamp
4. THE Application_Service SHALL sort applications by appliedAt in descending order
5. WHEN a non-Job_Seeker user attempts to access application history, THE Authorization_Middleware SHALL return an authorization error

### Requirement 24: Data Model Validation

**User Story:** As a backend developer, I want Mongoose schema validation, so that invalid data cannot be stored in the database.

#### Acceptance Criteria

1. THE Job_Portal SHALL define required fields in all Mongoose schemas
2. THE Job_Portal SHALL define enumeration constraints for role and status fields
3. THE Job_Portal SHALL define minimum and maximum constraints for salary fields
4. THE Job_Portal SHALL define unique constraint for email field in User schema
5. WHEN invalid data is saved, THE Job_Portal SHALL return a validation error from Mongoose
6. THE Job_Portal SHALL define default values for isBlocked, isActive, and timestamp fields

### Requirement 25: Frontend Responsive Design

**User Story:** As a user, I want the application to work on different screen sizes, so that I can access it from any device.

#### Acceptance Criteria

1. THE Job_Portal SHALL use Tailwind CSS version 3 for styling
2. THE Job_Portal SHALL use responsive utility classes for layout components
3. THE Job_Portal SHALL display navigation menus appropriately on mobile and desktop screens
4. THE Job_Portal SHALL ensure forms are usable on mobile devices
5. THE Job_Portal SHALL ensure tables and lists are readable on mobile devices

### Requirement 26: Frontend Chart Visualization

**User Story:** As an Administrator, I want visual charts for analytics data, so that I can quickly understand platform trends.

#### Acceptance Criteria

1. WHERE the user is an Administrator viewing the dashboard, THE Job_Portal SHALL display charts using Recharts library
2. THE Job_Portal SHALL display a bar chart showing user counts by role
3. THE Job_Portal SHALL display a pie chart showing application status distribution
4. THE Job_Portal SHALL display a line chart showing registration trends over time
5. THE Job_Portal SHALL display a line chart showing job posting trends over time
