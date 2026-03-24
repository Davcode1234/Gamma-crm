import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import { it } from 'vitest';

import Form from './Form';

it('Renders to the page ', () => {
  const { getByTestId } = render(
    <Form isSignInView={false} onSubmit={() => {}}>
      <input />
    </Form>
  );

  const form = getByTestId('form');
  expect(form).toBeVisible();
});

it('Accept children input', () => {
  const { getByTestId } = render(
    <Form isSignInView={false} onSubmit={() => {}}>
      <input />
    </Form>
  );

  const form = getByTestId('form');
  expect(form).toContainHTML('input');
});
