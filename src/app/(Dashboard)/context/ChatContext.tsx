'use client';

import React, { createContext, useContext } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch, RootState } from '@/app/redux/store';
import { useChatSocket } from '@/app/redux/api/chat/useChatSocket';
import {
  Conversation,
  Message,
  useGetConversationsQuery,
  useGetMessagesQuery,
  useSendMessageMutation,
} from '@/app/redux/api/chat/chatApi';
import {
  setActiveConversation,
  setTyping,
} from '@/app/redux/api/chat/chatSlice';
import { skipToken } from '@reduxjs/toolkit/query';

interface ChatContextType {
  conversations: Conversation[];
  messages: Message[];
  activeConversationId: string | null;
  selectConversation: (id: string) => void;
  sendMessage: (text: string, attachments?: string[]) => Promise<void>;
  isTyping: boolean;
  setTyping: (v: boolean) => void;
}

const ChatContext = createContext<ChatContextType | null>(null);

export const useChat = () => {
  const ctx = useContext(ChatContext);
  if (!ctx) throw new Error('useChat must be used inside ChatProvider');
  return ctx;
};

export function ChatProvider({ children }: { children: React.ReactNode }) {
  const dispatch = useDispatch<AppDispatch>();

  const { activeConversationId, typing } = useSelector(
    (state: RootState) => state.chat,
  );

  // 🔥 SOCKET (safe emitter only)
  const { emitMessage } = useChatSocket();

  // 🔥 GET CONVERSATIONS
  const { data: conversationsData } = useGetConversationsQuery();

  // 🔥 GET MESSAGES (safe skip without !)
  const { data: messagesData } = useGetMessagesQuery(
    activeConversationId ? { conversationId: activeConversationId } : skipToken,
  );

  const [sendMessageApi] = useSendMessageMutation();

  // 🔥 SEND MESSAGE
  async function sendMessage(text: string, attachments: string[] = []) {
    if (!activeConversationId) return;

    // Emit via socket (real-time)
    emitMessage('send_message', {
      conversationId: activeConversationId,
      message: {
        message: text,
        attachments,
      },
    });

    // Fallback persistence via REST
    await sendMessageApi({
      conversationId: activeConversationId,
      message: text,
      attachments,
    });
  }

  return (
    <ChatContext.Provider
      value={{
        conversations: conversationsData?.data ?? [],
        messages: messagesData?.data ?? [],
        activeConversationId,
        selectConversation: (id: string) => dispatch(setActiveConversation(id)),
        sendMessage,
        isTyping: typing,
        setTyping: (v: boolean) => dispatch(setTyping(v)),
      }}
    >
      {children}
    </ChatContext.Provider>
  );
}
