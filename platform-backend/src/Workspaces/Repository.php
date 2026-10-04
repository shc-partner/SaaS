<?php
declare(strict_types=1);

namespace CreatorDesk\Workspaces;

use CreatorDesk\Db\Connection;
use PDO;

final class Repository
{
    private PDO $pdo;

    private const CHANNEL_LABELS = array(
        'youtube' => '유튜브',
        'chzzk' => '치지직',
        'soop' => '숲',
        'twitch' => '트위치',
        'other' => '기타',
    );

    private const FIELD_LABELS = array(
        'title' => '컨텐츠 제목',
        'status' => '컨텐츠 상태',
        'dueDate' => '마감일',
        'publishDate' => '배포일',
        'contentUrl' => '컨텐츠 URL',
        'channel' => '활동 채널',
        'format' => '컨텐츠 형식',
        'priority' => '우선순위',
        'tags' => '태그',
        'memo' => '메모',
        'referenceLinks' => '참고 링크',
        'thumbnail' => '썸네일',
        'script' => '대본 / 구성안',
        'shooting' => '촬영 여부',
        'editing' => '편집 여부',
        'upload' => '업로드 여부',
        'scheduled' => '예약 배포 여부',
        'assignee' => '담당자',
        'reviewStatus' => '검토 상태',
        'feedbackMemo' => '피드백 메모',
        'notification' => '알림 여부',
        'sponsored' => '협찬 여부',
        'sponsorBrand' => '협찬사 / 브랜드',
        'views' => '조회수',
        'avgViewers' => '평균 시청자 수',
        'streamStartTime' => '방송 시작 시간',
        'streamEndTime' => '방송 종료 시간',
        'streamTopic' => '방송 주제',
        'vodUrl' => '다시보기 URL',
        'peakViewers' => '최고 시청자 수',
        'chatIssueMemo' => '채팅 이슈 메모',
        'gameTitle' => '게임명',
        'platform' => '플랫폼',
        'highlightMemo' => '하이라이트 메모',
        'partyMembers' => '참여 멤버',
        'gameMode' => '게임 모드',
        'streamTime' => '방송 예정 시간',
        'clipProduction' => '클립 제작 여부',
        'vodUpload' => '다시보기 업로드 여부',
        'research' => '자료 조사',
        'sourceLinks' => '출처 링크',
        'referenceImages' => '참고 이미지',
        'productName' => '제품명',
        'comparisonTarget' => '비교 대상',
        'purchaseLink' => '구매 링크',
        'prosConsMemo' => '장단점 메모',
        'shootingLocation' => '촬영 장소',
        'shootingDate' => '시작일자',
        'brollCheck' => 'B-roll 체크',
        'musicBgm' => '음악 / BGM',
        'issueSource' => '이슈 출처',
        'publishDeadline' => '배포 마감 시간',
        'factCheck' => '팩트 체크',
        'sensitivity' => '민감도',
        'shortformHook' => '첫 3초 훅',
        'shortformCaption' => '자막 문구',
        'shortformSound' => '사용 음원',
        'keyword' => '키워드',
        'seoTitle' => 'SEO 제목',
        'metaDescription' => '메타 설명',
    );

    private const BOARD_COLUMNS_BY_PRESET = array(
        'simple' => array(
            array('id' => 'idea', 'label' => '아이디어'),
            array('id' => 'editing', 'label' => '제작중'),
            array('id' => 'scheduled', 'label' => '예약됨'),
            array('id' => 'published', 'label' => '작업완료'),
        ),
        'standard' => array(
            array('id' => 'idea', 'label' => '아이디어'),
            array('id' => 'planning', 'label' => '기획중'),
            array('id' => 'shooting', 'label' => '촬영 / 녹화'),
            array('id' => 'editing', 'label' => '작업중'),
            array('id' => 'scheduled', 'label' => '업로드 예약'),
            array('id' => 'published', 'label' => '작업완료'),
        ),
        'team' => array(
            array('id' => 'idea', 'label' => '아이디어'),
            array('id' => 'planning', 'label' => '기획중'),
            array('id' => 'scripting', 'label' => '대본 작성'),
            array('id' => 'shooting', 'label' => '촬영 완료'),
            array('id' => 'editing', 'label' => '작업중'),
            array('id' => 'edit-review', 'label' => '편집 검수'),
            array('id' => 'thumbnail', 'label' => '썸네일 작업'),
            array('id' => 'scheduled', 'label' => '예약됨'),
            array('id' => 'published', 'label' => '작업완료'),
        ),
    );

