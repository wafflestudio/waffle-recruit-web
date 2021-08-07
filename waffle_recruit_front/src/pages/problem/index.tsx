import React from 'react';

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import emoji from 'emoji-dictionary';
import ReactMarkdown from 'react-markdown';

import Sidebar from '../../component/Sidebar';

import styles from './[probNum]/Problem.module.css';

import '../containers.css';

const ProblemPage: React.FC = () => {
  return (
    <div>
      <Sidebar />
      <br />
      <br />
      <div className={styles.ReviewContainer}>
        <ReactMarkdown source={`\`\`\`${content}\`\`\``} />
      </div>
    </div>
  );
};

export default ProblemPage;

const content = `
와플 루키 모집에 참여하신 것을 환영합니다!

루키 지원을 위해, 이 사이트에서 제공되는 세 개의 문제 (Problem 1, 2, 3) 를 풀어 제출해 주세요.

사용 가능한 언어는 Java, Python, Kotlin, Javascript, Typescript 로 제한됩니다.
(Problem 3에 한해, Java나 Python의 경우 스켈레톤 코드가 제공됩니다.)

**중요** 채점에 사용되는 언어 버전은 다음과 같습니다.
- Java: openjdk v11
- Python: v3.6.9
- nodeJS: v16.6.0 (ES6 지원)
- typescript: nodeJS v16.6.0 (tsc version 4.3.5)
- kotlin: kotlin-jvm 1.5.21 (JRE 11.0.1+9-Ubuntu0-ubuntu2.18.04)

그럼 건투를 빌어요!

> 제출 후에는 자기소개서와 깃허브 아이디를 recruit@wafflestudio.com 으로 반드시 보내주셔야 지원이 완료됩니다. <

> 문제를 다 풀지 못하셔도 괜찮습니다. 채용 공고에 적혀 있듯이, 루키 모집이니만큼 실력보다는 노력을 더 중요하게 확인하여 선발할 예정입니다. <

> 모든 테스트케이스의 시간 제한은 각각 1초입니다. <
`;
