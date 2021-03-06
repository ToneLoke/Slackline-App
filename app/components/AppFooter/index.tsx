import React, { memo } from 'react';
import styled, { css } from '../../styles/styled-components';
import media from '../../styles/media';
import Sponsors from './Sponsors';

interface Props {}

function AppFooter(props: Props) {
  return (
    <Wrapper>
      <ClippedZone />
      <InnerWrapper>
        <Sponsors />
      </InnerWrapper>
    </Wrapper>
  );
}

const InnerWrapper = styled.div`
  display: flex;
  justify-content: flex-start;
  flex-direction: column;
  height: 100%;
  width: 100%;
`;
const ClippedZone = styled.div`
  display: flex;
  width: 100%;
  height: 22px;
`;

const Wrapper = styled.div`
  display: flex;
  align-self: flex-end;
  flex-direction: column;
  width: 100%;
  justify-content: flex-end;
  clip-path: polygon(0 16%, 33% 0, 100% 16%, 100% 100%, 0 100%);
  background: ${props =>
    `linear-gradient(180deg, ${props.theme.background} 0%, ${
      props.theme.brandSecondary
    } 100%)`};
  ${media.desktop`
    display: none;
  `};
`;

export default memo(AppFooter);