    private const CALENDAR_TYPES = array(
        array('key' => 'start', 'name' => '시작일자', 'color' => '#2563eb'),
        array('key' => 'due', 'name' => '마감일자', 'color' => '#f97316'),
    );

    public function __construct(?PDO $pdo = null)
    {
        $this->pdo = $pdo ?? Connection::pdo();
    }

    /** @return array<int,array<string,mixed>> */
    public function listForUser(int $userId): array
    {
        $q = $this->pdo->prepare(
            'SELECT DISTINCT w.*
              FROM workspaces w
               LEFT JOIN workspace_members m ON m.workspace_id = w.id
              WHERE w.owner_user_id = :owner_uid OR m.user_id = :member_uid
              ORDER BY w.created_at DESC, w.id DESC'
        );
        $q->execute(array(':owner_uid' => $userId, ':member_uid' => $userId));
        return array_map(array($this, 'mapWorkspace'), $q->fetchAll());
    }

    /** @param array<string,mixed> $input */
    public function create(int $userId, array $input): array
    {
        $this->pdo->beginTransaction();
        try {
            $q = $this->pdo->prepare(
                'INSERT INTO workspaces
                  (owner_user_id, name, description, purpose, channels, format, template_key, preset, items, status)
                 VALUES
                  (:owner_user_id, :name, :description, :purpose, :channels, :format, :template_key, :preset, :items, :status)'
            );
            $q->execute(array(
                ':owner_user_id' => $userId,
                ':name' => (string)$input['name'],
                ':description' => (string)($input['description'] ?? ''),
                ':purpose' => (string)$input['purpose'],
                ':channels' => $this->json($input['channels'] ?? array()),
                ':format' => (string)$input['format'],
                ':template_key' => (string)$input['templateKey'],
                ':preset' => (string)$input['preset'],
                ':items' => $this->json($input['items'] ?? array()),
                ':status' => (string)($input['status'] ?? 'active'),
            ));

            $workspaceId = (int)$this->pdo->lastInsertId();
            $this->addMember($workspaceId, $userId, 'admin');
            $this->replaceConfiguration($workspaceId, $input);
            $this->pdo->commit();
        } catch (\Throwable $e) {
            $this->pdo->rollBack();
            throw $e;
        }

        return $this->findForUser($workspaceId, $userId);
    }

    public function canAccess(int $workspaceId, int $userId): bool
    {
        $q = $this->pdo->prepare(
            'SELECT 1
               FROM workspaces w
               LEFT JOIN workspace_members m ON m.workspace_id = w.id AND m.user_id = :member_uid
              WHERE w.id = :wid
                AND (w.owner_user_id = :owner_uid OR m.user_id IS NOT NULL)
              LIMIT 1'
        );
        $q->execute(array(':wid' => $workspaceId, ':member_uid' => $userId, ':owner_uid' => $userId));
        return $q->fetchColumn() !== false;
    }

    public function isAdmin(int $workspaceId, int $userId): bool
    {
        $q = $this->pdo->prepare(
            'SELECT 1
               FROM workspaces w
               LEFT JOIN workspace_members m ON m.workspace_id = w.id AND m.user_id = :member_uid
              WHERE w.id = :wid
                AND (w.owner_user_id = :owner_uid OR m.role = :admin_role)
              LIMIT 1'
        );
        $q->execute(array(
            ':wid' => $workspaceId,
            ':member_uid' => $userId,
            ':owner_uid' => $userId,
            ':admin_role' => 'admin',
        ));
        return $q->fetchColumn() !== false;
    }

    public function findForUser(int $workspaceId, int $userId): array
    {
        $q = $this->pdo->prepare(
            'SELECT w.*
               FROM workspaces w
               LEFT JOIN workspace_members m ON m.workspace_id = w.id AND m.user_id = :member_uid
              WHERE w.id = :wid
                AND (w.owner_user_id = :owner_uid OR m.user_id IS NOT NULL)
              LIMIT 1'
        );
        $q->execute(array(':wid' => $workspaceId, ':member_uid' => $userId, ':owner_uid' => $userId));
        $row = $q->fetch();
        return $row === false ? array() : $this->mapWorkspace($row);
    }

