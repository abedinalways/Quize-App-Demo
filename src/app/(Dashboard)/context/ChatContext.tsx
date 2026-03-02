'use client';

import React, { createContext, useContext, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch, RootState } from '@/app/redux/store';
import { useChatSocket } from '@/app/redux/api/chat/useChatSocket';
import {
  useGetConversationsQuery,
  useGetMessagesQuery,
  useSendMessageMutation,
  Conversation,
  Message,
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

  const { joinConversation, emitMessage } = useChatSocket();

  const { data: conversationsData } = useGetConversationsQuery();

  const { data: messagesData } = useGetMessagesQuery(
    activeConversationId ? { conversationId: activeConversationId } : skipToken,
  );

  const [sendMessageApi] = useSendMessageMutation();

  useEffect(() => {
    if (activeConversationId) {
      joinConversation(activeConversationId);
    }
  }, [activeConversationId, joinConversation]);

  async function sendMessage(text: string, attachments: string[] = []) {
    if (!activeConversationId) return;

    // Optimistic UI
    emitMessage({
      conversationId: activeConversationId,
      message: text,
      attachments,
    });

    // Persist
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
        selectConversation: id => dispatch(setActiveConversation(id)),
        sendMessage,
        isTyping: typing,
        setTyping: v => dispatch(setTyping(v)),
      }}
    >
      {children}
    </ChatContext.Provider>
  );
}
