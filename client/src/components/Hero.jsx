import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Hero = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const navigate = useNavigate();

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            navigate(`/jobseeker/jobs?skills=${encodeURIComponent(searchQuery)}`);
        } else {
            navigate('/jobseeker/jobs');
        }
    };

    return (
        <section className="flex flex-col items-center pb-48 pt-20 text-center text-sm text-white max-md:px-4 bg-[url('https://raw.githubusercontent.com/prebuiltui/prebuiltui/main/assets/hero/bg-image-grain.png')] bg-cover bg-center">
            {/* Social Proof */}
            <div className="flex flex-wrap items-center justify-center p-1.5 mt-10 rounded-full border border-slate-400/30 text-xs bg-black/10 backdrop-blur-sm animate-in fade-in slide-in-from-top duration-700">
                <div className="flex items-center">
                    <img className="size-7 rounded-full border-2 border-white"
                        src="https://images.unsplash.com/photo-1633332755192-727a05c4013d?q=80&w=50" alt="userImage1" />
                    <img className="size-7 rounded-full border-2 border-white -translate-x-2"
                        src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=50" alt="userImage2" />
                    <img className="size-7 rounded-full border-2 border-white -translate-x-4"
                        src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=50&h=50&auto=format&fit=crop"
                        alt="userImage3" />
                </div>
                <p className="-translate-x-2 text-slate-200">Join a community of 1m+ talented professionals </p>
            </div>

            {/* Headline */}
            <h1 className="font-berkshire text-[45px]/[52px] md:text-7xl/[80px] mt-8 max-w-4xl drop-shadow-xl">
                Empowering talent to work on their own terms.
            </h1>

            <p className="text-base md:text-lg mt-6 max-w-2xl text-slate-100 font-light leading-relaxed">
                Unlock flexible opportunities, thoughtful roles, and the freedom to build your career.
                No limitations, no compromises.
            </p>

            <p className="text-base mt-4 max-w-xl text-slate-200 italic">
                Secure your dream role today and unlock our premium career resources.
            </p>

            {/* Search Form */}
            <form onSubmit={handleSearch} className="flex items-center mt-12 max-w-xl h-16 w-full rounded-full border border-slate-50/20 bg-white/5 backdrop-blur-md shadow-2xl transition-all focus-within:border-white/50 group">
                <input
                    type="text"
                    placeholder="Enter skills, title or company..."
                    className="w-full h-full outline-none bg-transparent pl-8 pr-2 text-white placeholder:text-slate-300 rounded-full text-base"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
                <button type="submit" className="bg-white text-slate-800 hover:bg-indigo-600 hover:text-white text-nowrap px-8 md:px-10 h-12 mr-2 rounded-full font-bold transition-all transform active:scale-95 shadow-lg">
                    Search Jobs
                </button>
            </form>

            <div className="mt-10 flex items-center gap-6 opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
                <img src="https://raw.githubusercontent.com/prebuiltui/prebuiltui/main/assets/companyLogo/mark/google.png" className="h-6 w-auto" alt="Google" />
                <img src="https://raw.githubusercontent.com/prebuiltui/prebuiltui/main/assets/companyLogo/mark/meta.png" className="h-6 w-auto" alt="Meta" />
                <img src="https://raw.githubusercontent.com/prebuiltui/prebuiltui/main/assets/companyLogo/mark/netflix.png" className="h-6 w-auto" alt="Netflix" />
            </div>
        </section>
    );
};

export default Hero;
