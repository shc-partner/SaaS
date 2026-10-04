<?php
declare(strict_types=1);

namespace CreatorDesk\Workspaces;

use CreatorDesk\Auth\TokenGuard;
use CreatorDesk\Http\Request;
use CreatorDesk\Http\Response;

final class Controller
{
    public function __construct(
        private Repository $repo = new Repository(),
        private TokenGuard $guard = new TokenGuard(),
    ) {}

    public function index(Request $request): Response
    {
        $userId = $this->guard->userId($request);
        if ($userId === null) {
            return Response::error(401, 'unauthenticated', '로그인이 필요합니다.');
        }

        return Response::ok(array('items' => $this->repo->listForUser($userId)));
    }

    public function create(Request $request): Response
    {
        $userId = $this->guard->userId($request);
        if ($userId === null) {
            return Response::error(401, 'unauthenticated', '로그인이 필요합니다.');
        }

        $body = is_array($request->body) ? $request->body : array();
        if (trim((string)($body['name'] ?? '')) === '') {
            return Response::error(400, 'validation_failed', '워크스페이스 이름을 입력해 주세요.');
        }
        if (
            empty($body['purpose']) ||
            empty($body['format']) ||
            empty($body['templateKey']) ||
            empty($body['preset']) ||
            !isset($body['channels']) ||
            !is_array($body['channels']) ||
            count($body['channels']) < 1 ||
            !isset($body['items']) ||
            !is_array($body['items']) ||
            count($body['items']) < 1
        ) {
            return Response::error(400, 'validation_failed', '워크스페이스 설정값을 확인해 주세요.');
        }

        return Response::ok(array('workspace' => $this->repo->create($userId, $body)), 201);
    }

    public function update(Request $request): Response
    {
        $userId = $this->guard->userId($request);
        if ($userId === null) {
            return Response::error(401, 'unauthenticated', '로그인이 필요합니다.');
        }

        $workspaceId = (int)($request->params['workspaceId'] ?? 0);
        $body = is_array($request->body) ? $request->body : array();
        if (trim((string)($body['name'] ?? '')) === '') {
            return Response::error(400, 'validation_failed', '워크스페이스 이름을 입력해 주세요.');
        }

        $workspace = $this->repo->updateForAdmin($workspaceId, $userId, $body);
        if (!$workspace) {
            return Response::error(404, 'workspace_not_found', '수정할 워크스페이스를 찾을 수 없습니다.');
        }

        return Response::ok(array('workspace' => $workspace));
    }

    public function board(Request $request): Response
    {
        $authorized = $this->authorize($request);
        if ($authorized instanceof Response) return $authorized;

        return Response::ok($this->repo->board($authorized));
    }

    public function syncBoard(Request $request): Response
    {
        $authorized = $this->authorize($request);
        if ($authorized instanceof Response) return $authorized;

        $body = is_array($request->body) ? $request->body : array();
        $items = isset($body['items']) && is_array($body['items']) ? $body['items'] : array();
        $ideas = isset($body['ideas']) && is_array($body['ideas']) ? $body['ideas'] : array();
        $taskRequests = isset($body['taskRequests']) && is_array($body['taskRequests']) ? $body['taskRequests'] : array();

        return Response::ok($this->repo->syncBoard($authorized, $items, $ideas, $taskRequests));
    }

    public function delete(Request $request): Response
    {
        $userId = $this->guard->userId($request);
        if ($userId === null) {
            return Response::error(401, 'unauthenticated', '로그인이 필요합니다.');
        }

        $workspaceId = (int)($request->params['workspaceId'] ?? 0);
        if ($workspaceId < 1 || !$this->repo->deleteForOwner($workspaceId, $userId)) {
            return Response::error(404, 'workspace_not_found', '삭제할 워크스페이스를 찾을 수 없습니다.');
        }

        return Response::ok(array('deleted' => true));
    }

    public function members(Request $request): Response
    {
        $authorized = $this->authorize($request);
        if ($authorized instanceof Response) return $authorized;

        return Response::ok(array('items' => $this->repo->members($authorized)));
    }

    public function addMember(Request $request): Response
    {
        $authorized = $this->authorizeAdmin($request);
        if ($authorized instanceof Response) return $authorized;

        $body = $request->json();
        $email = trim((string)($body['email'] ?? ''));
        if ($email === '' || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
            return Response::error(400, 'validation_failed', '초대할 팀원의 이메일을 입력해 주세요.');
        }

        $members = $this->repo->addMemberByEmail($authorized, $email);
        if (!$members) {
            return Response::error(404, 'user_not_found', '가입된 사용자를 찾을 수 없습니다.');
        }

        return Response::ok(array('items' => $members), 201);
    }

    public function updateMember(Request $request): Response
    {
        $authorized = $this->authorizeAdmin($request);
        if ($authorized instanceof Response) return $authorized;

        $memberUserId = (int)($request->params['memberUserId'] ?? 0);
        $body = $request->json();
        $role = (string)($body['role'] ?? '');

        $members = $this->repo->updateMemberRole($authorized, $memberUserId, $role);
        if (!$members) {
            return Response::error(400, 'member_update_failed', '팀원 권한을 변경할 수 없습니다.');
        }

        return Response::ok(array('items' => $members));
    }

    public function removeMember(Request $request): Response
    {
        $authorized = $this->authorizeAdmin($request);
        if ($authorized instanceof Response) return $authorized;

        $memberUserId = (int)($request->params['memberUserId'] ?? 0);
        $members = $this->repo->removeMember($authorized, $memberUserId);
        if (!$members) {
            return Response::error(400, 'member_remove_failed', '팀원을 제거할 수 없습니다.');
        }

        return Response::ok(array('items' => $members));
    }

    /** @return int|Response */
    private function authorize(Request $request): int|Response
    {
        $userId = $this->guard->userId($request);
        if ($userId === null) {
            return Response::error(401, 'unauthenticated', '로그인이 필요합니다.');
        }

        $workspaceId = (int)($request->params['workspaceId'] ?? 0);
        if ($workspaceId < 1 || !$this->repo->canAccess($workspaceId, $userId)) {
            return Response::error(404, 'workspace_not_found', '워크스페이스를 찾을 수 없습니다.');
        }

        return $workspaceId;
    }

    /** @return int|Response */
    private function authorizeAdmin(Request $request): int|Response
    {
        $userId = $this->guard->userId($request);
        if ($userId === null) {
            return Response::error(401, 'unauthenticated', '로그인이 필요합니다.');
        }

        $workspaceId = (int)($request->params['workspaceId'] ?? 0);
        if ($workspaceId < 1 || !$this->repo->isAdmin($workspaceId, $userId)) {
            return Response::error(403, 'forbidden', '워크스페이스 관리자만 변경할 수 있습니다.');
        }

        return $workspaceId;
    }
}
