import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

const InputBase = styled.input`
  background-color: transparent;
  border: 2px solid ${({ theme }) => `${theme.colors.mainBg}70`};
  border-radius: 4px;
  width: 100%;
  outline: none;
  color: white;
  padding: 10px 10px;
`;

export default function Input({ onChange, placeholder, ...props }) {
  return (
    <div>
      <InputBase
        onChange={onChange}
        placeholder={placeholder}
        // eslint-disable-next-line react/jsx-props-no-spreading
        {...props}
      />
    </div>
  );
}

Input.defaultProps = {
  value: '',
};

Input.propTypes = {
  onChange: PropTypes.func.isRequired,
  placeholder: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  value: PropTypes.string,
};
