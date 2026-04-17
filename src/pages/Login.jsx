import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Mail, Lock, LogIn, ArrowLeft } from "lucide-react";
import toast from "react-hot-toast";
import { APP_LOGO } from "../config";

const Login = () => {
    const [formData, setFormData] = useState({ email: "", password: "" });
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        const res = await login(formData.email, formData.password);
        if (res.success) {
            toast.success("Welcome back!");
            navigate("/dashboard");
        } else {
            toast.error(res.message);
        }
    };

    return (
        <div className="min-h-screen w-full flex items-center justify-center relative overflow-hidden bg-[#0a0a0c] font-['Outfit']">
            {/* Mixture Background (Matching Dashboard Aurora) */}
            <div className="fixed inset-0 bg-[#0f172a]"></div>

            {/* The "Mixture" Glows */}
            <div className="fixed top-[-10%] right-[-10%] w-[70%] h-[70%] bg-gradient-to-br from-rose-900/40 to-purple-900/20 blur-[120px] rounded-full opacity-60"></div>
            <div className="fixed bottom-[-10%] left-[-10%] w-[60%] h-[60%] bg-gradient-to-tr from-indigo-900/30 to-slate-900/20 blur-[100px] rounded-full opacity-40"></div>

            <div className="fixed inset-0 bg-[url('https://transparenttextures.com/patterns/carbon-fibre.png')] opacity-[0.03] pointer-events-none"></div>

            {/* Back to Home */}
            <Link to="/" className="fixed top-8 left-8 flex items-center gap-2 text-white/50 hover:text-white transition-colors font-bold group z-50">
                <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
                <span>Back to Home</span>
            </Link>

            <div className="w-full max-w-[560px] p-6 relative z-10">
                <div className="bg-white/5 backdrop-blur-[40px] p-8 md:px-12 md:py-10 rounded-[30px] shadow-[0_25px_50px_-12px_rgba(0,0,0,0.5)] border border-white/10 flex flex-col items-center">
                    <div className="relative mb-4">
                        <div className="absolute inset-0 bg-primary/30 blur-xl rounded-full"></div>
                        <img src={APP_LOGO} alt="Logo" className="w-14 h-14 object-contain relative drop-shadow-2xl" />
                    </div>
                    
                    <div className="text-center mb-6">
                        <h2 className="text-3xl font-black text-white mb-2 tracking-tight">Welcome Back</h2>
                        <p className="text-white/40 text-[10px] uppercase tracking-[3px]">PingMe Secure Access</p>
                    </div>

                    <form className="w-full space-y-4" onSubmit={handleLogin}>
                        <div className="space-y-1">
                            <label className="text-[9px] font-black text-white/30 uppercase tracking-[2px] ml-4">Email Address</label>
                            <div className="relative group">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-primary transition-colors" size={16} />
                                <input 
                                    type="email" 
                                    placeholder="your@email.com" 
                                    required 
                                    className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl outline-none focus:ring-4 focus:ring-primary/10 transition-all text-white text-sm placeholder:text-white/10"
                                    value={formData.email}
                                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                                />
                            </div>
                        </div>

                        <div className="space-y-1">
                            <label className="text-[9px] font-black text-white/30 uppercase tracking-[2px] ml-4">Security Password</label>
                            <div className="relative group">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-primary transition-colors" size={16} />
                                <input 
                                    type="password" 
                                    placeholder="••••••••" 
                                    required 
                                    className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl outline-none focus:ring-4 focus:ring-primary/10 transition-all text-white text-sm placeholder:text-white/10"
                                    value={formData.password}
                                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                                />
                            </div>
                        </div>

                        <div className="flex justify-end pt-1">
                            <a href="#" className="text-[10px] font-black text-white/20 hover:text-primary transition-colors uppercase tracking-widest">Forgot Password?</a>
                        </div>

                        <button type="submit" className="w-full py-4 bg-gradient-to-r from-primary to-secondary text-white rounded-xl font-black text-lg shadow-lg hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center gap-3 mt-4 border border-white/10">
                            <LogIn size={20} />
                            Sign In
                        </button>
                    </form>

                    <p className="mt-8 text-sm text-white/30">
                        New to PingMe? <Link to="/register" className="text-white font-bold hover:text-primary transition-colors hover:underline underline-offset-4 tracking-tight">Create Account</Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;
