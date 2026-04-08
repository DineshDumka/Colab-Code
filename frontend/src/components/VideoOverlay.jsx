import React, { useEffect, useRef, useState } from 'react';
import Peer from 'simple-peer';
import { Video, VideoOff, Mic, MicOff, Move } from 'lucide-react';

export const VideoOverlay = ({ socket, roomId }) => {
    const [stream, setStream] = useState(null);
    const [peerStream, setPeerStream] = useState(null);
    const [isVideoOn, setIsVideoOn] = useState(true);
    const [isAudioOn, setIsAudioOn] = useState(true);
    
    // Draggable positioning
    const [position, setPosition] = useState({ x: window.innerWidth - 300, y: window.innerHeight - 200 });
    const dragRef = useRef({ isDragging: false, startX: 0, startY: 0 });

    const myVideo = useRef();
    const peerVideo = useRef();
    const peerRef = useRef();

    useEffect(() => {
        navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then((currentStream) => {
            setStream(currentStream);
            if (myVideo.current) {
                myVideo.current.srcObject = currentStream;
            }

            // Immediately offer to any existing users
            socket.emit("webrtc-join-request", { roomId });
        }).catch(err => console.error("WebRTC getUserMedia Error:", err));

        // When someone joins, they emit request, we create offer
        socket.on('webrtc-join-request', ({ fromSocketId }) => {
            if (fromSocketId !== socket.id && stream) {
                const peer = createPeer(fromSocketId, socket.id, stream);
                peerRef.current = peer;
            }
        });

        socket.on("webrtc-offer", ({ offer, fromSocketId }) => {
            const peer = addPeer(offer, fromSocketId, stream);
            peerRef.current = peer;
        });

        socket.on("webrtc-answer", ({ answer }) => {
            if (peerRef.current) {
                peerRef.current.signal(answer);
            }
        });

        socket.on("webrtc-ice-candidate", ({ candidate }) => {
            if (peerRef.current) {
                peerRef.current.signal(candidate);
            }
        });

        return () => {
            socket.off("webrtc-join-request");
            socket.off("webrtc-offer");
            socket.off("webrtc-answer");
            socket.off("webrtc-ice-candidate");
            if (stream) stream.getTracks().forEach(t => t.stop());
            if (peerRef.current) peerRef.current.destroy();
        };
    }, []);

    const createPeer = (userToSignal, callerID, currentStream) => {
        const peer = new Peer({
            initiator: true,
            trickle: false,
            stream: currentStream,
        });

        peer.on("signal", signal => {
            if (signal.type === 'offer') {
                socket.emit("webrtc-offer", { toSocketId: userToSignal, offer: signal, roomId });
            } else {
                socket.emit("webrtc-ice-candidate", { toSocketId: userToSignal, candidate: signal, roomId });
            }
        });

        peer.on("stream", receivedStream => {
            setPeerStream(receivedStream);
            if (peerVideo.current) peerVideo.current.srcObject = receivedStream;
        });

        return peer;
    }

    const addPeer = (incomingSignal, callerID, currentStream) => {
        const peer = new Peer({
            initiator: false,
            trickle: false,
            stream: currentStream,
        });

        peer.on("signal", signal => {
            if (signal.type === 'answer') {
                socket.emit("webrtc-answer", { toSocketId: callerID, answer: signal, roomId });
            } else {
                socket.emit("webrtc-ice-candidate", { toSocketId: callerID, candidate: signal, roomId });
            }
        });

        peer.on("stream", receivedStream => {
            setPeerStream(receivedStream);
            if (peerVideo.current) peerVideo.current.srcObject = receivedStream;
        });

        peer.signal(incomingSignal);
        return peer;
    }

    const toggleVideo = () => {
        if (stream) {
            stream.getVideoTracks()[0].enabled = !isVideoOn;
            setIsVideoOn(!isVideoOn);
        }
    };

    const toggleAudio = () => {
        if (stream) {
            stream.getAudioTracks()[0].enabled = !isAudioOn;
            setIsAudioOn(!isAudioOn);
        }
    };

    const onMouseDown = (e) => {
        dragRef.current = {
            isDragging: true,
            startX: e.clientX - position.x,
            startY: e.clientY - position.y
        };
    };

    const onMouseMove = (e) => {
        if (dragRef.current.isDragging) {
            setPosition({
                x: e.clientX - dragRef.current.startX,
                y: e.clientY - dragRef.current.startY
            });
        }
    };

    const onMouseUp = () => {
        dragRef.current.isDragging = false;
    };

    useEffect(() => {
        document.addEventListener('mousemove', onMouseMove);
        document.addEventListener('mouseup', onMouseUp);
        return () => {
            document.removeEventListener('mousemove', onMouseMove);
            document.removeEventListener('mouseup', onMouseUp);
        }
    }, [position]);

    if (!stream) return null;

    return (
        <div 
            className="fixed z-50 rounded-2xl overflow-hidden shadow-2xl border-2 border-emerald-500/30 bg-[#05030a]"
            style={{ left: position.x, top: position.y, width: 240 }}
        >
            {/* Drag Handle */}
            <div 
                className="bg-emerald-500/20 p-2 cursor-grab active:cursor-grabbing flex justify-between items-center"
                onMouseDown={onMouseDown}
            >
                <div className="flex gap-2">
                    <button onClick={toggleAudio} className={`p-1.5 rounded-md ${isAudioOn ? 'bg-white/10 text-emerald-400' : 'bg-red-500/20 text-red-400'}`}>
                        {isAudioOn ? <Mic size={14} /> : <MicOff size={14} />}
                    </button>
                    <button onClick={toggleVideo} className={`p-1.5 rounded-md ${isVideoOn ? 'bg-white/10 text-emerald-400' : 'bg-red-500/20 text-red-400'}`}>
                        {isVideoOn ? <Video size={14} /> : <VideoOff size={14} />}
                    </button>
                </div>
                <Move size={14} className="text-white/40" />
            </div>

            {/* Video Streams */}
            <div className="relative h-[150px] bg-black">
                {peerStream ? (
                    <video playsInline ref={peerVideo} autoPlay className="w-full h-full object-cover" />
                ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center text-white/30 text-xs gap-2">
                        <div className="w-6 h-6 border-2 border-white/10 border-t-emerald-400 rounded-full animate-spin" />
                        Waiting for peer...
                    </div>
                )}
                
                {/* Picture in Picture for self */}
                <div className="absolute bottom-2 right-2 w-20 h-28 bg-black rounded-lg overflow-hidden border border-white/20 shadow-lg">
                    <video playsInline muted ref={myVideo} autoPlay className="w-full h-full object-cover" style={{ transform: 'scaleX(-1)' }} />
                </div>
            </div>
        </div>
    );
};
