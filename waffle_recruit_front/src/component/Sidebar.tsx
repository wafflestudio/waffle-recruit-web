import React, { useEffect, useState } from 'react';

import { useDispatch, useSelector } from 'react-redux';
import { Link, useHistory, useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Image } from 'semantic-ui-react';
import styled from 'styled-components';

import { checkResult } from '../apis/checkResult';
import { getUsername } from '../apis/getAuth';
import { loadRefresh, loadUser, saveJWT, saveRefresh } from '../apis/localStorages';
import { authRequester, requester } from '../apis/requester';
import { useAuthContext } from '../context/authContext';
import { clearAuth } from '../redux/auth';
import { clearResult, ResultType, setResults } from '../redux/results';
import { RootState } from '../redux/store';

const Logo = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 140px;
`;

const SidebarWrapper = styled.nav`
  position: fixed;
  display: flex;
  flex-direction: column;
  top: 0;
  width: 240px;
  box-shadow: gray 0px 0 5px;
  background-color: #de8234;
  z-index: 2;
  height: 100%;
`;

const LinkItem = styled(Link)`
  font-size: 24px;
  font-weight: bolder;
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
  const { pathname } = useLocation();
  const [selected, setSelected] = useState<string>('');
  const { prob0, prob1, prob2, prob3 } = useSelector((state: RootState) => state.results);
  const dispatch = useDispatch();
  const username = getUsername();

  const onClickSignOut = async () => {
    try {
      await authRequester.post('/auth/signout/', { refresh: loadRefresh() });
      dispatch(clearAuth());
      saveJWT('');
      saveRefresh('');
      history.push('/signin');
    } catch (err) {
      toast.error('로그아웃 실패');
    }
  };

  const isSelected = (targetPath: string) => {
    return selected === targetPath ? 'selected' : 'not-selected';
  };

  useEffect(() => {
    setSelected(pathname);
  }, [pathname]);

  //get result
  useEffect(() => {
    checkResult('0').then((res) => {
      if (res === 'no submit') {
        dispatch(clearResult('0'));
      } else {
        dispatch(setResults({ prob_num: '0', response: res }));
      }
    });
    checkResult('1').then((res) => {
      if (res === 'no submit') {
        dispatch(clearResult('1'));
      } else {
        dispatch(setResults({ prob_num: '1', response: res }));
      }
    });
    checkResult('2').then((res) => {
      if (res === 'no submit') {
        dispatch(clearResult('2'));
      } else {
        dispatch(setResults({ prob_num: '2', response: res }));
      }
    });
    checkResult('3').then((res) => {
      if (res === 'no submit') {
        dispatch(clearResult('3'));
      } else {
        dispatch(setResults({ prob_num: '3', response: res }));
      }
    });
  }, []);

  /*
  useEffect(() => {
    [0, 1, 2, 3].forEach(async (probNum, i) => {
      try {
        const response = await authRequester(`/check/${probNum}/result/`);
        setIsSolvedList(
          isSolvedList.map((item, index) => {
            return index === probNum ? response.data.result === 1 : item;
          })
        );
      } catch (e) {}
    });
  }, []);
 */
  const isSolved = (result: ResultType) => {
    if (result.isSubmitted && result.content.result) {
      return true;
    }
    return false;
  };

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
        test problem {renderSuccessLabel(isSolved(prob0))}
      </LinkItem>

      <LinkItem className={isSelected('/problem/1/')} to={'/problem/1/'}>
        Problem 1 {renderSuccessLabel(isSolved(prob1))}
      </LinkItem>

      <LinkItem className={isSelected('/problem/2/')} to={'/problem/2/'}>
        Problem 2 {renderSuccessLabel(isSolved(prob2))}
      </LinkItem>

      <LinkItem className={isSelected('/problem/3/')} to={'/problem/3/'}>
        Problem 3 {renderSuccessLabel(isSolved(prob3))}
      </LinkItem>

      <LinkItem className={isSelected('/coverletter/')} to={'/coverletter/'}>
        자소서 제출
      </LinkItem>

      <AItem href={'mailto:recruit@wafflestudio.com'} target={'_blank'}>
        문의하기
      </AItem>

      <p style={{ fontSize: '16px', wordBreak: 'break-all', color: 'white', textAlign: 'center' }}>Signed as </p>
      <p style={{ fontSize: '16px', wordBreak: 'break-all', color: 'white', textAlign: 'center' }}>{username} </p>

      <LinkItem to={'/'} onClick={onClickSignOut}>
        Logout
      </LinkItem>
    </SidebarWrapper>
  );
};

export default Sidebar;
