<?php
declare(strict_types=1);

namespace CreatorDesk\Ai;

use CreatorDesk\Db\Connection;
use PDO;

final class UsageService
{
    private const FEATURE_TREND_IDEAS = 'trend_ideas';

    /** @var array<string,int> */
    private array $defaultLimits = array(
        'free' => 5,
        'starter' => 30,
        'pro' => 100,
        'team' => 300,
        'enterprise' => 1000,
    );

    private PDO $pdo;

    public function __construct(?PDO $pdo = null)
    {
        $this->pdo = $pdo ?? Connection::pdo();
    }

    /** @return array{plan:string,limit:int,used:int,remaining:int,feature:string} */
    public function trendIdeaQuota(int $userId): array
    {
        $policy = $this->policyForUser($userId);
        $used = $this->countToday($userId, self::FEATURE_TREND_IDEAS);
        return array(
            'plan' => $policy['plan'],
            'limit' => $policy['limit'],
            'used' => $used,
            'remaining' => max($policy['limit'] - $used, 0),
            'feature' => self::FEATURE_TREND_IDEAS,
        );
    }

    public function canUseTrendIdeas(int $userId): bool
    {
        $quota = $this->trendIdeaQuota($userId);
        return $quota['used'] < $quota['limit'];
    }

    /**
     * @param array{model?:string,promptTokens?:int|null,completionTokens?:int|null,estimatedCost?:float|null} $meta
     */
    public function recordTrendIdeas(int $userId, int $workspaceId, array $meta = array()): void
    {
        $policy = $this->policyForUser($userId);
        $stmt = $this->pdo->prepare(
            'INSERT INTO ai_usage_logs
              (user_id, workspace_id, feature, plan_code, model, prompt_tokens, completion_tokens, estimated_cost, used_at)
             VALUES
              (:user_id, :workspace_id, :feature, :plan_code, :model, :prompt_tokens, :completion_tokens, :estimated_cost, NOW())'
        );
        $stmt->execute(array(
            ':user_id' => $userId,
            ':workspace_id' => $workspaceId,
            ':feature' => self::FEATURE_TREND_IDEAS,
            ':plan_code' => $policy['plan'],
            ':model' => isset($meta['model']) ? (string)$meta['model'] : null,
            ':prompt_tokens' => isset($meta['promptTokens']) ? $meta['promptTokens'] : null,
            ':completion_tokens' => isset($meta['completionTokens']) ? $meta['completionTokens'] : null,
            ':estimated_cost' => isset($meta['estimatedCost']) ? $meta['estimatedCost'] : null,
        ));
    }

    /** @return array{plan:string,limit:int} */
    private function policyForUser(int $userId): array
    {
        $stmt = $this->pdo->prepare('SELECT plan_code, daily_limit FROM user_ai_plan WHERE user_id = :user_id LIMIT 1');
        $stmt->execute(array(':user_id' => $userId));
        $row = $stmt->fetch();

        $plan = $row !== false ? strtolower((string)$row['plan_code']) : 'free';
        if ($plan === '') {
            $plan = 'free';
        }

        $limit = $row !== false && $row['daily_limit'] !== null
            ? (int)$row['daily_limit']
            : $this->limitForPlan($plan);

        return array(
            'plan' => $plan,
            'limit' => max($limit, 0),
        );
    }

    private function limitForPlan(string $plan): int
    {
        $envName = 'AI_DAILY_LIMIT_' . strtoupper($plan);
        $envLimit = getenv($envName);
        if ($envLimit !== false && (int)$envLimit >= 0) {
            return (int)$envLimit;
        }
        return $this->defaultLimits[$plan] ?? $this->defaultLimits['free'];
    }

    private function countToday(int $userId, string $feature): int
    {
        $stmt = $this->pdo->prepare(
            'SELECT COUNT(*)
               FROM ai_usage_logs
              WHERE user_id = :user_id
                AND feature = :feature
                AND used_at >= CURRENT_DATE()
                AND used_at < DATE_ADD(CURRENT_DATE(), INTERVAL 1 DAY)'
        );
        $stmt->execute(array(
            ':user_id' => $userId,
            ':feature' => $feature,
        ));
        return (int)$stmt->fetchColumn();
    }
}