    /** @param array<string,mixed> $input */
    public function updateForAdmin(int $workspaceId, int $userId, array $input): array
    {
        if (!$this->isAdmin($workspaceId, $userId)) {
            return array();
        }

        $this->pdo->beginTransaction();
        try {
            $q = $this->pdo->prepare(
                'UPDATE workspaces
                    SET name = :name,
                        description = :description,
                        purpose = :purpose,
                        channels = :channels,
                        format = :format,
                        template_key = :template_key,
                        preset = :preset,
                        items = :items
                  WHERE id = :wid'
            );
            $q->execute(array(
                ':name' => (string)$input['name'],
                ':description' => (string)($input['description'] ?? ''),
                ':purpose' => (string)$input['purpose'],
                ':channels' => $this->json($input['channels'] ?? array()),
                ':format' => (string)$input['format'],
                ':template_key' => (string)$input['templateKey'],
                ':preset' => (string)$input['preset'],
                ':items' => $this->json($input['items'] ?? array()),
                ':wid' => $workspaceId,
            ));
            $this->replaceConfiguration($workspaceId, $input);
            $this->pdo->commit();
        } catch (\Throwable $e) {
            $this->pdo->rollBack();
            throw $e;
        }

        return $this->findForUser($workspaceId, $userId);
    }

    public function deleteForOwner(int $workspaceId, int $userId): bool
    {
        $q = $this->pdo->prepare(
            'SELECT 1 FROM workspaces WHERE id = :wid AND owner_user_id = :uid LIMIT 1'
        );
        $q->execute(array(':wid' => $workspaceId, ':uid' => $userId));
        if ($q->fetchColumn() === false) {
            return false;
        }

        $this->pdo->beginTransaction();
        try {
            $this->pdo
                ->prepare('DELETE FROM workspace_youtube_trend_category WHERE workspace_id = :wid')
                ->execute(array(':wid' => $workspaceId));
            $this->pdo
                ->prepare('DELETE FROM workspaces WHERE id = :wid AND owner_user_id = :uid')
                ->execute(array(':wid' => $workspaceId, ':uid' => $userId));
            $this->pdo->commit();
        } catch (\Throwable $e) {
            $this->pdo->rollBack();
            throw $e;
        }

        return true;
    }

    /** @return array<int,array<string,mixed>> */
    public function members(int $workspaceId): array
    {
        $q = $this->pdo->prepare(
            'SELECT m.user_id, m.role, m.created_at, u.email, u.name
               FROM workspace_members m
               JOIN users u ON u.id = m.user_id
              WHERE m.workspace_id = :wid
              ORDER BY FIELD(m.role, "admin", "member"), m.created_at ASC, m.id ASC'
        );
        $q->execute(array(':wid' => $workspaceId));

        return array_map(array($this, 'mapMember'), $q->fetchAll());
    }

    public function addMemberByEmail(int $workspaceId, string $email): array
    {
        $user = $this->findUserByEmail($email);
        if (!$user) {
            return array();
        }

        $this->addMember($workspaceId, (int)$user['id'], 'member');
        return $this->members($workspaceId);
    }

    public function updateMemberRole(int $workspaceId, int $memberUserId, string $role): array
    {
        if (!in_array($role, array('admin', 'member'), true)) {
            return array();
        }
        if (!$this->memberExists($workspaceId, $memberUserId)) {
            return array();
        }
        if ($role !== 'admin' && $this->isWorkspaceOwner($workspaceId, $memberUserId)) {
            return array();
        }

        $q = $this->pdo->prepare(
            'UPDATE workspace_members
                SET role = :role
              WHERE workspace_id = :wid AND user_id = :uid'
        );
        $q->execute(array(':role' => $role, ':wid' => $workspaceId, ':uid' => $memberUserId));

        return $this->members($workspaceId);
    }

    public function removeMember(int $workspaceId, int $memberUserId): array
    {
        if ($this->isWorkspaceOwner($workspaceId, $memberUserId)) {
            return array();
        }

        $q = $this->pdo->prepare(
            'DELETE FROM workspace_members
              WHERE workspace_id = :wid AND user_id = :uid'
        );
        $q->execute(array(':wid' => $workspaceId, ':uid' => $memberUserId));

        return $this->members($workspaceId);
    }

