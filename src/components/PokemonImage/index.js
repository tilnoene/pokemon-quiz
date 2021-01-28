import styled from 'styled-components';

const PokemonImage = styled.img`
  width: 50%;
  height: 50%;

  filter: ${({ visible }) => `contrast(${visible ? 100 : 0}%)`};
  &:focus {
    opacity: 1;
  }
  pointer-events: none;
  -webkit-touch-callout: none;
  -webkit-user-select: none;
  -khtml-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
`;
// colocar transição e afins

export default PokemonImage;
