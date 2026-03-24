import React from 'react';

type InputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  id: string;
  className: string;
  onChange: React.ChangeEventHandler<HTMLInputElement>;
  onBlur: React.ChangeEventHandler<HTMLInputElement>;
  value: string | number;
};

function Input({
  id,
  type,
  name,
  className,
  placeholder,
  onChange,
  onBlur,
  value,

  ...restProps
}: InputProps) {
  return (
    <input
      data-testid="input"
      className={className}
      id={id}
      type={type}
      name={name}
      placeholder={placeholder}
      onChange={onChange}
      onBlur={onBlur}
      value={value}
      {...restProps}
    />
  );
}

export default Input;
