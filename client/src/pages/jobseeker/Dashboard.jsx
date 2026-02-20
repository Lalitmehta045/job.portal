import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from '../../api/axios';
import { Loading, ErrorMessage } from '../../components';

const Dashboard = () => {
  const [stats, setStats] = useState({
    savedJobsCount: 0,
    applicationsCount: 0,
  });
  const [recentApplications, setRecentApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError('');

      const [savedJobsRes, applicationsRes] = await Promise.all([
        axios.get('/saved'),
        axios.get('/my-applications'),
      ]);

      const savedJobs = savedJobsRes.data.savedJobs || [];
      const applications = applicationsRes.data.applications || [];

      setStats({
        savedJobsCount: savedJobs.length,
        applicationsCount: applications.length,
      });

      setRecentApplications(applications.slice(0, 5));
    } catch (err) {
      console.error('Failed to fetch dashboard data:', err);
      setError(err.response?.data?.message || 'Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const getStatusStyles = (status) => {
    switch (status) {
      case 'accepted':
        return 'bg-green-500/10 text-green-400 border-green-500/20';
      case 'rejected':
        return 'bg-red-500/10 text-red-400 border-red-500/20';
      case 'pending':
      default:
        return 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20';
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

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-10 duration-700">
      <header>
        <h1 className="text-4xl md:text-5xl font-berkshire text-white mb-4">Job Seeker Dashboard</h1>
        <p className="text-gray-400 text-lg">Track your career progress and manage applications effortlessly.</p>
      </header>

      {error && <ErrorMessage message={error} />}

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="group relative bg-white/5 backdrop-blur-xl rounded-[32px] p-8 border border-white/10 hover:border-blue-500/50 transition-all duration-500">
          <div className="absolute -top-12 -right-12 w-32 h-32 bg-blue-600/10 rounded-full blur-3xl group-hover:bg-blue-600/20 transition-all"></div>

          <div className="relative z-10 flex items-center justify-between">
            <div className="space-y-2">
              <p className="text-gray-400 font-medium tracking-wide uppercase text-xs">Total Saved Jobs</p>
              <h3 className="text-5xl font-bold text-white">{stats.savedJobsCount}</h3>
            </div>
            <div className="p-5 rounded-3xl bg-blue-600/10 text-blue-400 border border-blue-500/20 group-hover:scale-110 transition-transform duration-500">
              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" /></svg>
            </div>
          </div>
          <Link
            to="/jobseeker/saved"
            className="mt-8 inline-flex items-center gap-2 text-blue-400 hover:text-blue-300 font-bold transition-colors group/btn"
          >
            Manage Saved Jobs
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></svg>
          </Link>
        </div>

        <div className="group relative bg-white/5 backdrop-blur-xl rounded-[32px] p-8 border border-white/10 hover:border-purple-500/50 transition-all duration-500">
          <div className="absolute -top-12 -right-12 w-32 h-32 bg-purple-600/10 rounded-full blur-3xl group-hover:bg-purple-600/20 transition-all"></div>

          <div className="relative z-10 flex items-center justify-between">
            <div className="space-y-2">
              <p className="text-gray-400 font-medium tracking-wide uppercase text-xs">Applications Sent</p>
              <h3 className="text-5xl font-bold text-white">{stats.applicationsCount}</h3>
            </div>
            <div className="p-5 rounded-3xl bg-purple-600/10 text-purple-400 border border-purple-500/20 group-hover:scale-110 transition-transform duration-500">
              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M22 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>
            </div>
          </div>
          <Link
            to="/jobseeker/applied"
            className="mt-8 inline-flex items-center gap-2 text-purple-400 hover:text-purple-300 font-bold transition-colors group/btn"
          >
            Track Applications
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></svg>
          </Link>
        </div>
      </div>

      {/* Recent Applications Section */}
      <section className="relative">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold text-white flex items-center gap-3">
            <span className="w-2 h-8 bg-indigo-600 rounded-full"></span>
            Recent Applications
          </h2>
          {recentApplications.length > 0 && (
            <Link to="/jobseeker/applied" className="text-gray-400 hover:text-white transition-colors text-sm font-medium">View All</Link>
          )}
        </div>

        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-[40px] overflow-hidden p-2">
          {recentApplications.length === 0 ? (
            <div className="text-center py-20 px-4">
              <div className="w-24 h-24 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6 border border-white/5">
                <svg className="w-10 h-10 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M9 12h6m-6 4h6m2 5H7a2 2 0 0 1-2-2V5a2 2 0 0 12-2h5.586a1 1 0 0 1.707.293l5.414 5.414a1 1 0 0 1.293.707V19a2 2 0 0 1-2 2z" /></svg>
              </div>
              <p className="text-gray-400 text-lg mb-8">Ready to land your dream job?</p>
              <Link
                to="/jobseeker/jobs"
                className="inline-flex items-center gap-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-10 py-4 rounded-full font-bold hover:scale-105 transition-all shadow-xl shadow-indigo-600/20 active:scale-95"
              >
                Browse Latest Jobs
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" /></svg>
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-white/5">
              {recentApplications.map((application) => (
                <div
                  key={application._id}
                  className="group flex flex-col sm:flex-row sm:items-center justify-between p-8 hover:bg-white/5 transition-all duration-300"
                >
                  <div className="flex items-center gap-6">
                    <div className="w-16 h-16 rounded-2xl bg-indigo-500/10 flex items-center justify-center text-indigo-400 group-hover:scale-110 transition-transform">
                      <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 7V5a2 2 0 0 1 2-2h2" /><path d="M17 3h2a2 2 0 0 1 2 2v2" /><path d="M21 17v2a2 2 0 0 1-2 2h-2" /><path d="M7 21H5a2 2 0 0 1-2-2v-2" /><rect width="7" height="5" x="7" y="7" rx="1" /><rect width="7" height="5" x="10" y="12" rx="1" /></svg>
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white group-hover:text-indigo-400 transition-colors">
                        {application.jobId?.title || 'N/A'}
                      </h3>
                      <div className="flex flex-wrap items-center gap-4 text-gray-500 text-sm mt-1">
                        <span className="flex items-center gap-1.5">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M19 21V5a2 2 0 0 0-2-2H7a2 2 0 0 0-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
                          {application.jobId?.company || 'N/A'}
                        </span>
                        <span className="w-1 h-1 bg-gray-700 rounded-full"></span>
                        <span>{formatDate(application.appliedAt)}</span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 sm:mt-0 flex items-center gap-6">
                    <span className={`px-4 py-1.5 rounded-full text-xs font-bold border tracking-wider uppercase ${getStatusStyles(application.status)}`}>
                      {application.status}
                    </span>
                    <Link
                      to={`/jobseeker/jobs/${application.jobId?._id}`}
                      className="p-3 rounded-2xl bg-white/5 border border-white/10 text-gray-400 hover:text-white hover:bg-white/10 transition-all active:scale-95"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" /><circle cx="12" cy="12" r="3" /></svg>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Dashboard;
