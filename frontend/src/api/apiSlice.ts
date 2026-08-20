import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { Board, Card, CreateCardPayload, ReorderItem, UpdateCardPayload } from '../types';

const baseUrl = import.meta.env.VITE_API_BASE_URL || '/api';

export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({ baseUrl }),
  tagTypes: ['Board'],
  endpoints: (builder) => ({
    createBoard: builder.mutation<Board, { name: string }>({
      query: (body) => ({ url: '/boards', method: 'POST', body }),
    }),
    getBoard: builder.query<Board, string>({
      query: (boardId) => `/boards/${boardId}`,
      providesTags: (_result, _err, id) => [{ type: 'Board', id }],
    }),
    updateBoard: builder.mutation<Board, { boardId: string; name: string }>({
      query: ({ boardId, name }) => ({
        url: `/boards/${boardId}`,
        method: 'PATCH',
        body: { name },
      }),
      invalidatesTags: (_result, _err, { boardId }) => [{ type: 'Board', id: boardId }],
    }),
    deleteBoard: builder.mutation<void, string>({
      query: (boardId) => ({ url: `/boards/${boardId}`, method: 'DELETE' }),
    }),
    createCard: builder.mutation<Card, { boardId: string; payload: CreateCardPayload }>({
      query: ({ boardId, payload }) => ({
        url: `/boards/${boardId}/cards`,
        method: 'POST',
        body: payload,
      }),
      invalidatesTags: (_result, _err, { boardId }) => [{ type: 'Board', id: boardId }],
    }),
    updateCard: builder.mutation<
      Card,
      { boardId: string; cardId: string; payload: UpdateCardPayload }
    >({
      query: ({ boardId, cardId, payload }) => ({
        url: `/boards/${boardId}/cards/${cardId}`,
        method: 'PATCH',
        body: payload,
      }),
      invalidatesTags: (_result, _err, { boardId }) => [{ type: 'Board', id: boardId }],
    }),
    deleteCard: builder.mutation<void, { boardId: string; cardId: string }>({
      query: ({ boardId, cardId }) => ({
        url: `/boards/${boardId}/cards/${cardId}`,
        method: 'DELETE',
      }),
      invalidatesTags: (_result, _err, { boardId }) => [{ type: 'Board', id: boardId }],
    }),
    reorderCards: builder.mutation<void, { boardId: string; cards: ReorderItem[] }>({
      query: ({ boardId, cards }) => ({
        url: `/boards/${boardId}/cards/reorder`,
        method: 'PATCH',
        body: { cards },
      }),
    }),
  }),
});

export const {
  useCreateBoardMutation,
  useGetBoardQuery,
  useUpdateBoardMutation,
  useDeleteBoardMutation,
  useCreateCardMutation,
  useUpdateCardMutation,
  useDeleteCardMutation,
  useReorderCardsMutation,
} = apiSlice;
