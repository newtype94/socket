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
app.get("/blocks", (req: any, res: any) => {
  // 유저 권한 확인
  // 풀노드 list 가져오기 : redis
  // 풀노드에 마지막 블록 요청 : socket emit
});

//보이스 해시 업로드
app.post("/hash", (req: any, res: any) => {
  // 공개키 복호화
  // 블록 임시 보관
  // 풀노드 list 가져오기 : redis
  // 풀노드에 마지막 블록 요청 : socket emit
  // 풀노드에 블록 추가 : socket emit
});

//보이스 해시 검증 요청 : txId, userId, 보이스해시, 날짜, 위치
app.get("/hash", (req: any, res: any) => {
  // 공개키 복호화
  // 풀노드 list 가져오기 : redis
  // 풀노드에 검증 요청 : socket emit
  // 검증 요청 노드
});

//풀노드 추가
app.post("/node", (req: any, res: any) => {
  // 유저 자격 확인 : mariadb
  // 마지막 블록 정보 확인 : body
  // 최신 블록으로 update : socket emit
  // 풀노드list에 추가 : redis
  // 소켓 세션
});

//마지막 블록 정보
io.on("block/last", (socket: any) => {
  //
});

//해시 검증완료
io.on("authorize/complete", (socket: any) => {
  // success | fail 판단
  // 임시 보관소에 전파
});
```