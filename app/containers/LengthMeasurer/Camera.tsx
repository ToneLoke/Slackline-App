import React, { memo, useContext, useState } from 'react';
import styled, { ThemeContext } from 'styles/styled-components';
import media from 'styles/media';
import Webcam from 'react-webcam';
import { useDeviceOrientation } from 'utils/hooks/useDeviceOrientation';
import { elevatedShadow, touchableOpacity } from 'styles/mixins';
import CancelIcon from 'components/svg/cancel.svg';
import { cover, mix } from 'polished';
import { Button } from 'components/Button';
import { Spinner } from 'components/LoadingIndicator';
import { Utils } from 'utils/index';
import Portal from 'components/Modal';
import { RotateDeviceModal } from '../../components/RotateDeviceModal';
import CrosshairIcon from './crosshair.svg';

interface Props {
  closeClicked(): void;
  knownDistance: number;
}

enum MeasuringState {
  started = 0,
  farAnchorMarked = 1,
  closeAnchorMarked = 2,
}
let farAnchorAlpha = 0;
let closeAnchorAlpha = 0;

function Component(props: Props) {
  const [orientation, screenOrientation] = useDeviceOrientation();
  const [measuringState, setMeasuringState] = useState(MeasuringState.started);

  let currentAlpha = 0;
  if (orientation) {
    if (
      screenOrientation === 'landscape' &&
      orientation.alpha &&
      orientation.gamma
    ) {
      currentAlpha = orientation.alpha;
      if (orientation.gamma > 0) {
        currentAlpha = (180 + orientation.alpha) % 360;
      }
    }
  }

  const videoConstraints = {
    facingMode: 'environment',
  };

  function farAnchorAngle() {
    if (farAnchorAlpha && currentAlpha) {
      return Utils.angleDiff(farAnchorAlpha, currentAlpha);
    }
    return undefined;
  }
  function knownDistanceAngle() {
    if (closeAnchorAlpha && currentAlpha) {
      return Utils.angleDiff(closeAnchorAlpha, currentAlpha);
    }
    return undefined;
  }

  function distance() {
    const angleC = farAnchorAngle();
    const angleA = knownDistanceAngle();
    const lengthC = props.knownDistance;
    if (angleA && angleC && lengthC) {
      const distance =
        (lengthC * Math.sin(Utils.degreesToRadians(angleA))) /
        Math.sin(Utils.degreesToRadians(angleC));
      return Utils.trimToDecimals(distance, 1);
    }
    return undefined;
  }

  function buttonClicked() {
    if (measuringState === MeasuringState.started) {
      farAnchorAlpha = currentAlpha;
      setMeasuringState(MeasuringState.farAnchorMarked);
    } else if (measuringState === MeasuringState.farAnchorMarked) {
      closeAnchorAlpha = currentAlpha;
      setMeasuringState(MeasuringState.closeAnchorMarked);
    } else if (measuringState === MeasuringState.closeAnchorMarked) {
      farAnchorAlpha = 0;
      closeAnchorAlpha = 0;
      setMeasuringState(MeasuringState.started);
    }
  }

  return (
    <Wrapper>
      <LoadingText>
        Loading Camera
        <Loading />
      </LoadingText>
      <StyledCamera
        audio={false}
        screenshotFormat="image/jpeg"
        videoConstraints={videoConstraints}
      />

      <CloseButton onClick={props.closeClicked} />
      {screenOrientation === 'landscape' ? (
        <React.Fragment>
          <Crosshair />
          <CenterWrapper>
            {
              {
                0: (
                  <Text>
                    Stand on the close anchor, then point to the far anchor,
                    then press Mark
                  </Text>
                ),
                1: (
                  <Text>
                    Stand on your measured spot, then point to the close anchor,
                    then press Mark
                  </Text>
                ),
                2:
                  !Utils.isNil(distance()) && distance()! >= 0 ? (
                    <Text>
                      <span>{distance()}</span> m
                    </Text>
                  ) : (
                    <Text>️Invalid distance ⚠️</Text>
                  ),
              }[measuringState]
            }

            {
              {
                0: <CustomButton onClick={buttonClicked}>Mark</CustomButton>,
                1: (
                  <CustomButton
                    key="keyforrenderingagain"
                    onClick={buttonClicked}
                  >
                    Mark
                  </CustomButton>
                ),
                2: (
                  <CustomButton
                    key="keyforrenderingagain2"
                    onClick={buttonClicked}
                  >
                    Measure Again
                  </CustomButton>
                ),
              }[measuringState]
            }
          </CenterWrapper>
        </React.Fragment>
      ) : (
        <Portal isTransparentBackground={true} allowEvents={true} z={999}>
          <RotateDeviceModal />
        </Portal>
      )}
    </Wrapper>
  );
}

const Crosshair = styled.img.attrs({
  src: CrosshairIcon,
})`
  display: flex;
  position: absolute;
  margin: auto;
  width: 3rem;
  height: 3rem;
`;

const CenterWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  height: 50%;
  margin-top: auto;
  justify-content: space-between;
`;

const CustomButton = styled(Button)`
  margin-bottom: 1rem;
  font-size: 0.8rem;
  border-radius: 2rem;
`;

const Text = styled.span`
  margin-top: 2.5rem;
  font-weight: bold;
  font-size: 0.8rem;
  text-align: center;
  & span {
    font-size: 2rem;
  }
`;

const StyledCamera = styled(Webcam)`
  position: absolute;
  top: 50%;
  left: 50%;
  -webkit-transform: translateX(-50%) translateY(-50%);
  transform: translateX(-50%) translateY(-50%);
  width: 100%;
  min-height: 100%;
  width: auto;
  height: auto;
  z-index: -1;
  overflow: hidden;
`;

const CloseButton = styled.img.attrs({ src: CancelIcon })`
  position: absolute;
  right: 1rem;
  top: 1rem;
  width: 1.2rem;
  ${touchableOpacity}
`;

const Loading = styled(Spinner)`
  width: 2rem;
  height: 2rem;
  margin-top: 1rem;
`;

const LoadingText = styled.span`
  display: flex;
  flex-direction: column;
  align-items: center;
  position: absolute;
  word-break: keep-all;
  line-break: strict;
  left: 25%;
  right: 25%;
  top: 2rem;
  font-size: 1.2rem;
  font-weight: bold;
  text-align: center;
  z-index: -1;
`;

const Wrapper = styled.div`
  ${cover()}
  position: fixed;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color: ${props => props.theme.surface};
`;

export const Camera = memo(Component);