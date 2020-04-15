```javascript
interface transaction {
  userId: string;
  voiceHash: string;
  timeStamp: number;
  longitude?: number;
  lantitude?: number;
}

interface chain {
  index: number;
  hash: string;
  previousHash: string;
  timestamp: number;
  data: transaction;
}
```

```javascript
//전체 블록 요청
rest API => get => /blocks
  // 풀노드 list 가져오기 : dynamodb

//보이스 해시 업로드
rest API => POST => /hash
  // 서버의 마지막 노드에 결합되는지 확인(dynamodb)
  // 풀노드에 블록 추가 : socket emit
});

socket => connect
  //data.lastBlock 체크 => 최신이라면 connect
  //lastBlock가 최신이 아니라면 부족한 만큼 보내줌
  //lastBlock이 문제가 있다면 error리턴
  //error리턴받은 클라이언트는 /blocks rest요청
  //클라이언트는 블록 업데이트 후 다시 1번으로


//보이스 해시 검증 요청 : txId, userId, 보이스해시, 날짜
app.get("/hash", (req: any, res: any) => {
  // 풀노드 list 가져오기 : redis
  // 풀노드에 검증 요청 : socket emit
  // 검증 요청 노드
});

//풀노드 추가
app.post("/node", (req: any, res: any) => {
  // 마지막 블록 정보 확인 : body
  // 최신 블록으로 update : socket emit
  // 풀노드list에 추가 : redis
  // 소켓 세션
});

//해시 검증완료
io.on("authorize/complete", (socket: any) => {
  // success | fail 판단
  // 임시 보관소에 전파
});
```
