<?php
declare(strict_types=1);

namespace CreatorDesk\Youtube;

use CreatorDesk\Http\Request;
use CreatorDesk\Http\Response;
use RuntimeException;

final class Controller
{
    private TrendService $service;
    private CategoryRepository $categories;

    public function __construct()
    {
        $this->service = new TrendService();
        $this->categories = new CategoryRepository();
    }

    public function categories(Request $request): Response
    {
        $enabledOnly = $request->queryParam('enabledOnly', '0') === '1';
        $workspaceId = $this->workspaceId($request);
        if ($workspaceId < 1) {
            return Response::error(400, 'missing_workspace_id', 'workspaceId is required.');
        }

        return Response::ok(array(
            'items' => $enabledOnly
                ? $this->categories->enabledForWorkspace($workspaceId)
                : $this->categories->allForWorkspace($workspaceId),
        ));
    }

    public function saveCategories(Request $request): Response
    {
        $body = is_array($request->body) ? $request->body : array();
        $workspaceId = isset($body['workspaceId']) ? (int)$body['workspaceId'] : 0;
        if ($workspaceId < 1) {
            return Response::error(400, 'missing_workspace_id', 'workspaceId is required.');
        }

        $enabledIds = isset($body['enabledCategoryIds']) && is_array($body['enabledCategoryIds'])
            ? $body['enabledCategoryIds']
            : array();

        $this->categories->saveForWorkspace($workspaceId, array_map('strval', $enabledIds));

        return Response::ok(array(
            'items' => $this->categories->allForWorkspace($workspaceId),
            'message' => '저장되었습니다.',
        ));
    }

    public function restoreDefaultCategories(Request $request): Response
    {
        $body = is_array($request->body) ? $request->body : array();
        $workspaceId = isset($body['workspaceId'])
            ? (int)$body['workspaceId']
            : $this->workspaceId($request);
        if ($workspaceId < 1) {
            return Response::error(400, 'missing_workspace_id', 'workspaceId is required.');
        }

        $this->categories->restoreDefaultsForWorkspace($workspaceId);

        return Response::ok(array(
            'items' => $this->categories->allForWorkspace($workspaceId),
            'message' => '저장되었습니다.',
        ));
    }

    public function trends(Request $request): Response
    {
        $mode = (string)$request->queryParam('mode', 'category');
        $keyword = trim((string)$request->queryParam('keyword', ''));
        $regionCode = strtoupper((string)$request->queryParam('regionCode', 'KR'));
        $categoryId = (string)$request->queryParam('categoryId', '');
        $period = (string)$request->queryParam('period', '7d');
        $sort = (string)$request->queryParam('sort', 'trend');
        $limit = (int)$request->queryParam('limit', '50');

        if (!in_array($mode, array('category', 'search'), true)) {
            return Response::error(400, 'invalid_mode', 'mode must be one of category, search.');
        }
        if (!preg_match('/^[A-Z]{2}$/', $regionCode)) {
            return Response::error(400, 'invalid_region_code', 'regionCode must be a two-letter country code.');
        }
        if ($categoryId !== '' && !preg_match('/^\d+$/', $categoryId) && $categoryId !== 'vtuber') {
            return Response::error(400, 'invalid_category_id', 'categoryId must be empty, numeric, or vtuber.');
        }
        if (!in_array($period, array('24h', '3d', '7d', '30d'), true)) {
            return Response::error(400, 'invalid_period', 'period must be one of 24h, 3d, 7d, 30d.');
        }
        if (!in_array($sort, array('trend', 'views', 'latest'), true)) {
            return Response::error(400, 'invalid_sort', 'sort must be one of trend, views, latest.');
        }
        if (!in_array($limit, array(50, 100), true)) {
            return Response::error(400, 'invalid_limit', 'limit must be one of 50, 100.');
        }
        if ($mode === 'search' && $keyword === '') {
            return Response::error(400, 'missing_keyword', 'keyword is required in search mode.');
        }

        try {
            if ($mode === 'search') {
                $videos = $this->service->search($regionCode, $keyword, $period, $sort, $limit);
                return $this->trendResponse($videos, $regionCode, '', $period, $sort, false, '', $mode, $keyword, $limit);
            }

            $videos = $this->service->fetch($regionCode, $categoryId, $period, $sort, $limit);
            return $this->trendResponse($videos, $regionCode, $categoryId, $period, $sort, false, '', $mode, $keyword, $limit);
        } catch (RuntimeException $e) {
            if ($mode === 'category' && $categoryId !== '') {
                try {
                    $videos = $this->service->fetch($regionCode, '', $period, $sort, $limit);
                    return $this->trendResponse(
                        $videos,
                        $regionCode,
                        '',
                        $period,
                        $sort,
                        true,
                        '선택한 카테고리는 현재 국가의 인기 차트를 지원하지 않아 전체 인기 영상으로 표시합니다.',
                        $mode,
                        $keyword,
                        $limit
                    );
                } catch (RuntimeException $fallbackError) {
                    return Response::error(502, 'youtube_trends_failed', '트렌드 영상을 불러오지 못했습니다.', array(
                        'reason' => $fallbackError->getMessage(),
                        'categoryReason' => $e->getMessage(),
                    ));
                }
            }

            return Response::error(502, 'youtube_trends_failed', '트렌드 영상을 불러오지 못했습니다.', array(
                'reason' => $e->getMessage(),
            ));
        }
    }

    private function workspaceId(Request $request): int
    {
        return (int)$request->queryParam('workspaceId', '0');
    }

    /**
     * @param array<int,array<string,mixed>> $videos
     */
    private function trendResponse(
        array $videos,
        string $regionCode,
        string $categoryId,
        string $period,
        string $sort,
        bool $categoryFallback,
        string $message,
        string $mode,
        string $keyword,
        int $limit
    ): Response {
        return Response::ok(array(
            'items' => $videos,
            'meta' => array(
                'mode' => $mode,
                'keyword' => $keyword,
                'regionCode' => $regionCode,
                'categoryId' => $categoryId,
                'period' => $period,
                'sort' => $sort,
                'limit' => $limit,
                'cachedForSeconds' => 1800,
                'categoryFallback' => $categoryFallback,
                'message' => $message,
            ),
        ));
    }
}
