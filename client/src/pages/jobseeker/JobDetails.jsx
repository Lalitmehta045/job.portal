import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from '../../api/axios';
import { Loading, ErrorMessage } from '../../components';

const JobDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [actionLoading, setActionLoading] = useState(false);
  const [actionMessage, setActionMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    fetchJobDetails();
  }, [id]);

  const fetchJobDetails = async () => {
    try {
      setLoading(true);
      setError('');

      const response = await axios.get(`/jobs`);
      const jobs = response.data.jobs || [];
      const foundJob = jobs.find((j) => j._id === id);

      if (!foundJob) {
        setError('Job not found');
      } else {
        setJob(foundJob);
      }
    } catch (err) {
      console.error('Failed to fetch job details:', err);
      setError(err.response?.data?.message || 'Failed to load job details');
    } finally {
      setLoading(false);
    }
  };

  const handleApply = async () => {
    try {
      setActionLoading(true);
      setActionMessage({ type: '', text: '' });

      await axios.post(`/apply/${id}`);
      
      setActionMessage({
        type: 'success',
        text: 'Application submitted successfully!',
      });

      // Redirect to applications page after 2 seconds
      setTimeout(() => {
        navigate('/jobseeker/applied');
      }, 2000);
    } catch (err) {
      console.error('Failed to apply for job:', err);
      const errorMsg = err.response?.data?.message || 'Failed to submit application';
      
      setActionMessage({
        type: 'error',
        text: errorMsg,
      });
    } finally {
      setActionLoading(false);
    }
  };

  const handleSaveJob = async () => {
    try {
      setActionLoading(true);
      setActionMessage({ type: '', text: '' });

      await axios.post(`/saved/${id}`);
      
      setActionMessage({
        type: 'success',
        text: 'Job saved successfully!',
      });
    } catch (err) {
      console.error('Failed to save job:', err);
      const errorMsg = err.response?.data?.message || 'Failed to save job';
      
      setActionMessage({
        type: 'error',
        text: errorMsg,
      });
    } finally {
      setActionLoading(false);
    }
  };

  const formatSalary = (min, max) => {
    return `$${min.toLocaleString()} - $${max.toLocaleString()}`;
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <ErrorMessage message={error} />
        <Link
          to="/jobseeker/jobs"
          className="inline-block mt-4 text-blue-600 hover:text-blue-800 font-medium"
        >
          ← Back to Jobs
        </Link>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <p className="text-gray-500 text-lg mb-4">Job not found</p>
          <Link
            to="/jobseeker/jobs"
            className="inline-block text-blue-600 hover:text-blue-800 font-medium"
          >
            ← Back to Jobs
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Back Button */}
      <Link
        to="/jobseeker/jobs"
        className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium mb-6"
      >
        <svg
          className="w-5 h-5 mr-1"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 19l-7-7 7-7"
          />
        </svg>
        Back to Jobs
      </Link>

      {/* Action Message */}
      {actionMessage.text && (
        <div
          className={`mb-6 p-4 rounded-lg ${
            actionMessage.type === 'success'
              ? 'bg-green-100 text-green-800'
              : 'bg-red-100 text-red-800'
          }`}
        >
          {actionMessage.text}
        </div>
      )}

      {/* Job Details Card */}
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        {/* Header Section */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-8 text-white">
          <h1 className="text-3xl font-bold mb-2">{job.title}</h1>
          <div className="flex flex-wrap items-center gap-4 text-blue-100">
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
              <span className="font-medium">{job.company}</span>
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
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
              <span>{job.location}</span>
            </div>
          </div>
        </div>

        {/* Content Section */}
        <div className="px-6 py-8">
          {/* Salary */}
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-2">Salary Range</h2>
            <div className="flex items-center text-green-600 text-xl font-bold">
              <svg
                className="w-6 h-6 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              {formatSalary(job.salary.min, job.salary.max)}
            </div>
          </div>

          {/* Description */}
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-3">Job Description</h2>
            <div className="text-gray-700 whitespace-pre-line leading-relaxed">
              {job.description}
            </div>
          </div>

          {/* Required Skills */}
          {job.skillsRequired && job.skillsRequired.length > 0 && (
            <div className="mb-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-3">Required Skills</h2>
              <div className="flex flex-wrap gap-2">
                {job.skillsRequired.map((skill, index) => (
                  <span
                    key={index}
                    className="bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-medium"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Posted Date */}
          <div className="mb-8 text-sm text-gray-500">
            Posted on {formatDate(job.createdAt)}
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-gray-200">
            <button
              onClick={handleApply}
              disabled={actionLoading}
              className="flex-1 bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {actionLoading ? 'Processing...' : 'Apply for this Job'}
            </button>
            <button
              onClick={handleSaveJob}
              disabled={actionLoading}
              className="flex-1 bg-gray-200 text-gray-700 px-8 py-3 rounded-lg hover:bg-gray-300 transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
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
                  d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
                />
              </svg>
              {actionLoading ? 'Processing...' : 'Save Job'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobDetails;
