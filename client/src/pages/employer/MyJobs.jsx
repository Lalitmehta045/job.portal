import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from '../../api/axios';
import { Loading, ErrorMessage, Input, TextArea } from '../../components';

const MyJobs = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editingJob, setEditingJob] = useState(null);
  const [editFormData, setEditFormData] = useState({});
  const [editLoading, setEditLoading] = useState(false);
  const [editError, setEditError] = useState('');

  useEffect(() => {
    fetchMyJobs();
  }, []);

  const fetchMyJobs = async () => {
    try {
      setLoading(true);
      setError('');

      const response = await axios.get('/jobs/my-jobs');
      setJobs(response.data.jobs || []);
    } catch (err) {
      console.error('Failed to fetch jobs:', err);
      setError(err.response?.data?.message || 'Failed to load your jobs');
    } finally {
      setLoading(false);
    }
  };

  const handleEditClick = (job) => {
    setEditingJob(job._id);
    setEditFormData({
      title: job.title,
      description: job.description,
      location: job.location,
      salaryMin: job.salary.min,
      salaryMax: job.salary.max,
      skillsRequired: job.skillsRequired.join(', '),
    });
    setEditError('');
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleEditSubmit = async (jobId) => {
    try {
      setEditLoading(true);
      setEditError('');

      // Validate salary
      const min = Number(editFormData.salaryMin);
      const max = Number(editFormData.salaryMax);
      
      if (min > max) {
        setEditError('Maximum salary must be greater than or equal to minimum salary');
        setEditLoading(false);
        return;
      }

      // Parse skills
      const skillsArray = editFormData.skillsRequired
        .split(',')
        .map((skill) => skill.trim())
        .filter((skill) => skill.length > 0);

      if (skillsArray.length === 0) {
        setEditError('At least one skill is required');
        setEditLoading(false);
        return;
      }

      const updateData = {
        title: editFormData.title.trim(),
        description: editFormData.description.trim(),
        location: editFormData.location.trim(),
        salary: {
          min,
          max,
        },
        skillsRequired: skillsArray,
      };

      await axios.put(`/jobs/${jobId}`, updateData);
      
      // Refresh jobs list
      await fetchMyJobs();
      
      // Close edit form
      setEditingJob(null);
      setEditFormData({});
    } catch (err) {
      console.error('Failed to update job:', err);
      setEditError(err.response?.data?.message || 'Failed to update job');
    } finally {
      setEditLoading(false);
    }
  };

  const handleCancelEdit = () => {
    setEditingJob(null);
    setEditFormData({});
    setEditError('');
  };

  const handleDelete = async (jobId) => {
    if (!window.confirm('Are you sure you want to delete this job? This action cannot be undone.')) {
      return;
    }

    try {
      await axios.delete(`/jobs/${jobId}`);
      
      // Refresh jobs list
      await fetchMyJobs();
    } catch (err) {
      console.error('Failed to delete job:', err);
      alert(err.response?.data?.message || 'Failed to delete job');
    }
  };

  const formatSalary = (min, max) => {
    return `$${min.toLocaleString()} - $${max.toLocaleString()}`;
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <ErrorMessage message={error} />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">My Jobs</h1>
        <Link
          to="/employer/post-job"
          className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-semibold"
        >
          Post New Job
        </Link>
      </div>

      {jobs.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <svg
            className="mx-auto h-12 w-12 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
            />
          </svg>
          <p className="mt-4 text-gray-500 text-lg">You haven't posted any jobs yet</p>
          <Link
            to="/employer/post-job"
            className="inline-block mt-4 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-semibold"
          >
            Post Your First Job
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {jobs.map((job) => (
            <div key={job._id} className="bg-white rounded-lg shadow">
              {editingJob === job._id ? (
                // Edit Form
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">Edit Job</h3>
                  
                  {editError && (
                    <div className="mb-4 p-3 bg-red-100 text-red-800 rounded-lg">
                      {editError}
                    </div>
                  )}

                  <div className="space-y-4">
                    <Input
                      label="Job Title"
                      name="title"
                      value={editFormData.title}
                      onChange={handleEditChange}
                      required
                    />

                    <Input
                      label="Location"
                      name="location"
                      value={editFormData.location}
                      onChange={handleEditChange}
                      required
                    />

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <Input
                        label="Minimum Salary"
                        name="salaryMin"
                        type="number"
                        value={editFormData.salaryMin}
                        onChange={handleEditChange}
                        required
                      />
                      <Input
                        label="Maximum Salary"
                        name="salaryMax"
                        type="number"
                        value={editFormData.salaryMax}
                        onChange={handleEditChange}
                        required
                      />
                    </div>

                    <div>
                      <Input
                        label="Required Skills"
                        name="skillsRequired"
                        value={editFormData.skillsRequired}
                        onChange={handleEditChange}
                        required
                      />
                      <p className="mt-1 text-sm text-gray-500">
                        Enter skills separated by commas
                      </p>
                    </div>

                    <TextArea
                      label="Job Description"
                      name="description"
                      value={editFormData.description}
                      onChange={handleEditChange}
                      rows={6}
                      required
                    />

                    <div className="flex gap-4 pt-4">
                      <button
                        onClick={() => handleEditSubmit(job._id)}
                        disabled={editLoading}
                        className="flex-1 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {editLoading ? 'Saving...' : 'Save Changes'}
                      </button>
                      <button
                        onClick={handleCancelEdit}
                        disabled={editLoading}
                        className="flex-1 bg-gray-200 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-300 transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                // Job Display
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900 mb-2">{job.title}</h2>
                      <div className="flex flex-wrap gap-4 text-gray-600">
                        <div className="flex items-center">
                          <svg
                            className="w-5 h-5 mr-2"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                            />
                          </svg>
                          <span>{job.company}</span>
                        </div>
                        <div className="flex items-center">
                          <svg
                            className="w-5 h-5 mr-2"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                            />
                          </svg>
                          <span>{job.location}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEditClick(job)}
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(job._id)}
                        className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors font-medium"
                      >
                        Delete
                      </button>
                    </div>
                  </div>

                  <div className="mb-4">
                    <p className="text-green-600 font-semibold text-lg">
                      {formatSalary(job.salary.min, job.salary.max)}
                    </p>
                  </div>

                  <div className="mb-4">
                    <p className="text-gray-700 whitespace-pre-line">{job.description}</p>
                  </div>

                  {job.skillsRequired && job.skillsRequired.length > 0 && (
                    <div className="mb-4">
                      <h3 className="text-sm font-semibold text-gray-700 mb-2">Required Skills:</h3>
                      <div className="flex flex-wrap gap-2">
                        {job.skillsRequired.map((skill, index) => (
                          <span
                            key={index}
                            className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="flex justify-between items-center pt-4 border-t border-gray-200">
                    <p className="text-sm text-gray-500">Posted on {formatDate(job.createdAt)}</p>
                    <Link
                      to={`/employer/applicants/${job._id}`}
                      className="text-blue-600 hover:text-blue-800 font-medium"
                    >
                      View Applicants →
                    </Link>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyJobs;
