import styled from 'styled-components';

const Input = styled.input`
  background-color: transparent;
  border: 2px solid ${({ theme }) => `${theme.colors.mainBg}70`};
  border-radius: 4px;
  width: 100%;
  outline: none;
  color: white;
  padding: 10px 10px;
`;

export default Input;
