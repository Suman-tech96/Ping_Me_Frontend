import React, { useEffect, useRef, useState } from "react";
import { Phone, PhoneOff, Video, VideoOff, Mic, MicOff, Camera } from "lucide-react";

const VideoCallModal = ({ 
    socket, 
    myId, 
    myName, 
    recipientId, 
    recipientName, 
    isIncoming, 
    initialSignal, 
    callType, // 'voice' or 'video'
    onClose 
}) => {
    const [callAccepted, setCallAccepted] = useState(false);
    const [isMuted, setIsMuted] = useState(false);
    const [isVideoOff, setIsVideoOff] = useState(callType === 'voice');
    
    const localVideo = useRef();
    const remoteVideo = useRef();
    const connectionRef = useRef();
    const localStreamRef = useRef();
    const timeoutRef = useRef();

    useEffect(() => {
        setupMedia();

        // 30 seconds timeout for ringing
        timeoutRef.current = setTimeout(() => {
            if (!callAccepted) {
                handleTimeout();
            }
        }, 30000);

        return () => {
            if (timeoutRef.current) clearTimeout(timeoutRef.current);
            endCall();
        };
    }, []);

    const handleTimeout = () => {
        if (!isIncoming) {
            // If we are calling, we can log a missed call message
            sendMissedCallNotification();
        }
        endCall();
    };

    const sendMissedCallNotification = () => {
        socket.emit("sendMessage", {
            roomId: [myId, recipientId].sort().join("_"),
            message: `📞 Missed ${callType} call`,
            recipientId: recipientId
        });
    };

    const setupMedia = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ 
                video: callType === 'video', 
                audio: true 
            });
            localStreamRef.current = stream;
            if (localVideo.current) localVideo.current.srcObject = stream;

            // Define PeerConnection
            const pc = new RTCPeerConnection({
                iceServers: [{ urls: "stun:stun.l.google.com:19302" }]
            });
            connectionRef.current = pc;

            // Add local tracks
            stream.getTracks().forEach(track => pc.addTrack(track, stream));

            // Handle remote track
            pc.ontrack = (event) => {
                if (remoteVideo.current) remoteVideo.current.srcObject = event.streams[0];
            };

            // Handle ICE candidates
            pc.onicecandidate = (event) => {
                if (event.candidate) {
                    socket.emit("ice-candidate", { to: recipientId, candidate: event.candidate });
                }
            };

            // Socket Listeners for Signaling
            socket.on("callAccepted", async (signal) => {
                console.log("Call Accepted by remote");
                setCallAccepted(true);
                if (timeoutRef.current) clearTimeout(timeoutRef.current);
                await pc.setRemoteDescription(new RTCSessionDescription(signal));
            });

            socket.on("ice-candidate", async (candidate) => {
                try {
                    await pc.addIceCandidate(new RTCIceCandidate(candidate));
                } catch (e) {
                    console.error("Error adding ice candidate", e);
                }
            });

            socket.on("endCall", () => {
                onClose();
            });

            socket.on("callRejected", () => {
                alert("Call rejected");
                onClose();
            });

            // If it's incoming, we wait for Answer click. 
            // If it's outgoing, we create Offer now.
            if (!isIncoming) {
                const offer = await pc.createOffer();
                await pc.setLocalDescription(offer);
                socket.emit("callUser", {
                    userToCall: recipientId,
                    signalData: offer,
                    from: myId,
                    name: myName,
                    callType: callType
                });
            } else if (initialSignal) {
                // Pre-set remote description for incoming call if signal exists
                await pc.setRemoteDescription(new RTCSessionDescription(initialSignal));
            }

        } catch (err) {
            console.error("Media Error:", err);
            alert("Could not access camera/microphone");
            onClose();
        }
    };

    const answerCall = async () => {
        setCallAccepted(true);
        const pc = connectionRef.current;
        const answer = await pc.createAnswer();
        await pc.setLocalDescription(answer);
        socket.emit("answerCall", { signal: answer, to: recipientId });
    };

    const rejectCall = () => {
        socket.emit("callRejected", { to: recipientId });
        onClose();
    };

    const endCall = () => {
        if (localStreamRef.current) {
            localStreamRef.current.getTracks().forEach(track => track.stop());
        }
        if (connectionRef.current) {
            connectionRef.current.close();
        }
        socket.emit("endCall", { to: recipientId });
        onClose();
    };

    const toggleMute = () => {
        const enabled = localStreamRef.current.getAudioTracks()[0].enabled;
        localStreamRef.current.getAudioTracks()[0].enabled = !enabled;
        setIsMuted(enabled);
    };

    const toggleVideo = () => {
        if (callType === 'voice') return;
        const enabled = localStreamRef.current.getVideoTracks()[0].enabled;
        localStreamRef.current.getVideoTracks()[0].enabled = !enabled;
        setIsVideoOff(enabled);
    };

    return (
        <div className="call-overlay">
            <div className="call-container glass">
                <div className="call-header">
                    <div className="caller-info">
                        <div className="call-avatar">
                            {recipientName.charAt(0)}
                        </div>
                        <h3>{recipientName}</h3>
                        <p>{callAccepted ? "In conversation..." : isIncoming ? "Incoming call" : "Ringing..."}</p>
                    </div>
                </div>

                <div className="video-streams">
                    {callType === 'video' && (
                        <video playsInline muted ref={localVideo} autoPlay className="local-video" />
                    )}
                    {callAccepted && (
                        <video playsInline ref={remoteVideo} autoPlay className="remote-video" />
                    )}
                    
                    {!callAccepted && isIncoming && (
                        <div className="ringing-animation">
                            <Phone className="ring-icon" size={48} />
                        </div>
                    )}
                </div>

                <div className="call-controls">
                    {!callAccepted && isIncoming ? (
                        <>
                            <button onClick={answerCall} className="control-btn accept">
                                <Phone size={24} />
                            </button>
                            <button onClick={rejectCall} className="control-btn reject">
                                <PhoneOff size={24} />
                            </button>
                        </>
                    ) : (
                        <>
                            <button onClick={toggleMute} className={`control-btn ${isMuted ? 'off' : ''}`}>
                                {isMuted ? <MicOff size={22} /> : <Mic size={22} />}
                            </button>
                            
                            {callType === 'video' && (
                                <button onClick={toggleVideo} className={`control-btn ${isVideoOff ? 'off' : ''}`}>
                                    {isVideoOff ? <VideoOff size={22} /> : <Video size={22} />}
                                </button>
                            )}

                            <button onClick={endCall} className="control-btn end">
                                <PhoneOff size={24} />
                            </button>
                        </>
                    )}
                </div>
            </div>

            <style>{`
                .call-overlay {
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100vw;
                    height: 100vh;
                    background: rgba(0,0,0,0.9);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    z-index: 2000;
                    backdrop-filter: blur(10px);
                }
                .call-container {
                    width: 90%;
                    max-width: 450px;
                    padding: 30px 20px;
                    border-radius: 32px;
                    text-align: center;
                    display: flex;
                    flex-direction: column;
                    gap: 30px;
                    border: 1px solid var(--glass-border);
                }
                @media (max-width: 480px) {
                    .call-container { padding: 20px 15px; }
                    .call-avatar { width: 80px; height: 80px; font-size: 32px; }
                }
                .call-avatar {
                    width: 100px;
                    height: 100px;
                    background: var(--grad-main);
                    border-radius: 50%;
                    margin: 0 auto 15px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 40px;
                    color: white;
                    font-weight: bold;
                    box-shadow: 0 0 30px rgba(99, 102, 241, 0.4);
                }
                .video-streams {
                    position: relative;
                    width: 100%;
                    aspect-ratio: 4/3;
                    background: #000;
                    border-radius: 20px;
                    overflow: hidden;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
                .local-video {
                    position: absolute;
                    top: 15px;
                    right: 15px;
                    width: 120px;
                    border-radius: 12px;
                    border: 2px solid white;
                    z-index: 10;
                }
                .remote-video {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                }
                .call-controls {
                    display: flex;
                    justify-content: center;
                    gap: 20px;
                }
                .control-btn {
                    width: 60px;
                    height: 60px;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: white;
                    background: rgba(255,255,255,0.1);
                    transition: 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
                }
                .control-btn:hover { transform: scale(1.15); }
                .control-btn.accept { background: #10b981; }
                .control-btn.reject, .control-btn.end { background: #ef4444; }
                .control-btn.off { background: rgba(239, 68, 68, 0.2); color: #ef4444; }

                .ring-icon {
                    color: #10b981;
                    animation: ringPulse 1.5s infinite;
                }
                @keyframes ringPulse {
                    0% { transform: scale(1); opacity: 1; }
                    50% { transform: scale(1.2); opacity: 0.5; }
                    100% { transform: scale(1); opacity: 1; }
                }
            `}</style>
        </div>
    );
};

export default VideoCallModal;
