// import { baseApi } from './baseApi';

// export interface StartTestPayload {
//   total_questions: number;
//   test_mode: string[];
//   difficulty: string;
//   topic: string[];
// }

// export interface AnswerOption {
//   id: string;
//   option_text: string;
// }

// export interface Question {
//   id: string;
//   question_statement: string;
//   question_title: string;
//   answer_options: AnswerOption[];
// }

// export interface StartTestResponse {
//   success: boolean;
//   message: string;
//   data: {
//     id: string;
//     test_mode: string[];
//     total_questions: number;
//     questions: Question[];
//   };
// }

// export const startTestApi = baseApi.injectEndpoints({
//   endpoints: builder => ({

//     startTest: builder.mutation<StartTestResponse, StartTestPayload>({
//       query: body => ({
//         url: '/test',
//         method: 'POST',
//         body,
//         credentials: 'include',
//       }),
//     }),
//   }),
//   overrideExisting: false,
// });

// export const { useStartTestMutation } = startTestApi;

import { baseApi } from './baseApi';

export interface StartTestPayload {
  total_questions: number;
  test_mode: string[];
  difficulty: string;
  topic: string[];
}

export interface AnswerOption {
  id: string;
  option_text: string;
}

export interface Question {
  id: string;
  question_steam: string;
  question_title: string;
  answerOptions: AnswerOption[];
}

export interface StartTestResponse {
  success: boolean;
  message: string;
  data: {
    id: string;
    test_mode: string[];
    total_questions: number;
    questions: Question[];
  };
}

export const startTestApi = baseApi.injectEndpoints({
  endpoints: builder => ({
    startTest: builder.mutation<StartTestResponse, StartTestPayload>({
      query: body => ({
        url: '/test',
        method: 'POST',
        body,
        credentials: 'include',
      
      }),
    }),
  }),
});

export const { useStartTestMutation } = startTestApi;