    /** @return array{items:array<int,array<string,mixed>>,ideas:array<int,array<string,mixed>>,taskRequests:array<int,array<string,mixed>>} */
    public function board(int $workspaceId): array
    {
        $items = $this->pdo->prepare('SELECT * FROM content_items WHERE workspace_id = :wid ORDER BY created_at DESC');
        $items->execute(array(':wid' => $workspaceId));

        $ideas = $this->pdo->prepare('SELECT * FROM content_ideas WHERE workspace_id = :wid ORDER BY created_at DESC');
        $ideas->execute(array(':wid' => $workspaceId));

        $taskRequests = $this->pdo->prepare('SELECT * FROM content_task_requests WHERE workspace_id = :wid ORDER BY created_at DESC');
        $taskRequests->execute(array(':wid' => $workspaceId));

        return array(
            'items' => array_map(array($this, 'mapContentItem'), $items->fetchAll()),
            'ideas' => array_map(array($this, 'mapIdea'), $ideas->fetchAll()),
            'taskRequests' => array_map(array($this, 'mapTaskRequest'), $taskRequests->fetchAll()),
        );
    }

    /** @param array<int,array<string,mixed>> $items @param array<int,array<string,mixed>> $ideas @param array<int,array<string,mixed>> $taskRequests */
    public function syncBoard(int $workspaceId, array $items, array $ideas, array $taskRequests = array()): array
    {
        $this->pdo->beginTransaction();
        try {
            $this->pdo->prepare('DELETE FROM content_items WHERE workspace_id = :wid')->execute(array(':wid' => $workspaceId));
            $this->pdo->prepare('DELETE FROM content_ideas WHERE workspace_id = :wid')->execute(array(':wid' => $workspaceId));
            $this->pdo->prepare('DELETE FROM content_task_requests WHERE workspace_id = :wid')->execute(array(':wid' => $workspaceId));

            $itemStmt = $this->pdo->prepare(
                'INSERT INTO content_items
                  (id, workspace_id, title, status, channels, content_format, tags, assignee, priority, script,
                   title_candidates, thumbnail_texts, editing_notes, reference_links, publish_date, shoot_date,
                   edit_due_date, is_sponsored, created_at, updated_at)
                 VALUES
                  (:id, :workspace_id, :title, :status, :channels, :content_format, :tags, :assignee, :priority, :script,
                   :title_candidates, :thumbnail_texts, :editing_notes, :reference_links, :publish_date, :shoot_date,
                   :edit_due_date, :is_sponsored, :created_at, :updated_at)'
            );
            foreach ($items as $item) {
                $itemStmt->execute(array(
                    ':id' => (string)$item['id'],
                    ':workspace_id' => $workspaceId,
                    ':title' => (string)$item['title'],
                    ':status' => (string)$item['status'],
                    ':channels' => $this->json($item['channels'] ?? array()),
                    ':content_format' => (string)($item['contentFormat'] ?? ''),
                    ':tags' => $this->json($item['tags'] ?? array()),
                    ':assignee' => (string)($item['assignee'] ?? ''),
                    ':priority' => (string)($item['priority'] ?? 'medium'),
                    ':script' => (string)($item['script'] ?? ''),
                    ':title_candidates' => $this->json($item['titleCandidates'] ?? array()),
                    ':thumbnail_texts' => $this->json($item['thumbnailTexts'] ?? array()),
                    ':editing_notes' => (string)($item['editingNotes'] ?? ''),
                    ':reference_links' => $this->json($item['referenceLinks'] ?? array()),
                    ':publish_date' => (string)($item['publishDate'] ?? ''),
                    ':shoot_date' => (string)($item['shootDate'] ?? ''),
                    ':edit_due_date' => (string)($item['editDueDate'] ?? ''),
                    ':is_sponsored' => !empty($item['isSponsored']) ? 1 : 0,
                    ':created_at' => $this->date((string)($item['createdAt'] ?? '')),
                    ':updated_at' => $this->date((string)($item['updatedAt'] ?? '')),
                ));
            }

            $ideaStmt = $this->pdo->prepare(
                'INSERT INTO content_ideas
                  (id, workspace_id, title, source, priority, tags, memo, reference_links, created_at)
                 VALUES
                  (:id, :workspace_id, :title, :source, :priority, :tags, :memo, :reference_links, :created_at)'
            );
            foreach ($ideas as $idea) {
                $ideaStmt->execute(array(
                    ':id' => (string)$idea['id'],
                    ':workspace_id' => $workspaceId,
                    ':title' => (string)$idea['title'],
                    ':source' => (string)($idea['source'] ?? ''),
                    ':priority' => (string)($idea['priority'] ?? 'medium'),
                    ':tags' => $this->json($idea['tags'] ?? array()),
                    ':memo' => (string)($idea['memo'] ?? ''),
                    ':reference_links' => $this->json($idea['referenceLinks'] ?? array()),
                    ':created_at' => $this->date((string)($idea['createdAt'] ?? '')),
                ));
            }

            $taskStmt = $this->pdo->prepare(
                'INSERT INTO content_task_requests
                  (id, workspace_id, content_item_id, task_name, description, requester, worker, reviewer, status, created_at, updated_at)
                 VALUES
                  (:id, :workspace_id, :content_item_id, :task_name, :description, :requester, :worker, :reviewer, :status, :created_at, :updated_at)'
            );
            foreach ($taskRequests as $task) {
                $taskStmt->execute(array(
                    ':id' => (string)$task['id'],
                    ':workspace_id' => $workspaceId,
                    ':content_item_id' => (string)($task['contentItemId'] ?? ''),
                    ':task_name' => (string)($task['taskName'] ?? ''),
                    ':description' => (string)($task['description'] ?? ''),
                    ':requester' => (string)($task['requester'] ?? ''),
                    ':worker' => (string)($task['worker'] ?? ''),
                    ':reviewer' => (string)($task['reviewer'] ?? ''),
                    ':status' => (string)($task['status'] ?? 'requested'),
                    ':created_at' => $this->date((string)($task['createdAt'] ?? '')),
                    ':updated_at' => $this->date((string)($task['updatedAt'] ?? '')),
                ));
            }

            $this->pdo->commit();
        } catch (\Throwable $e) {
            $this->pdo->rollBack();
            throw $e;
        }

        return $this->board($workspaceId);
    }

