import React, { useState, useEffect, useRef } from "react";
import { Send, Image as ImageIcon, Smile, MoreVertical, Phone, Video } from "lucide-react";
import EmojiPicker from "emoji-picker-react";
import { io } from "socket.io-client";
import { useAuth } from "../context/AuthContext";
import Message from "./Message";
import UserDetailModal from "./UserDetailModal";
import API from "../utils/api";
import toast from "react-hot-toast";

const ChatWindow = ({ recipient, onCall, socket }) => {
    const { user } = useAuth();
    const [message, setMessage] = useState("");
    const [chatHistory, setChatHistory] = useState([]);
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const [isTyping, setIsTyping] = useState(false);
    const [remoteTyping, setRemoteTyping] = useState(false);
    const [showUserDetail, setShowUserDetail] = useState(false);
    const [showMoreMenu, setShowMoreMenu] = useState(false);
    const { logout } = useAuth();
    const scrollRef = useRef(null);
    const fileInputRef = useRef(null);
    const emojiPickerRef = useRef(null);
    const emojiBtnRef = useRef(null);
    const typingTimeoutRef = useRef(null);

    // Room ID is sorted combination of IDs (handles both .id and ._id formats)
    const myId = user?.id || user?._id;
    const recipientId = recipient?.id || recipient?._id;
    const roomId = [myId, recipientId].sort().join("_");

    useEffect(() => {
        const handleClickOutside = (event) => {
            // Close emoji picker if click is outside
            if (showEmojiPicker && 
                emojiPickerRef.current && 
                !emojiPickerRef.current.contains(event.target) &&
                emojiBtnRef.current && 
                !emojiBtnRef.current.contains(event.target)) {
                setShowEmojiPicker(false);
            }

            // Close more menu if click is outside
            if (showMoreMenu && !event.target.closest('.header-actions')) {
                setShowMoreMenu(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [showEmojiPicker]);

    useEffect(() => {
        if (!socket?.current || !recipient || !myId || !recipientId) return;

        console.log("Setting up chat listeners for room:", roomId);
        const socketConn = socket.current;

        // CRITICAL: Clear chat history when switching rooms to prevent data leakage/conflict
        setChatHistory([]);
        setRemoteTyping(false);

        socketConn.emit("joinRoom", { roomId });

        // Listen for events
        socketConn.on("receiveMessage", (data) => {
            console.log("📩 New message received:", data);
            setChatHistory(prev => {
                if (prev.some(m => String(m._id) === String(data._id))) return prev;
                return [...prev, data];
            });
            // Mark as seen if we are the recipient
            if (String(data.senderId) !== String(myId)) {
                socketConn.emit("markSeen", { roomId });
            }
        });

        socketConn.on("messagesSeen", ({ roomId: rId }) => {
            if (rId === roomId) {
                setChatHistory(prev => prev.map(m => ({ ...m, status: "seen" })));
            }
        });

        socketConn.on("userTyping", ({ userId }) => {
            if (String(userId) !== String(user.id)) setRemoteTyping(true);
        });

        socketConn.on("userStopTyping", ({ userId }) => {
            if (String(userId) !== String(user.id)) setRemoteTyping(false);
        });

        socketConn.on("messageDeleted", ({ messageId }) => {
            setChatHistory(prev => prev.filter(m => String(m._id) !== String(messageId)));
        });

        // Fetch History
        fetchHistory();

        return () => {
            console.log("🧹 Cleaning up chat listeners...");
            socketConn.off("receiveMessage");
            socketConn.off("messagesSeen");
            socketConn.off("userTyping");
            socketConn.off("userStopTyping");
            socketConn.off("messageDeleted");
        };
    }, [recipient, roomId, myId, recipientId, socket]);

    useEffect(() => {
        const timer = setTimeout(() => {
            scrollRef.current?.scrollIntoView({ behavior: "smooth" });
        }, 100);
        return () => clearTimeout(timer);
    }, [chatHistory, remoteTyping]);

    const fetchHistory = async () => {
        try {
            const res = await API.get(`/chat/history/${roomId}`);
            if (res.data.success) {
                // Merge carefully: keep existing socket messages, add rest from history
                setChatHistory(prev => {
                    const existingIds = new Set(prev.map(m => m._id));
                    const newHistory = res.data.messages.filter(m => !existingIds.has(m._id));
                    return [...newHistory, ...prev].sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
                });
                // After history load, mark any unread messages as seen
                if (socket?.current) {
                    socket.current.emit("markSeen", { roomId });
                }
            }
        } catch (err) {
            console.error("History failed:", err);
            toast.error("Could not load chat history");
        }
    };

    const handleInputChange = (e) => {
        setMessage(e.target.value);

        if (!socket.current?.connected) return;

        // Emit typing
        socket.current.emit("typing", { roomId });

        // Clear existing timeout
        if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);

        // Set new timeout to stop typing after 2 seconds of inactivity
        typingTimeoutRef.current = setTimeout(() => {
            socket.current.emit("stopTyping", { roomId });
        }, 2000);
    };

    const handleSendMessage = (e) => {
        e.preventDefault();
        if (!message.trim()) return;

        if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
        socket.current.emit("stopTyping", { roomId });

        if (!socket.current?.connected) {
            toast.error("Not connected to server. Attempting to reconnect...");
            return;
        }

        socket.current.emit("sendMessage", {
            roomId,
            message,
            recipientId: recipient._id
        });

        setMessage("");
    };

    const handleFileUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const formData = new FormData();
        formData.append("image", file);

        const loading = toast.loading("Uploading image...");
        try {
            const res = await API.post("/chat/upload-image", formData);
            if (res.data.success) {
                socket.current.emit("sendMessage", {
                    roomId,
                    image: res.data.imageUrl,
                    recipientId: recipient._id
                });
                toast.success("Image sent", { id: loading });
            }
        } catch (err) {
            toast.error("Upload failed", { id: loading });
        }
    };

    const handleUnsend = (messageId) => {
        socket.current.emit("deleteMessage", { roomId, messageId });
        toast.success("Message unsent");
    };

    const handleClearChat = async () => {
        if (!window.confirm("Are you sure you want to clear all messages in this chat?")) return;
        
        try {
            const res = await API.delete(`/chat/clear/${roomId}`);
            if (res.data.success) {
                setChatHistory([]);
                toast.success("Chat cleared");
                setShowMoreMenu(false);
            }
        } catch (err) {
            toast.error("Failed to clear chat");
        }
    };

    return (
        <div className="chat-window">
            <div className="chat-header glass">
                <div className="recipient-info" onClick={() => setShowUserDetail(true)} style={{ cursor: 'pointer' }}>
                    <img src={recipient.photo} alt={recipient.name} className="avatar" />
                    <div>
                        <h3>{recipient.name}</h3>
                        <p className="status-text">{remoteTyping ? "Typing..." : "Temporary 24h Chat"}</p>
                    </div>
                </div>
                <div className="header-actions">
                    <Phone 
                        size={20} 
                        className="action-icn" 
                        onClick={() => onCall('voice')} 
                        title="Voice Call" 
                    />
                    <Video 
                        size={20} 
                        className="action-icn" 
                        onClick={() => onCall('video')} 
                        title="Video Call" 
                    />
                    <div className="more-menu-wrapper">
                        <MoreVertical size={20} className="action-icn" onClick={() => setShowMoreMenu(!showMoreMenu)} />
                        {showMoreMenu && (
                            <div className="dropdown-menu glass">
                                <button onClick={handleClearChat}>Clear Chat</button>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <div className="messages-area">
                {chatHistory.map((m, idx) => (
                    <Message 
                        key={m._id || idx} 
                        data={m} 
                        isOwn={String(m.senderId) === String(myId)} 
                        onUnsend={handleUnsend}
                    />
                ))}
                {remoteTyping && (
                    <div className="msg-wrapper received">
                        <div className="typing-dots glass">
                            <span></span><span></span><span></span>
                        </div>
                    </div>
                )}
                <div ref={scrollRef} />
            </div>

            <div className="chat-input-area glass">
                <form onSubmit={handleSendMessage}>
                    <button 
                        type="button" 
                        className="input-btn" 
                        onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                        ref={emojiBtnRef}
                    >
                        <Smile size={22} />
                    </button>
                    <button type="button" className="input-btn" onClick={() => fileInputRef.current.click()}>
                        <ImageIcon size={22} />
                    </button>
                    <input 
                        type="file" 
                        hidden 
                        ref={fileInputRef} 
                        onChange={handleFileUpload}
                        accept="image/*"
                    />
                    
                    <input 
                        type="text" 
                        placeholder="Type a message..." 
                        value={message}
                        onChange={handleInputChange}
                    />
                    
                    <button type="submit" className="send-btn" disabled={!message.trim()}>
                        <Send size={20} color="white" />
                    </button>
                </form>
                
                {showEmojiPicker && (
                    <div className="emoji-container" ref={emojiPickerRef}>
                        <EmojiPicker 
                            onEmojiClick={(e) => {
                                setMessage(prev => prev + e.emoji);
                            }}
                            theme="dark"
                        />
                    </div>
                )}
            </div>

            {showUserDetail && (
                <UserDetailModal 
                    user={recipient} 
                    onClose={() => setShowUserDetail(false)} 
                />
            )}

            <style>{`
                .chat-window {
                    flex: 1;
                    display: flex;
                    flex-direction: column;
                    background: rgba(255, 255, 255, 0.02);
                }
                .chat-header {
                    padding: 15px 25px;
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    z-index: 10;
                }
                .recipient-info { display: flex; align-items: center; gap: 12px; }
                .status-text { font-size: 11px; color: var(--accent); }
                .header-actions { display: flex; gap: 20px; color: var(--text-dim); align-items: center; position: relative; }
                .action-icn { cursor: pointer; transition: 0.2s; }
                .action-icn:hover { color: white; }
                
                .more-menu-wrapper { position: relative; display: flex; align-items: center; }
                .dropdown-menu {
                    position: absolute;
                    top: 100%;
                    right: 0;
                    margin-top: 10px;
                    width: 150px;
                    padding: 8px;
                    border-radius: 12px;
                    z-index: 100;
                    box-shadow: 0 10px 25px rgba(0,0,0,0.3);
                }
                .dropdown-menu button {
                    width: 100%;
                    padding: 10px;
                    text-align: left;
                    background: transparent;
                    color: var(--text-main);
                    font-size: 14px;
                    border-radius: 8px;
                }
                .dropdown-menu button:hover {
                    background: rgba(255,255,255,0.05);
                }
                .danger-text { color: var(--danger) !important; }

                .messages-area {
                    flex: 1;
                    padding: 20px;
                    overflow-y: auto;
                    display: flex;
                    flex-direction: column;
                    gap: 15px;
                }
                .msg-wrapper { display: flex; width: 100%; }
                .msg-wrapper.sent { justify-content: flex-end; }
                .msg-wrapper.received { justify-content: flex-start; }
                
                .msg-content {
                    max-width: 60%;
                    padding: 12px 16px;
                    border-radius: 20px;
                    position: relative;
                    box-shadow: 0 4px 15px rgba(0,0,0,0.1);
                    animation: popIn 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55);
                }
                .sent .msg-content {
                    background: var(--grad-main);
                    border-bottom-right-radius: 4px;
                    color: white;
                }
                .received .msg-content {
                    background: var(--glass);
                    border: 1px solid var(--glass-border);
                    border-bottom-left-radius: 4px;
                    backdrop-filter: blur(5px);
                }
                .shared-img {
                    max-width: 100%;
                    max-height: 300px;
                    border-radius: 12px;
                    margin-bottom: 5px;
                    cursor: pointer;
                }
                .msg-footer {
                    display: flex;
                    align-items: center;
                    justify-content: flex-end;
                    gap: 8px;
                    margin-top: 5px;
                    font-size: 10px;
                    opacity: 0.7;
                }
                .unsend-btn { cursor: pointer; transition: 0.2s; }
                .unsend-btn:hover { color: var(--danger); }

                .chat-input-area {
                    padding: 20px;
                    margin: 20px;
                    border-radius: 20px;
                    position: relative;
                }
                .chat-input-area form {
                    display: flex;
                    align-items: center;
                    gap: 15px;
                }
                .chat-input-area input[type="text"] {
                    flex: 1;
                    padding: 12px;
                    background: transparent;
                    color: white;
                    font-size: 15px;
                }
                .input-btn {
                    color: var(--text-dim);
                    background: transparent;
                    transition: 0.2s;
                }
                .input-btn:hover { color: var(--primary); }
                .send-btn {
                    width: 45px;
                    height: 45px;
                    border-radius: 12px;
                    background: var(--grad-main);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    box-shadow: 0 4px 12px rgba(99, 102, 241, 0.3);
                }
                .send-btn:disabled { opacity: 0.5; cursor: not-allowed; }
                
                .emoji-container {
                    position: absolute;
                    bottom: 80px;
                    left: 20px;
                    z-index: 100;
                }

                .typing-dots {
                    padding: 12px 16px;
                    border-radius: 20px;
                    display: flex;
                    gap: 4px;
                }
                .typing-dots span {
                    width: 6px;
                    height: 6px;
                    background: var(--text-dim);
                    border-radius: 50%;
                    animation: blink 1.4s infinite;
                }
                .typing-dots span:nth-child(2) { animation-delay: 0.2s; }
                .typing-dots span:nth-child(3) { animation-delay: 0.4s; }

                @keyframes popIn {
                    from { transform: scale(0.8); opacity: 0; }
                    to { transform: scale(1); opacity: 1; }
                }
                @keyframes blink {
                    0%, 100% { opacity: 0.3; }
                    50% { opacity: 1; }
                }

                @media (max-width: 768px) {
                    .chat-header { padding: 10px 15px; }
                    .chat-header h3 { font-size: 16px; }
                    .chat-input-area { margin: 10px; padding: 12px; }
                    .header-actions { gap: 15px; }
                }
            `}</style>
        </div>
    );
};

export default ChatWindow;
