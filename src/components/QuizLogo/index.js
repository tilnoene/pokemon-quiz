import styled from 'styled-components';

import React from 'react';
import PropTypes from 'prop-types';

const Logo = styled.img`
  width: 60%;
  height: 60%;
`;
/*
const QuizLogo = styled(Logo)`
  margin: auto;
  display: block;
  @media screen and (max-width: 500px) {
    margin: 0;
  }
`;
*/
export default function QuizLogo() {
  return (
    <Logo src="https://logodownload.org/wp-content/uploads/2017/08/pokemon-logo-1.png" />
  );
}
