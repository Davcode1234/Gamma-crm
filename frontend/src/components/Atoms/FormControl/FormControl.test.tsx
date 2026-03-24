import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { describe, it } from 'vitest';
import FormControl from './FormControl';

describe('Label component', () => {
  it('should render Form container and accept children', () => {
    render(
      <FormControl>
        <input />
        <form />
      </FormControl>
    );
    const formcontainer = screen.getByTestId('form-control');

    expect(formcontainer).toContainHTML('input');
    expect(formcontainer).toContainHTML('form');
  });
});
