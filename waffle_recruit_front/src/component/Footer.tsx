import React from 'react';

import { Image } from 'semantic-ui-react';
import styled from 'styled-components';

const FooterWrapper = styled.footer`
  position: relative;
  display: flex;
  justify-content: center;
  padding: 30px;
  background-color: white;
  height: 140px;
  border-top: 1px rgba(220, 220, 220, 1) solid;
`;

const Footer = () => {
  return (
    <FooterWrapper className="not-in-mobile">
      <a href="https://github.com/wafflestudio/waffle_recruit" target="_blank">
        <Image src="/logo.png" size="small" className="center" />
      </a>
    </FooterWrapper>
  );
};

export default Footer;
