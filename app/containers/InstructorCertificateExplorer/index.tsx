import React, { useState, useEffect } from 'react';
import AppBackgroundContainer from 'components/AppBackgroundContainer';
import styled from 'styles/styled-components';
import media from 'styles/media';
import { Icon } from 'components/Icons/Icon';
import { TextInput } from 'components/TextInput';
import { LoadableButton } from 'components/LoadableButton';
import { queryInstructor, InstructorItem } from './spreadsheet';
import { RouteComponentProps } from 'react-router';
import { Utils } from 'utils/index';
import { useDispatch } from 'react-redux';
import { replace } from 'connected-react-router';

interface Props extends RouteComponentProps {}

export default function InstructorCertificateExplorer(props: Props) {
  let defaultQuery = '';
  if (props.location.search) {
    defaultQuery = Utils.getUrlQueryVariable(props.location.search, 'query');
  }
  const [inputValue, setInputValue] = useState(defaultQuery);
  const [isLoading, setIsLoading] = useState(false);
  const [instructor, setInstructor] = useState<InstructorItem | null>();

  const dispatch = useDispatch();

  useEffect(() => {
    if (defaultQuery) {
      checkInstructor();
    }
  }, []);
  function updateValue(value: string) {
    setInputValue(value);
    setInstructor(undefined);
  }

  async function checkInstructor() {
    if (inputValue) {
      setIsLoading(true);
      const instructor = await queryInstructor(inputValue);
      setIsLoading(false);
      setInstructor(instructor);
      dispatch(replace({ search: `?query=${inputValue}` }));
    }
  }

  return (
    // tslint:disable-next-line: jsx-wrap-multiline
    <AppBackgroundContainer hideFooter>
      <Wrapper>
        <Header>
          <HeaderIcon iconType="instructor_certificate" />
          <span>Instructor Certificate Explorer</span>
        </Header>
        <Input
          type="text"
          label="ID or Name of the instructor"
          onChange={updateValue}
          value={inputValue}
        />
        <CustomLoadableButton isLoading={isLoading} onClick={checkInstructor}>
          CHECK
        </CustomLoadableButton>
        {/* <Divider show={instructor !== undefined} /> */}
        {instructor !== undefined &&
          (instructor === null ? (
            <InvalidText>
              Cannot find the instructor &nbsp;
              <b>{inputValue}</b>
            </InvalidText>
          ) : (
            <ValidText>
              <b>{`${instructor!.firstname} ${instructor!.name}`}</b>
              <span>&nbsp;has a&nbsp;</span>
              <b>{instructor!.level} Certificate</b>
              <span>&nbsp;valid until&nbsp;</span>
              <b>{instructor!.valid}</b>
            </ValidText>
          ))}
      </Wrapper>
    </AppBackgroundContainer>
  );
}

const Input = styled(TextInput)`
  width: 15rem;
`;

const ValidText = styled.span`
  display: flex;
  width: 100%;
  white-space: nowrap;
  flex-wrap: wrap;
  justify-content: center;
`;

const InvalidText = styled.span`
  display: flex;
  color: ${props => props.theme.red};
  font-style: bold;
  & b {
    color: ${props => props.theme.text};
  }
`;

const CustomLoadableButton = styled(LoadableButton)`
  margin-top: 4rem;
  margin-bottom: 4rem;
  font-size: 0.8rem;
  border-radius: 2rem;
`;

const HeaderIcon = styled(Icon)`
  display: flex;
  flex: none;
  width: 3rem;
  height: 3rem;
`;

const Header = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin-bottom: 4rem;
  ${media.desktop`
    margin-top: 3rem;
  `};
  & span {
    /* text-transform: uppercase; */
    font-size: 1rem;
    font-weight: bold;
    text-align: center;
    letter-spacing: 0.05rem;
    margin-top: 1rem;
    ${media.desktop`
      font-size: 1.5rem;
  `};
  }
`;

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  align-self: center;
  ${media.desktop`
  `};
`;
