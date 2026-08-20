import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { configureStore } from '@reduxjs/toolkit';
import { apiSlice } from '../api/apiSlice';
import HomePage from '../pages/HomePage';

function renderWithProviders(ui: React.ReactElement) {
  const store = configureStore({
    reducer: { [apiSlice.reducerPath]: apiSlice.reducer },
    middleware: (getDefault) => getDefault().concat(apiSlice.middleware),
  });

  return render(
    <Provider store={store}>
      <BrowserRouter>{ui}</BrowserRouter>
    </Provider>,
  );
}

describe('HomePage', () => {
  it('renders the create board form and the join board form', () => {
    renderWithProviders(<HomePage />);

    expect(screen.getByLabelText(/create a new board/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/open an existing board/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /create/i })).toBeDisabled();
  });

  it('shows a validation message when joining without an ID', async () => {
    renderWithProviders(<HomePage />);

    screen.getByRole('button', { name: /open/i }).click();

    expect(await screen.findByText(/enter a board id/i)).toBeInTheDocument();
  });
});