    private function addMember(int $workspaceId, int $userId, string $role): void
    {
        $q = $this->pdo->prepare(
            'INSERT INTO workspace_members (workspace_id, user_id, role)
             VALUES (:wid, :uid, :role)
             ON DUPLICATE KEY UPDATE role = VALUES(role)'
        );
        $q->execute(array(':wid' => $workspaceId, ':uid' => $userId, ':role' => $role));
    }

    /** @return array<string,mixed> */
    private function findUserByEmail(string $email): array
    {
        $q = $this->pdo->prepare('SELECT id, email, name FROM users WHERE email = :email AND status = :status LIMIT 1');
        $q->execute(array(':email' => $email, ':status' => 'active'));
        $row = $q->fetch();
        return $row === false ? array() : $row;
    }

    private function memberExists(int $workspaceId, int $userId): bool
    {
        $q = $this->pdo->prepare('SELECT 1 FROM workspace_members WHERE workspace_id = :wid AND user_id = :uid LIMIT 1');
        $q->execute(array(':wid' => $workspaceId, ':uid' => $userId));
        return $q->fetchColumn() !== false;
    }

    private function isWorkspaceOwner(int $workspaceId, int $userId): bool
    {
        $q = $this->pdo->prepare('SELECT 1 FROM workspaces WHERE id = :wid AND owner_user_id = :uid LIMIT 1');
        $q->execute(array(':wid' => $workspaceId, ':uid' => $userId));
        return $q->fetchColumn() !== false;
    }

    /** @param array<string,mixed> $input */
    private function replaceConfiguration(int $workspaceId, array $input): void
    {
        $this->pdo->prepare('DELETE FROM workspace_channels WHERE workspace_id = :wid')->execute(array(':wid' => $workspaceId));
        $this->pdo->prepare('DELETE FROM workspace_board_columns WHERE workspace_id = :wid')->execute(array(':wid' => $workspaceId));
        $this->pdo->prepare('DELETE FROM workspace_content_fields WHERE workspace_id = :wid')->execute(array(':wid' => $workspaceId));
        $this->pdo->prepare('DELETE FROM workspace_calendar_event_types WHERE workspace_id = :wid')->execute(array(':wid' => $workspaceId));

        $this->insertWorkspaceChannels($workspaceId, $input['channels'] ?? array());
        $this->insertBoardColumns($workspaceId, (string)($input['preset'] ?? 'standard'));
        $this->insertContentFields($workspaceId, $input['items'] ?? array());
        $this->insertCalendarTypes($workspaceId);
    }

