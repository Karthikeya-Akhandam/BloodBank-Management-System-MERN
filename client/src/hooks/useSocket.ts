import { useEffect, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import { useAuth } from '../context/AuthContext';

export const useSocket = (onEvent?: (event: string, data: any) => void) => {
    const { user } = useAuth();
    const socketRef = useRef<Socket | null>(null);

    useEffect(() => {
        if (user) {
            const socketUrl = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000';
            socketRef.current = io(socketUrl);
            
            socketRef.current.on('connect', () => {
                console.log('Connected to socket');
                socketRef.current?.emit('join', user._id);
            });

            const events = ['new-donation', 'donation-status-update', 'new-request', 'request-status-update'];
            
            events.forEach(event => {
                socketRef.current?.on(event, (data) => {
                    console.log(`Event received: ${event}`, data);
                    if (onEvent) onEvent(event, data);
                });
            });

            return () => {
                socketRef.current?.disconnect();
            };
        }
    }, [user]);

    return socketRef.current;
};
