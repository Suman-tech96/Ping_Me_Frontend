import React, { useState } from "react";
import { Search, Bell, ChevronDown, Sun, Moon, Menu } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import API from "../utils/api";
import toast from "react-hot-toast";

const Navbar = ({ onSearchUser, onOpenProfile, onToggleSidebar }) => {
    const { user } = useAuth();
    const { theme, toggleTheme } = useTheme();
    const [searchTerm, setSearchTerm] = useState("");
    const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);

    const handleSearch = async (e) => {
        e.preventDefault();
        if (!searchTerm.trim()) return;

        try {
            const res = await API.get(`/user/phone/${searchTerm}`);
            if (res.data.success) {
                onSearchUser(res.data.user);
                setSearchTerm("");
            }
        } catch (err) {
            toast.error("User not found with this phone number");
        }
    };

    return (
        <nav className={`top-nav glass ${isMobileSearchOpen ? 'search-active' : ''}`}>
            <div className="nav-left">
                {!isMobileSearchOpen && (
                    <>
                        <button className="menu-btn" onClick={onToggleSidebar} title="Toggle Sidebar">
                            <Menu size={22} />
                        </button>
                        <div className="brand">
                            <div className="brand-dot"></div>
                            <h2>PingMe</h2>
                        </div>
                    </>
                )}
            </div>

            <div className={`nav-center ${isMobileSearchOpen ? 'mobile-open' : ''}`}>
                <div className="nav-search-bar">
                    <form onSubmit={handleSearch}>
                        <Search className="search-icon" size={18} />
                        <input 
                            type="text" 
                            placeholder="Find by phone..." 
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <button type="submit" className="nav-search-btn">Find</button>
                    </form>
                    {isMobileSearchOpen && (
                        <button className="close-search" onClick={() => setIsMobileSearchOpen(false)}>×</button>
                    )}
                </div>
            </div>

            <div className="nav-right">
                <div className="nav-icons">
                    <button className="mobile-search-trigger" onClick={() => setIsMobileSearchOpen(true)}>
                        <Search size={20} />
                    </button>
                    <div className="theme-toggle" onClick={toggleTheme} title={`Switch mode`}>
                        {theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
                    </div>
                </div>
                <div className="nav-profile" onClick={onOpenProfile}>
                    <img src={user?.photo} alt={user?.name} className="nav-avatar" />
                    <span className="nav-username">{user?.name}</span>
                </div>
            </div>

            <style>{`
                .top-nav {
                    height: 70px;
                    width: 100%;
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    padding: 0 30px;
                    border-bottom: 1px solid var(--glass-border);
                    z-index: 100;
                }
                .nav-left { display: flex; align-items: center; gap: 15px; }
                .menu-btn {
                    background: transparent;
                    color: var(--text-dim);
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    transition: 0.2s;
                    padding: 5px;
                    border-radius: 8px;
                }
                .menu-btn:hover { background: rgba(255,255,255,0.05); color: var(--primary); }
                .nav-left .brand { display: flex; align-items: center; gap: 10px; }
                .brand-dot { width: 12px; height: 12px; border-radius: 50%; background: var(--accent); box-shadow: 0 0 10px var(--accent); }
                .brand h2 { font-size: 20px; font-weight: 700; background: var(--grad-main); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
                .nav-center { flex: 0 1 500px; }
                .nav-search-bar { width: 100%; }
                .nav-search-bar form { position: relative; display: flex; align-items: center; }
                .nav-search-bar .search-icon { position: absolute; left: 15px; color: var(--text-dim); }
                .nav-search-bar input {
                    width: 100%;
                    padding: 12px 15px 12px 45px;
                    background: rgba(255, 255, 255, 0.1);
                    border: 1px solid var(--glass-border);
                    border-radius: 12px;
                    color: white;
                    font-size: 14px;
                    transition: 0.3s;
                }
                .nav-search-bar input::placeholder { color: rgba(255, 255, 255, 0.5); }
                .nav-search-bar input:focus { border-color: var(--primary); background: rgba(255, 255, 255, 0.15); box-shadow: 0 0 0 4px rgba(99, 102, 241, 0.1); }
                .nav-search-btn {
                    position: absolute;
                    right: 8px;
                    padding: 6px 15px;
                    background: var(--grad-main);
                    border-radius: 8px;
                    color: white;
                    font-size: 12px;
                    font-weight: 600;
                }
                .nav-right { display: flex; align-items: center; gap: 25px; }
                .nav-icons { color: var(--text-dim); display: flex; gap: 20px; align-items: center; }
                .theme-toggle { cursor: pointer; display: flex; align-items: center; transition: 0.3s; }
                .theme-toggle:hover { color: var(--primary); transform: rotate(15deg); }
                .nav-icn { cursor: pointer; transition: 0.3s; }
                .nav-icn:hover { color: white; }
                .nav-profile { display: flex; align-items: center; gap: 10px; cursor: pointer; padding: 5px 10px; border-radius: 12px; }
                .nav-profile:hover { background: rgba(255, 255, 255, 0.05); }
                .nav-avatar { width: 32px; height: 32px; border-radius: 8px; object-fit: cover; }
                .nav-username { font-size: 14px; font-weight: 500; }

                .mobile-search-trigger { display: none; background: transparent; color: var(--text-dim); }

                @media (max-width: 768px) {
                    .top-nav { padding: 0 15px; }
                    .nav-username, .nav-icn:not(.menu-btn *) { display: none; }
                    .nav-center {
                        display: none;
                        position: absolute;
                        top: 0;
                        left: 0;
                        width: 100%;
                        height: 100%;
                        background: var(--bg-main);
                        padding: 0 15px;
                        z-index: 150;
                    }
                    .nav-center.mobile-open { display: flex; align-items: center; }
                    .mobile-search-trigger { display: flex; }
                    .close-search {
                        margin-left: 10px;
                        font-size: 28px;
                        color: var(--text-dim);
                        background: transparent;
                    }
                }
            `}</style>
        </nav>
    );
};

export default Navbar;
