import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mail, Lock, Key, ArrowLeft, Shield } from "lucide-react";
import toast from "react-hot-toast";
import API from "../utils/api";
import { APP_LOGO } from "../config";

const ForgotPassword = () => {
    const [step, setStep] = useState(1); // 1: Email, 2: OTP & New Password
    const [email, setEmail] = useState("");
    const [otp, setOtp] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const handleSendOTP = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const res = await API.post("/auth/send-otp", { email });
            if (res.data.success) {
                toast.success("OTP sent to your email!");
                setStep(2);
            } else {
                toast.error(res.data.message || "Failed to send OTP");
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Network error");
        } finally {
            setIsLoading(false);
        }
    };

    const handleResetPassword = async (e) => {
        e.preventDefault();
        if (newPassword !== confirmPassword) {
            return toast.error("Passwords do not match!");
        }
        if (otp.length < 6) {
            return toast.error("Please enter a valid 6-digit OTP");
        }
        
        setIsLoading(true);
        try {
            // Step 1: Verify OTP
            const verifyRes = await API.post("/auth/verify-otp", { email, otp });
            
            if (verifyRes.data.success) {
                // Step 2: Reset Password
                const resetRes = await API.post("/auth/reset-password", { email, otp, newPassword });
                
                if (resetRes.data.success) {
                    toast.success("Password reset successful! Please login.");
                    navigate("/login");
                } else {
                    toast.error(resetRes.data.message || "Failed to reset password");
                }
            } else {
                toast.error(verifyRes.data.message || "Invalid OTP");
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Something went wrong");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen w-full flex items-center justify-center relative overflow-hidden bg-[#0a0a0c] font-['Outfit']">
            {/* Mixture Background (Matching Login Aurora) */}
            <div className="fixed inset-0 bg-[#0f172a]"></div>

            {/* The "Mixture" Glows */}
            <div className="fixed top-[-10%] right-[-10%] w-[70%] h-[70%] bg-gradient-to-br from-rose-900/40 to-purple-900/20 blur-[120px] rounded-full opacity-60"></div>
            <div className="fixed bottom-[-10%] left-[-10%] w-[60%] h-[60%] bg-gradient-to-tr from-indigo-900/30 to-slate-900/20 blur-[100px] rounded-full opacity-40"></div>

            <div className="fixed inset-0 bg-[url('https://transparenttextures.com/patterns/carbon-fibre.png')] opacity-[0.03] pointer-events-none"></div>

            {/* Back to Login */}
            <Link to="/login" className="fixed top-8 left-8 flex items-center gap-2 text-white/50 hover:text-white transition-colors font-bold group z-50">
                <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
                <span>Back to Login</span>
            </Link>

            <div className="w-full max-w-[560px] p-6 relative z-10">
                <div className="bg-white/5 backdrop-blur-[40px] p-8 md:px-12 md:py-10 rounded-[30px] shadow-[0_25px_50px_-12px_rgba(0,0,0,0.5)] border border-white/10 flex flex-col items-center">
                    <div className="relative mb-4">
                        <div className="absolute inset-0 bg-primary/30 blur-xl rounded-full"></div>
                        <img src={APP_LOGO} alt="Logo" className="w-14 h-14 object-contain relative drop-shadow-2xl" />
                    </div>
                    
                    <div className="text-center mb-6">
                        <h2 className="text-3xl font-black text-white mb-2 tracking-tight">
                            {step === 1 ? "Reset Password" : "Secure Your Account"}
                        </h2>
                        <p className="text-white/40 text-[10px] uppercase tracking-[3px]">
                            {step === 1 ? "Enter email to receive OTP" : "Verification & New Password"}
                        </p>
                    </div>

                    {step === 1 ? (
                        <form className="w-full space-y-4" onSubmit={handleSendOTP}>
                            <div className="space-y-1">
                                <label className="text-[9px] font-black text-white/30 uppercase tracking-[2px] ml-4">Email Address</label>
                                <div className="relative group">
                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-primary transition-colors" size={16} />
                                    <input 
                                        type="email" 
                                        placeholder="your@email.com" 
                                        required 
                                        className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl outline-none focus:ring-4 focus:ring-primary/10 transition-all text-white text-sm placeholder:text-white/10"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                    />
                                </div>
                            </div>

                            <button 
                                type="submit" 
                                disabled={isLoading}
                                className="w-full py-4 bg-gradient-to-r from-primary to-secondary text-white rounded-xl font-black text-lg shadow-lg hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center gap-3 mt-4 border border-white/10 disabled:opacity-50"
                            >
                                {isLoading ? "Sending..." : "Send Verification Code"}
                                {!isLoading && <Mail size={20} />}
                            </button>
                        </form>
                    ) : (
                        <form className="w-full space-y-4" onSubmit={handleResetPassword}>
                            <div className="space-y-1">
                                <label className="text-[9px] font-black text-white/30 uppercase tracking-[2px] ml-4">6-Digit Verification Code</label>
                                <div className="relative group">
                                    <Key className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-primary transition-colors" size={16} />
                                    <input 
                                        type="text" 
                                        placeholder="0 0 0 0 0 0" 
                                        required 
                                        maxLength={6}
                                        className="w-full pl-12 pr-4 py-4 bg-white/5 border border-white/10 rounded-xl outline-none focus:ring-4 focus:ring-primary/10 transition-all text-white text-xl placeholder:text-white/10 tracking-[0.5em] font-black text-center"
                                        value={otp}
                                        onChange={(e) => setOtp(e.target.value)}
                                    />
                                </div>
                            </div>

                            <div className="space-y-1">
                                <label className="text-[9px] font-black text-white/30 uppercase tracking-[2px] ml-4">New Security Password</label>
                                <div className="relative group">
                                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-primary transition-colors" size={16} />
                                    <input 
                                        type="password" 
                                        placeholder="••••••••" 
                                        required 
                                        className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl outline-none focus:ring-4 focus:ring-primary/10 transition-all text-white text-sm placeholder:text-white/10"
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                    />
                                </div>
                            </div>

                            <div className="space-y-1">
                                <label className="text-[9px] font-black text-white/30 uppercase tracking-[2px] ml-4">Confirm Security Password</label>
                                <div className="relative group">
                                    <Shield className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-primary transition-colors" size={16} />
                                    <input 
                                        type="password" 
                                        placeholder="••••••••" 
                                        required 
                                        className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl outline-none focus:ring-4 focus:ring-primary/10 transition-all text-white text-sm placeholder:text-white/10"
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                    />
                                </div>
                            </div>

                            <button 
                                type="submit" 
                                disabled={isLoading}
                                className="w-full py-4 bg-gradient-to-r from-primary to-secondary text-white rounded-xl font-black text-lg shadow-lg hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center gap-3 mt-4 border border-white/10 disabled:opacity-50"
                            >
                                {isLoading ? "Resetting..." : "Reset Password"}
                                {!isLoading && <Lock size={20} />}
                            </button>

                            <button 
                                type="button" 
                                onClick={() => setStep(1)}
                                className="w-full text-[10px] font-black text-white/20 hover:text-white transition-colors uppercase tracking-[2px] mt-2 underline underline-offset-4"
                            >
                                Send Code to Different Email
                            </button>
                        </form>
                    )}

                    <p className="mt-8 text-sm text-white/30 text-center">
                        Secure tip: Use a mix of letters, numbers, and symbols for a stronger password.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default ForgotPassword;
