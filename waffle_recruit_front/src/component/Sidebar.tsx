import React from 'react';

import { useQuery } from 'react-query';
import { Link, useHistory } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Image } from 'semantic-ui-react';
import styled from 'styled-components';

import { requester } from '../apis/requester';
import { useAuthContext } from '../context/authContext';

import './Sidebar.css';

type IProbStatusResponse =
  | {
      status: 'correct';
      message: 'correct' | 'already_correct';
    }
  | {
      status: 'pending';
      message: 'pending';
    }
  | {
      status: 'wrong';
      message: 'string';
    };

const LinkItem = styled(Link)`
  font-size: 20px;
  font-weight: bold;
  color: rgb(202, 150, 106);
  height: 40px;
  line-height: 40px;
  transition: font-size 0.1s, color 0.3s;

  &:hover {
    color: rgb(95, 62, 32);
    font-size: 21px;
  }
`;

const AItem = styled.a`
  font-size: 20px;
  font-weight: bold;
  color: rgb(202, 150, 106);
  height: 40px;
  line-height: 40px;
  transition: font-size 0.1s, color 0.3s;

  &:hover {
    color: rgb(95, 62, 32);
    font-size: 21px;
  }
`;

const Sidebar: React.FC = () => {
  const history = useHistory();
  const { user, clearUser } = useAuthContext();

  const isSolvedQuery0 = useQuery<{
    solved: boolean;
    task: IProbStatusResponse;
  }>(`/check/prob/0/`);
  const isSolvedQuery1 = useQuery<{
    solved: boolean;
    task: IProbStatusResponse;
  }>(`/check/prob/1/`);
  const isSolvedQuery2 = useQuery<{
    solved: boolean;
    task: IProbStatusResponse;
  }>(`/check/prob/2/`);
  const isSolvedQuery3 = useQuery<{
    solved: boolean;
    task: IProbStatusResponse;
  }>(`/check/prob/3/`);
  const isSolvedList: (boolean | undefined)[] = [
    isSolvedQuery0.data?.solved,
    isSolvedQuery1.data?.solved,
    isSolvedQuery2.data?.solved,
    isSolvedQuery3.data?.solved,
  ];

  const onClickSignOut = async () => {
    try {
      await requester.get('/check/signout/');
      clearUser();
      history.replace('/signin');
    } catch (err) {
      toast.error('로그아웃 실패.');
    }
  };

  const renderSuccessLabel = (isSolved: boolean | undefined) => {
    return isSolved === true ? (
      <span className="ui green label mini tag">해결 완료</span>
    ) : isSolved === false ? (
      <span className="ui red label mini tag">미해결</span>
    ) : null;
  };

  return (
    <div className="additional">
      <div className="sidebar">
        <Image src="/pupuri.png" size="small" className="center" />
        <br />
        <br />
        <LinkItem to={'/main/'}>[필독] 문제 개요</LinkItem>
        <br />
        <br />
        <br />
        <br />
        <LinkItem to={'/problem/0/'}>test problem {renderSuccessLabel(isSolvedList[0])}</LinkItem>
        <br />
        <br />
        <LinkItem to={'/problem/1/'}>Problem 1 {renderSuccessLabel(isSolvedList[1])}</LinkItem>
        <br />
        <br />
        <LinkItem to={'/problem/2/'}>Problem 2 {renderSuccessLabel(isSolvedList[2])}</LinkItem>
        <br />
        <br />
        <LinkItem to={'/problem/3/'}>Problem 3 {renderSuccessLabel(isSolvedList[3])}</LinkItem>
        <br />
        <br />
        <br />
        <br />
        <br />
        <br />
        <AItem href={'mailto:recruit@wafflestudio.com'} target={'_blank'}>
          문의하기
        </AItem>
        <br />
        <br />
        <br />

        <p style={{ width: 150, wordBreak: 'break-all', color: '#804020' }}>Signed as {user}</p>

        <LinkItem to={'/'} onClick={onClickSignOut}>
          Logout
        </LinkItem>
      </div>
    </div>
  );
};

export default Sidebar;
