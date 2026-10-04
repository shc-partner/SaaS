<?php
declare(strict_types=1);

namespace CreatorDesk\Ai;

use CreatorDesk\Auth\TokenGuard;
use CreatorDesk\Http\Request;
use CreatorDesk\Http\Response;
use CreatorDesk\Workspaces\Repository as WorkspaceRepository;
use RuntimeException;

final class Controller
{
    public function __construct(
        private TrendIdeaService $service = new TrendIdeaService(),
        private TokenGuard $guard = new TokenGuard(),
        private WorkspaceRepository $workspaces = new WorkspaceRepository(),
        private UsageService $usage = new UsageService(),
    ) {}

    public function trendIdeas(Request $request): Response
    {
        $userId = $this->guard->userId($request);
        if ($userId === null) {
            return Response::error(401, 'unauthenticated', '로그인이 필요합니다.');
        }

        $body = $request->json();
        $workspaceId = isset($body['workspaceId']) ? (int)$body['workspaceId'] : 0;
        if ($workspaceId < 1 || !$this->workspaces->canAccess($workspaceId, $userId)) {
            return Response::error(404, 'workspace_not_found', '워크스페이스를 찾을 수 없습니다.');
        }

        $video = isset($body['video']) && is_array($body['video']) ? $body['video'] : array();
        if (trim((string)($video['title'] ?? '')) === '') {
            return Response::error(400, 'validation_failed', '트렌드 영상 정보가 필요합니다.');
        }

        $quota = $this->usage->trendIdeaQuota($userId);
        if ($quota['used'] >= $quota['limit']) {
            return Response::error(429, 'ai_usage_limit_exceeded', '오늘 사용할 수 있는 AI 추천 횟수를 모두 사용했습니다.', array(
                'usage' => $quota,
            ));
        }

        $count = isset($body['count']) ? (int)$body['count'] : 5;
        try {
            $result = $this->service->generateWithUsage($video, $count);
            $this->usage->recordTrendIdeas($userId, $workspaceId, array(
                'model' => $result['model'],
                'promptTokens' => $result['promptTokens'],
                'completionTokens' => $result['completionTokens'],
                'estimatedCost' => $result['estimatedCost'],
            ));
            $nextQuota = $this->usage->trendIdeaQuota($userId);

            return Response::ok(array(
                'ideas' => $result['ideas'],
                'usage' => $nextQuota,
            ));
        } catch (RuntimeException $e) {
            return Response::error(502, 'ai_ideas_failed', 'AI 아이디어 추천을 생성하지 못했습니다.', array(
                'reason' => $e->getMessage(),
                'usage' => $quota,
            ));
        }
    }

    public function trendIdeasFromVideos(Request $request): Response
    {
        $userId = $this->guard->userId($request);
        if ($userId === null) {
            return Response::error(401, 'unauthenticated', '로그인이 필요합니다.');
        }

        $body = $request->json();
        $workspaceId = isset($body['workspaceId']) ? (int)$body['workspaceId'] : 0;
        if ($workspaceId < 1 || !$this->workspaces->canAccess($workspaceId, $userId)) {
            return Response::error(404, 'workspace_not_found', '워크스페이스를 찾을 수 없습니다.');
        }

        $videos = isset($body['videos']) && is_array($body['videos']) ? $body['videos'] : array();
        if (count($videos) === 0) {
            return Response::error(400, 'validation_failed', '트렌드 영상 목록이 필요합니다.');
        }

        $quota = $this->usage->trendIdeaQuota($userId);
        if ($quota['used'] >= $quota['limit']) {
            return Response::error(429, 'ai_usage_limit_exceeded', '오늘 사용할 수 있는 AI 추천 횟수를 모두 사용했습니다.', array(
                'usage' => $quota,
            ));
        }

        $count = isset($body['count']) ? (int)$body['count'] : 7;
        try {
            $result = $this->service->generateFromVideosWithUsage($videos, $count);
            $this->usage->recordTrendIdeas($userId, $workspaceId, array(
                'model' => $result['model'],
                'promptTokens' => $result['promptTokens'],
                'completionTokens' => $result['completionTokens'],
                'estimatedCost' => $result['estimatedCost'],
            ));
            $nextQuota = $this->usage->trendIdeaQuota($userId);

            return Response::ok(array(
                'ideas' => $result['ideas'],
                'usage' => $nextQuota,
            ));
        } catch (RuntimeException $e) {
            return Response::error(502, 'ai_ideas_failed', 'AI 아이디어 추천을 생성하지 못했습니다.', array(
                'reason' => $e->getMessage(),
                'usage' => $quota,
            ));
        }
    }
}
