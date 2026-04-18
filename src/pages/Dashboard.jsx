import React, { useState } from "react";
import Sidebar from "../components/Sidebar";
import ChatWindow from "../components/ChatWindow";
import Navbar from "../components/Navbar";
import ProfileModal from "../components/ProfileModal";
import VideoCallModal from "../components/VideoCallModal";
import { MessageSquare } from "lucide-react";
import { io } from "socket.io-client";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";

import { SOCKET_URL } from "../config";

const Dashboard = () => {
    const { user } = useAuth();
    const [selectedRecipient, setSelectedRecipient] = useState(null);
    const [showProfile, setShowProfile] = useState(false);
    const [isSidebarOpen, setIsSidebarOpen] = useState(window.innerWidth > 768);
    
    // Global Socket
    const socket = React.useRef(null);

    // Call State
    const [call, setCall] = useState({
        isActive: false,
        isIncoming: false,
        recipientId: null,
        recipientName: "",
        signal: null,
        callType: 'video'
    });

    React.useEffect(() => {
        let isIgnore = false;
        const token = localStorage.getItem("chatToken");
        
        if (!token || !user) return;

        // Cleanup function closure capture
        let currentSocket = null;

        const connectSocket = () => {
            if (isIgnore) return;

            // If already connected, don't re-init
            if (socket.current?.connected) return;

            socket.current = io(SOCKET_URL, {
                auth: { token },
                transports: ["websocket", "polling"],
                reconnectionAttempts: 5,
                timeout: 5000
            });

            currentSocket = socket.current;

            currentSocket.on("connect", () => {
                if (isIgnore) {
                    currentSocket.disconnect();
                    return;
                }
                console.log("✅ Dashboard Socket Connected:", currentSocket.id);
                currentSocket.emit("registerUser", { userId: user.id || user._id, name: user.name });
            });

            currentSocket.on("incomingCall", ({ from, name, signal, callType }) => {
                if (isIgnore) return;
                setCall({
                    isActive: true,
                    isIncoming: true,
                    recipientId: from,
                    recipientName: name,
                    signal: signal,
                    callType: callType
                });
            });
        };

        connectSocket();

        return () => {
            isIgnore = true;
            if (currentSocket) {
                console.log("🔌 Cleaning up socket...");
                currentSocket.off("connect");
                currentSocket.off("incomingCall");
                currentSocket.disconnect();
                socket.current = null;
            }
        };
    }, [user?.id, user?._id]); // Dependency on ID is more stable than user object

    const handleStartCall = (type) => {
        if (!selectedRecipient) return;
        setCall({
            isActive: true,
            isIncoming: false,
            recipientId: selectedRecipient._id,
            recipientName: selectedRecipient.name,
            signal: null,
            callType: type
        });
    };

    return (
        <div className="dashboard-wrapper">
            <Navbar 
                onSearchUser={(user) => {
                    setSelectedRecipient(user);
                    if (window.innerWidth <= 768) setIsSidebarOpen(false);
                }} 
                onOpenProfile={() => setShowProfile(true)}
                onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
            />
            
            <div className="dashboard-content">
                <div className="main-layout glass">
                    {isSidebarOpen && (
                        <div className="sidebar-backdrop" onClick={() => setIsSidebarOpen(false)}></div>
                    )}
                    <div className={`sidebar-container ${isSidebarOpen ? 'open' : 'closed'}`}>
                        <Sidebar 
                            onSelectUser={(user) => {
                                setSelectedRecipient(user);
                                if (window.innerWidth <= 768) setIsSidebarOpen(false);
                            }} 
                            activeChat={selectedRecipient}
                        />
                    </div>
                    
                    {selectedRecipient ? (
                        <ChatWindow 
                            recipient={selectedRecipient} 
                            socket={socket}
                            onCall={handleStartCall}
                        />
                    ) : (
                        <div className="welcome-screen">
                            <div className="empty-chat-icon">
                                <MessageSquare size={60} />
                            </div>
                            <h2>Start a secure conversation</h2>
                            <p>Search for a user by phone in the navbar above to begin your temporary 24h chat room.</p>
                        </div>
                    )}
                </div>
            </div>

            {showProfile && <ProfileModal onClose={() => setShowProfile(false)} />}

            {call.isActive && (
                <VideoCallModal 
                    socket={socket.current}
                    myId={user.id}
                    myName={user.name}
                    recipientId={call.recipientId}
                    recipientName={call.recipientName}
                    isIncoming={call.isIncoming}
                    initialSignal={call.signal}
                    callType={call.callType}
                    onClose={() => setCall({ isActive: false, isIncoming: false, recipientId: null, recipientName: "", signal: null, callType: 'video' })}
                />
            )}

            <style>{`
                .dashboard-wrapper {
                    height: 100vh;
                    display: flex;
                    flex-direction: column;
                }
                .dashboard-content {
                    flex: 1;
                    padding: 15px 20px 20px;
                    overflow: hidden;
                    width: 100%;
                    max-width: 1600px;
                    margin: 0 auto;
                }
                .main-layout {
                    width: 100%;
                    height: 100%;
                    border-radius: 24px;
                    display: flex;
                    overflow: hidden;
                    box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
                    position: relative;
                }

                .sidebar-container {
                    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                    width: 350px;
                    height: 100%;
                }
                .sidebar-container.closed {
                    width: 0;
                    opacity: 0;
                    pointer-events: none;
                    transform: translateX(-20px);
                }

                @media (max-width: 900px) {
                    .sidebar-container { width: 300px; }
                }

                @media (max-width: 768px) {
                    .dashboard-content {
                        padding: 10px;
                    }
                    .main-layout {
                        border-radius: 12px;
                    }
                    .sidebar-container {
                        position: absolute;
                        top: 0;
                        left: 0;
                        z-index: 50;
                        width: 280px;
                        background: var(--bg-main);
                        box-shadow: 20px 0 50px rgba(0,0,0,0.5);
                    }
                    .sidebar-container.closed {
                        width: 280px;
                        transform: translateX(-100%);
                    }
                    .sidebar-container.open {
                        transform: translateX(0);
                        opacity: 1;
                    }
                    .sidebar-backdrop {
                        position: absolute;
                        inset: 0;
                        background: rgba(0,0,0,0.4);
                        backdrop-filter: blur(2px);
                        z-index: 40;
                        animation: fadeIn 0.3s ease;
                    }
                }

                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }

                /* ... other styles remain same or are defined in components ... */
                .welcome-screen {
                    flex: 1;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    gap: 20px;
                    text-align: center;
                    background: rgba(255, 255, 255, 0.01);
                }
                .empty-chat-icon {
                    width: 120px;
                    height: 120px;
                    border-radius: 40px;
                    background: rgba(99, 102, 241, 0.1);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: var(--primary);
                }
                .welcome-screen h2 { font-size: 28px; }
                .welcome-screen p { 
                    max-width: 400px; 
                    color: var(--text-dim); 
                    line-height: 1.6;
                }
            `}</style>
        </div>
    );
};

export default Dashboard;
