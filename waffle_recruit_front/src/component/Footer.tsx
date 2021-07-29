import React from 'react';

import { Image } from 'semantic-ui-react';

import './Footer.css';

const Footer: React.FC = () => {
  return (
    <div className="center, footbox">
      <a href="https://github.com/wafflestudio/waffle_recruit" target="_blank">
        <Image src="/logo.png" size="small" className="center" />
      </a>
    </div>
  );
};

export default Footer;
