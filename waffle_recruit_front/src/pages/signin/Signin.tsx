import React, { useState } from 'react';

import ReactMarkdown from 'react-markdown';
import { Button } from 'semantic-ui-react';
import styled from 'styled-components';

import githubLogo from '../../assets/GitHub-Mark-64px.png';
import WaffleBackground from '../../component/WaffleBackground';

import { notice } from './Notice';

const LoginWrapper = styled.section`
  position: relative;
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;
const NoticeWrapper = styled.article`
  text-align: left;
  font-size: 18px;
  width: 100%;
  max-width: 1000px;
  padding: 80px;
  box-shadow: 0px 3px 10px gray;
  margin-bottom: 120px;
  background: rgba(255, 255, 255, 0.95);
`;

const Title = styled.div`
  color: white;
  margin-top: 150px;
  h1 {
    font-size: 60px;
    text-shadow: 2px 2px 3px rgb(50, 50, 50);
  }
`;

const LoginButton = styled.a`
  display: inline-block;
  position: relative;
  left: calc(50% - 115px);
  color: black;
  padding: 5px;
  margin-top: 40px;
  border-radius: 15px;
  transition: 0.2s;
  img {
    margin-right: 10px;
  }
  &:hover {
    background: gray;
    color: white;
    .popup {
      display: block;
      opacity: 1;
    }
  }
`;

const LoginPopup = styled.div`
  width: 360px;
  position: absolute;
  background-color: gray;
  color: white;
  padding: 10px;
  top: 110%;
  left: -65px;
  border-radius: 15px;
  text-align: center;
  opacity: 0;
  transition: 0.2s;
`;

const Signin: React.FC = () => {
  return (
    <LoginWrapper className="login_page">
      <WaffleBackground />
      <Title className="Title not-in-mobile">
        <h1>WAFFLESTUDIO RECRUIT</h1>
      </Title>
      <NoticeWrapper className="notice">
        <ReactMarkdown source={notice}></ReactMarkdown>
        <LoginButton href={`https://github.com/login/oauth/authorize?client_id=ca61f5ee19f092f55e8e`}>
          <img src={githubLogo} />
          GitHub 로그인 하기
          <LoginPopup className="popup">깃허브의 public email 설정을 확인하세요</LoginPopup>
        </LoginButton>
      </NoticeWrapper>
    </LoginWrapper>
  );
};

export default Signin;
