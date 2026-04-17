import React, { useState, useRef } from "react";
import { X, Camera, Phone, User, LogOut } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import API from "../utils/api";
import toast from "react-hot-toast";

const ProfileModal = ({ onClose }) => {
    const { user, setUser, logout } = useAuth();
    const [name, setName] = useState(user?.name || "");
    const [phone, setPhone] = useState(user?.phone || "");
    const [imagePreview, setImagePreview] = useState(user?.photo);
    const fileInputRef = useRef(null);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append("name", name);
        formData.append("phone", phone);
        if (fileInputRef.current.files[0]) {
            formData.append("image", fileInputRef.current.files[0]);
        }

        const loading = toast.loading("Updating profile...");
        try {
            const res = await API.patch("/user/update", formData);
            if (res.data.success) {
                const updated = res.data.user;
                updated.id = updated.id || updated._id;
                setUser(updated);
                localStorage.setItem("chatUser", JSON.stringify(updated));
                toast.success("Profile updated", { id: loading });
                setTimeout(() => onClose(), 500); 
            }
        } catch (err) {
            toast.error(err.response?.data?.message || "Update failed", { id: loading });
        }
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content glass" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h2>Your Profile</h2>
                    <button className="close-btn" onClick={onClose}><X size={20} /></button>
                </div>

                <form onSubmit={handleUpdate} className="profile-form">
                    <div className="image-section">
                        <div className="avatar-wrapper" onClick={() => fileInputRef.current.click()}>
                            <img src={imagePreview} alt="Profile" className="large-avatar" />
                            <div className="camera-overlay">
                                <Camera size={24} />
                            </div>
                        </div>
                        <input 
                            type="file" 
                            hidden 
                            ref={fileInputRef} 
                            onChange={handleImageChange}
                            accept="image/*"
                        />
                        <p className="hint">Click to change photo</p>
                    </div>

                    <div className="input-field">
                        <User size={18} className="icon" />
                        <input 
                            type="text" 
                            placeholder="Full Name" 
                            value={name} 
                            onChange={(e) => setName(e.target.value)} 
                        />
                    </div>

                    <div className="input-field">
                        <Phone size={18} className="icon" />
                        <input 
                            type="text" 
                            placeholder="Phone Number" 
                            value={phone} 
                            onChange={(e) => setPhone(e.target.value)} 
                        />
                    </div>

                    <button type="submit" className="save-btn grad-bg">Save Changes</button>
                    <button type="button" className="logout-inline" onClick={logout}>
                        <LogOut size={18} /> Logout Account
                    </button>
                </form>
            </div>

            <style>{`
                .modal-overlay {
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100vw;
                    height: 100vh;
                    background: rgba(0, 0, 0, 0.85);
                    backdrop-filter: blur(12px);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    z-index: 11000;
                    padding: 20px;
                }
                .modal-content {
                    width: 100%;
                    max-width: 440px;
                    background: rgba(255, 255, 255, 0.03);
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    border-radius: 32px;
                    padding: 40px;
                    backdrop-filter: blur(20px);
                    box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
                    animation: modalPop 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
                }
                @keyframes modalPop {
                    from { transform: scale(0.9) translateY(20px); opacity: 0; }
                    to { transform: scale(1) translateY(0); opacity: 1; }
                }
                .modal-header {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    margin-bottom: 25px;
                }
                .close-btn { background: transparent; color: var(--text-dim); }

                .image-section {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    margin-bottom: 30px;
                }
                .avatar-wrapper {
                    width: 130px;
                    height: 130px;
                    border-radius: 50%;
                    overflow: hidden;
                    position: relative;
                    cursor: pointer;
                    border: 4px solid var(--primary);
                    box-shadow: 0 0 20px rgba(99, 102, 241, 0.3);
                    transition: 0.3s;
                }
                .avatar-wrapper:hover {
                    transform: scale(1.05);
                    border-color: white;
                }
                .large-avatar { width: 100%; height: 100%; object-fit: cover; }
                .camera-overlay {
                    position: absolute;
                    inset: 0;
                    background: rgba(0,0,0,0.5);
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    color: white;
                    opacity: 0;
                    transition: 0.3s;
                    font-size: 10px;
                    font-weight: 600;
                    gap: 5px;
                }
                .avatar-wrapper:hover .camera-overlay { opacity: 1; }
                .hint { font-size: 12px; color: var(--text-dim); margin-top: 10px; }

                .profile-form { display: flex; flex-direction: column; gap: 15px; }
                .input-field {
                    position: relative;
                    display: flex;
                    align-items: center;
                }
                .input-field .icon {
                    position: absolute;
                    left: 15px;
                    color: var(--text-dim);
                }
                .input-field input {
                    width: 100%;
                    padding: 12px 15px 12px 45px;
                    background: rgba(255, 255, 255, 0.05);
                    border: 1px solid var(--glass-border);
                    border-radius: 12px;
                    color: white;
                }

                .save-btn {
                    padding: 14px;
                    border-radius: 12px;
                    font-weight: 600;
                    margin-top: 10px;
                }
                .logout-inline {
                    background: transparent;
                    color: var(--danger);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 8px;
                    font-size: 14px;
                    margin-top: 5px;
                }

                @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
                @keyframes slideUp { from { transform: translateY(20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
            `}</style>
        </div>
    );
};

export default ProfileModal;
