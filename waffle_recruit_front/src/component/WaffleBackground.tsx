import React from 'react';

import styled from 'styled-components';

const BackgroundWrapper = styled.div`
  position: absolute;
  z-index: -1;
  width: 100%;
  height: 100%;
  overflow: hidden;
  left: 0;
  top: 0;
  background: linear-gradient(to bottom, #f0975e 0%, #ed8573 100%);
`;

const BackSheet = styled.div`
  position: absolute;
  left: -20%;
  top: -20%;
  width: 160%;
  height: 180%;
  background: #f0975e;
  background: linear-gradient(to bottom, #f0975e 0%, #ed8573 100%);
  transform: rotate(15deg);
`;
const WaffleColumn = styled.div`
  position: absolute;
  width: 200px;
  height: 100%;
  background: #27181d;
  left: 400px;
`;

const WaffleRow = styled.div`
  position: absolute;
  width: 100%;
  height: 200px;
  background: #27181d;
  top: 600px;
`;

const WaffleBackground = () => {
  return (
    <BackgroundWrapper>
      <BackSheet>
        <WaffleColumn />
        <WaffleColumn style={{ left: '1300px' }} />
        <WaffleColumn style={{ left: '2200px' }} />
        <WaffleColumn style={{ left: '3100px' }} />
        <WaffleRow />
        <WaffleRow style={{ top: '1400px' }} />
        <WaffleRow style={{ top: '2200px' }} />
        <WaffleRow style={{ top: '3000px' }} />

        <WaffleRow />
      </BackSheet>
    </BackgroundWrapper>
  );
};

export default WaffleBackground;
