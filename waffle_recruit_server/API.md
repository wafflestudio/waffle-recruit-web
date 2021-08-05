### GET /check/prob/<prob_num>/
- payload
  - <prob_num>, in URI
- sample response
  - 401 Unauthorized
  - `{"error": "Exception()"}`, with status code 500 (unexpected server error)
  - `{"solved": true, "task": task_result}`, with status code 200
  - task_result
    - status: 'pending' | 'correct' | 'wrong'
    - message
      - status: pending -> message: pending
      - status: correct -> message: 'correct' | 'already correct'
      - status: wrong -> message: error message (wrong output)
    - example
      - ```
        {
          "solved": true,
           "task": {
             "status": "correct"
             "message": "correct"
           }
        }
        ```
      - ```
        {
          "solved": false,
           "task": {
             "status": "pending"
             "message": "pending"
           }
        }
        ```

### POST /check/prob/<prob_num>/
- payload
  - 기존과 동일
  - json body
- sample response
  - ```{"error": "invalid filename: `..` is not allowed"}``` with status code 400
  - `{"remain": 5}` with status code 402
  - empty response with status code 202
  - 401 Unauthorized
- 기존에 처리중이던 task는 취소되고 이번 요청이 새로 발생.
