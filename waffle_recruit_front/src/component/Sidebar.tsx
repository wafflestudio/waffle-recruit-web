import React, { useEffect, useState } from 'react';

import { useQuery } from 'react-query';
import { Link, useHistory } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Image } from 'semantic-ui-react';
import styled from 'styled-components';

import { requester } from '../apis/requester';
import { useAuthContext } from '../context/authContext';

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

const Logo = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 140px;
`;

const SidebarWrapper = styled.nav`
  position: relative;
  display: flex;
  flex-direction: column;
  width: 300px;
  box-shadow: gray 0px 0 5px;
  background-color: #de8234;
  //background-color: rgb(122, 70, 34);
`;

const LinkItem = styled(Link)`
  font-size: 24px;
  font-weight: bolder;
  //color: rgb(202, 150, 106);
  color: white;
  line-height: 40px;
  transition: font-size 0.1s, color 0.3s, background-color 0.3s;
  padding: 20px;

  &:hover {
    color: rgb(95, 62, 32);
    font-size: 21px;
    background-color: white;
  }
  &.selected {
    color: rgb(95, 62, 32);
    font-size: 21px;
    background-color: white;
  }
`;

const AItem = styled.a`
  font-size: 20px;
  font-weight: bold;
  //color: rgb(202, 150, 106);
  color: white;
  padding: 20px;
  line-height: 40px;
  transition: font-size 0.1s, color 0.3s;
  margin-bottom: 50px;
  &:hover {
    color: rgb(95, 62, 32);
    font-size: 21px;
  }
`;

const Sidebar: React.FC = () => {
  const history = useHistory();
  const { user, clearUser } = useAuthContext();
  const [selected, setSelected] = useState<string>('');

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

  const isSelected = (targetPath: string) => {
    return selected === targetPath ? 'selected' : 'not-selected';
  };

  useEffect(() => {
    setSelected(history.location.pathname);
  }, [history.location.pathname]);

  const renderSuccessLabel = (isSolved: boolean | undefined) => {
    return isSolved === true ? (
      <span className="ui green label mini tag">해결 완료</span>
    ) : isSolved === false ? (
      <span className="ui red label mini tag">미해결</span>
    ) : null;
  };

  return (
    <SidebarWrapper>
      <Logo>
        <Image src="/pupuri.png" size="small" className="center" />
      </Logo>

      <LinkItem className={isSelected('/main')} to={'/main/'}>
        [필독] 문제 개요
      </LinkItem>

      <LinkItem className={isSelected('/problem/0/')} to={'/problem/0/'}>
        test problem {renderSuccessLabel(isSolvedList[0])}
      </LinkItem>

      <LinkItem className={isSelected('/problem/1/')} to={'/problem/1/'}>
        Problem 1 {renderSuccessLabel(isSolvedList[1])}
      </LinkItem>

      <LinkItem className={isSelected('/problem/2/')} to={'/problem/2/'}>
        Problem 2 {renderSuccessLabel(isSolvedList[2])}
      </LinkItem>

      <LinkItem className={isSelected('/problem/3/')} to={'/problem/3/'}>
        Problem 3 {renderSuccessLabel(isSolvedList[3])}
      </LinkItem>

      <AItem href={'mailto:recruit@wafflestudio.com'} target={'_blank'}>
        문의하기
      </AItem>

      <p style={{ width: 150, fontSize: '16px', wordBreak: 'break-all', color: 'white' }}>Signed as {user}</p>

      <LinkItem to={'/'} onClick={onClickSignOut}>
        Logout
      </LinkItem>
    </SidebarWrapper>
  );
};

export default Sidebar;
