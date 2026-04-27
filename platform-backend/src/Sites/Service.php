<?php
declare(strict_types=1);

namespace SiteForge\Sites;

use InvalidArgumentException;
use RuntimeException;

// 사이트 생성/조회 비즈니스 규칙. 컨트롤러는 HTTP 변환만 맡고, build 규칙은 여기로 모은다.
final class Service
{
    /** @var array<string,array{label:string,path:string,sort:int,section:string}> */
    private const PAGE_DEFS = [
        'home'     => ['label' => '홈',        'path' => '/',         'sort' => 0,  'section' => 'hero'],
        'about'    => ['label' => '회사 소개', 'path' => '/about',    'sort' => 10, 'section' => 'about'],
        'services' => ['label' => '서비스',    'path' => '/services', 'sort' => 20, 'section' => 'services'],
        'contact'  => ['label' => '문의하기',  'path' => '/contact',  'sort' => 30, 'section' => 'contact'],
        'board'    => ['label' => '게시판',    'path' => '/board',    'sort' => 40, 'section' => 'board'],
    ];

    public function __construct(
        private Repository $repo = new Repository(),
    ) {}

    /**
     * @param array{
     *     siteType:string,
     *     selectedTemplateKey?:string,
     *     basic:array{siteName:string,slug:string,industry?:string,summary?:string},
     *     selectedPages?:array<int,string>,
     *     pageContents?:array<string,array{heading?:string,lead?:string,body?:string}>,
     *     features:array<int,string>
     * } $input
     * @param int|null $ownerUserId 사이트를 만든 사용자 id. 비로그인 생성은 null.
     * @return array<string,mixed>
     */
    public function create(array $input, ?int $ownerUserId = null): array
    {
        $this->validate($input);

        $slug = trim((string)$input['basic']['slug']);
        $name = trim((string)$input['basic']['siteName']);
        $industry = $this->nullableTrim($input['basic']['industry'] ?? null);
        $summary = $this->nullableTrim($input['basic']['summary'] ?? null);
        $templateKey = $this->nullableTrim($input['selectedTemplateKey'] ?? null);
        $features = array_values(array_unique(array_map('strval', $input['features'])));
        $selectedPagesInput = is_array($input['selectedPages'] ?? null) ? $input['selectedPages'] : ['home'];
        $selectedPages = $this->normalizeSelectedPages($selectedPagesInput);
        $pageContents = is_array($input['pageContents'] ?? null) ? $input['pageContents'] : [];

        if ($this->repo->existsBySlug($slug)) {
            throw new InvalidArgumentException("slug '{$slug}' 는 이미 사용 중입니다.");
        }

        $pdo = $this->repo->pdo();
        $pdo->beginTransaction();
        try {
            $siteId = $this->repo->insertSite([
                'slug'          => $slug,
                'type'          => $input['siteType'],
                'template_key'  => $templateKey,
                'name'          => $name,
                'industry'      => $industry,
                'summary'       => $summary,
                'owner_user_id' => $ownerUserId,
            ]);
            $this->repo->insertFeatures($siteId, $features);

            $pageIds = [];
            foreach ($selectedPages as $pageKey) {
                $def = self::PAGE_DEFS[$pageKey];
                $pageIds[$pageKey] = $this->repo->insertPage($siteId, [
                    'key' => $pageKey,
                    'label' => $def['label'],
                    'path' => $def['path'],
                    'sort_order' => $def['sort'],
                ]);
            }

            $this->repo->insertSection($siteId, null, 'header', 0, ['brand' => $name]);

            foreach ($selectedPages as $pageKey) {
                $content = is_array($pageContents[$pageKey] ?? null) ? $pageContents[$pageKey] : [];
                $section = self::PAGE_DEFS[$pageKey]['section'];
                $this->repo->insertSection(
                    $siteId,
                    $pageIds[$pageKey],
                    $section,
                    $pageKey === 'home' ? 1 : 0,
                    $this->buildSectionContent($section, $content, $name, $industry, $summary),
                );
            }

            $this->repo->insertSection($siteId, null, 'footer', 99, ['brand' => $name]);

            $pdo->commit();
        } catch (\Throwable $e) {
            $pdo->rollBack();
            throw new RuntimeException('사이트 생성 실패: ' . $e->getMessage(), previous: $e);
        }

        return $this->buildPayload($siteId);
    }

    /** @return array<string,mixed>|null */
    public function find(int $id): ?array
    {
        $site = $this->repo->findSiteById($id);
        return $site === null ? null : $this->buildPayloadFromRow($site);
    }

