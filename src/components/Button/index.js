import styled from 'styled-components';

// fazer disabled
const Button = styled.button`
  background-color: #ff9100;
  color: #fff;
  width: 100%;
  border: none;
  padding: 12px 0;
  border-radius: 10px;
  cursor: pointer;
  font-weight: 800;
  outline: none;

  &:hover,
  &:focus {
    opacity: .7;
  }
  &:disabled {
    background-color: #979797;
    cursor: not-allowed;
  }
`;

export default Button;
