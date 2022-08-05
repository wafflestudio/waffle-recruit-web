import React, { useEffect } from 'react';

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import emoji from 'emoji-dictionary';
import ReactMarkdown from 'react-markdown';
import { useHistory, useLocation, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Button } from 'semantic-ui-react';
import styled from 'styled-components';

import { getResult } from '../../apis/checkResult';
import Result from '../../component/Result';
import Sidebar from '../../component/Sidebar';

import { main, problemStrings, coverletter } from './problems/problemStrings';

const emojiSupport = (text: any) => text.value.replace(/:\w+:/gi, (name: any) => emoji.getUnicode(name));

export const MainPageWrapper = styled.article`
  position: relative;
  display: flex;
  width: 100%;
  min-height: 100vh;
`;

export const ReviewContainer = styled.div`
  width: calc(100% - 300px);
  box-sizing: border-box;
  padding: 80px;
  margin-top: 80px;
  margin-left: 240px;
  font-family: 'NanumSquare', sans-serif;
  white-space: pre-wrap;
  word-wrap: break-word;
  text-align: left;
  line-height: 1.5;
  font-size: 16px;
`;

const ProblemPage = () => {
  const { prob_num }: { prob_num: string | undefined } = useParams();
  const { pathname } = useLocation();
  const history = useHistory();
  const { title, content }: { title: string; content: string } = prob_num
    ? problemStrings[Number(prob_num)]
    : pathname.includes('main')
    ? main
    : coverletter;

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <MainPageWrapper className="reverse-in-mobile">
      <Sidebar />
      <ReviewContainer className="wide-in-mobile">
        <ReactMarkdown source={title} renderers={{ text: emojiSupport }} />
        <ReactMarkdown source={content} />
        {prob_num && (
          <>
            <Result prob_num={prob_num} />
            <Button
              onClick={() => {
                if (getResult(prob_num)?.content.last_try !== -1) {
                  history.push(`/problem/${prob_num}/submit`);
                } else {
                  toast.error('채점 중에는 제출할 수 없습니다');
                }
              }}
            >
              제출하기
            </Button>
          </>
        )}
        {pathname.includes('coverletter') && (
          <>
            <iframe
              className="not-in-mobile"
              src="https://docs.google.com/forms/d/e/1FAIpQLSdalLD4Zxa_vgJDqbQV1OpzyADwATDCr6g-7aoIQnEtPsPqew/viewform?embedded=true"
              width="900"
              height="100%"
              frameBorder="0"
              marginHeight={0}
              marginWidth={0}
            >
              로드 중…
            </iframe>
            <a href="https://forms.gle/fGg55XyUJNZYLg9BA" className="only-in-mobile">
              모바일은 이 링크로 접속하세요
            </a>
          </>
        )}
      </ReviewContainer>
    </MainPageWrapper>
  );
};

export default ProblemPage;
