import React, { useState, useRef, useEffect } from 'react';
import { FaChevronDown } from 'react-icons/fa';

const XCustomSelect = ({ options = [], value, onChange, placeholder = 'Select...', name, id, required }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (ref.current && !ref.current.contains(event.target)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (option) => {
    onChange(option);
    setOpen(false);
  };

  return (
    <div className={`x_customSelect${open ? ' x_customSelect--open' : ''}`} ref={ref}>
      <button
        type="button"
        className="x_customSelect__control"
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="listbox"
        aria-expanded={open}
        id={id}
        name={name}
        required={required}
      >
        <span className={`x_customSelect__value${!value ? ' x_customSelect__placeholder' : ''}`}>
          {value ? value.label : placeholder}
        </span>
        <FaChevronDown className="x_customSelect__arrow" />
      </button>
      {open && (
        <ul className="x_customSelect__menu" role="listbox">
          {options.map((option) => (
            <li
              key={option.value}
              className={`x_customSelect__option${value && value.value === option.value ? ' x_customSelect__option--selected' : ''}`}
              onClick={() => handleSelect(option)}
              role="option"
              aria-selected={value && value.value === option.value}
            >
              {option.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default XCustomSelect;
