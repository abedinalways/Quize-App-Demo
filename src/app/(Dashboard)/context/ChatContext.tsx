'use client';

import React, { createContext, useContext, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { store, type AppDispatch, type RootState } from '@/app/redux/store';
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
  sendMessage: (text: string, attachments?: File[]) => Promise<void>;
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

  const { joinConversation } = useChatSocket();

  const { data: conversationsData } = useGetConversationsQuery();

  const { data: messagesData } = useGetMessagesQuery(
    activeConversationId
      ? { conversationId: activeConversationId, limit: 20 }
      : skipToken,
  );

  const [sendMessageApi] = useSendMessageMutation();

  // ✅ auto select first conversation
  useEffect(() => {
    const list = conversationsData?.data ?? [];
    if (!activeConversationId && list.length > 0) {
      dispatch(setActiveConversation(list[0].id));
    }
  }, [conversationsData, activeConversationId, dispatch]);

  // ✅ join socket room when conversation changes
  useEffect(() => {
    if (!activeConversationId) return;
    joinConversation(activeConversationId);
  }, [activeConversationId, joinConversation]);

  async function sendMessage(text: string, attachments: File[] = []) {
    if (!activeConversationId) return;

    const conv = conversationsData?.data?.find(
      c => c.id === activeConversationId,
    );
    if (!conv) return;

    const meId = store.getState().auth?.user?.id;

    // ✅ dynamic receiver id
    const receiverId =
      conv.creator_id === meId ? conv.participant_id : conv.creator_id;

    await sendMessageApi({
      conversationId: activeConversationId,
      receiverId,
      message: text,
      attachments,
    }).unwrap();
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
