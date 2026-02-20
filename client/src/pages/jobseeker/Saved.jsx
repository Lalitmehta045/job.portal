import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from '../../api/axios';
import { Loading, ErrorMessage } from '../../components';

const Saved = () => {
  const [savedJobs, setSavedJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [removingJobId, setRemovingJobId] = useState(null);

  useEffect(() => {
    fetchSavedJobs();
  }, []);

  const fetchSavedJobs = async () => {
    try {
      setLoading(true);
      setError('');

      const response = await axios.get('/saved');
      setSavedJobs(response.data.savedJobs || []);
    } catch (err) {
      console.error('Failed to fetch saved jobs:', err);
      setError(err.response?.data?.message || 'Failed to load saved jobs');
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async (jobId) => {
    try {
      setRemovingJobId(jobId);
      setError('');

      await axios.delete(`/saved/${jobId}`);

      // Remove from local state
      setSavedJobs(savedJobs.filter(saved => saved.jobId._id !== jobId));
    } catch (err) {
      console.error('Failed to remove saved job:', err);
      setError(err.response?.data?.message || 'Failed to remove saved job');
    } finally {
      setRemovingJobId(null);
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

  const formatSalary = (min, max) => {
    return `$${min.toLocaleString()} - $${max.toLocaleString()}`;
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4">
        <div className="w-12 h-12 border-4 border-indigo-600/20 border-t-indigo-600 rounded-full animate-spin"></div>
        <p className="text-gray-500 font-medium">Loading your favorites...</p>
      </div>
    );
  }

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-10 duration-700">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl md:text-5xl font-berkshire text-white mb-4">Saved Jobs</h1>
          <p className="text-gray-400 text-lg">Your curated list of premium career opportunities.</p>
        </div>
        {!loading && (
          <div className="px-6 py-2 bg-indigo-600/10 border border-indigo-500/20 rounded-2xl text-indigo-400 font-bold text-sm tracking-wide">
            {savedJobs.length} SAVED OPPORTUNITIES
          </div>
        )}
      </header>

      {error && <ErrorMessage message={error} />}

      {savedJobs.length === 0 ? (
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-[44px] p-20 text-center">
          <div className="w-24 h-24 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-8 border border-white/5">
            <svg className="w-12 h-12 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>
          </div>
          <h3 className="text-3xl font-bold text-white mb-4">No saved jobs yet</h3>
          <p className="text-gray-400 text-lg mb-10 max-w-md mx-auto">Found something interesting? Save it to review later and build your dream career portfolio.</p>
          <Link
            to="/jobseeker/jobs"
            className="inline-flex items-center gap-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-10 py-4 rounded-full font-bold hover:scale-105 transition-all shadow-xl shadow-indigo-600/20 active:scale-95"
          >
            Explore Jobs
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {savedJobs.map((saved) => (
            <div
              key={saved._id}
              className="group relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-[32px] p-8 md:p-10 transition-all duration-500 hover:border-indigo-500/30 overflow-hidden"
            >
              {/* Background Glow */}
              <div className="absolute -top-24 -right-24 w-48 h-48 bg-indigo-600/5 rounded-full blur-3xl group-hover:bg-indigo-600/10 transition-all duration-500"></div>

              <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
                <div className="flex-1 space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-indigo-500/10 flex items-center justify-center text-indigo-400 group-hover:scale-110 transition-transform">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><path d="m9.09 9 1-1" /><path d="m14.91 15 1-1" /><circle cx="9" cy="9" r="1" /><circle cx="15" cy="15" r="1" /></svg>
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-white group-hover:text-indigo-400 transition-colors">
                        {saved.jobId?.title || 'N/A'}
                      </h3>
                      <p className="text-lg text-gray-400 font-medium">{saved.jobId?.company || 'N/A'}</p>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-6">
                    <div className="flex items-center gap-2 text-gray-500 text-sm">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                      {saved.jobId?.location || 'N/A'}
                    </div>
                    {saved.jobId?.salary && (
                      <div className="flex items-center gap-2 text-green-400 text-sm font-medium">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                        {formatSalary(saved.jobId.salary.min, saved.jobId.salary.max)}
                      </div>
                    )}
                    <div className="flex items-center gap-2 text-gray-500 text-sm">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                      Saved on {formatDate(saved.savedAt)}
                    </div>
                  </div>

                  {saved.jobId?.skillsRequired && saved.jobId.skillsRequired.length > 0 && (
                    <div className="flex flex-wrap gap-2 pt-2">
                      {saved.jobId.skillsRequired.slice(0, 4).map((skill, index) => (
                        <span key={index} className="px-3 py-1 bg-white/5 border border-white/10 rounded-lg text-xs font-semibold text-gray-300">
                          {skill}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-4">
                  <button
                    onClick={() => handleRemove(saved.jobId._id)}
                    disabled={removingJobId === saved.jobId._id}
                    className="w-full sm:w-auto px-6 py-4 rounded-2xl bg-red-500/10 text-red-500 font-bold hover:bg-red-500 hover:text-white transition-all active:scale-95 text-center min-w-[140px] border border-red-500/20"
                  >
                    {removingJobId === saved.jobId._id ? 'Removing...' : 'Remove'}
                  </button>
                  <Link
                    to={`/jobseeker/jobs/${saved.jobId?._id}`}
                    className="w-full sm:w-auto px-10 py-4 rounded-2xl bg-indigo-600 text-white font-bold hover:bg-indigo-500 transition-all shadow-lg shadow-indigo-600/20 active:scale-95 text-center min-w-[160px]"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Saved;
