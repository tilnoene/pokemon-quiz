import styled from 'styled-components';

const PokemonImage = styled.img`
  width: 50%;
  height: 50%;
  filter: contrast(0%);

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
