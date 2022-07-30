import React, { useEffect } from 'react';

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import emoji from 'emoji-dictionary';
import ReactMarkdown from 'react-markdown';
import { useHistory, useLocation, useParams, useRouteMatch } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Button } from 'semantic-ui-react';
import styled from 'styled-components';

import { authRequester, requester } from '../../apis/requester';
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
    <MainPageWrapper>
      <Sidebar />
      <ReviewContainer>
        <ReactMarkdown source={`# ${title}`} renderers={{ text: emojiSupport }} />
        <ReactMarkdown source={content} />
        {prob_num && (
          <Button
            onClick={
              () => history.push(`/problem/${prob_num}/submit`)
              /*              authRequester.post('/check/0/submit/', { req_data: {} }).then(
                (res) => {
                  console.log(res);
                },
                (err) => {
                  console.log(err);
                }
              )*/
            }
          >
            제출하기
          </Button>
        )}
        {pathname.includes('coverletter') && (
          <iframe
            src="https://docs.google.com/forms/d/e/1FAIpQLSdUQMy4umFnz0lEOfqZm2D0SBRh_uUam-dLRsIwEmvpoQn_EQ/viewform?embedded=true"
            width="900"
            height="100%"
            frameBorder="0"
            marginHeight={0}
            marginWidth={0}
          >
            로드 중…
          </iframe>
        )}
      </ReviewContainer>
    </MainPageWrapper>
  );
};

export default ProblemPage;
