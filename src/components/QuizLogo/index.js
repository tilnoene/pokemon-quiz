import styled from 'styled-components';

import React from 'react';
import PropTypes from 'prop-types';

const Logo = styled.img`
  width: 60%;
  height: 60%;
`;

export default function QuizLogo() {
  return (
    <Logo src="https://i.imgur.com/Rom6xpJ.png" />
  );
}
