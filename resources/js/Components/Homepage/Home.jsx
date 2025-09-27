import { motion } from "framer-motion";

const letterVariant = {
    hidden: { opacity: 0, y: 20 },
    visible: (i) => ({
        opacity: 1,
        y: 0,
        transition: {
            delay: i * 0.05,
            duration: 0.5,
            ease: [0.25, 0.46, 0.45, 0.94],
        },
    }),
};

const AnimatedText = ({ text }) => (
    <motion.h1
        className="text-6xl sm:text-6xl md:text-7xl lg:text-[120px] font-extrabold font-montserrat
               bg-gradient-to-r from-[#0a2a66] via-[#6aa0ff] to-[#0a2a66]
               bg-clip-text text-transparent drop-shadow-2xl flex justify-center flex-wrap"
        initial="hidden"
        animate="visible"
    >
        {text.split("").map((char, index) => (
            <motion.span key={index} custom={index} variants={letterVariant} className="inline-block">
                {char === " " ? "\u00A0" : char}
            </motion.span>
        ))}
    </motion.h1>
);

const popVariant = (delay = 0) => ({
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
        opacity: 1,
        scale: 1,
        transition: {
            duration: 1.4,
            delay,
            ease: [0.16, 1, 0.3, 1],
        },
    },
});

const textPop = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: {
        opacity: 1,
        scale: 1,
        transition: {
            duration: 5.4,
            ease: [0, 0.71, 0.2, 1.01],
        },
    },
};

const Home = () => {
    return (
        <div className="relative overflow-x-hidden font-montserrat">

            {/* Animated Icon Cards */}
            {[
                { src: "/images/icon-request.png", top: "25%", left: "10%", rotate: 12, delay: 0.2 },
                { src: "/images/icon-folder.png", top: "20%", right: "10%", rotate: -12, delay: 0.4 },
                { src: "/images/icon-blotter.png", bottom: "20%", left: "12%", rotate: 15, delay: 0.6 },
                { src: "/images/icon-bookrecords.png", bottom: "15%", right: "12%", rotate: -15, delay: 0.8 },
            ].map((icon, idx) => (
                <motion.div
                    key={idx}
                    className="absolute p-2 sm:p-3 rounded-2xl backdrop-blur-lg bg-white/30 z-10 shadow-xl"
                    style={{
                        ...icon,
                        boxShadow: `${icon.rotate > 0 ? 10 : -10}px ${icon.rotate > 0 ? 10 : -10}px 25px rgba(0,0,0,0.2)`,
                    }}
                    variants={popVariant(icon.delay)}
                    initial="hidden"
                    animate="visible"
                >
                    <img src={icon.src} alt="" className="w-6 sm:w-8 md:w-10 lg:w-14" />
                </motion.div>
            ))}

            {/* Hero Section */}
            <section className="flex flex-col items-center justify-center min-h-screen text-center px-4 relative z-10">
                <motion.h6
                    className="inline-block px-4 py-1 rounded-xl text-2sm sm:text-xl md:text-xl lg:text-2xl font-bold font-montserrat text-[#093a7b] bg-white/30 backdrop-blur-md shadow-lg rotate-[-3deg]"
                    variants={textPop}
                    initial="hidden"
                    animate="visible"
                >
                    Welcome to
                </motion.h6>

                <AnimatedText text="ILAGAN CITY" />

                <motion.p
                    className="text-4xl sm:text-xl md:text-4xl lg:text-6xl pb-3 font-light font-montserrat text-[#093a7b]"
                    variants={textPop}
                    initial="hidden"
                    animate="visible"
                    transition={{ delay: 0.4 }}
                >
                    Barangay Information<br />
                    Management System
                </motion.p>

                <motion.p
                    className="text-sm sm:text-sm md:text-md lg:text-xl font-montserrat"
                    variants={textPop}
                    initial="hidden"
                    animate="visible"
                    transition={{ delay: 0.6 }}
                >
                    Empowering Communities Through Digital Innovation
                </motion.p>

                <motion.p
                    className="text-sm sm:text-sm md:text-md lg:text-xl font-montserrat"
                    variants={textPop}
                    initial="hidden"
                    animate="visible"
                    transition={{ delay: 1 }}
                >
                    A centralized system for efficient barangay management and seamless citizen engagement.
                </motion.p>
            </section>
            {/* Background Gradients / Glow */}
            <div
                className="absolute left-0 top-1/2 w-[50vw] h-[50vw] max-w-[500px] max-h-[500px] rounded-full opacity-90 -z-10 transform -translate-x-1/2"
                style={{
                    background:
                        "radial-gradient(circle, rgba(28, 100, 220, 0.9) 70%, rgba(28, 100, 220, 0.4) 70%, transparent 100%)",
                    filter: "blur(100px)",
                }}
            ></div>

            <div
                className="absolute right-0 top-0 w-[60vw] h-[60vw] max-w-[500px] max-h-[600px] rounded-full opacity-90 -z-10 transform translate-x-1/2"
                style={{
                    background:
                        "radial-gradient(circle, rgba(28, 100, 220, 0.85) 80%, rgba(28, 100, 220, 0.35) 30%, transparent 100%)",
                    filter: "blur(100px)",
                }}
            ></div>

            {/* Top Half Glow */}
            <div
                className="absolute top-0 left-1/2 w-[40vw] h-[20vw] max-w-[400px] max-h-[200px] -z-10 transform -translate-x-1/2 rounded-b-full opacity-75"
                style={{
                    background: "radial-gradient(circle, rgba(28, 100, 220, 0.6) 0%, rgba(28, 100, 220, 0.15) 100%)",
                    filter: "blur(80px)",
                }}
            ></div>

        </div>
    );
};

export default Home;
