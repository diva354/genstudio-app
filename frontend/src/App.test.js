// import { render, screen } from '@testing-library/react';
// import App from './App';

// test('renders learn react link', () => {
//   render(<App />);
//   const linkElement = screen.getByText(/learn react/i);
//   expect(linkElement).toBeInTheDocument();
// });
// App.test.js


// ✅ Mock axios (pulls from __mocks__/axios.js automatically)
jest.mock('axios');
import axios from 'axios';

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import App from './App';
import '@testing-library/jest-dom';


describe('Roman Numeral Converter UI', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test('renders input and convert button', () => {
    render(<App />);

    expect(screen.getByLabelText(/enter a number/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /convert/i })).toBeInTheDocument();
  });

  test('disables button while loading', async () => {
    render(<App />);
    const input = screen.getByLabelText(/enter a number/i);
    const button = screen.getByRole('button', { name: /convert/i });

    fireEvent.change(input, { target: { value: '10' } });
    fireEvent.click(button);

    expect(button).toBeDisabled(); // while waiting for response
  });

  test('shows result on successful conversion', async () => {
    axios.get.mockResolvedValueOnce({
      data: { input: '10', output: 'X' }
    });

    render(<App />);
    const input = screen.getByLabelText(/enter a number/i);
    const button = screen.getByRole('button', { name: /convert/i });

    fireEvent.change(input, { target: { value: '10' } });
    fireEvent.click(button);

    const result = await screen.findByText(/Roman numeral: X/i);
    screen.debug();
    expect(result).toBeInTheDocument();

  });

  test('shows error for invalid input', async () => {

    render(<App />);
    fireEvent.change(screen.getByLabelText(/enter a number/i), {
      target: { value: '4000' },
    });
    fireEvent.click(screen.getByRole('button'));

    const error = await screen.findByText(/Input Invalid. Please enter a valid whole number between 1 and 3999./i);
    expect(error).toBeInTheDocument();
  });
});

