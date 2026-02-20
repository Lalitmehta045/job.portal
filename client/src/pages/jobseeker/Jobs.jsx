import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from '../../api/axios';
import { Loading, ErrorMessage, Input, Select, JobCard } from '../../components';

const Jobs = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Filter state
  const [filters, setFilters] = useState({
    location: '',
    skills: '',
    minSalary: '',
    maxSalary: '',
    company: '',
  });

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async (filterParams = {}) => {
    try {
      setLoading(true);
      setError('');

      const queryParams = new URLSearchParams();
      Object.keys(filterParams).forEach((key) => {
        if (filterParams[key]) {
          queryParams.append(key, filterParams[key]);
        }
      });

      const response = await axios.get(`/jobs?${queryParams.toString()}`);
      setJobs(response.data.jobs || []);
    } catch (err) {
      console.error('Failed to fetch jobs:', err);
      setError(err.response?.data?.message || 'Failed to load jobs');
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleApplyFilters = (e) => {
    e.preventDefault();
    fetchJobs(filters);
  };

  const handleClearFilters = () => {
    setFilters({
      location: '',
      skills: '',
      minSalary: '',
      maxSalary: '',
      company: '',
    });
    fetchJobs();
  };

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-10 duration-700">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl md:text-5xl font-berkshire text-white mb-4">Browse Jobs</h1>
          <p className="text-gray-400 text-lg">Explore premium opportunities from world-class industry leaders.</p>
        </div>
        {!loading && (
          <div className="px-6 py-2 bg-indigo-600/10 border border-indigo-500/20 rounded-2xl text-indigo-400 font-bold text-sm tracking-wide">
            {jobs.length} OPPORTUNITIES FOUND
          </div>
        )}
      </header>

      {error && <ErrorMessage message={error} />}

      {/* Filter Form - Premium Glassmorphism */}
      <div className="relative group">
        <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-[32px] blur opacity-10 group-hover:opacity-20 transition duration-1000"></div>
        <div className="relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-[32px] p-8 md:p-10">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-1.5 h-6 bg-indigo-600 rounded-full"></div>
            <h2 className="text-xl font-bold text-white">Find Your Perfect Match</h2>
          </div>

          <form onSubmit={handleApplyFilters} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-widest ml-1">Location</label>
                <div className="relative">
                  <div className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-500">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" /><circle cx="12" cy="10" r="3" /></svg>
                  </div>
                  <input
                    name="location"
                    value={filters.location}
                    onChange={handleFilterChange}
                    placeholder="e.g. Remote, NY"
                    className="w-full bg-white/5 border border-white/10 focus:border-indigo-500/50 rounded-2xl py-4 pl-12 pr-6 text-white placeholder-white/20 outline-none transition-all"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-widest ml-1">Skills</label>
                <div className="relative">
                  <div className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-500">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" /></svg>
                  </div>
                  <input
                    name="skills"
                    value={filters.skills}
                    onChange={handleFilterChange}
                    placeholder="e.g. React, Python"
                    className="w-full bg-white/5 border border-white/10 focus:border-indigo-500/50 rounded-2xl py-4 pl-12 pr-6 text-white placeholder-white/20 outline-none transition-all"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-widest ml-1">Company</label>
                <div className="relative">
                  <div className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-500">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21V5a2 2 0 0 0-2-2H7a2 2 0 0 0-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
                  </div>
                  <input
                    name="company"
                    value={filters.company}
                    onChange={handleFilterChange}
                    placeholder="e.g. Google, Apple"
                    className="w-full bg-white/5 border border-white/10 focus:border-indigo-500/50 rounded-2xl py-4 pl-12 pr-6 text-white placeholder-white/20 outline-none transition-all"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-widest ml-1">Salary Range</label>
                <div className="flex items-center gap-4">
                  <div className="relative flex-1">
                    <div className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-500 font-bold">$</div>
                    <input
                      type="number"
                      name="minSalary"
                      value={filters.minSalary}
                      onChange={handleFilterChange}
                      placeholder="Min"
                      className="w-full bg-white/5 border border-white/10 focus:border-indigo-500/50 rounded-2xl py-4 pl-10 pr-4 text-white placeholder-white/20 outline-none transition-all"
                    />
                  </div>
                  <div className="text-gray-600">—</div>
                  <div className="relative flex-1">
                    <div className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-500 font-bold">$</div>
                    <input
                      type="number"
                      name="maxSalary"
                      value={filters.maxSalary}
                      onChange={handleFilterChange}
                      placeholder="Max"
                      className="w-full bg-white/5 border border-white/10 focus:border-indigo-500/50 rounded-2xl py-4 pl-10 pr-4 text-white placeholder-white/20 outline-none transition-all"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 pt-4 border-t border-white/5">
              <button
                type="submit"
                className="flex-1 bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-8 py-4 rounded-2xl font-bold hover:scale-[1.02] transition-all shadow-lg shadow-indigo-600/20 active:scale-95"
              >
                Apply Filters
              </button>
              <button
                type="button"
                onClick={handleClearFilters}
                className="px-8 py-4 rounded-2xl bg-white/5 border border-white/10 text-gray-400 hover:text-white hover:bg-white/10 transition-all active:scale-95 font-bold"
              >
                Reset
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Jobs List */}
      <div className="space-y-6">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <div className="w-12 h-12 border-4 border-indigo-600/20 border-t-indigo-600 rounded-full animate-spin"></div>
            <p className="text-gray-500 font-medium">Curating opportunities...</p>
          </div>
        ) : jobs.length === 0 ? (
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-[44px] p-20 text-center">
            <div className="w-24 h-24 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-8 border border-white/5">
              <svg className="w-12 h-12 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
            </div>
            <h3 className="text-3xl font-bold text-white mb-4">No results found</h3>
            <p className="text-gray-400 text-lg mb-10 max-w-md mx-auto">We couldn't find any jobs matching your current filters. Try adjusting your criteria or search across all jobs.</p>
            <button
              onClick={handleClearFilters}
              className="px-10 py-4 bg-white/5 border border-white/10 text-white rounded-full font-bold hover:bg-white/10 transition-all"
            >
              Clear all filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {jobs.map((job) => (
              <JobCard key={job._id} job={job} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Jobs;