    /**
     * 내가 만든 사이트 목록 — 대시보드/내 사이트 목록 페이지에서 사용.
     * 무거운 sections 까지 싣지 않고 카드에 필요한 만큼만 채운다.
     * @return array<int,array<string,mixed>>
     */
    public function listMine(int $ownerUserId): array
    {
        $rows = $this->repo->listByOwner($ownerUserId);
        $out = [];
        foreach ($rows as $row) {
            $siteId = (int)$row['id'];
            $features = $this->repo->listFeatures($siteId);
            $pages = $this->repo->listPages($siteId);
            $out[] = [
                'id'            => $siteId,
                'slug'          => (string)$row['slug'],
                'type'          => (string)$row['type'],
                'name'          => (string)$row['name'],
                'status'        => (string)$row['status'],
                'createdAt'     => (string)$row['created_at'],
                'updatedAt'     => (string)$row['updated_at'],
                'adminRequired' => in_array('adminPage', $features, true),
                'pages'         => array_map(
                    static fn (array $r): array => [
                        'key'   => (string)$r['page_key'],
                        'label' => (string)$r['label'],
                        'path'  => (string)$r['path'],
                    ],
                    $pages,
                ),
            ];
        }
        return $out;
    }

    /** 사이트 소유자 user id 조회 — 단건 조회 권한 검사용. 없으면 null. */
    public function ownerOf(int $siteId): ?int
    {
        $site = $this->repo->findSiteById($siteId);
        if ($site === null) return null;
        $owner = $site['owner_user_id'] ?? null;
        return $owner === null ? null : (int)$owner;
    }

    /** @return array<string,mixed>|null */
    public function findPublic(string $slug): ?array
    {
        $site = $this->repo->findSiteBySlug($slug);
        if ($site === null || ($site['status'] ?? '') !== 'published') {
            return null;
        }
        return $this->buildPayloadFromRow($site);
    }

    /** @param array<string,mixed> $input */
    private function validate(array $input): void
    {
        if (($input['siteType'] ?? null) !== 'company') {
            throw new InvalidArgumentException('현재는 company 유형만 지원합니다.');
        }
        $basic = $input['basic'] ?? null;
        if (!is_array($basic)) {
            throw new InvalidArgumentException('basic 정보가 필요합니다.');
        }
        $name = trim((string)($basic['siteName'] ?? ''));
        $slug = trim((string)($basic['slug'] ?? ''));
        if ($name === '') {
            throw new InvalidArgumentException('사이트 이름은 필수입니다.');
        }
        if (!preg_match('/^[a-z0-9]+(?:-[a-z0-9]+)*$/', $slug)) {
            throw new InvalidArgumentException("slug 형식이 올바르지 않습니다: '{$slug}'");
        }
        if (!is_array($input['features'] ?? null)) {
            throw new InvalidArgumentException('features 배열이 필요합니다.');
        }

        if (isset($input['selectedPages']) && !is_array($input['selectedPages'])) {
            throw new InvalidArgumentException('selectedPages 배열이 필요합니다.');
        }
        $this->normalizeSelectedPages($input['selectedPages'] ?? ['home']);
    }

    /**
     * @param array<int,string> $pages
     * @return array<int,string>
     */
    private function normalizeSelectedPages(array $pages): array
    {
        $ordered = ['home'];
        foreach (self::PAGE_DEFS as $key => $_) {
            if ($key === 'home') {
                continue;
            }
            if (in_array($key, $pages, true)) {
                $ordered[] = $key;
            }
        }

        foreach ($pages as $key) {
            $key = (string)$key;
            if (!isset(self::PAGE_DEFS[$key])) {
                throw new InvalidArgumentException("지원하지 않는 페이지입니다: '{$key}'");
            }
        }

        return $ordered;
    }

