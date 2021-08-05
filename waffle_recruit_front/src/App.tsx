import React, { useEffect, useState } from 'react';

import ReactMarkdown from 'react-markdown';
import { Route, Redirect, Switch, useHistory, useLocation } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { Button, Header, Loader, Modal } from 'semantic-ui-react';

import { requester } from './apis/requester';
import Footer from './component/Footer';
import { useAuthContext } from './context/authContext';
import ProblemPage from './pages/problem';
import Main from './pages/problem/[probNum]';
import Submit from './pages/problem/[probNum]/submit';
import Signin from './pages/signin/Signin';
import Signup from './pages/signup/Signup';

import './App.css';
import 'react-toastify/dist/ReactToastify.css';

const App: React.FC = () => {
  const [isOpenModal, setOpenModal] = useState<boolean>(false);
  const [isTokenChecked, setTokenChecked] = useState<boolean>(false);
  const { setUser, clearUser, setCsrf } = useAuthContext();
  const history = useHistory();

  const { pathname } = useLocation();

  const isAuthNeeded = pathname.includes('problem');

  useEffect(() => {
    const isDisableModal = sessionStorage.getItem('disableModal3');
    if (!isDisableModal) {
      setOpenModal(true);
    }
  }, []);

  useEffect(() => {
    requester.get<{ user?: string; token: string }>('/check/token/').then((res) => {
      setTokenChecked(true);
      setCsrf(res.data.token);
      requester.defaults.headers['X-CSRFToken'] = res.data.token;
      if (!res.data.user && isAuthNeeded) {
        clearUser();
        history.replace('/signin');
      } else if (res.data.user) {
        setUser(res.data.user);
        if (!isAuthNeeded) {
          history.replace('/problem/0');
        }
      }
    });
  }, [pathname]);

  if (!isTokenChecked) return <Loader />;

  return (
    <>
      <div className="App">
        <Switch>
          <Route path="/signin" exact component={Signin} />
          <Route path="/signup" exact component={Signup} />
          <Route path="/problem" exact component={ProblemPage} />
          <Route path="/problem/:prob_num" exact component={Main} />
          <Route path="/problem/:prob_num/submit" exact component={Submit} />
          <Redirect from="/" to="/signin" />
        </Switch>
      </div>
      <Footer />
      <ToastContainer
        position="bottom-right"
        autoClose={false}
        hideProgressBar
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      <Modal style={{ position: 'fixed', left: 100, right: 100 }} open={isOpenModal} onClose={() => setOpenModal(false)}>
        <Header icon="archive" content="와플스튜디오 루키 리크루팅 코딩 테스트 공지사항 (8/6 00시 08분 업데이트)" />
        <Modal.Content scrolling>
          <ReactMarkdown
            source={`\`\`\`
안녕하세요, 와플스튜디오 운영팀입니다.

몇 가지 공지사항 전달드립니다.

1. 문제 3번 테스트케이스 오류

  - 문제 3번의 테스트 케이스 중 list -g의 필터 조건에 0이 들어간 경우가 있었습니다.
    이 때문에 정답 코드임에도 불구하고 오랜 시간 동안 왜 안 되는지 고민하며 시간을 뺏기고 스트레스를 받으셨을 것으로 생각됩니다.
    이전 2번 문제에 이어 테스트케이스의 문제가 또다시 발생한 점 진심으로 사과드립니다.
    어떠한 문제가 발생하였거나 문제로 의심된다고 생각되시는 경우, recruit@wafflestudio.com 으로 제보해 주시면 최대한 빠르게 대응해 드리겠습니다.
    
2. 문제 2번 스켈레톤 ( 파이썬 ) 오류

  - student.py 의 출력 형식에, 학년과 이름의 순서가 바뀌어 있는 오류가 있었습니다. 해당 스켈레톤은 현재는 수정되었습니다.
  
3. 서버 점검
  
  - 작일 22시 50분부터 23시 50분까지 채점 속도 향상을 위한 서버 점검이 있었습니다.
  - 점검 결과 채점 속도가 눈에 띄게 향상되었습니다.
  - 또한 채점 ui가 일부 변경되었습니다.
      - 좌측 사이드바 문제 번호에 해결 라벨이 붙어 있으면 해당 문제를 한 번이라도 해결하신 것입니다.
      - 문제 페이지에서, 문제 이름 옆에 있는 아이콘은 해당 문제에 가장 최근에 제출하신 코드의 채점 결과입니다.

문제가 발생한 부분에 대해 다시 한 번 사과드립니다.

와플스튜디오 운영팀 드림
\`\`\``}
          />
        </Modal.Content>
        <Modal.Actions>
          <Button
            color="red"
            onClick={() => {
              sessionStorage.setItem('disableModal3', 'true');
              setOpenModal(false);
            }}
          >
            다시 보지 않기
          </Button>
          <Button color="green" onClick={() => setOpenModal(false)}>
            닫기
          </Button>
        </Modal.Actions>
      </Modal>
    </>
  );
};

export default App;
