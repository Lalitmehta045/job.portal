import { Link } from 'react-router-dom';
import logo from '../assets/logo_job.png';

const Footer = () => {
    return (
        <footer className="bg-[#050015] text-white pt-24 pb-12 border-t border-white/5 relative overflow-hidden">
            {/* Ambient Background Light */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-purple-600/5 rounded-full blur-[150px] -z-0"></div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-20">
                    <div className="space-y-6">
                        <Link to="/" className="inline-block transform hover:scale-105 transition-transform duration-300">
                            <img src={logo} alt="Job Portal Logo" className="h-16 w-auto drop-shadow-sm" />
                        </Link>
                        <p className="text-gray-400 leading-relaxed text-lg max-w-xs">
                            Connecting world-class talent with industry-leading companies through a futuristic recruitment experience.
                        </p>
                        <div className="flex space-x-4">
                            {['facebook', 'twitter', 'linkedin', 'instagram'].map((social) => (
                                <button key={social} className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-purple-600 hover:border-purple-600 transition-all duration-300 group">
                                    <span className="sr-only">{social}</span>
                                    <div className="w-5 h-5 bg-gray-400 group-hover:bg-white transition-colors mask-icon" style={{ WebkitMaskImage: `url(/icons/${social}.svg)`, maskImage: `url(/icons/${social}.svg)` }}></div>
                                </button>
                            ))}
                        </div>
                    </div>

                    <div>
                        <h3 className="text-xl font-bold mb-8 text-white relative inline-block">
                            For Job Seekers
                            <span className="absolute -bottom-2 left-0 w-8 h-1 bg-purple-500 rounded-full"></span>
                        </h3>
                        <ul className="space-y-4">
                            {['Browse Jobs', 'Career Dashboard', 'Applications', 'My Profile'].map((item) => (
                                <li key={item}>
                                    <Link to={`/jobseeker/${item.toLowerCase().replace(' ', '-')}`} className="text-gray-400 hover:text-purple-400 hover:translate-x-2 transition-all duration-300 flex items-center">
                                        <svg className="w-4 h-4 mr-2 opacity-0 group-hover:opacity-100 transition-opacity" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                                        </svg>
                                        {item}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div>
                        <h3 className="text-xl font-bold mb-8 text-white relative inline-block">
                            For Employers
                            <span className="absolute -bottom-2 left-0 w-8 h-1 bg-blue-500 rounded-full"></span>
                        </h3>
                        <ul className="space-y-4">
                            {['Post a Job', 'Employer Dashboard', 'Candidate Search'].map((item) => (
                                <li key={item}>
                                    <Link to={`/employer/${item.toLowerCase().replace(' ', '-')}`} className="text-gray-400 hover:text-blue-400 hover:translate-x-2 transition-all duration-300 flex items-center">
                                        {item}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div>
                        <h3 className="text-xl font-bold mb-8 text-white relative inline-block">
                            Get In Touch
                            <span className="absolute -bottom-2 left-0 w-8 h-1 bg-emerald-500 rounded-full"></span>
                        </h3>
                        <ul className="space-y-6">
                            <li className="flex items-start group">
                                <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center mr-4 group-hover:bg-purple-500 transition-all duration-300">
                                    <svg className="w-5 h-5 text-purple-400 group-hover:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                    </svg>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500 mb-1">Email us</p>
                                    <a href="mailto:support@jobportal.com" className="text-gray-300 hover:text-white transition-colors">support@jobportal.com</a>
                                </div>
                            </li>
                            <li className="flex items-start group">
                                <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center mr-4 group-hover:bg-blue-500 transition-all duration-300">
                                    <svg className="w-5 h-5 text-blue-400 group-hover:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                    </svg>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500 mb-1">Call us</p>
                                    <a href="tel:+15551234567" className="text-gray-300 hover:text-white transition-colors">+1 (555) 123-4567</a>
                                </div>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0 text-sm">
                    <p className="text-gray-500 font-medium">© {new Date().getFullYear()} Job Portal. Crafted for Excellence.</p>
                    <div className="flex space-x-10">
                        {['Privacy Policy', 'Terms of Service', 'Cookie Policy'].map((item) => (
                            <a key={item} href="#" className="text-gray-500 hover:text-purple-400 transition-colors duration-300 font-medium">{item}</a>
                        ))}
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
