/* global jest, describe, it, expect, beforeEach */
import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import TryAgainButton from '../shared/components/TryAgainButton';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Renders the button with the given props and returns the button element. */
function setup(props = {}) {
  const defaultOnClick = props.onClick ?? jest.fn();
  render(<TryAgainButton onClick={defaultOnClick} {...props} />);
  return screen.getByRole('button');
}

// ---------------------------------------------------------------------------
// Rendering
// ---------------------------------------------------------------------------

describe('TryAgainButton — rendering', () => {
  it('renders with default label "Try Again"', () => {
    setup({ onClick: jest.fn() });
    expect(screen.getByText('Try Again')).toBeInTheDocument();
  });

  it('renders a custom label', () => {
    setup({ onClick: jest.fn(), label: 'Reload data' });
    expect(screen.getByText('Reload data')).toBeInTheDocument();
  });

  it('renders the RefreshCw icon by default', () => {
    setup({ onClick: jest.fn() });
    // lucide-react renders an <svg> inside the button
    expect(screen.getByRole('button').querySelector('svg')).toBeInTheDocument();
  });

  it('hides the icon when showIcon is false', () => {
    setup({ onClick: jest.fn(), showIcon: false });
    expect(screen.getByRole('button').querySelector('svg')).not.toBeInTheDocument();
  });

  it('is not disabled in the idle state', () => {
    const btn = setup({ onClick: jest.fn() });
    expect(btn).not.toBeDisabled();
  });

  it('is disabled when the disabled prop is true', () => {
    const btn = setup({ onClick: jest.fn(), disabled: true });
    expect(btn).toBeDisabled();
    expect(btn).toHaveAttribute('aria-disabled', 'true');
  });
});

// ---------------------------------------------------------------------------
// Async click handling
// ---------------------------------------------------------------------------

describe('TryAgainButton — async click handling', () => {
  it('calls the onClick handler when clicked', async () => {
    const onClick = jest.fn().mockResolvedValue(undefined);
    const btn = setup({ onClick });
    await act(async () => { fireEvent.click(btn); });
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('shows the loading label and sets aria-busy while pending', async () => {
    let resolve;
    const onClick = jest.fn(() => new Promise((r) => { resolve = r; }));
    const btn = setup({ onClick, loadingLabel: 'Retrying…' });

    fireEvent.click(btn);

    await waitFor(() => {
      expect(screen.getByText('Retrying…')).toBeInTheDocument();
      expect(btn).toHaveAttribute('aria-busy', 'true');
      expect(btn).toBeDisabled();
    });

    // Resolve the promise so the component can finish
    await act(async () => { resolve(); });
  });

  it('returns to the idle state after the promise resolves', async () => {
    const onClick = jest.fn().mockResolvedValue(undefined);
    const btn = setup({ onClick });

    await act(async () => { fireEvent.click(btn); });

    await waitFor(() => {
      expect(screen.getByText('Try Again')).toBeInTheDocument();
      expect(btn).toHaveAttribute('aria-busy', 'false');
      expect(btn).not.toBeDisabled();
    });
  });

  it('returns to the idle state even when the promise rejects', async () => {
    const onClick = jest.fn().mockRejectedValue(new Error('Network error'));
    const btn = setup({ onClick });

    await act(async () => { fireEvent.click(btn); });

    await waitFor(() => {
      expect(btn).not.toBeDisabled();
      expect(btn).toHaveAttribute('aria-busy', 'false');
    });
  });

  it('does not fire onClick while already pending', async () => {
    let resolve;
    const onClick = jest.fn(() => new Promise((r) => { resolve = r; }));
    const btn = setup({ onClick });

    fireEvent.click(btn);
    await waitFor(() => expect(btn).toBeDisabled());

    fireEvent.click(btn); // should be ignored
    await act(async () => { resolve(); });

    expect(onClick).toHaveBeenCalledTimes(1);
  });
});

// ---------------------------------------------------------------------------
// Max-retries
// ---------------------------------------------------------------------------

describe('TryAgainButton — maxRetries', () => {
  it('disables the button after maxRetries attempts', async () => {
    const onClick = jest.fn().mockResolvedValue(undefined);
    const btn = setup({ onClick, maxRetries: 2 });

    // First retry
    await act(async () => { fireEvent.click(btn); });
    // Second retry
    await act(async () => { fireEvent.click(btn); });

    await waitFor(() => {
      expect(btn).toBeDisabled();
      expect(btn).toHaveAttribute('aria-disabled', 'true');
    });
  });

  it('shows maxRetriesLabel when exhausted', async () => {
    const onClick = jest.fn().mockResolvedValue(undefined);
    setup({ onClick, maxRetries: 1, maxRetriesLabel: 'No more retries' });

    await act(async () => { fireEvent.click(screen.getByRole('button')); });

    await waitFor(() => {
      expect(screen.getByText('No more retries')).toBeInTheDocument();
    });
  });

  it('does not disable the button when maxRetries is not set', async () => {
    const onClick = jest.fn().mockResolvedValue(undefined);
    const btn = setup({ onClick });

    for (let i = 0; i < 5; i++) {
      await act(async () => { fireEvent.click(btn); });
    }

    expect(btn).not.toBeDisabled();
  });
});

// ---------------------------------------------------------------------------
// Accessibility
// ---------------------------------------------------------------------------

describe('TryAgainButton — accessibility', () => {
  it('has type="button" to prevent accidental form submission', () => {
    const btn = setup({ onClick: jest.fn() });
    expect(btn).toHaveAttribute('type', 'button');
  });

  it('has an aria-label matching the current label', () => {
    const btn = setup({ onClick: jest.fn(), label: 'Reload' });
    expect(btn).toHaveAttribute('aria-label', 'Reload');
  });

  it('forwards aria-describedby to the button element', () => {
    render(
      <>
        <p id="hint">Something went wrong. Please try again.</p>
        <TryAgainButton onClick={jest.fn()} aria-describedby="hint" />
      </>
    );
    expect(screen.getByRole('button')).toHaveAttribute('aria-describedby', 'hint');
  });

  it('exposes the screen-reader retry counter when maxRetries is finite', () => {
    setup({ onClick: jest.fn(), maxRetries: 3 });
    // "Attempt 1 of 3." is rendered inside .sr-only
    expect(screen.getByText(/attempt 1 of 3/i)).toBeInTheDocument();
  });
});
