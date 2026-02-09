import { baseApi } from "./baseApi";

export interface Root {
  success: boolean;
  message: string;
  data: Daum[];
  meta_data: MetaData;
}

export interface Daum {
  id: string;
  created_at: string;
  test_mode: string[];
  difficulty: string;
  topic: string[];
  total_questions: number;
  score: number;
  is_completed: boolean;
}

export interface MetaData {
  page: number;
  limit: number;
  total: number;
}

export const previousTestHistoryApi = baseApi.injectEndpoints({
  endpoints: builder => ({
    getTestHistoryStats: builder.query<Daum, void>({
      query: () => ({
        url: '/test/histories',
        method: 'GET',
        credentials: 'include',
      }),
    }),
  }),
  overrideExisting: false,
});

export const { useGetTestHistoriesQuery } = previousTestHistoryApi;