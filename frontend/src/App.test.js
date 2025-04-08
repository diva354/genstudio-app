


// Mock axios (pulls from __mocks__/axios.js automatically)
jest.mock('axios');
import axios from 'axios';

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
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
    await waitFor(() => {
      fireEvent.click(button);
    });

    const result = await screen.findByText(/Roman numeral: X/i);
    expect(result).toBeInTheDocument();

  });
  

  test('shows offline error when navigator is offline', async () => {
    Object.defineProperty(window.navigator, 'onLine', {
      value: false,
      writable: true,
      configurable: true,
    });
  
    render(<App />);
    const input = screen.getByLabelText(/enter a number/i);
    const button = screen.getByRole('button', { name: /convert/i });
  
    fireEvent.change(input, { target: { value: '23' } });
    fireEvent.click(button);
  
    const errorMessage = await screen.findByText(/You appear to be offline/i);
    expect(errorMessage).toBeInTheDocument();
  
    // Reset after test
    window.navigator.onLine = true;
  });
  

  test('handles 500 internal server error', async () => {
    axios.get.mockRejectedValueOnce({
      response: {
        status: 500,
        statusText: 'Internal Server Error',
        data: { errorMessage: 'Internal server error.' },
      }
    });
  
    render(<App />);
    const input = screen.getByLabelText(/enter a number/i);
    const button = screen.getByRole('button', { name: /convert/i });
  
    fireEvent.change(input, { target: { value: '99' } });
    fireEvent.click(button);
  
    const errorMessage = await screen.findByText(/Internal server error/i);
    expect(errorMessage).toBeInTheDocument();
  });
  

  test('shows error for invalid input', async () => {

    render(<App />);
    fireEvent.change(screen.getByLabelText(/enter a number/i), {
      target: { value: '4000' },
    });
    
    await waitFor(() => {
      fireEvent.click(screen.getByRole('button'));
    });
    

    const error = await screen.findByText(/Input Invalid. Please enter a valid whole number between 1 and 3999./i);
    expect(error).toBeInTheDocument();
  });
});

