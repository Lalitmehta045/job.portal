import { useState, useEffect } from 'react';
import axios from '../api/axios';
import { Hero, CategorySection, HowItWorks, Footer, JobCard, Loading, Navbar } from '../components';

const Home = () => {
    const [featuredJobs, setFeaturedJobs] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchFeaturedJobs = async () => {
            try {
                const response = await axios.get('/jobs?limit=3');
                setFeaturedJobs(response.data.jobs || []);
            } catch (error) {
                console.error('Error fetching featured jobs:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchFeaturedJobs();
    }, []);

    return (
        <div className="min-h-screen bg-[#050015]">
            <Navbar />
            <Hero />
            <CategorySection />

            {/* Featured Jobs Section */}
            <section className="py-32 relative overflow-hidden">
                {/* Background Ambient Light */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-[800px] bg-blue-600/5 rounded-full blur-[150px] -z-0"></div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="flex flex-col md:flex-row md:items-end justify-between mb-20">
                        <div className="animate-in fade-in slide-in-from-left duration-700">
                            <h2 className="font-berkshire text-4xl md:text-6xl text-white mb-6">Featured Jobs</h2>
                            <p className="mt-4 text-xl text-gray-400 max-w-xl">
                                Hand-picked premium opportunities from world-class industry leaders.
                            </p>
                        </div>
                        <button className="mt-8 md:mt-0 relative inline-flex items-center justify-center p-0.5 overflow-hidden text-sm font-bold text-white rounded-2xl group bg-gradient-to-br from-purple-600 to-blue-500 hover:text-white transition-all hover:scale-105 active:scale-95 shadow-lg shadow-blue-500/20">
                            <span className="relative px-8 py-3.5 transition-all ease-in duration-75 bg-gray-900 rounded-[14px] group-hover:bg-opacity-0">
                                Browse All Jobs
                                <svg className="w-5 h-5 ml-2 inline-block transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                </svg>
                            </span>
                        </button>
                    </div>

                    {loading ? (
                        <div className="py-20 flex justify-center">
                            <Loading />
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                            {featuredJobs.length > 0 ? (
                                featuredJobs.map((job, index) => (
                                    <div key={job._id} className="animate-in fade-in slide-in-from-bottom duration-700" style={{ animationDelay: `${index * 150}ms` }}>
                                        <JobCard job={job} />
                                    </div>
                                ))
                            ) : (
                                <div className="col-span-full text-center py-24 bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10">
                                    <p className="text-gray-400 text-xl font-medium">No featured jobs available at the moment.</p>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </section>

            <HowItWorks />

            {/* Call to Action Section - Premium Grain Textured */}
            <section className="py-32 px-4 relative">
                <div className="max-w-7xl mx-auto">
                    <div className="relative overflow-hidden rounded-[40px] bg-gradient-to-br from-indigo-900 via-purple-900 to-indigo-900 px-8 py-24 md:px-16 md:py-32 shadow-2xl shadow-purple-500/20 border border-white/10">
                        {/* Grain Texture Overlay */}
                        <div className="absolute inset-0 opacity-20 pointer-events-none mix-blend-overlay" style={{ backgroundImage: 'url("https://grainy-gradients.vercel.app/noise.svg")' }}></div>

                        {/* Abstract Glows */}
                        <div className="absolute -top-24 -left-24 w-96 h-96 bg-blue-500/30 rounded-full blur-[100px]"></div>
                        <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-purple-500/30 rounded-full blur-[100px]"></div>

                        <div className="relative z-10 max-w-4xl mx-auto text-center">
                            <h2 className="font-berkshire text-4xl md:text-7xl text-white mb-8 leading-tight">
                                Ready to Take the <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">Next Step?</span>
                            </h2>
                            <p className="text-xl md:text-2xl text-indigo-100/80 mb-12 leading-relaxed">
                                Join thousands of elite professionals who have found their dream careers through our globally recognized platform.
                            </p>
                            <div className="flex flex-col sm:flex-row justify-center items-center gap-6">
                                <button className="w-full sm:w-auto bg-white text-indigo-950 font-black py-5 px-12 rounded-2xl hover:bg-indigo-50 transition-all transform hover:scale-105 active:scale-95 shadow-2xl text-lg">
                                    Get Started Now
                                </button>
                                <button className="w-full sm:w-auto bg-transparent text-white font-bold py-5 px-12 rounded-2xl border-2 border-white/20 hover:bg-white/10 transition-all transform hover:scale-105 active:scale-95 text-lg">
                                    Post a Job
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
};

export default Home;
