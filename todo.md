# socket => last block check
  1. isCorrect : O, isUpdated : O => connect!
  2. isCorrect : O, isUpdated : X => <rest>/block?start=n&end=m
  3. isCorrect : X, isUpdated : X => <rest>/block
  4. 2,3번은 업데이트 후 다시 1번으로

# 보이스 해시 업로드
## socket => newHash
  - 마지막 블록에 결합될 새 블록 생성
  - 다른 유저들에게 블록 추가 : socket emit

# 과거 블록 검증 요청 
index, {userId, voiceHash, timestamp}

## socket => checkHash
  - 서버 => 유저 : 검증 요청 : socket emit
## socket => authorizeHash
  - checkTimestamp, 검증 결과(success/fail) 받아서 누적