    /**
     * @param array{heading?:string,lead?:string,body?:string} $content
     * @return array<string,mixed>
     */
    private function buildSectionContent(
        string $section,
        array $content,
        string $name,
        ?string $industry,
        ?string $summary,
    ): array {
        $heading = $this->fallback($content['heading'] ?? null, '');
        $lead = $this->fallback($content['lead'] ?? null, '');
        $body = $this->fallback($content['body'] ?? null, '');

        return match ($section) {
            'hero' => [
                'title' => $heading !== '' ? $heading : $name,
                'subtitle' => $lead !== '' ? $lead : ($summary ?: ($industry ? "{$industry} 분야의 신뢰할 수 있는 파트너" : '')),
                'cta' => '자세히 알아보기',
            ],
            'about' => [
                'heading' => $heading !== '' ? $heading : '회사 소개',
                'industry' => $industry ?: '',
                'cards' => [
                    ['title' => '비전', 'body' => $lead !== '' ? $lead : '기술과 경험을 결합해, 가장 확실한 결과를 전달합니다.'],
                    ['title' => '경험', 'body' => $body !== '' ? $body : '다양한 업계 프로젝트를 통해 검증된 전문성을 보유하고 있습니다.'],
                    ['title' => '팀', 'body' => '분야별 전문가가 협업하여 프로젝트의 성공을 책임집니다.'],
                ],
            ],
            'services' => [
                'heading' => $heading !== '' ? $heading : '서비스 소개',
                'lead' => $lead !== '' ? $lead : '고객의 단계별 니즈에 맞춰 세 가지 영역의 서비스를 제공합니다.',
                'items' => [
                    ['title' => '컨설팅', 'body' => $body !== '' ? $body : '비즈니스 목표에 맞춘 전략과 실행 계획을 함께 설계합니다.'],
                    ['title' => '프로젝트 수행', 'body' => '경험 있는 팀이 일정과 품질을 책임지고 결과물을 전달합니다.'],
                    ['title' => '운영 지원', 'body' => '런칭 이후에도 안정적인 운영을 위한 유지보수와 개선을 지원합니다.'],
                ],
            ],
            'contact' => [
                'heading' => $heading !== '' ? $heading : '문의하기',
                'lead' => $lead !== '' ? $lead : "{$name} 에 대해 더 알고 싶다면 편하게 연락해 주세요.",
                'address' => '서울특별시 ○○구 ○○로 00, 0층',
                'phone' => '02-000-0000',
                'email' => 'contact@example.com',
                'hours' => '평일 09:00 — 18:00',
            ],
            'board' => [
                'heading' => $heading !== '' ? $heading : '게시판',
                'lead' => $lead !== '' ? $lead : '공지사항과 최신 소식을 한곳에서 확인하세요.',
                'posts' => [
                    [
                        'title' => $body !== '' ? $body : '사이트 오픈 안내',
                        'excerpt' => '새로운 소식과 운영 공지를 게시판에서 순차적으로 제공할 예정입니다.',
                        'date' => '2026-04-25',
                    ],
                    [
                        'title' => '자주 묻는 질문',
                        'excerpt' => '서비스 이용 방법과 문의 전 확인할 내용을 정리합니다.',
                        'date' => '2026-04-25',
                    ],
                ],
            ],
            default => [],
        };
    }

    private function fallback(mixed $value, string $placeholder): string
    {
        $trimmed = trim((string)($value ?? ''));
        return $trimmed === '' ? $placeholder : $trimmed;
    }

    private function nullableTrim(mixed $value): ?string
    {
        $trimmed = trim((string)($value ?? ''));
        return $trimmed === '' ? null : $trimmed;
    }

    /** @return array<string,mixed> */
    private function buildPayload(int $siteId): array
    {
        $site = $this->repo->findSiteById($siteId);
        if ($site === null) {
            throw new RuntimeException('생성 직후 사이트 조회 실패');
        }
        return $this->buildPayloadFromRow($site);
    }

    /**
     * @param array<string,mixed> $site
     * @return array<string,mixed>
     */
    private function buildPayloadFromRow(array $site): array
    {
        $siteId = (int)$site['id'];
        $features = $this->repo->listFeatures($siteId);
        $pages = $this->repo->listPages($siteId);
        $sections = $this->repo->listSections($siteId);

        $sectionsOut = array_map(
            static fn (array $r): array => [
                'id' => (int)$r['id'],
                'pageId' => $r['page_id'] !== null ? (int)$r['page_id'] : null,
                'kind' => (string)$r['kind'],
                'sort' => (int)$r['sort_order'],
                'content' => json_decode((string)$r['content_json'], true),
            ],
            $sections,
        );

        $pagesOut = array_map(
            static fn (array $r): array => [
                'id' => (int)$r['id'],
                'key' => (string)$r['page_key'],
                'label' => (string)$r['label'],
                'path' => (string)$r['path'],
                'sort' => (int)$r['sort_order'],
            ],
            $pages,
        );

        return [
            'site' => [
                'id' => $siteId,
                'slug' => (string)$site['slug'],
                'type' => (string)$site['type'],
                'templateKey' => $site['template_key'] ?? null,
                'name' => (string)$site['name'],
                'industry' => $site['industry'],
                'summary' => $site['summary'],
                'status' => (string)$site['status'],
                'createdAt' => (string)$site['created_at'],
                'updatedAt' => (string)$site['updated_at'],
            ],
            'features' => $features,
            'pages' => $pagesOut,
            'sections' => $sectionsOut,
            'publicUrl' => '/sites/' . $site['slug'],
            'adminUrl' => in_array('adminPage', $features, true) ? '/admin/sites/' . $siteId : null,
        ];
    }
}
