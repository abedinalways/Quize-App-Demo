'use client';

import { useEffect, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch, RootState } from '../../store';
import { chatApi } from './chatApi';
import type { Message } from './chatApi';

interface SocketMessage extends Message {
  conversationId: string;
}

export function useChatSocket() {
  const socketRef = useRef<Socket | null>(null);
  const dispatch = useDispatch<AppDispatch>();

  const { activeConversationId } = useSelector(
    (state: RootState) => state.chat,
  );

  useEffect(() => {
    const socketInstance = io(process.env.NEXT_PUBLIC_SOCKET_URL!, {
      auth: {
        token: localStorage.getItem('token'),
      },
    });

    socketRef.current = socketInstance;

    socketInstance.on('receive_message', (message: SocketMessage) => {
      dispatch(
        chatApi.util.updateQueryData(
          'getMessages',
          { conversationId: message.conversationId },
          draft => {
            draft.data.push(message);
          },
        ),
      );
    });

    return () => {
      socketInstance.disconnect();
    };
  }, [dispatch]);

  useEffect(() => {
    if (!socketRef.current || !activeConversationId) return;

    socketRef.current.emit('join_conversation', activeConversationId);
  }, [activeConversationId]);

  const emitMessage = (event: string, payload: unknown) => {
    socketRef.current?.emit(event, payload);
  };

  return { emitMessage };
}
