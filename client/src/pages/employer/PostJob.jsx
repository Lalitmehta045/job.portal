import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../../api/axios';
import { Input, TextArea, ErrorMessage } from '../../components';

const PostJob = () => {
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    company: '',
    location: '',
    salaryMin: '',
    salaryMax: '',
    skillsRequired: '',
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [validationErrors, setValidationErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    
    // Clear validation error for this field
    if (validationErrors[name]) {
      setValidationErrors((prev) => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  const validateForm = () => {
    const errors = {};

    if (!formData.title.trim()) {
      errors.title = 'Job title is required';
    }

    if (!formData.description.trim()) {
      errors.description = 'Job description is required';
    }

    if (!formData.company.trim()) {
      errors.company = 'Company name is required';
    }

    if (!formData.location.trim()) {
      errors.location = 'Location is required';
    }

    if (!formData.salaryMin) {
      errors.salaryMin = 'Minimum salary is required';
    } else if (isNaN(formData.salaryMin) || Number(formData.salaryMin) < 0) {
      errors.salaryMin = 'Minimum salary must be a positive number';
    }

    if (!formData.salaryMax) {
      errors.salaryMax = 'Maximum salary is required';
    } else if (isNaN(formData.salaryMax) || Number(formData.salaryMax) < 0) {
      errors.salaryMax = 'Maximum salary must be a positive number';
    }

    // Validate salary min <= max
    if (formData.salaryMin && formData.salaryMax) {
      const min = Number(formData.salaryMin);
      const max = Number(formData.salaryMax);
      if (min > max) {
        errors.salaryMax = 'Maximum salary must be greater than or equal to minimum salary';
      }
    }

    if (!formData.skillsRequired.trim()) {
      errors.skillsRequired = 'At least one skill is required';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);
      setError('');

      // Parse skills from comma-separated string
      const skillsArray = formData.skillsRequired
        .split(',')
        .map((skill) => skill.trim())
        .filter((skill) => skill.length > 0);

      const jobData = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        company: formData.company.trim(),
        location: formData.location.trim(),
        salary: {
          min: Number(formData.salaryMin),
          max: Number(formData.salaryMax),
        },
        skillsRequired: skillsArray,
      };

      await axios.post('/jobs', jobData);
      
      // Redirect to My Jobs page on success
      navigate('/employer/my-jobs');
    } catch (err) {
      console.error('Failed to create job:', err);
      setError(err.response?.data?.message || 'Failed to create job listing');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white rounded-lg shadow-lg p-6 sm:p-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Post a New Job</h1>

        {error && <ErrorMessage message={error} />}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Job Title */}
          <Input
            label="Job Title"
            name="title"
            type="text"
            value={formData.title}
            onChange={handleChange}
            placeholder="e.g., Senior Software Engineer"
            error={validationErrors.title}
            required
          />

          {/* Company */}
          <Input
            label="Company Name"
            name="company"
            type="text"
            value={formData.company}
            onChange={handleChange}
            placeholder="e.g., Tech Corp"
            error={validationErrors.company}
            required
          />

          {/* Location */}
          <Input
            label="Location"
            name="location"
            type="text"
            value={formData.location}
            onChange={handleChange}
            placeholder="e.g., San Francisco, CA"
            error={validationErrors.location}
            required
          />

          {/* Salary Range */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Minimum Salary"
              name="salaryMin"
              type="number"
              value={formData.salaryMin}
              onChange={handleChange}
              placeholder="e.g., 80000"
              error={validationErrors.salaryMin}
              required
            />
            <Input
              label="Maximum Salary"
              name="salaryMax"
              type="number"
              value={formData.salaryMax}
              onChange={handleChange}
              placeholder="e.g., 120000"
              error={validationErrors.salaryMax}
              required
            />
          </div>

          {/* Skills Required */}
          <div>
            <Input
              label="Required Skills"
              name="skillsRequired"
              type="text"
              value={formData.skillsRequired}
              onChange={handleChange}
              placeholder="e.g., JavaScript, React, Node.js"
              error={validationErrors.skillsRequired}
              required
            />
            <p className="mt-1 text-sm text-gray-500">
              Enter skills separated by commas
            </p>
          </div>

          {/* Job Description */}
          <TextArea
            label="Job Description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Describe the job responsibilities, requirements, and benefits..."
            rows={8}
            error={validationErrors.description}
            required
          />

          {/* Submit Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Posting...' : 'Post Job'}
            </button>
            <button
              type="button"
              onClick={() => navigate('/employer/my-jobs')}
              disabled={loading}
              className="flex-1 bg-gray-200 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-300 transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PostJob;
