import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { MessageCircle, Shield, Zap, ArrowRight, UserPlus, LogIn, ExternalLink } from "lucide-react";
import Footer from "../components/Footer";
import { APP_LOGO } from "../config";

const LandingPage = () => {
    return (
        <div className="min-h-screen w-full bg-[#f0f9ff] relative overflow-x-hidden overflow-y-auto text-slate-800 flex flex-col font-['Outfit']">
            {/* Background Decorative Elements */}
            <div className="fixed inset-0 -z-10 bg-mesh">
                <div className="absolute w-full h-full opacity-10 bg-[radial-gradient(#6366f1_1px,transparent_1px)] [background-size:40px_40px]"></div>
            </div>

            {/* Navbar */}
            <nav className="sticky top-0 z-[1000] flex justify-between items-center px-[5%] lg:px-[10%] py-4 bg-white/10 backdrop-blur-xl border-b border-white/20 shadow-[0_8px_32px_0_rgba(31,38,135,0.07)]">
                <Link to="/" className="flex items-center gap-2 md:gap-3 group">
                    <div className="relative">
                        <img src={APP_LOGO} alt="Logo" className="w-10 h-10 md:w-14 md:h-14 object-contain drop-shadow-[0_0_15px_rgba(99,102,241,0.3)] group-hover:scale-110 transition-transform duration-300" />
                        <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full -z-10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    </div>
                    <h1 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight">Ping<span className="text-primary italic">Me</span></h1>
                </Link>

                <div className="flex items-center gap-3 sm:gap-6">
                    <div className="hidden lg:flex items-center gap-8 mr-4">
                        <Link to="/features" className="font-bold text-slate-600 hover:text-primary transition-all hover:-translate-y-0.5">Features</Link>
                        <Link to="/security" className="font-bold text-slate-600 hover:text-primary transition-all hover:-translate-y-0.5">Security</Link>
                        <Link to="/about" className="font-bold text-slate-600 hover:text-primary transition-all hover:-translate-y-0.5">About</Link>
                    </div>

                    <div className="flex items-center gap-2 sm:gap-4">
                        <Link to="/login" className="px-4 py-2 md:px-6 md:py-2.5 rounded-full font-bold text-slate-700 bg-white/40 backdrop-blur-md border border-white/50 shadow-lg hover:bg-white/60 hover:shadow-xl hover:-translate-y-0.5 active:scale-95 transition-all text-xs md:text-sm">
                            Log In
                        </Link>
                        <Link to="/register" className="px-5 py-2 md:px-8 md:py-2.5 bg-gradient-to-r from-primary to-secondary text-white rounded-full font-bold shadow-[0_10px_25px_-5px_rgba(99,102,241,0.4)] hover:shadow-[0_15px_30px_-5px_rgba(99,102,241,0.6)] hover:scale-105 active:scale-95 transition-all text-xs md:text-sm border border-white/20">
                            Get Started
                        </Link>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <header className="text-center mt-10 md:mt-[5vh] px-5 max-w-5xl mx-auto">
                <motion.h2 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-slate-900 mb-6 leading-[1.1] tracking-tight"
                >
                    Connect <span className="text-primary italic">Instantly</span>, <br className="hidden sm:block" /> Share <span className="text-secondary italic">Seamlessly</span>.
                </motion.h2>
                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="text-sm sm:text-base md:text-lg lg:text-xl text-slate-500 max-w-[700px] mx-auto leading-relaxed"
                >
                    Experience secure, real-time messaging with anyone, anywhere. No delays, just flow.
                </motion.p>
            </header>

            {/* Main Interactive Content */}
            <main className="flex-1 px-[5%] lg:px-[8%] py-12 flex justify-center">
                <div className="grid grid-cols-1 lg:grid-cols-[1fr_1fr_1.2fr] gap-12 lg:gap-10 items-center w-full max-w-[1400px]">
                    {/* Left Illustration (Reordered for mobile focus) */}
                    <div className="relative order-1 lg:order-1 flex justify-center lg:block">
                        <motion.div 
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ duration: 1 }}
                            className="relative w-full max-w-[500px] lg:max-w-none"
                        >
                            <img src="/chat-illustration.png" alt="Chat Presentation" className="w-full drop-shadow-[0_40px_80px_rgba(0,0,0,0.15)]" />
                            {/* Decorative Chat Bubbles */}
                            <motion.div animate={{ x: [0, 5, 0], y: [0, -5, 0] }} transition={{ duration: 3, repeat: Infinity }} className="absolute -top-4 -right-2 bg-primary text-white px-4 py-2 rounded-2xl text-[10px] sm:text-xs font-bold shadow-lg border border-white/20 whitespace-nowrap">
                                Hi, how are you?
                            </motion.div>
                            <motion.div animate={{ x: [0, -5, 0], y: [0, 5, 0] }} transition={{ duration: 4, repeat: Infinity }} className="absolute -bottom-2 -left-2 bg-white px-4 py-2 rounded-2xl text-[10px] sm:text-xs font-bold shadow-lg border-l-4 border-l-secondary text-slate-600 whitespace-nowrap">
                                typing...
                            </motion.div>
                        </motion.div>
                    </div>

                    {/* Center Floating Cards */}
                    <div className="flex flex-col sm:flex-row lg:flex-col gap-6 order-3 lg:order-2 justify-center items-center">
                        <motion.div 
                            animate={{ y: [0, -15, 0] }}
                            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                            className="bg-white/90 backdrop-blur-sm p-6 sm:p-8 w-full max-w-[240px] text-center shadow-[0_20px_40px_rgba(0,0,0,0.06)] border-2 border-primary rounded-[40px] hover:shadow-xl transition-shadow"
                        >
                            <h3 className="text-xl font-black mb-4 tracking-wider uppercase text-slate-800">REGISTRATION</h3>
                            <Link to="/register" className="inline-flex items-center gap-2 bg-slate-50 px-4 py-2.5 rounded-full text-xs font-bold border border-slate-200 hover:bg-white transition-colors">
                                <span className="w-6 h-6 bg-primary text-white rounded-full flex items-center justify-center text-[10px]">R</span>
                                Click to Register
                            </Link>
                        </motion.div>

                        <motion.div 
                            animate={{ y: [0, 15, 0] }}
                            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                            className="bg-white/90 backdrop-blur-sm p-6 sm:p-8 w-full max-w-[240px] text-center shadow-[0_20px_40px_rgba(0,0,0,0.06)] border-2 border-secondary rounded-[40px] hover:shadow-xl transition-shadow"
                        >
                            <h3 className="text-xl font-black mb-4 tracking-wider uppercase text-slate-800">LOGIN</h3>
                            <Link to="/login" className="inline-flex items-center gap-2 bg-slate-50 px-4 py-2.5 rounded-full text-xs font-bold border border-slate-200 hover:bg-white transition-colors">
                                <span className="w-6 h-6 bg-secondary text-white rounded-full flex items-center justify-center text-[10px]">L</span>
                                Click to Login
                            </Link>
                        </motion.div>
                    </div>

                    {/* Right Form Card */}
                    <div className="flex justify-center order-2 lg:order-3">
                        <div className="bg-white/80 md:bg-white/85 backdrop-blur-xl p-8 sm:p-10 rounded-[32px] shadow-[0_40px_80px_-15px_rgba(0,0,0,0.12)] border border-white relative w-full max-w-[400px]">
                            <span className="text-xs text-slate-500 font-bold block mb-1 tracking-wider">Join Today - It's Free!</span>
                            <h2 className="text-2xl sm:text-3xl font-black mb-8 text-slate-900 uppercase">PING NOW</h2>
                            <form className="space-y-4">
                                <input type="email" placeholder="Email Address" className="w-full p-4 rounded-xl border border-slate-200 bg-slate-50 outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm" />
                                <input type="password" placeholder="Password" className="w-full p-4 rounded-xl border border-slate-200 bg-slate-50 outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm" />
                                <button type="submit" className="w-full p-4 bg-primary text-white rounded-xl font-bold text-base shadow-lg shadow-primary/20 hover:brightness-105 active:scale-[0.98] transition-all">Get Started</button>
                                <a href="#" className="block text-center text-slate-400 text-xs font-semibold hover:text-primary transition-colors">Forgot Password?</a>
                            </form>
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default LandingPage;
