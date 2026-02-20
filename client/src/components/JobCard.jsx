import { Link } from 'react-router-dom';

const JobCard = ({ job }) => {
    const formatSalary = (min, max) => {
        return `$${min.toLocaleString()} - $${max.toLocaleString()}`;
    };

    return (
        <div className="group relative bg-white/5 backdrop-blur-xl rounded-3xl p-8 border border-white/10 hover:border-purple-500/50 transition-all duration-500 hover:shadow-2xl hover:shadow-purple-500/20 overflow-hidden h-full flex flex-col">
            {/* Background Glow */}
            <div className="absolute -top-24 -right-24 w-48 h-48 bg-purple-600/10 rounded-full blur-3xl group-hover:bg-purple-600/20 transition-all duration-500"></div>

            <div className="relative z-10 flex flex-col flex-1">
                <div className="flex items-start justify-between mb-6">
                    <div className="bg-gradient-to-br from-purple-500/20 to-blue-500/20 p-4 rounded-2xl border border-white/10 group-hover:scale-110 transition-transform duration-500">
                        <svg className="w-8 h-8 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                    </div>
                    <span className="bg-white/10 backdrop-blur-md text-white/80 text-xs font-bold px-4 py-2 rounded-full border border-white/10">
                        {job.jobType || 'Full-time'}
                    </span>
                </div>

                <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-purple-400 transition-colors duration-300">
                    {job.title}
                </h3>

                <p className="text-gray-400 font-medium mb-6 flex items-center">
                    <span className="bg-purple-400/10 p-1 rounded-md mr-2">
                        <svg className="w-4 h-4 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                        </svg>
                    </span>
                    {job.company}
                </p>

                <div className="space-y-4 mb-8">
                    <div className="flex items-center text-gray-400 text-sm">
                        <svg className="w-5 h-5 mr-3 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        {job.location}
                    </div>
                    <div className="flex items-center text-gray-400 text-sm font-bold">
                        <svg className="w-5 h-5 mr-3 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span className="text-emerald-400">{formatSalary(job.salary.min, job.salary.max)}</span>
                    </div>
                </div>

                <div className="mt-auto pt-6 border-t border-white/10 flex items-center justify-between">
                    <Link
                        to={`/jobseeker/jobs/${job._id}`}
                        className="text-white font-bold hover:text-purple-400 transition-colors flex items-center group/link"
                    >
                        Learn More
                        <svg className="w-5 h-5 ml-2 transition-transform group-hover/link:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                        </svg>
                    </Link>
                    <Link
                        to={`/jobseeker/jobs/${job._id}`}
                        className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-3 rounded-2xl font-bold hover:scale-105 transition-all text-sm shadow-lg shadow-purple-500/20 active:scale-95"
                    >
                        Apply Now
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default JobCard;