    /** @param mixed $channels */
    private function insertWorkspaceChannels(int $workspaceId, mixed $channels): void
    {
        $stmt = $this->pdo->prepare(
            'INSERT INTO workspace_channels (workspace_id, channel_key, channel_name, sort_order, is_enabled)
             VALUES (:wid, :channel_key, :channel_name, :sort_order, 1)'
        );
        foreach (is_array($channels) ? array_values($channels) : array() as $index => $channel) {
            $key = (string)$channel;
            $stmt->execute(array(
                ':wid' => $workspaceId,
                ':channel_key' => $key,
                ':channel_name' => self::CHANNEL_LABELS[$key] ?? $key,
                ':sort_order' => $index + 1,
            ));
        }
    }

    private function insertBoardColumns(int $workspaceId, string $preset): void
    {
        $columns = self::BOARD_COLUMNS_BY_PRESET[$preset] ?? self::BOARD_COLUMNS_BY_PRESET['standard'];
        $stmt = $this->pdo->prepare(
            'INSERT INTO workspace_board_columns (workspace_id, column_key, column_name, sort_order, is_done)
             VALUES (:wid, :column_key, :column_name, :sort_order, :is_done)'
        );
        foreach ($columns as $index => $column) {
            $key = (string)$column['id'];
            $stmt->execute(array(
                ':wid' => $workspaceId,
                ':column_key' => $key,
                ':column_name' => (string)$column['label'],
                ':sort_order' => $index + 1,
                ':is_done' => $key === 'published' ? 1 : 0,
            ));
        }
    }

    /** @param mixed $items */
    private function insertContentFields(int $workspaceId, mixed $items): void
    {
        $stmt = $this->pdo->prepare(
            'INSERT INTO workspace_content_fields (workspace_id, field_key, field_label, field_type, sort_order, is_enabled)
             VALUES (:wid, :field_key, :field_label, :field_type, :sort_order, 1)'
        );
        foreach (is_array($items) ? array_values($items) : array() as $index => $item) {
            $key = (string)$item;
            $stmt->execute(array(
                ':wid' => $workspaceId,
                ':field_key' => $key,
                ':field_label' => self::FIELD_LABELS[$key] ?? $key,
                ':field_type' => $this->fieldType($key),
                ':sort_order' => $index + 1,
            ));
        }
    }

    private function insertCalendarTypes(int $workspaceId): void
    {
        $stmt = $this->pdo->prepare(
            'INSERT INTO workspace_calendar_event_types (workspace_id, event_key, event_name, color, sort_order)
             VALUES (:wid, :event_key, :event_name, :color, :sort_order)'
        );
        foreach (self::CALENDAR_TYPES as $index => $event) {
            $stmt->execute(array(
                ':wid' => $workspaceId,
                ':event_key' => (string)$event['key'],
                ':event_name' => (string)$event['name'],
                ':color' => (string)$event['color'],
                ':sort_order' => $index + 1,
            ));
        }
    }

    /** @param array<string,mixed> $row */
    private function mapWorkspace(array $row): array
    {
        $workspaceId = (int)$row['id'];
        $channels = $this->decode($row['channels'] ?? '[]');
        $items = $this->decode($row['items'] ?? '[]');
        $preset = (string)$row['preset'];

        return array(
            'id' => (string)$row['id'],
            'ownerUserId' => isset($row['owner_user_id']) ? (int)$row['owner_user_id'] : null,
            'name' => (string)$row['name'],
            'description' => (string)($row['description'] ?? ''),
            'purpose' => (string)$row['purpose'],
            'channels' => $channels,
            'format' => (string)($row['format'] ?? ''),
            'templateKey' => (string)$row['template_key'],
            'preset' => $preset,
            'items' => $items,
            'channelSettings' => $this->workspaceChannels($workspaceId, $channels),
            'boardColumns' => $this->workspaceBoardColumns($workspaceId, $preset),
            'contentFields' => $this->workspaceContentFields($workspaceId, $items),
            'calendarEventTypes' => $this->workspaceCalendarEventTypes($workspaceId),
            'members' => $this->members($workspaceId),
            'createdAt' => (string)$row['created_at'],
            'status' => (string)$row['status'],
        );
    }

