# (client) => (socket)/connect => (rest)/check
  1. isCorrect : O, isLast : O => connect!
  2. isCorrect : O, isLast : X => (rest)/block?start=n&end=m
  3. isCorrect : X, isLast : X => (rest)/block
  4. 2,3번은 업데이트 후 다시 1번으로

# 블록 전파
## (client) => (socket)/once/addBlock => (rest)/block
  - 마지막 블록에 결합될 새 블록 생성
  - 다른 유저들에게 블록 추가 : socket emit

# 기존 블록.data 유효성 검증
  - index, {userId, voiceHash, timestamp}
## (client A) => (socket)/broadcast/checkPlz => (client B,C,D,...)/check
## (client B,C,D,...) => (socket)/broadcast/authorizedHash => (client A)
  - 검증 결과(success/fail) 받아서 누적