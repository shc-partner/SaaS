# Template — company-intro

기업 소개형 산출물 템플릿. 위저드 입력값이 이 템플릿에 주입되어 고객사 사이트가 만들어진다.

> ⚠️ **UI 정책: 본 템플릿의 frontend 는 반응형 필수.** 자세한 내용은 [../../docs/ui-policy.md](../../docs/ui-policy.md).

## 디렉토리 (예정)

```
company-intro/
├─ manifest.json            # 입력 스키마, 변수 목록, 파일 매핑 (TBD)
├─ frontend/                # React 템플릿 — 반응형 필수
│  ├─ index.html.tmpl       # viewport: width=device-width, initial-scale=1
│  ├─ src/
│  │  ├─ pages/
│  │  ├─ components/
│  │  └─ styles/responsive.css.tmpl   # mobile-first base
│  └─ package.json.tmpl
├─ backend/                 # plain PHP 템플릿 — UI 없음
│  ├─ public/index.php
│  └─ src/
├─ database/
│  ├─ schema.sql
│  └─ seed.sql.tmpl
└─ docker-compose.yml.tmpl
```

현재는 정책만 고정. 실제 파일은 generator/engine 단계에서 채워진다.

## 반응형 요구 사항 (Stage 1)

산출물 frontend 는 다음 기준을 만족해야 한다:

1. **viewport meta**: `<meta name="viewport" content="width=device-width, initial-scale=1">`
2. **mobile-first CSS**: 기본 스타일을 좁은 화면 기준으로 짜고, 미디어쿼리로 넓은 화면을 확장한다.
3. **breakpoint** (권장):
   - 모바일: ~ 640px
   - 태블릿: 641 ~ 1024px
   - 데스크탑: 1025px ~
4. **헤더 내비게이션**: 모바일에서는 햄버거/드로어 형태, 데스크탑에서는 가로 메뉴.
5. **이미지/미디어**: `max-width: 100%; height: auto`.
6. **타이포그래피**: 화면 폭에 따라 자연스럽게 변하도록 `rem` + 미디어쿼리 또는 `clamp()` 사용.
7. **레이아웃 그리드**: 모바일 1열 → 태블릿 2열 → 데스크탑 다열 식 점진 확장.
8. **터치 영역**: 모바일에서 버튼/링크 최소 44×44px.

## 검증 (템플릿 작성 시 체크리스트)

- [ ] Chrome DevTools 의 모바일 (iPhone SE 375px) 에서 가로 스크롤 없음.
- [ ] 태블릿 (768px) 에서 메뉴/카드가 깨지지 않음.
- [ ] 데스크탑 (1440px) 에서 콘텐츠가 과도하게 늘어나지 않음 (`max-width` 적용).
- [ ] 이미지 자리 표시(placeholder) 가 모든 폭에서 비율 유지.
- [ ] 폼 입력 필드가 모바일 키보드 노출 시에도 보임.

## 관리자(/admin) 화면은 별도 정책

산출물 안의 `/admin` 경로는 **데스크탑 전용**. 운영자가 PC 에서 콘텐츠를 수정한다는 가정.
[../../docs/ui-policy.md](../../docs/ui-policy.md) 참고.
