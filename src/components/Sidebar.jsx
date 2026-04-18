import React, { useState, useEffect } from "react";
import { Search, LogOut, Settings, MessageSquarePlus } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import API from "../utils/api";
import toast from "react-hot-toast";

const Sidebar = ({ onSelectUser, activeChat }) => {
    const { user } = useAuth();
    const [searchTerm, setSearchTerm] = useState("");
    const [searchResults, setSearchResults] = useState(null);
    const [recentChats, setRecentChats] = useState([]);

    useEffect(() => {
        fetchRecentChats();
    }, []);

    const fetchRecentChats = async () => {
        try {
            const res = await API.get("/chat/conversations");
            if (res.data.success) {
                setRecentChats(res.data.conversations);
            }
        } catch (err) {
            console.error("Failed to load recent chats");
        }
    };

    const handleSearch = async (e) => {
        e.preventDefault();
        if (!searchTerm) return;
        
        try {
            const res = await API.get(`/user/phone/${searchTerm}`);
            if (res.data.success) {
                setSearchResults(res.data.user);
            }
        } catch (err) {
            setSearchResults(null);
            toast.error("User not found");
        }
    };

    return (
        <div className="sidebar glass">
            <div className="sidebar-header">
                <div className="user-profile">
                    <img src={user?.photo || "https://res.cloudinary.com/dzt89p0bm/image/upload/v1713271111/avatar_default.png"} alt={user?.name} className="avatar" />
                    <div className="user-info">
                        <h3>{user?.name}</h3>
                        <p>{user?.phone}</p>
                    </div>
                </div>
            </div>

            <div className="sidebar-search">
                <form onSubmit={handleSearch}>
                    <Search size={18} className="search-icon" />
                    <input 
                        type="text" 
                        placeholder="Search chats or phone..." 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </form>
            </div>

            <div className="chat-list">
                {searchResults && (
                    <div className="search-result-section">
                        <p className="section-title">Search Result</p>
                        <div 
                            className={`chat-item search-res ${activeChat?._id === searchResults._id ? 'active' : ''}`}
                            onClick={() => {
                                onSelectUser(searchResults);
                                setSearchResults(null); // Clear search result after selecting
                                setSearchTerm(""); // Clear search term
                            }}
                        >
                            <img src={searchResults.photo} alt={searchResults.name} className="avatar" />
                            <div className="chat-info">
                                <h3>{searchResults.name}</h3>
                                <p className="online-status">Found User</p>
                            </div>
                            <MessageSquarePlus size={18} className="add-icon" />
                        </div>
                        <hr className="divider" />
                    </div>
                )}
                
                <p className="section-title">Your Chats</p>
                {recentChats.length > 0 ? (
                    recentChats.map(chat => (
                        <div 
                            key={chat._id}
                            className={`chat-item ${activeChat?._id === chat._id ? 'active' : ''}`}
                            onClick={() => onSelectUser(chat)}
                        >
                            <img src={chat.photo} alt={chat.name} className="avatar" />
                            <div className="chat-info">
                                <h3>{chat.name}</h3>
                                <p className="online-status">Recent Connection</p>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="empty-state">
                        <p>Search users by phone to start a temporary 24h chat!</p>
                    </div>
                )}
            </div>

            <style>{`
                .sidebar {
                    width: 350px;
                    height: 100%;
                    display: flex;
                    flex-direction: column;
                    border-right: 1px solid rgba(255, 255, 255, 0.1);
                    transition: all 0.3s;
                }
                .sidebar-header {
                    padding: 25px;
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                }
                .user-profile {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                }
                .avatar {
                    width: 45px;
                    height: 45px;
                    border-radius: 14px;
                    object-fit: cover;
                    border: 2px solid var(--glass-border);
                }
                .user-info h3 { font-size: 16px; font-weight: 600; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 180px; }
                .user-info p { font-size: 12px; color: var(--text-dim); }
                
                .sidebar-search { padding: 0 20px 15px; }
                .sidebar-search form { position: relative; display: flex; align-items: center; }
                .sidebar-search .search-icon { position: absolute; left: 12px; color: var(--text-dim); pointer-events: none; }
                .sidebar-search input {
                    width: 100%;
                    padding: 10px 15px 10px 40px;
                    background: rgba(255, 255, 255, 0.05);
                    border: 1px solid var(--glass-border);
                    border-radius: 12px;
                    color: white;
                    font-size: 13px;
                    transition: 0.3s;
                }
                .sidebar-search input:focus { border-color: var(--primary); background: rgba(255, 255, 255, 0.1); }

                .chat-list {
                    flex: 1;
                    overflow-y: auto;
                    padding: 10px;
                }
                .section-title {
                    font-size: 12px;
                    font-weight: 600;
                    color: var(--text-dim);
                    text-transform: uppercase;
                    letter-spacing: 1px;
                    padding: 10px 15px;
                }
                .chat-item {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    padding: 12px 15px;
                    border-radius: 16px;
                    transition: all 0.2s;
                    cursor: pointer;
                    margin-bottom: 5px;
                }
                .chat-item:hover {
                    background: rgba(255, 255, 255, 0.05);
                }
                .chat-item.active {
                    background: rgba(99, 102, 241, 0.15);
                    border: 1px solid var(--glass-border);
                }
                .online-status {
                    font-size: 11px;
                    color: var(--accent);
                }
                .divider { border: none; border-top: 1px solid rgba(255, 255, 255, 0.05); margin: 15px 0; }
                .empty-state {
                    text-align: center;
                    padding: 40px 20px;
                    color: var(--text-dim);
                    font-size: 14px;
                }

                @media (max-width: 768px) {
                    .sidebar {
                        width: 100%;
                    }
                    .user-info, .section-title, .chat-info, .online-status, .empty-state p {
                        display: block; /* Shown because the container handles visibility */
                    }
                    .sidebar-search {
                        display: block;
                    }
                }
            `}</style>
        </div>
    );
};

export default Sidebar;
