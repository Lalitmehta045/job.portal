import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from '../../api/axios';
import { Loading, ErrorMessage, Select } from '../../components';

const Applicants = () => {
  const { jobId } = useParams();
  
  const [job, setJob] = useState(null);
  const [applicants, setApplicants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [updatingStatus, setUpdatingStatus] = useState({});

  useEffect(() => {
    fetchJobAndApplicants();
  }, [jobId]);

  const fetchJobAndApplicants = async () => {
    try {
      setLoading(true);
      setError('');

      // Fetch job details
      const jobsResponse = await axios.get('/jobs/my-jobs');
      const jobs = jobsResponse.data.jobs || [];
      const foundJob = jobs.find((j) => j._id === jobId);

      if (!foundJob) {
        setError('Job not found or you do not have permission to view it');
        setLoading(false);
        return;
      }

      setJob(foundJob);

      // Fetch applicants for this job
      const applicantsResponse = await axios.get(`/jobs/${jobId}/applicants`);
      setApplicants(applicantsResponse.data.applicants || []);
    } catch (err) {
      console.error('Failed to fetch applicants:', err);
      setError(err.response?.data?.message || 'Failed to load applicants');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (applicationId, newStatus) => {
    try {
      setUpdatingStatus((prev) => ({ ...prev, [applicationId]: true }));

      await axios.put(`/application/${applicationId}/status`, {
        status: newStatus,
      });

      // Update local state
      setApplicants((prev) =>
        prev.map((app) =>
          app._id === applicationId ? { ...app, status: newStatus } : app
        )
      );
    } catch (err) {
      console.error('Failed to update status:', err);
      alert(err.response?.data?.message || 'Failed to update application status');
    } finally {
      setUpdatingStatus((prev) => ({ ...prev, [applicationId]: false }));
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'accepted':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-yellow-100 text-yellow-800';
    }
  };

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <ErrorMessage message={error} />
        <Link
          to="/employer/my-jobs"
          className="inline-block mt-4 text-blue-600 hover:text-blue-800 font-medium"
        >
          ← Back to My Jobs
        </Link>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <p className="text-gray-500 text-lg mb-4">Job not found</p>
          <Link
            to="/employer/my-jobs"
            className="inline-block text-blue-600 hover:text-blue-800 font-medium"
          >
            ← Back to My Jobs
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Back Button */}
      <Link
        to="/employer/my-jobs"
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
        Back to My Jobs
      </Link>

      {/* Job Info Header */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">{job.title}</h1>
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
                d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
              />
            </svg>
            <span>{applicants.length} Applicant{applicants.length !== 1 ? 's' : ''}</span>
          </div>
        </div>
      </div>

      {/* Applicants List */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Applicants</h2>
        </div>

        {applicants.length === 0 ? (
          <div className="p-8 text-center">
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
                d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
              />
            </svg>
            <p className="mt-2 text-gray-500">No applicants yet</p>
            <p className="text-sm text-gray-400 mt-1">
              Applicants will appear here when job seekers apply to this job
            </p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {applicants.map((applicant) => (
              <div key={applicant._id} className="p-6 hover:bg-gray-50 transition-colors">
                <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                  {/* Applicant Info */}
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">
                          {applicant.applicantId?.name || 'N/A'}
                        </h3>
                        <p className="text-gray-600">{applicant.applicantId?.email || 'N/A'}</p>
                      </div>
                      <span
                        className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(
                          applicant.status
                        )}`}
                      >
                        {applicant.status}
                      </span>
                    </div>

                    {/* Skills */}
                    {applicant.applicantId?.profile?.skills &&
                      applicant.applicantId.profile.skills.length > 0 && (
                        <div className="mb-3">
                          <h4 className="text-sm font-semibold text-gray-700 mb-2">Skills:</h4>
                          <div className="flex flex-wrap gap-2">
                            {applicant.applicantId.profile.skills.map((skill, index) => (
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

                    {/* Experience */}
                    {applicant.applicantId?.profile?.experience && (
                      <div className="mb-3">
                        <h4 className="text-sm font-semibold text-gray-700 mb-1">Experience:</h4>
                        <p className="text-gray-600 text-sm whitespace-pre-line">
                          {applicant.applicantId.profile.experience}
                        </p>
                      </div>
                    )}

                    {/* Education */}
                    {applicant.applicantId?.profile?.education && (
                      <div className="mb-3">
                        <h4 className="text-sm font-semibold text-gray-700 mb-1">Education:</h4>
                        <p className="text-gray-600 text-sm whitespace-pre-line">
                          {applicant.applicantId.profile.education}
                        </p>
                      </div>
                    )}

                    {/* Resume */}
                    {applicant.applicantId?.profile?.resumeUrl && (
                      <div className="mb-3">
                        <a
                          href={applicant.applicantId.profile.resumeUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium"
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
                              d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                            />
                          </svg>
                          View Resume
                        </a>
                      </div>
                    )}

                    <p className="text-sm text-gray-500">
                      Applied on {formatDate(applicant.appliedAt)}
                    </p>
                  </div>

                  {/* Status Dropdown */}
                  <div className="lg:w-48">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Update Status
                    </label>
                    <select
                      value={applicant.status}
                      onChange={(e) => handleStatusChange(applicant._id, e.target.value)}
                      disabled={updatingStatus[applicant._id]}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <option value="pending">Pending</option>
                      <option value="accepted">Accepted</option>
                      <option value="rejected">Rejected</option>
                    </select>
                    {updatingStatus[applicant._id] && (
                      <p className="text-xs text-gray-500 mt-1">Updating...</p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Applicants;
