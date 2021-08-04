### GET /check/prob/<prob_num>/
- payload
  - 기존과 동일
  - <prob_num>, in URI
- sample response
  - 기존과 동일
  - `{"solved": true}`

### POST /check/prob/<prob_num>/
- payload
  - 기존과 동일
  - json body
- sample response
  - ```{"error": "invalid filename: `..` is not allowed"}``` with status code 400
  - `{"remain": 5}` with status code 402
  - `{"task_id": "5d64c62f-a75e-44c5-bfb0-bef4a193e3c1"}` with status code 202
- 기존에 처리중이던 task는 취소되고 이번 요청이 새로 발생.

### GET /check/prob/<prob_num>/<task_id>/
- payload
  - <prob_num>, in URI
  - <task_id>, in URI, retrieved from `POST /check/prob/<prob_num>/`
- sample response
  - emtpy response with status code 204, if solver is pending. 
  - `{"error": "Exception()"}`, with status code 500 (unexpected celery error)
  - `{"error": "Wrong answer : resulted b'' in "}`, with status code 400 (submitted code error)
    - 기존과 동일한 형식
  - empty response with status code 200, if first solved
    - 기존과 동일한 형식
  - empty response with status code 202, if already solved
    - 기존과 동일한 형식