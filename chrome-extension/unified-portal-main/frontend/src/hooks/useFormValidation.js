import { useState } from 'react';

export const useFormValidation = (initialValues = {}) => {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  const validateField = (name, value) => {
    const newErrors = { ...errors };

    switch (name) {
      case 'name':
        if (!value) {
          newErrors.name = 'Name is required';
        } else if (value.length < 3) {
          newErrors.name = 'Name must be at least 3 characters';
        } else if (value.length > 50) {
          newErrors.name = 'Name must not exceed 50 characters';
        } else {
          delete newErrors.name;
        }
        break;

      case 'email':
        if (!value) {
          newErrors.email = 'Email is required';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          newErrors.email = 'Invalid email format';
        } else {
          delete newErrors.email;
        }
        break;

      case 'phone':
        if (!value) {
          newErrors.phone = 'Phone is required';
        } else if (!/^\d{10}$/.test(value.replace(/\D/g, ''))) {
          newErrors.phone = 'Phone must be 10 digits';
        } else {
          delete newErrors.phone;
        }
        break;

      case 'consumerId':
        if (value && !/^[a-zA-Z0-9]+$/.test(value)) {
          newErrors.consumerId = 'Consumer ID must be alphanumeric';
        } else {
          delete newErrors.consumerId;
        }
        break;

      default:
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setValues({ ...values, [name]: value });
    if (touched[name]) {
      validateField(name, value);
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched({ ...touched, [name]: true });
    validateField(name, value);
  };

  const isValid = () => {
    const newErrors = {};
    Object.keys(values).forEach((key) => {
      if (!validateField(key, values[key])) {
        newErrors[key] = errors[key];
      }
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const reset = () => {
    setValues(initialValues);
    setErrors({});
    setTouched({});
  };

  return {
    values,
    errors,
    touched,
    handleChange,
    handleBlur,
    isValid,
    reset,
    setValues,
  };
};

export default useFormValidation;