    /** @param array<string,mixed> $row */
    private function mapContentItem(array $row): array
    {
        return array(
            'id' => (string)$row['id'],
            'workspaceId' => (string)$row['workspace_id'],
            'title' => (string)$row['title'],
            'status' => (string)$row['status'],
            'channels' => $this->decode($row['channels']),
            'contentFormat' => (string)$row['content_format'],
            'tags' => $this->decode($row['tags']),
            'assignee' => (string)$row['assignee'],
            'priority' => (string)$row['priority'],
            'script' => (string)$row['script'],
            'titleCandidates' => $this->decode($row['title_candidates']),
            'thumbnailTexts' => $this->decode($row['thumbnail_texts']),
            'editingNotes' => (string)$row['editing_notes'],
            'referenceLinks' => $this->decode($row['reference_links']),
            'publishDate' => (string)$row['publish_date'],
            'shootDate' => (string)$row['shoot_date'],
            'editDueDate' => (string)$row['edit_due_date'],
            'isSponsored' => (bool)$row['is_sponsored'],
            'createdAt' => (string)$row['created_at'],
            'updatedAt' => (string)$row['updated_at'],
        );
    }

    /** @param array<string,mixed> $row */
    private function mapIdea(array $row): array
    {
        return array(
            'id' => (string)$row['id'],
            'workspaceId' => (string)$row['workspace_id'],
            'title' => (string)$row['title'],
            'source' => (string)$row['source'],
            'priority' => (string)$row['priority'],
            'tags' => $this->decode($row['tags']),
            'memo' => (string)$row['memo'],
            'referenceLinks' => $this->decode($row['reference_links']),
            'createdAt' => (string)$row['created_at'],
        );
    }

    /** @param array<string,mixed> $row */
    private function mapTaskRequest(array $row): array
    {
        return array(
            'id' => (string)$row['id'],
            'workspaceId' => (string)$row['workspace_id'],
            'contentItemId' => (string)$row['content_item_id'],
            'taskName' => (string)$row['task_name'],
            'description' => (string)$row['description'],
            'requester' => (string)$row['requester'],
            'worker' => (string)$row['worker'],
            'reviewer' => (string)$row['reviewer'],
            'status' => (string)$row['status'],
            'createdAt' => (string)$row['created_at'],
            'updatedAt' => (string)$row['updated_at'],
        );
    }

