import { useState, useEffect } from 'react';

const facts = [
    {
        title: "What are qAR Payments?",
        text: "qAR payments are a secure, fast, and decentralized way to transfer value on the blockchain using QR codes. They’re designed to make crypto transactions as easy as scanning a code!",
    },
    {
        title: "The Power of Decentralization",
        text: "qAR operates on a decentralized network, ensuring that transactions are secure, transparent, and free from central control, enhancing trust and reliability.",
    },
    {
        title: "Secure Transactions via QR Codes",
        text: "Simply scan a QR code to initiate a transaction. QR codes help ensure your transaction details are accurate, quick, and securely linked to your wallet.",
    },
];

const Home = () => {
    const [currentFactIndex, setCurrentFactIndex] = useState(0);
    const [isVisible, setIsVisible] = useState(true);

    useEffect(() => {
        // Interval to handle fade-out and fade-in transitions
        const interval = setInterval(() => {
            setIsVisible(false); // Start fade-out
            setTimeout(() => {
                setCurrentFactIndex((prevIndex) => (prevIndex + 1) % facts.length);
                setIsVisible(true); // Start fade-in
            }, 500); // Wait for fade-out to complete before switching text
        }, 8000); // Duration for each fact display (including fade effects)

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="min-h-[88vh] flex flex-col items-center justify-center overflow-hidden px-4">
            <div className="text-center max-w-2xl w-full">
                {/* Octagon Effect with Particle Web */}
                <div className="w-24 h-24 mx-auto mb-6 relative overflow-hidden">
                    {/* Octagon Animation */}
                    <div className="w-full h-full border-4 border-indigo-500 animate-spin-slow clip-octagon" />
                    {/* Particle Web */}
                    <div className="absolute inset-0">
                        {[...Array(8)].map((_, i) => (
                            <div
                                key={i}
                                className={`absolute w-1.5 h-1.5 bg-purple-500 rounded-full animate-pulse`}
                                style={{
                                    top: `${50 + 25 * Math.sin((i * Math.PI) / 4)}%`,
                                    left: `${50 + 25 * Math.cos((i * Math.PI) / 4)}%`,
                                    transform: 'translate(-50%, -50%)',
                                }}
                            />
                        ))}
                    </div>
                </div>
    
                <h1 className="text-4xl font-bold text-white mb-4">Welcome to Qbit Pay</h1>
                <p className="text-gray-300 text-lg mb-4">Your Decentralized Payment Solution</p>
    
                {/* Dashed Separator */}
                <hr className="w-3/4 mx-auto my-8 border-t border-dashed border-gray-500" />
    
                {/* Did You Know Section */}
                <div className="mt-8 w-full text-center">
                    <h2 className="text-3xl font-semibold text-white mb-6">Did You Know?</h2>
                    <div
                        className={`transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2'}`}
                        style={{ minHeight: '140px' }}
                    >
                        <h3 className="font-bold text-white mb-2">{facts[currentFactIndex].title}</h3>
                        <p className="text-gray-200 text-base leading-relaxed mx-auto max-w-md">
                            {facts[currentFactIndex].text}
                        </p>
                    </div>
    
                    {/* Pagination Dots */}
                    <div className="flex justify-center mt-2 space-x-2">
                        {facts.map((_, index) => (
                            <div
                                key={index}
                                className={`w-2 h-2 rounded-full ${index === currentFactIndex ? 'bg-indigo-500' : 'bg-gray-400'} transition-colors duration-300`}
                            ></div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
    
    
};

export default Home;
