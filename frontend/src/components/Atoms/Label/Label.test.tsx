import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { describe, it } from 'vitest';
import Label from './Label';

describe('Label component', () => {
  it('should render label', () => {
    render(<Label htmlFor="email" labelContent="email" />);
    const label = screen.getByTestId('label');

    expect(label).toBeVisible();
  });

  it('should contain htmlFor attribute', () => {
    render(<Label htmlFor="email" labelContent="email" />);
    const label = screen.getByTestId('label');

    expect(label).toHaveAttribute('for', 'email');
  });
});
