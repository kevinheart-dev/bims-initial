// src/Pages/OverviewPage.jsx
const OverviewPage = () => {
    return (
        <div className="relative overflow-hidden bg-[#f8faff] font-montserrat">
            {/* Content Section */}
            <div className="relative z-10 flex flex-col items-center justify-center px-6 py-20 space-y-10">
                <h3 className="text-5xl sm:text-6xl md:text-7xl font-extrabold text-[#093a7b] text-center">
                    Ilagan City, Isabela
                </h3>

                <div className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="bg-white/40 backdrop-blur-md rounded-2xl shadow-md p-8 text-center text-[#093a7b]">
                        <h2 className="text-2xl font-semibold mb-4">City Overview</h2>
                        <p className="text-sm">
                            Ilagan City is the capital of Isabela Province, known for its rich cultural heritage,
                            agricultural economy, and progressive development. As a key center in the Cagayan Valley,
                            it continues to grow with strong governance, innovative digital systems, and a vibrant community.
                        </p>
                    </div>
                    <div className="bg-white/40 backdrop-blur-md rounded-2xl shadow-md p-8 text-center text-[#093a7b]">
                        <h2 className="text-2xl font-semibold mb-4">Fast Facts</h2>
                        <ul className="text-sm space-y-2">
                            <li>📍 Capital of Isabela Province</li>
                            <li>🌾 Major producer of corn and rice</li>
                            <li>👥 Population: Over 150,000 residents</li>
                            <li>🏛️ Established as a city in 2012</li>
                            <li>💡 Known as the “Corn Capital of the Philippines”</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OverviewPage;
