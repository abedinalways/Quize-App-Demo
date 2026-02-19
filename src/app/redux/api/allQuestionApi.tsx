import { baseApi } from './baseApi';

/* ================= TYPES ================= */

export interface Question {
  id: string;
  question_title: string;
  question_id: string;
  difficulty: 'Intern' | 'Senior' | 'Boards';
  topic: string[];
}

export interface QuestionMeta {
  total: number;
  page: number;
  limit: number;
  totalPage: number;
  next: number | null;
  previous: number | null;
}

export interface GetQuestionsResponse {
  success: boolean;
  message: string;
  data: Question[];
  meta: QuestionMeta;
}

export interface GetQuestionsParams {
  page?: number;
  limit?: number;
  search?: string;
}

/* ================= API ================= */

export const allQuestionApi = baseApi.injectEndpoints({
  endpoints: builder => ({
    /* ---------- GET ALL QUESTIONS ---------- */
    getQuestions: builder.query<
      GetQuestionsResponse,
      GetQuestionsParams | undefined
    >({
      query: params => ({
        url: '/admin/questions',
        method: 'GET',
        params,
      }),
      providesTags: ['allQuestions'],
    }),

    /* ---------- GET SINGLE QUESTION ---------- */
    getSingleQuestion: builder.query<Question, string>({
      query: id => ({
        url: `/admin/questions/${id}`,
        method: 'GET',
      }),
      providesTags: ['allQuestions'],
    }),

    /* ---------- DELETE QUESTION ---------- */
    deleteQuestion: builder.mutation<
      { success: boolean; message: string },
      string
    >({
      query: id => ({
        url: `/admin/questions/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['allQuestions'],
    }),
    /* ---------- UPDATE QUESTION ---------- */
    updateQuestion: builder.mutation<
      { success: boolean; message: string },
      { id: string; formData: FormData }
    >({
      query: ({ id, formData }) => ({
        url: `/admin/questions/${id}`,
        method: 'PATCH',
        body: formData,
      }),
      invalidatesTags: ['allQuestions'],
    }),
  }),
});

export const {
  useGetQuestionsQuery,
  useGetSingleQuestionQuery,
  useDeleteQuestionMutation,
  useUpdateQuestionMutation,
} = allQuestionApi;
