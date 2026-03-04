'use client';

import { useEffect, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import { useDispatch } from 'react-redux';
import type { AppDispatch } from '../../store';
import { chatApi } from './chatApi';
import type { Message } from './chatApi';
import Cookies from 'js-cookie';

interface SocketMessage extends Message {
  conversationId: string;
}

export function useChatSocket() {
  const socketRef = useRef<Socket | null>(null);
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    // const socket = io(process.env.NEXT_PUBLIC_SOCKET_URL!, {
    //   transports: ['websocket'],
    //   auth: {
    //     token: localStorage.getItem('token'),
    //   },
    // });

    const token = Cookies.get('token');
    console.log('==================  Connecting to socket with token:', token);

    const socket = io('http://192.168.7.42:4004', {
      extraHeaders: {
        authorization: `Bearer ${token}`,
      },
    });

    socketRef.current = socket;

    socket.on('connect', () => {
      console.log(' Socket Connected:', socket.id);
    });
    console.log('Initial messages:');

    socket.on('message', (message: SocketMessage) => {
      console.log(message, 'my message');
      alert('New message received: ' + message.message);
      dispatch(
        chatApi.util.updateQueryData(
          'getMessages',
          { conversationId: message.conversationId, limit: 50 },
          draft => {
            if (!draft?.data) draft.data = [];

            // avoid duplicates
            const exists = draft.data.some(m => m.id === message.id);
            if (!exists) {
              draft.data.push(message);
            }
          },
        ),
      );
    });

    return () => {
      socket.disconnect();
    };
  }, [dispatch]);

  const joinConversation = (conversationId: string) => {
    socketRef.current?.emit('join_conversation', conversationId);
  };

  return { joinConversation };
}
