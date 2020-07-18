import React from 'react';
import { Field, useField } from 'formik';

interface InputProps {
  label: string;
  name: string;
  type?: string;
}

export const FormInput = ({ label, name, type }: InputProps) => {
  const { touched, error } = useField(name)[1];
  return (
    <div className="min-w-full pb-3">
      <label
        className="block text-sm font-medium leading-5 text-gray-700"
        htmlFor={name}
      >
        {label}
      </label>
      <Field
        className="block w-full pr-12 form-input pl-7 sm:text-sm sm:leading-5"
        name={name}
        aria-label={label}
        type={type || 'text'}
      />
      {touched && error ? (
        <span className="block text-sm font-medium leading-5 text-red-700">
          {error}
        </span>
      ) : null}
    </div>
  );
};
