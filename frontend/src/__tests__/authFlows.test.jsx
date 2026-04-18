/* global jest, describe, it, expect, afterEach */
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { AuthProvider } from '../auth/AuthContext.jsx';
import { Modal } from '../shared/components/Modal.jsx';
import LoginForm from '../auth/LoginForm.jsx';
import SignupForm from '../auth/SignupForm.jsx';

// Mock authService used inside AuthContext
import authService from '../services/authService.js';

jest.mock('../services/authService.js', () => ({
  __esModule: true,
  default: {
    login: jest.fn(),
    register: jest.fn(),
    logout: jest.fn(),
  },
}));

describe('Authentication flows', () => {
  const wrapper = ({ children }) => <AuthProvider>{children}</AuthProvider>;

  afterEach(() => jest.clearAllMocks());

  it('logs in a user successfully', async () => {
    authService.login.mockResolvedValueOnce({ data: { email: 'user@example.com' } });

    render(
      <Modal isOpen={true} onClose={jest.fn()}>
        <LoginForm onSuccess={jest.fn()} onSwitchToSignup={jest.fn()} />
      </Modal>,
      { wrapper }
    );

    fireEvent.change(screen.getByLabelText(/email address/i), {
      target: { value: 'user@example.com' },
    });
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: 'password123' },
    });
    fireEvent.click(screen.getByRole('button', { name: /sign in/i }));

    await waitFor(() => {
      expect(authService.login).toHaveBeenCalledWith({
        email: 'user@example.com',
        password: 'password123',
      });
    });
  });

  it('signs up a user successfully', async () => {
    authService.register.mockResolvedValueOnce({ data: { email: 'new@example.com' } });

    render(
      <Modal isOpen={true} onClose={jest.fn()}>
        <SignupForm onSuccess={jest.fn()} onSwitchToLogin={jest.fn()} />
      </Modal>,
      { wrapper }
    );

    fireEvent.change(screen.getByLabelText(/first name/i), { target: { value: 'John' } });
    fireEvent.change(screen.getByLabelText(/last name/i), { target: { value: 'Doe' } });
    fireEvent.change(screen.getByLabelText(/^email address$/i), { target: { value: 'new@example.com' } });
    fireEvent.change(screen.getByLabelText(/phone number/i), { target: { value: '1234567890' } });
    fireEvent.change(screen.getByLabelText(/i am a/i), { target: { value: 'customer' } });
    fireEvent.change(screen.getByLabelText(/^create password$/i), { target: { value: 'password123' } });
    fireEvent.change(screen.getByLabelText(/confirm password/i), { target: { value: 'password123' } });

    fireEvent.click(screen.getByRole('button', { name: /create account/i }));

    await waitFor(() => {
      expect(authService.register).toHaveBeenCalledWith({
        firstName: 'John',
        lastName: 'Doe',
        email: 'new@example.com',
        phone: '1234567890',
        role: 'customer',
        password: 'password123',
      });
    });
  });
});
