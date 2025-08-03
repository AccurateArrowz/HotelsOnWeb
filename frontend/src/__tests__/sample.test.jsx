import React from 'react';
import { render, screen } from '@testing-library/react';

describe('Sample frontend test', () => {
  it('renders hello world', () => {
    render(<div>Hello World</div>);
    expect(screen.getByText('Hello World')).toBeInTheDocument();
  });
});
