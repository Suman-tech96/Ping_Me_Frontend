import React from "react";
import { Trash2, Check, CheckCheck } from "lucide-react";

const Message = ({ data, isOwn, onUnsend }) => {
    return (
        <div className={`message-row ${isOwn ? "own" : "other"}`}>
            <div className="message-content glass">
                {data.image ? (
                    <img src={data.image} alt="Shared" className="chat-image" onClick={() => window.open(data.image)} />
                ) : (
                    <p className={`text ${data.message?.includes("Missed") ? "call-alert" : ""}`}>
                        {data.message}
                    </p>
                )}
                
                <div className="message-info">
                    <span className="time">
                        {new Date(data.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                    {isOwn && (
                        <div className="status-icons">
                            {data.status === "seen" ? (
                                <CheckCheck size={14} className="tick seen" />
                            ) : (
                                <Check size={14} className="tick" />
                            )}
                            <button className="unsend-icon" onClick={() => onUnsend(data._id)} title="Unsend">
                                <Trash2 size={12} />
                            </button>
                        </div>
                    )}
                </div>
            </div>

            <style>{`
                .message-row { display: flex; width: 100%; margin-bottom: 5px; }
                .message-row.own { justify-content: flex-end; }
                .message-row.other { justify-content: flex-start; }

                .message-content {
                    max-width: 65%;
                    padding: 10px 14px;
                    border-radius: 18px;
                    position: relative;
                    transition: 0.3s;
                }
                .own .message-content {
                    background: var(--grad-main);
                    border-bottom-right-radius: 4px;
                    color: white;
                    box-shadow: 0 4px 15px rgba(99, 102, 241, 0.2);
                }
                .other .message-content {
                    background: var(--msg-received);
                    border: 1px solid var(--glass-border);
                    border-bottom-left-radius: 4px;
                }

                .chat-image {
                    max-width: 100%;
                    max-height: 250px;
                    border-radius: 12px;
                    display: block;
                    cursor: pointer;
                    margin-bottom: 5px;
                }
                .text { font-size: 15px; line-height: 1.5; }
                .call-alert { color: #fbbf24; font-weight: 500; font-style: italic; }

                .message-info {
                    display: flex;
                    align-items: center;
                    justify-content: flex-end;
                    gap: 8px;
                    margin-top: 4px;
                    opacity: 0.6;
                    font-size: 10px;
                }
                .unsend-icon {
                    background: transparent;
                    color: inherit;
                    cursor: pointer;
                    opacity: 0.4;
                    transition: 0.2s;
                }
                .unsend-icon:hover { opacity: 1; color: var(--danger); }

                .status-icons {
                    display: flex;
                    align-items: center;
                    gap: 4px;
                }
                .tick {
                    opacity: 0.8;
                }
                .tick.seen {
                    color: #38bdf8;
                }

                @media (max-width: 768px) {
                    .message-content { max-width: 85%; }
                }
            `}</style>
        </div>
    );
};

export default Message;
