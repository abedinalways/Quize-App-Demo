import { baseApi } from '../../api/baseApi';

interface ApiResponse<T> {
  success: boolean;
  data: T;
}

interface ChatUser {
  id: string;
  name: string;
  avatar?: string;
}

interface ChatAttachment {
  id: string;
  file_url: string;
  type: string;
  name: string;
  size?: number;
}

export interface Conversation {
  id: string;
  creator_id: string;
  participant_id: string;
  created_at: string;
  updated_at: string;
}

export interface Message {
  id: string;
  message: string | null;
  created_at: string;
  status: string;
  sender: ChatUser;
  receiver: ChatUser;
  attachments: ChatAttachment[];
}

export const chatApi = baseApi.injectEndpoints({
  endpoints: builder => ({
    getConversations: builder.query<ApiResponse<Conversation[]>, void>({
      query: () => ({
        url: '/chat/conversation',
        method: 'GET',
      }),
      providesTags: ['Chat'],
    }),

    getMessages: builder.query<
      ApiResponse<Message[]>,
      { conversationId: string; limit?: number }
    >({
      query: ({ conversationId, limit = 20 }) => ({
        url: '/chat/message',
        method: 'GET',
        params: {
          conversation_id: conversationId,
          limit,
        },
      }),
      providesTags: (result, error, arg) => [
        { type: 'Chat', id: arg.conversationId },
      ],
    }),

    sendMessage: builder.mutation<
      ApiResponse<Message>,
      {
        conversationId: string;
        message?: string;
        attachments?: string[];
      }
    >({
      query: body => ({
        url: '/chat/message',
        method: 'POST',
        body,
      }),
      invalidatesTags: (result, error, arg) => [
        { type: 'Chat', id: arg.conversationId },
      ],
    }),
  }),
});

export const {
  useGetConversationsQuery,
  useGetMessagesQuery,
  useSendMessageMutation,
} = chatApi;
