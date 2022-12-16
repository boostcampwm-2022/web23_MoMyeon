# 📢 프로젝트 소개

## 프로젝트명
![https://user-images.githubusercontent.com/106823684/201805789-52ef3a88-13cd-4b58-9f85-fb7da8f1fa13.png](https://user-images.githubusercontent.com/106823684/201805789-52ef3a88-13cd-4b58-9f85-fb7da8f1fa13.png)

### [[모면 바로가기](https://www.momyeon.site/)]

### 🐬 개발자 대상 온라인 모의면접 서비스

### ✏️ 게시글을 등록하여 함께 모의 면접을 연습할 사람을 모아요

### 🌟 모의 면접 중에 피드백을 작성할 수 있고, 서로의 피드백을 확인할 수 있어요



# 🎤 팀원 소개

|J102 서효석|J105 신승헌|J206 최용석|J219 홍순규|
|------|---|---|---|
|<img src="https://user-images.githubusercontent.com/75475398/206685316-4d821791-e7c2-4ef6-b0e7-79b6cd2b2321.png" width="200" height="200"></img> | <img src="https://user-images.githubusercontent.com/75475398/206686138-c50b9db5-ef24-4b33-9d3d-307493a28b57.png" width="200" height="200"></img> | <img src="https://user-images.githubusercontent.com/75475398/206686616-809084ae-829a-4bd8-84c0-e5a1754c80dc.png" width="200" height="200"></img> | <img src="https://user-images.githubusercontent.com/75475398/206686724-38677f21-1bfa-44e2-ae76-4a8f0c46cc9f.gif" width="200" height="200"></img> |
|[@Hyodori04](https://github.com/Hyodori04)|[@SeungheonShin](https://github.com/SeungheonShin)|[@yongseok-dev](https://github.com/yongseok-dev)|[@kabosuMy3a](https://github.com/kabosumy3a)|
|# 프론트엔드|# 백엔드|# 백엔드|# 프론트엔드 ~|


# 👨‍💻 기술스택
![](https://user-images.githubusercontent.com/75475398/206688942-4bdeb940-0f89-419d-b1f1-f3329cd7933f.png)


# ⚙ 아키텍쳐
![](https://user-images.githubusercontent.com/75475398/206688956-24bf6b8d-a8cb-4803-b52b-b3817d61d666.png)


# 🖥️ 화면구성


- 메인페이지
    - 무한스크롤 & 카테고리 검색
![무한스크롤](https://user-images.githubusercontent.com/106823684/208058829-6e2a6091-e522-4bda-8178-733c78bcb06a.gif)
    - 로그인 & 로그아웃
![로그인로그아웃](https://user-images.githubusercontent.com/106823684/208058872-22fdd4c1-08be-4ba3-8a5c-7dc6025a7132.gif)
- 상세페이지
    - 작성
![모의면접모집](https://user-images.githubusercontent.com/106823684/208059170-e5fc71c2-098d-4226-9e62-bbd8b22c68e5.gif)
    - 보기
![상세보기](https://user-images.githubusercontent.com/106823684/208059117-e7f9b63f-c5d2-4166-b2ff-e1be1e87d978.gif)
        
- 면접프로그램
    - 모의면접 접속
![모의면접 입장](https://user-images.githubusercontent.com/106823684/208059216-56665459-9e5a-40eb-ba70-2d76905c666a.gif)
    - 피드백 입력
![피드백 입력](https://user-images.githubusercontent.com/106823684/208059258-47698656-691b-436a-9a45-266fd26dd33b.gif)
    - 피드백 결과 
![피드백 보기](https://user-images.githubusercontent.com/106823684/208059324-e807a80f-b873-4bf7-8c0d-ec8a9f1f38b1.gif)
        
- 마이페이지
    - 이력서 관리
![이력서](https://user-images.githubusercontent.com/106823684/208059407-41b83b6b-72d8-4582-8bab-2abf0d1d46ad.gif)
    - 면접 관리
![모의면접 관리](https://user-images.githubusercontent.com/106823684/208059431-58b7f817-0bb7-40bd-9e1c-8922b83bf0d1.gif)
    - 면접 질문 관리
![질문관리](https://user-images.githubusercontent.com/106823684/208059473-10018c71-02de-458b-9ab6-aa205bb67ba7.gif)

# 🛠️ Feature 기능

### 모의면접 모집 기능

- 간편한 UI를 통해 쉽게 글을 작성하여 모의면접을 모집합니다.
- 카테고리를 기반으로 자신이 원하는 분야의 모집 글을 쉽게 찾을 수 있습니다.
- SSR를 기반으로 검색엔진에 최적화하여 검색을 통해 글을 찾을 수 있습니다.

### 온라인 모의면접 기능

- mediasoup 라이브러리를 통해 모의면접에 참여한 참여자 간의 화상통화 기능을 제공합니다.
- 모의면접을 진행을 위해 사전에 준비한 질문이 제공되고, 피드백을 위한 입력이 가능합니다.
- 모의면접을 마치며 상호간의 피드백 결과를 공유합니다.

### 마이페이지 관리 기능

- 자신의 이력사항을 추가하여 모의면접시 활용할 수 있게 합니다.
- 면접 준비를 위한 좋은 질문들을 정리하여 기록합니다.
- 모의면접을 통해 받은 피드백을 확인할 수 있습니다.

### GitHub OAuth 기반 사용자 인증

- 별도의 가입 없이 서비스를 사용 가능
- 서버 확장성을 고려하여 JWT 토큰을 사용

# 📚 고민의 흔적
- [검색엔진 최적화를 위한 길 - 성능을 중점으로](https://github.com/boostcampwm-2022/web23_MoMyeon/wiki/%EA%B2%80%EC%83%89%EC%97%94%EC%A7%84-%EC%B5%9C%EC%A0%81%ED%99%94%EB%A5%BC-%EC%9C%84%ED%95%9C-%EA%B8%B8:-%EC%84%B1%EB%8A%A5%EC%9D%84-%EC%A4%91%EC%A0%90%EC%9C%BC%EB%A1%9C)
- [Redis로 요청을 빠르게 처리하기](https://github.com/boostcampwm-2022/web23_MoMyeon/wiki/Redis%EB%A1%9C-%EC%9A%94%EC%B2%AD%EC%9D%84-%EB%B9%A0%EB%A5%B4%EA%B2%8C-%EC%B2%98%EB%A6%AC%ED%95%98%EA%B8%B0)
