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
    const isDisableModal = sessionStorage.getItem('disableModal');
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
        autoClose={5000}
        hideProgressBar
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      <Modal style={{ position: 'fixed', left: 100, right: 100 }} open={isOpenModal} onClose={() => setOpenModal(false)}>
        <Header icon="archive" content="와플스튜디오 루키 리크루팅 코딩 테스트 채점 사과문" />
        <Modal.Content scrolling>
          <ReactMarkdown
            source={`\`\`\`
안녕하세요, 와플스튜디오 운영팀입니다.

이틀 동안 발생한 여러 가지 이슈에 대해,
8 / 3 ~ 8 / 4 이틀에 걸쳐 와플스튜디오 채점사이트에 등록해주신 학우분들께 사과의 말씀 올립니다.

내부적으로 정해진 기한에 맞추어 채점 서버 배포를 촉박하게 진행하다 보니,
몇 가지 큰 실수를 저질렀음을 뒤늦게 확인하였습니다.

저희가 발견한 이슈는 다음과 같습니다.

1. 문제 2번 테스트케이스 오류

  - 테스트케이스를 제작하는 과정에서 문제 2번의 일부 테스트케이스가 틀린 출력을 하고 있어,
    정답 코드여도 통과가 되지 않고 있었습니다. 이 부분 불편을 끼쳐 드려 죄송합니다.
    발견한 즉시 조치하여 현재는 정상 작동하도록 수정해두었습니다.
    
  - 추가적으로, 소수점 출력과 관련하여 명세가 애매한 부분이 있어 보강해두었습니다.
    정답을 도출한 후 구해진 시간을 소수 5번째 자리까지 반올림하여 출력해주시면 됩니다.
    해당 문제의 경우 이미 잘 구현하신 분들이 저희 측 실수로 오답 처리를 받고 당황하셨을 경우가 많을 것으로 예상됩니다.
    이 부분 진심으로 사과드립니다.
 
 
2. 문제 3번 스켈레톤 ( 자바 ) 오류

  - 서버 환경에서 openjdk 11을 사용하고 있는데, 4일 기준 올라가있던 자바 스켈레톤 코드에는
  java 14부터 사용 가능한 syntactic sugar가 적용되어 있어 해당 스켈레톤을 사용할 경우 컴파일 에러가 일어납니다.
  이 부분도 즉시 정정하였고 수정을 마친 상태입니다. 마찬가지로 깊은 사과의 말씀 드립니다.
  
  
3. 채점 서버의 각종 오류

  - 현재 채점 서버를 이용중이신 분들이 많아 채점에 오랜 시간이 소요되고 있으며,
    간혹 정답 코드임에도 timeout이 뜨는 등의 문제 역시 발생하고 있습니다.
  - 이는 서버 증설 및 ui 개선을 통해 더 나은 경험을 제공해드리기 위해 노력중입니다.
  
 
상기 이슈를 해결하여 정상적으로 작동하는 채점 사이트 환경을 갖추어두도록 최대한 노력하겠습니다.

미비된 사항이 많았던 점 다시 한 번 고개숙여 사과드립니다.

와플스튜디오 운영팀
\`\`\``}
          />
        </Modal.Content>
        <Modal.Actions>
          <Button
            color="red"
            onClick={() => {
              sessionStorage.setItem('disableModal', 'true');
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
