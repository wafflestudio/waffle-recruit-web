import React, { useEffect } from 'react';

import { batch, useDispatch } from 'react-redux';
import { useHistory, useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';

import { saveTokens, saveUser } from '../../apis/localStorages';
import { requester } from '../../apis/requester';
import { useAuthContext } from '../../context/authContext';
import { setAccess, setRefresh, setUsername } from '../../redux/auth';

const GitHub = () => {
  const location = useLocation();
  const { setUser } = useAuthContext();
  const code = new URLSearchParams(location.search).get('code');
  const history = useHistory();
  const dispatch = useDispatch();

  async function getGitHubCode() {
    try {
      const res = await requester.get(`/auth/signin/github/callback/?code=${code}`);
      const [{ username }, { access, refresh }] = res.data;
      saveUser(res.data[0].username);
      saveTokens(res.data[1]);
      batch(() => {
        dispatch(setAccess(access));
        dispatch(setRefresh(refresh));
        dispatch(setUsername(username));
      });
      history.push('/main');
    } catch (err) {
      toast.error('GitHub 로그인에 실패하였습니다.');
      history.push('/signin');
    }
  }

  useEffect(() => {
    getGitHubCode();
  }, []);

  return <div className="signup_page">GitHub 소셜 로그인 중...</div>;
};

export default GitHub;
