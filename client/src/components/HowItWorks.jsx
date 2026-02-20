const HowItWorks = () => {
    const steps = [
        {
            id: 1,
            title: 'Create an Account',
            description: 'Sign up as a job seeker or employer to get started with our platform.',
            icon: (
                <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                </svg>
            ),
            glow: 'shadow-purple-500/50',
            bg: 'bg-purple-600/20 text-purple-400 border-purple-500/30'
        },
        {
            id: 2,
            title: 'Build Your Profile',
            description: 'Add your skills, experience, and resume to showcase your talent to employers.',
            icon: (
                <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
            ),
            glow: 'shadow-blue-500/50',
            bg: 'bg-blue-600/20 text-blue-400 border-blue-500/30'
        },
        {
            id: 3,
            title: 'Apply for Jobs',
            description: 'Search for jobs that match your expertise and apply with just one click.',
            icon: (
                <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
            ),
            glow: 'shadow-pink-500/50',
            bg: 'bg-pink-600/20 text-pink-400 border-pink-500/30'
        },
    ];

    return (
        <section className="py-32 bg-[#090025] relative">
            <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:60px_60px]"></div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="text-center mb-24">
                    <h2 className="font-berkshire text-4xl md:text-6xl text-white mb-6">How It Works</h2>
                    <p className="mt-4 text-lg text-gray-400 max-w-2xl mx-auto">
                        Getting your next job or hire is simpler, faster, and more efficient with our premium end-to-end recruitment platform.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-16 md:gap-8">
                    {steps.map((step, index) => (
                        <div key={step.id} className="group relative text-center">
                            {/* Connector Line */}
                            {index < steps.length - 1 && (
                                <div className="hidden md:block absolute top-[50px] left-[60%] w-[80%] h-[2px] bg-gradient-to-r from-purple-500/50 to-blue-500/50 -z-0"></div>
                            )}

                            <div className={`mx-auto w-24 h-24 ${step.bg} rounded-3xl border flex items-center justify-center shadow-2xl ${step.glow} mb-10 transition-all duration-500 group-hover:scale-110 group-hover:-translate-y-2 relative z-10 overflow-hidden`}>
                                <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                {step.icon}
                            </div>

                            <div className="absolute -top-4 -left-4 text-8xl font-black text-white/5 font-primary select-none group-hover:text-white/10 transition-colors">
                                0{step.id}
                            </div>

                            <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-purple-400 transition-colors duration-300">
                                {step.title}
                            </h3>
                            <p className="text-gray-400 text-lg leading-relaxed px-4">
                                {step.description}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default HowItWorks;
