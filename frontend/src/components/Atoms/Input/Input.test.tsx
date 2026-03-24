import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';
import { describe, it } from 'vitest';
import Input from './Input';

describe('Input component', () => {
  it('should render input', () => {
    render(
      <Input
        id="input"
        className="test"
        placeholder="Email"
        type="text"
        onChange={() => {
          console.log('change');
        }}
        onBlur={() => {
          console.log('blur');
        }}
        value="test"
        name="Dawid"
      />
    );
    const input = screen.getByRole('textbox');

    expect(input).toBeVisible();
  });

  it('should focus on click', () => {
    async () => {
      render(
        <Input
          id="input"
          className="test"
          placeholder="Email"
          type="text"
          onChange={() => {
            console.log('change');
          }}
          onBlur={() => {
            console.log('blur');
          }}
          value="test"
          name="Dawid"
        />
      );
      const input = screen.getByRole('textbox');
      await userEvent.click(input);
      expect(input).toHaveFocus();
    };
  });

  it('should take user input', () => {
    async () => {
      render(
        <Input
          id="input"
          className="test"
          placeholder="Email"
          type="text"
          onChange={() => {
            console.log('change');
          }}
          onBlur={() => {
            console.log('blur');
          }}
          value="test"
          name="Dawid"
        />
      );
      await userEvent.type(screen.getByRole('textbox'), 'testTyping');
      expect(screen.getByRole('textbox')).toHaveValue('testTyping');
    };
  });

  it('should focus on tab', () => {
    async () => {
      render(
        <Input
          id="input"
          className="test"
          placeholder="Email"
          type="text"
          onChange={() => {
            console.log('change');
          }}
          onBlur={() => {
            console.log('blur');
          }}
          value="test"
          name="Dawid"
        />
      );
      const input = screen.getByRole('textbox');
      await userEvent.tab();
      expect(input).toHaveFocus();
    };
  });
});
