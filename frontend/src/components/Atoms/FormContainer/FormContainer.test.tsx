import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { describe, it } from 'vitest';
import FormContainer from './FormContainer';

describe('Label component', () => {
  it('should render Form container and accept children', () => {
    render(
      <FormContainer>
        <form />
      </FormContainer>
    );
    const formcontainer = screen.getByTestId('wrapper');

    expect(formcontainer).toContainHTML('form');
  });
});
