import React, { memo } from 'react';
import styled from '../../../styles/styled-components';
import media from '../../../styles/media';
import isaLogo from '../isaLogo.svg';

interface Props {}

function Title() {
  return (
    <Wrapper>
      <Text href="/">
        Slackline <Linebreak />
        Web Tools
      </Text>
      <ByWrapper>
        <Divider />
        <span>by</span>
        <Divider />
      </ByWrapper>
      <Logo href={'//www.slacklineinternational.org'} target="_blank">
        <img style={{ width: '100%' }} src={isaLogo} />
      </Logo>
    </Wrapper>
  );
}
const Linebreak = styled.br`
  display: none;
  ${media.desktop`
    display: flex;
  `};
`;

const Logo = styled.a`
  display: flex;
  align-self: center;
  width: 50%;
  ${media.desktop`
    align-self: flex-start;
    width: 66%;
  `};
`;

const Divider = styled.div`
  width: 2rem;
  height: 1px;
  background-color: ${props => props.theme.text};
  ${media.desktop`
    width: 2rem;
    height: 2px;
  `};
`;

const ByWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 0.5rem 0;
  ${media.desktop`
    justify-content: flex-start;
    margin: 1.5rem 0;
    text-align: left;
  `};

  & span {
    font-size: 0.8rem;
    /* font-weight: bold; */
    margin: 0 0.5rem;
  }
`;

const Text = styled.a`
  font-size: 1.2rem;
  font-weight: bold;
  text-align: center;
  text-decoration: none;
  ${media.desktop`
    font-size: 2.5rem;
    text-align: left;
  `};
`;

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin-bottom: 0rem;
  padding: 0.5rem;
  ${media.desktop`
    justify-content: flex-start;
    margin-bottom: 2rem;
    margin-top: 5rem;
  `};
`;

export default memo(Title);
