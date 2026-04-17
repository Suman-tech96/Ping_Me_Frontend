import React from "react";
import { Link } from "react-router-dom";
import { Send, Apple, PlayCircle } from "lucide-react";
import { APP_LOGO } from "../config";

// Custom Social Icons to avoid missing export errors in lucide-react
const Twitter = ({ size = 20 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path></svg>
);
const Facebook = ({ size = 20 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
);
const Instagram = ({ size = 20 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
);
const Youtube = ({ size = 20 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33 2.78 2.78 0 0 0 1.94 2C13.12 20 12 20 12 20s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.33 29 29 0 0 0-.46-5.33z"></path><polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"></polygon></svg>
);

const Footer = () => {
    return (
        <footer className="w-full bg-[#111b21] text-[#8696a0] font-['Outfit'] border-t border-white/5">
            {/* Top Banner section */}
            <div className="bg-[#202c33] px-[5%] lg:px-[8%] py-8 flex flex-col md:flex-row justify-between items-center gap-6">
                <div className="flex items-center gap-4 text-white">
                    <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
                        <Send size={20} className="text-white" />
                    </div>
                    <p className="text-sm max-w-2xl leading-relaxed">
                        <span className="font-bold">PingMe</span> is free and offers simple, secure, reliable messaging and calling, available on phones all over the world. 
                        Download <span className="text-primary font-bold">PingMe</span> for free today and stay connected with anyone, anywhere.
                    </p>
                </div>
            </div>

            {/* Main Footer Content */}
            <div className="px-[5%] lg:px-[8%] py-16">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-12 lg:gap-8">
                    {/* Brand Column */}
                    <div className="lg:col-span-1">
                        <div className="flex items-center gap-3 mb-6">
                            <img src={APP_LOGO} alt="PingMe Logo" className="w-10 h-10 object-contain" />
                            <h2 className="text-2xl font-bold text-white tracking-tight">PingMe</h2>
                        </div>
                        <p className="text-sm leading-relaxed mb-8">
                            Simple. Reliable. Private. <br />
                            Message and call for free, worldwide.
                        </p>
                        <div className="flex flex-col gap-3">
                            <button className="flex items-center gap-3 bg-[#202c33] text-white px-4 py-2 rounded-xl hover:bg-[#2a3942] transition-colors border border-white/10 w-fit">
                                <Apple size={24} />
                                <div className="text-left">
                                    <div className="text-[10px] uppercase opacity-60 leading-none">Download on the</div>
                                    <div className="text-sm font-bold leading-none mt-1">App Store</div>
                                </div>
                            </button>
                            <button className="flex items-center gap-3 bg-[#202c33] text-white px-4 py-2 rounded-xl hover:bg-[#2a3942] transition-colors border border-white/10 w-fit">
                                <PlayCircle size={24} />
                                <div className="text-left">
                                    <div className="text-[10px] uppercase opacity-60 leading-none">Get it on</div>
                                    <div className="text-sm font-bold leading-none mt-1">Google Play</div>
                                </div>
                            </button>
                        </div>
                    </div>

                    {/* Features Links */}
                    <div>
                        <h4 className="text-[#00a884] font-bold text-xs uppercase tracking-widest mb-6">Features</h4>
                        <ul className="flex flex-col gap-4 text-sm">
                            <li><Link to="/features" className="hover:text-white transition-colors">Messaging</Link></li>
                            <li><Link to="/features" className="hover:text-white transition-colors">Voice & video calls</Link></li>
                            <li><Link to="/features" className="hover:text-white transition-colors">Groups & communities</Link></li>
                            <li><Link to="/features" className="hover:text-white transition-colors">Status updates</Link></li>
                            <li><Link to="/features" className="hover:text-white transition-colors">Channels</Link></li>
                            <li><Link to="/features" className="hover:text-white transition-colors">PingMe Web</Link></li>
                        </ul>
                    </div>

                    {/* Privacy Links */}
                    <div>
                        <h4 className="text-[#00a884] font-bold text-xs uppercase tracking-widest mb-6">Privacy & Security</h4>
                        <ul className="flex flex-col gap-4 text-sm">
                            <li><Link to="/security" className="hover:text-white transition-colors">End-to-end encryption</Link></li>
                            <li><Link to="/security" className="hover:text-white transition-colors">Privacy policy</Link></li>
                            <li><Link to="/security" className="hover:text-white transition-colors">Security advisories</Link></li>
                            <li><Link to="/security" className="hover:text-white transition-colors">Two-step verification</Link></li>
                            <li><Link to="/security" className="hover:text-white transition-colors">Safety center</Link></li>
                        </ul>
                    </div>

                    {/* Help Links */}
                    <div>
                        <h4 className="text-[#00a884] font-bold text-xs uppercase tracking-widest mb-6">Help</h4>
                        <ul className="flex flex-col gap-4 text-sm">
                            <li><Link to="/about" className="hover:text-white transition-colors">Help center</Link></li>
                            <li><Link to="/about" className="hover:text-white transition-colors">Contact us</Link></li>
                            <li><Link to="/about" className="hover:text-white transition-colors">Blog</Link></li>
                            <li><Link to="/about" className="hover:text-white transition-colors">Accessibility</Link></li>
                            <li><Link to="/security" className="hover:text-white transition-colors">Cookie policy</Link></li>
                        </ul>
                    </div>

                    {/* Business Links */}
                    <div>
                        <h4 className="text-[#00a884] font-bold text-xs uppercase tracking-widest mb-6">Business</h4>
                        <ul className="flex flex-col gap-4 text-sm">
                            <li><a href="#" className="hover:text-white transition-colors">PingMe Business</a></li>
                            <li><a href="#" className="hover:text-white transition-colors">PingMe API</a></li>
                            <li><a href="#" className="hover:text-white transition-colors">Business features</a></li>
                            <li><a href="#" className="hover:text-white transition-colors">Success stories</a></li>
                            <li><a href="#" className="hover:text-white transition-colors">Partner directory</a></li>
                        </ul>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="mt-20 pt-10 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-8">
                    <div className="flex flex-wrap items-center justify-center gap-6 text-xs font-semibold">
                        <span className="text-white/40 mb-2 md:mb-0">© 2026 PingMe LLC</span>
                        <Link to="/security" className="hover:text-white transition-colors">Terms of service</Link>
                        <Link to="/security" className="hover:text-white transition-colors">Privacy policy</Link>
                        <Link to="/security" className="hover:text-white transition-colors">Cookie policy</Link>
                    </div>
                    <div className="flex gap-4">
                        <a href="#" className="w-10 h-10 bg-[#202c33] rounded-full flex items-center justify-center text-white hover:bg-[#2a3942] transition-all"><Twitter size={18} /></a>
                        <a href="#" className="w-10 h-10 bg-[#202c33] rounded-full flex items-center justify-center text-white hover:bg-[#2a3942] transition-all"><Facebook size={18} /></a>
                        <a href="#" className="w-10 h-10 bg-[#202c33] rounded-full flex items-center justify-center text-white hover:bg-[#2a3942] transition-all"><Instagram size={18} /></a>
                        <a href="#" className="w-10 h-10 bg-[#202c33] rounded-full flex items-center justify-center text-white hover:bg-[#2a3942] transition-all"><Youtube size={18} /></a>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
