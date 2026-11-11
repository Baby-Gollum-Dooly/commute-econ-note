# 출근길 경제노트

- 출근 30분 동안 읽는 경제, 스타트업, 시사, 국제, IT과학, 산업, 부동산 뉴스 정리 페이지
- 배포 주소 https://commute-econ-note.vercel.app
- main 브랜치에 올라오면 Vercel이 자동 배포
- 매일 아침 7시에 그날 뉴스로 갱신

## 폴더 구조

```
.
├── index.html              배포용 페이지, 빌드 결과물
├── assets
│   ├── css/style.css       스타일, 빌드 결과물
│   └── js/app.js           탭 전환, 읽음 표시, 퀴즈 동작, 빌드 결과물
├── src
│   └── page.html           원본 페이지, 내용 수정은 여기서
└── scripts
    └── build_page.py       src/page.html 을 위 세 파일로 나누는 스크립트
```

## 수정 방법

- src/page.html 수정
- `python scripts/build_page.py` 실행
- index.html, assets 폴더 변경분을 src/page.html 과 함께 커밋

## 페이지 구성 규칙

- 탭은 `data-view` 속성으로 구분 (econ, startup, issues, world, tech, industry, realty)
- 기사와 카테고리는 `article.story`, 읽는 시간은 `data-min` 에 분 단위로 기록
- 탭별 기본 시간은 `data-base`, 마지막 섹션 id는 `data-end`
- 날짜는 `.wrap` 의 `data-date` 에 기록, 읽음 표시는 날짜별로 따로 저장
- 상승은 빨간색 `.up`, 하락은 파란색 `.down`
