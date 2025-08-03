import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { SignupModal } from '../SignupModal.jsx';

// Mock useAuth to avoid actual API calls
jest.mock('../../AuthContext', () => ({
  useAuth: () => ({ register: jest.fn().mockResolvedValue({}) })
}));

describe('SignupModal validation', () => {
  const setup = () => {
    render(
      <SignupModal open={true} onClose={jest.fn()} onSwitchToLogin={jest.fn()} />
    );
  };

  it('shows error if any field is empty', () => {
    setup();
    const form = document.querySelector('.signup-form');
    fireEvent.submit(form);
    const errorMsg = screen.queryByText(/all fields are required/i);
    if (!errorMsg) {
      // eslint-disable-next-line no-console
      console.log(document.body.innerHTML);
    }
    expect(errorMsg).toBeInTheDocument();
  });

  it('shows error for invalid email', () => {
    setup();
    fireEvent.change(screen.getByLabelText(/first name/i), { target: { value: 'Test' } });
    fireEvent.change(screen.getByLabelText(/last name/i), { target: { value: 'User' } });
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'invalidemail' } });
    fireEvent.change(screen.getByLabelText(/phone/i), { target: { value: '1234567890' } });
    fireEvent.change(screen.getByLabelText(/i am a/i), { target: { value: 'customer' } });
    fireEvent.change(screen.getByLabelText(/create password/i), { target: { value: 'password123' } });
    fireEvent.change(screen.getByLabelText(/confirm password/i), { target: { value: 'password123' } });
    const form = document.querySelector('.signup-form');
    fireEvent.submit(form);
    const errorMsg = screen.queryByText(/valid email address/i);
    if (!errorMsg) {
      // eslint-disable-next-line no-console
      console.log(document.body.innerHTML);
    }
    expect(errorMsg).toBeInTheDocument();
  });

  it("shows error if passwords don't match", () => {
    setup();
    fireEvent.change(screen.getByLabelText(/first name/i), { target: { value: 'Test' } });
    fireEvent.change(screen.getByLabelText(/last name/i), { target: { value: 'User' } });
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByLabelText(/phone/i), { target: { value: '1234567890' } });
    fireEvent.change(screen.getByLabelText(/i am a/i), { target: { value: 'customer' } });
    fireEvent.change(screen.getByLabelText(/create password/i), { target: { value: 'password123' } });
    fireEvent.change(screen.getByLabelText(/confirm password/i), { target: { value: 'differentpass' } });
    fireEvent.click(screen.getByRole('button', { name: /create account/i }));
    expect(screen.getByText(/passwords don't match/i)).toBeInTheDocument();
  });

  it('shows error if password is less than 8 characters', () => {
    setup();
    fireEvent.change(screen.getByLabelText(/first name/i), { target: { value: 'Test' } });
    fireEvent.change(screen.getByLabelText(/last name/i), { target: { value: 'User' } });
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByLabelText(/phone/i), { target: { value: '1234567890' } });
    fireEvent.change(screen.getByLabelText(/i am a/i), { target: { value: 'customer' } });
    fireEvent.change(screen.getByLabelText(/create password/i), { target: { value: 'short' } });
    fireEvent.change(screen.getByLabelText(/confirm password/i), { target: { value: 'short' } });
    fireEvent.click(screen.getByRole('button', { name: /create account/i }));
    // Target only the error message container for error assertion
    const errorContainer = document.querySelector('.error-message');
    expect(errorContainer).toHaveTextContent(/at least 8 characters/i);
  });

  it('submits successfully with valid data', async () => {
    setup();
    fireEvent.change(screen.getByLabelText(/first name/i), { target: { value: 'Test' } });
    fireEvent.change(screen.getByLabelText(/last name/i), { target: { value: 'User' } });
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByLabelText(/phone/i), { target: { value: '1234567890' } });
    fireEvent.change(screen.getByLabelText(/i am a/i), { target: { value: 'customer' } });
    fireEvent.change(screen.getByLabelText(/create password/i), { target: { value: 'password123' } });
    fireEvent.change(screen.getByLabelText(/confirm password/i), { target: { value: 'password123' } });
    fireEvent.click(screen.getByRole('button', { name: /create account/i }));
    // No error message should be displayed
    expect(screen.queryByText(/all fields are required/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/valid email address/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/passwords don't match/i)).not.toBeInTheDocument();
    // Ensure error message is not present in error container
    const errorContainer = document.querySelector('.error-message');
    if (errorContainer) {
      expect(errorContainer).not.toHaveTextContent(/at least 8 characters/i);
    }
  });
});