    private function json(mixed $value): string
    {
        return json_encode(is_array($value) ? array_values($value) : array(), JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    }

    /** @return array<int,mixed> */
    private function decode(mixed $value): array
    {
        $decoded = json_decode((string)$value, true);
        return is_array($decoded) ? $decoded : array();
    }

    private function date(string $value): string
    {
        if ($value === '') {
            return date('Y-m-d H:i:s');
        }
        $time = strtotime($value);
        return $time === false ? date('Y-m-d H:i:s') : date('Y-m-d H:i:s', $time);
    }

    private function fieldType(string $key): string
    {
        if (in_array($key, array('dueDate', 'publishDate', 'shootingDate', 'publishDeadline', 'streamStartTime', 'streamEndTime'), true)) {
            return 'date';
        }
        if (in_array($key, array('shooting', 'editing', 'upload', 'scheduled', 'notification', 'sponsored', 'clipProduction', 'vodUpload', 'factCheck'), true)) {
            return 'boolean';
        }
        if (in_array($key, array('views', 'avgViewers', 'peakViewers'), true)) {
            return 'number';
        }
        if (in_array($key, array('memo', 'script', 'feedbackMemo', 'prosConsMemo', 'chatIssueMemo', 'highlightMemo', 'metaDescription'), true)) {
            return 'textarea';
        }
        return 'text';
    }

    /** @param array<int,mixed> $fallback */
    private function workspaceChannels(int $workspaceId, array $fallback): array
    {
        $q = $this->pdo->prepare('SELECT * FROM workspace_channels WHERE workspace_id = :wid AND is_enabled = 1 ORDER BY sort_order ASC, id ASC');
        $q->execute(array(':wid' => $workspaceId));
        $rows = $q->fetchAll();
        if (!$rows) {
            $rows = array();
            foreach ($fallback as $index => $key) {
                $key = (string)$key;
                $rows[] = array('channel_key' => $key, 'channel_name' => self::CHANNEL_LABELS[$key] ?? $key, 'sort_order' => $index + 1, 'is_enabled' => 1);
            }
        }
        return array_map(function (array $row): array {
            return array(
                'key' => (string)$row['channel_key'],
                'label' => (string)$row['channel_name'],
                'sortOrder' => (int)$row['sort_order'],
                'isEnabled' => (bool)$row['is_enabled'],
            );
        }, $rows);
    }

    private function workspaceBoardColumns(int $workspaceId, string $preset): array
    {
        $q = $this->pdo->prepare('SELECT * FROM workspace_board_columns WHERE workspace_id = :wid ORDER BY sort_order ASC, id ASC');
        $q->execute(array(':wid' => $workspaceId));
        $rows = $q->fetchAll();
        if (!$rows) {
            $columns = self::BOARD_COLUMNS_BY_PRESET[$preset] ?? self::BOARD_COLUMNS_BY_PRESET['standard'];
            $rows = array();
            foreach ($columns as $index => $column) {
                $key = (string)$column['id'];
                $rows[] = array('column_key' => $key, 'column_name' => (string)$column['label'], 'sort_order' => $index + 1, 'is_done' => $key === 'published' ? 1 : 0);
            }
        }
        return array_map(function (array $row): array {
            return array(
                'id' => (string)$row['column_key'],
                'label' => (string)$row['column_name'],
                'sortOrder' => (int)$row['sort_order'],
                'isDone' => (bool)$row['is_done'],
            );
        }, $rows);
    }

    /** @param array<int,mixed> $fallback */
    private function workspaceContentFields(int $workspaceId, array $fallback): array
    {
        $q = $this->pdo->prepare('SELECT * FROM workspace_content_fields WHERE workspace_id = :wid AND is_enabled = 1 ORDER BY sort_order ASC, id ASC');
        $q->execute(array(':wid' => $workspaceId));
        $rows = $q->fetchAll();
        if (!$rows) {
            $rows = array();
            foreach ($fallback as $index => $key) {
                $key = (string)$key;
                $rows[] = array('field_key' => $key, 'field_label' => self::FIELD_LABELS[$key] ?? $key, 'field_type' => $this->fieldType($key), 'sort_order' => $index + 1, 'is_enabled' => 1);
            }
        }
        return array_map(function (array $row): array {
            return array(
                'key' => (string)$row['field_key'],
                'label' => (string)$row['field_label'],
                'type' => (string)$row['field_type'],
                'sortOrder' => (int)$row['sort_order'],
                'isEnabled' => (bool)$row['is_enabled'],
            );
        }, $rows);
    }

    private function workspaceCalendarEventTypes(int $workspaceId): array
    {
        $q = $this->pdo->prepare('SELECT * FROM workspace_calendar_event_types WHERE workspace_id = :wid ORDER BY sort_order ASC, id ASC');
        $q->execute(array(':wid' => $workspaceId));
        $rows = $q->fetchAll();
        if (!$rows) {
            $rows = array();
            foreach (self::CALENDAR_TYPES as $index => $event) {
                $rows[] = array('event_key' => (string)$event['key'], 'event_name' => (string)$event['name'], 'color' => (string)$event['color'], 'sort_order' => $index + 1);
            }
        }
        return array_map(function (array $row): array {
            return array(
                'key' => (string)$row['event_key'],
                'label' => (string)$row['event_name'],
                'color' => (string)$row['color'],
                'sortOrder' => (int)$row['sort_order'],
            );
        }, $rows);
    }

    /** @param array<string,mixed> $row */
    private function mapMember(array $row): array
    {
        return array(
            'userId' => (int)$row['user_id'],
            'email' => (string)$row['email'],
            'name' => (string)$row['name'],
            'role' => (string)$row['role'],
            'joinedAt' => (string)$row['created_at'],
        );
    }
}
