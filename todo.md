```javascript
interface transaction {
  userId: string;
  voiceHash: string;
  timeStamp: number;
}

interface chain {
  index: number;
  hash: string;
  previousHash: string;
  timestamp: number;
  data: transaction;
}

const calculateHash = (index, previousHash, timestamp, data) =>
    CryptoJS.SHA256(index + previousHash + timestamp + JSON.stringfy(data)).toString();
```

```javascript

socket => connect
  //data.lastBlock 체크 => 최신이라면 connect
  //lastBlock가 최신이 아니라면 부족한 만큼 보내줌
  //lastBlock이 문제가 있다면 error리턴
  //error리턴받은 클라이언트는 /blocks rest요청
  //클라이언트는 블록 업데이트 후 다시 1번으로

//전체 블록 요청
socket => blocks
  // 전체 블록 조회 : dynamodb

//보이스 해시 업로드
socket => newHash
  // 마지막 블록에 결합될 새 블록 생성
  // 다른 유저들에게 블록 추가 : socket emit
});

//과거 블록 검증 요청 : index, {userId, voiceHash, timestamp}, checkTimestamp
socket => checkHash
  // 서버 => 유저 : 검증 요청 : socket emit
socket => authorizeHash
  // checkTimestamp, 검증 결과(success/fail) 받아서 누적

```
