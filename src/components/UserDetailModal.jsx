import React from "react";
import { X, Phone, User, Calendar, ShieldCheck } from "lucide-react";

const UserDetailModal = ({ user, onClose }) => {
    if (!user) return null;

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="user-detail-card glass" onClick={(e) => e.stopPropagation()}>
                <button className="close-btn-top" onClick={onClose}>
                    <X size={24} />
                </button>

                <div className="user-header">
                    <div className="avatar-wrapper">
                        <img src={user.photo || "https://res.cloudinary.com/dzt89p0bm/image/upload/v1713271111/avatar_default.png"} alt={user.name} />
                    </div>
                    <h2>{user.name}</h2>
                    <p className="status">Online</p>
                </div>

                <div className="user-info-body">
                    <div className="info-item">
                        <div className="icon-box">
                            <User size={18} />
                        </div>
                        <div className="info-content">
                            <label>Name</label>
                            <p>{user.name}</p>
                        </div>
                    </div>

                    <div className="info-item">
                        <div className="icon-box">
                            <Phone size={18} />
                        </div>
                        <div className="info-content">
                            <label>Phone Number</label>
                            <p>{user.phone || "Not provided"}</p>
                        </div>
                    </div>

                    <div className="info-item">
                        <div className="icon-box">
                            <ShieldCheck size={18} />
                        </div>
                        <div className="info-content">
                            <label>Encryption</label>
                            <p>End-to-End Encrypted</p>
                        </div>
                    </div>
                </div>

                <div className="modal-footer">
                    <p>All messages are automatically deleted after 24 hours.</p>
                </div>
            </div>

            <style>{`
                .modal-overlay {
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100vw;
                    height: 100vh;
                    background: rgba(0, 0, 0, 0.7);
                    backdrop-filter: blur(8px);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    z-index: 1000;
                    animation: fadeIn 0.3s ease;
                }
                .user-detail-card {
                    width: 100%;
                    max-width: 400px;
                    padding: 30px;
                    border-radius: 24px;
                    text-align: center;
                    position: relative;
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    box-shadow: 0 20px 40px rgba(0,0,0,0.4);
                    animation: slideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1);
                }
                .close-btn-top {
                    position: absolute;
                    top: 20px;
                    right: 20px;
                    color: var(--text-dim);
                    background: rgba(255,255,255,0.05);
                    padding: 8px;
                    border-radius: 50%;
                    transition: 0.3s;
                }
                .close-btn-top:hover {
                    background: rgba(255,255,255,0.1);
                    color: white;
                }
                .avatar-wrapper {
                    width: 120px;
                    height: 120px;
                    margin: 0 auto 15px;
                    border-radius: 50%;
                    padding: 4px;
                    background: var(--grad-main);
                    box-shadow: 0 8px 16px rgba(0,0,0,0.3);
                }
                .avatar-wrapper img {
                    width: 100%;
                    height: 100%;
                    border-radius: 50%;
                    object-fit: cover;
                    border: 3px solid #1a1a2e;
                }
                .user-header h2 {
                    font-size: 24px;
                    margin-bottom: 5px;
                    letter-spacing: -0.5px;
                }
                .status {
                    color: #10b981;
                    font-size: 13px;
                    font-weight: 500;
                    margin-bottom: 25px;
                }
                .user-info-body {
                    text-align: left;
                    display: flex;
                    flex-direction: column;
                    gap: 15px;
                    margin-bottom: 25px;
                }
                .info-item {
                    display: flex;
                    align-items: center;
                    gap: 15px;
                    padding: 12px;
                    background: rgba(255,255,255,0.03);
                    border-radius: 12px;
                    border: 1px solid var(--glass-border);
                }
                .icon-box {
                    width: 36px;
                    height: 36px;
                    background: rgba(99, 102, 241, 0.1);
                    color: var(--primary);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    border-radius: 10px;
                }
                .info-content label {
                    display: block;
                    font-size: 11px;
                    color: var(--text-dim);
                    text-transform: uppercase;
                    letter-spacing: 0.5px;
                }
                .info-content p {
                    font-size: 15px;
                    font-weight: 500;
                    color: white;
                }
                .modal-footer {
                    font-size: 12px;
                    color: var(--text-dim);
                    padding-top: 20px;
                    border-top: 1px solid rgba(255,255,255,0.05);
                }

                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                @keyframes slideUp {
                    from { transform: translateY(30px); opacity: 0; }
                    to { transform: translateY(0); opacity: 1; }
                }
            `}</style>
        </div>
    );
};

export default UserDetailModal;
