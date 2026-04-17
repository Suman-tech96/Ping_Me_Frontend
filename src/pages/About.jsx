import React from "react";
import { Link } from "react-router-dom";
import { MessageCircle, Heart, Globe, Award } from "lucide-react";
import Footer from "../components/Footer";

const About = () => {
    return (
        <div className="min-h-screen w-full bg-[#f0f9ff] relative overflow-x-hidden overflow-y-auto text-slate-800 flex flex-col font-['Outfit']">
            {/* Background */}
            <div className="fixed inset-0 -z-10 bg-mesh opacity-50"></div>

            <nav className="sticky top-0 z-[1000] flex justify-between items-center px-[5%] lg:px-[10%] py-4 bg-white/10 backdrop-blur-xl border-b border-white/20 shadow-[0_8px_32px_0_rgba(31,38,135,0.07)]">
                <Link to="/" className="flex items-center gap-2 md:gap-3 group">
                    <img src="/src/assets/pingme_logo-photoroom.png" alt="Logo" className="w-10 h-10 md:w-14 md:h-14 object-contain group-hover:scale-110 transition-transform duration-300" />
                    <h1 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight">Ping<span className="text-primary italic">Me</span></h1>
                </Link>

                <div className="flex items-center gap-3 sm:gap-6">
                    <div className="hidden lg:flex items-center gap-8 mr-4">
                        <Link to="/features" className="font-bold text-slate-600 hover:text-primary transition-all hover:-translate-y-0.5">Features</Link>
                        <Link to="/security" className="font-bold text-slate-600 hover:text-primary transition-all hover:-translate-y-0.5">Security</Link>
                        <Link to="/about" className="font-bold text-primary transition-all underline underline-offset-8 decoration-2">About</Link>
                    </div>

                    <div className="flex items-center gap-2 sm:gap-4">
                        <Link to="/login" className="px-4 py-2 md:px-6 md:py-2.5 rounded-full font-bold text-slate-700 bg-white/40 backdrop-blur-md border border-white/50 shadow-lg hover:bg-white/60 hover:shadow-xl hover:-translate-y-0.5 active:scale-95 transition-all text-xs md:text-sm">
                            Log In
                        </Link>
                        <Link to="/register" className="px-5 py-2 md:px-8 md:py-2.5 bg-gradient-to-r from-primary to-secondary text-white rounded-full font-bold shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 transition-all text-xs md:text-sm border border-white/20">
                            Get Started
                        </Link>
                    </div>
                </div>
            </nav>

            <main className="flex-1 px-[5%] lg:px-[8%] py-12 md:py-16 max-w-[1200px] mx-auto w-full">
                <header className="text-center mb-12 md:mb-16">
                    <h1 className="text-3xl sm:text-5xl md:text-6xl font-black mb-5 leading-tight">About <br className="hidden sm:block"/><span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">PingMe</span></h1>
                    <p className="text-sm sm:text-base md:text-lg text-slate-500 max-w-2xl mx-auto leading-relaxed">Connecting the world through secure and seamless communication.</p>
                </header>

                <section className="p-10 md:p-16 rounded-[40px] bg-white/70 backdrop-blur-md border border-white shadow-xl leading-relaxed">
                    <div className="max-w-3xl mx-auto">
                        <h2 className="text-3xl font-extrabold mb-6">Our Mission</h2>
                        <p className="text-lg text-slate-600 mb-10">
                            PingMe was born out of a simple idea: communication should be effortless and private. 
                            In a world where privacy is often compromised, we built a platform that puts the user back in control.
                        </p>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 mt-12">
                            <div className="text-center">
                                <h3 className="text-4xl font-black text-primary mb-2">10M+</h3>
                                <p className="text-slate-500 font-semibold uppercase tracking-wider text-xs">Users Worldwide</p>
                            </div>
                            <div className="text-center">
                                <h3 className="text-4xl font-black text-primary mb-2">99.9%</h3>
                                <p className="text-slate-500 font-semibold uppercase tracking-wider text-xs">Uptime Guaranteed</p>
                            </div>
                            <div className="text-center">
                                <h3 className="text-4xl font-black text-primary mb-2">0</h3>
                                <p className="text-slate-500 font-semibold uppercase tracking-wider text-xs">Third Party Access</p>
                            </div>
                        </div>
                    </div>
                </section>
            </main>
            <Footer />
        </div>
    );
};

export default About;
