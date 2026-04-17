import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { Mail, Lock, User, Phone, LogIn, UserPlus } from "lucide-react";
import toast from "react-hot-toast";

const AuthPage = () => {
    const [isLogin, setIsLogin] = useState(true);
    const [formData, setFormData] = useState({ name: "", email: "", phone: "", password: "" });
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        const loadingToast = toast.loading(isLogin ? "Signing in..." : "Creating account...");
        
        try {
            if (isLogin) {
                const res = await login(formData.email, formData.password);
                if (res.success) {
                    toast.success("Welcome back!", { id: loadingToast });
                    navigate("/");
                } else {
                    toast.error(res.message, { id: loadingToast });
                }
            } else {
                // Registration logic (can be added to context too)
                const res = await fetch("https://ping-me-backend-09ed.onrender.com/api/auth/register", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(formData)
                });
                const data = await res.json();
                if (data.success) {
                    toast.success("Account created! Please login.", { id: loadingToast });
                    setIsLogin(true);
                } else {
                    toast.error(data.message, { id: loadingToast });
                }
            }
        } catch (err) {
            toast.error("Something went wrong", { id: loadingToast });
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-card glass">
                <div className="auth-header">
                    <div className="logo-box grad-bg">
                        <User size={32} />
                    </div>
                    <h1>{isLogin ? "Welcome Back" : "Create Account"}</h1>
                    <p>{isLogin ? "Login to stay connected" : "Join our community today"}</p>
                </div>

                <form onSubmit={handleSubmit} className="auth-form">
                    {!isLogin && (
                        <>
                            <div className="input-group">
                                <User className="icon" size={20} />
                                <input 
                                    type="text" 
                                    placeholder="Full Name" 
                                    required 
                                    value={formData.name}
                                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                                />
                            </div>
                            <div className="input-group">
                                <Phone className="icon" size={20} />
                                <input 
                                    type="text" 
                                    placeholder="Phone Number" 
                                    required 
                                    value={formData.phone}
                                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                                />
                            </div>
                        </>
                    )}
                    <div className="input-group">
                        <Mail className="icon" size={20} />
                        <input 
                            type="email" 
                            placeholder="Email Address" 
                            required 
                            value={formData.email}
                            onChange={(e) => setFormData({...formData, email: e.target.value})}
                        />
                    </div>
                    <div className="input-group">
                        <Lock className="icon" size={20} />
                        <input 
                            type="password" 
                            placeholder="Password" 
                            required 
                            value={formData.password}
                            onChange={(e) => setFormData({...formData, password: e.target.value})}
                        />
                    </div>

                    <button type="submit" className="submit-btn grad-bg">
                        {isLogin ? <><LogIn size={20} /> Login</> : <><UserPlus size={20} /> Register</>}
                    </button>
                </form>

                <div className="auth-footer">
                    <p>
                        {isLogin ? "Don't have an account? " : "Already have an account? "}
                        <span onClick={() => setIsLogin(!isLogin)}>
                            {isLogin ? "Sign Up" : "Sign In"}
                        </span>
                    </p>
                </div>
            </div>

            <style>{`
                .auth-container {
                    height: 100vh;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    padding: 20px;
                }
                .auth-card {
                    width: 100%;
                    max-width: 400px;
                    padding: 40px;
                    border-radius: 24px;
                    animation: slideUp 0.6s ease-out;
                }
                .auth-header {
                    text-align: center;
                    margin-bottom: 30px;
                }
                .logo-box {
                    width: 60px;
                    height: 60px;
                    border-radius: 18px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    margin: 0 auto 15px;
                    box-shadow: 0 10px 20px rgba(99, 102, 241, 0.3);
                }
                .grad-bg {
                    background: var(--grad-main);
                    color: white;
                }
                h1 { font-size: 24px; margin-bottom: 8px; }
                p { color: var(--text-dim); font-size: 14px; }
                .auth-form { display: flex; flex-direction: column; gap: 15px; }
                .input-group {
                    position: relative;
                    display: flex;
                    align-items: center;
                }
                .input-group .icon {
                    position: absolute;
                    left: 15px;
                    color: var(--text-dim);
                }
                .input-group input {
                    width: 100%;
                    padding: 14px 15px 14px 45px;
                    background: rgba(255, 255, 255, 0.05);
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    border-radius: 12px;
                    color: white;
                    transition: all 0.3s;
                }
                .input-group input:focus {
                    background: rgba(255, 255, 255, 0.08);
                    border-color: var(--primary);
                    box-shadow: 0 0 0 4px rgba(99, 102, 241, 0.1);
                }
                .submit-btn {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 10px;
                    padding: 14px;
                    border-radius: 12px;
                    font-weight: 600;
                    margin-top: 10px;
                }
                .submit-btn:hover {
                    opacity: 0.9;
                    transform: translateY(-2px);
                }
                .auth-footer {
                    text-align: center;
                    margin-top: 25px;
                    font-size: 14px;
                }
                .auth-footer span {
                    color: var(--primary);
                    font-weight: 600;
                    cursor: pointer;
                }
                @keyframes slideUp {
                    from { transform: translateY(20px); opacity: 0; }
                    to { transform: translateY(0); opacity: 1; }
                }
            `}</style>
        </div>
    );
};

export default AuthPage;
