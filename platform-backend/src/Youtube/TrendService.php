<?php
declare(strict_types=1);

namespace CreatorDesk\Youtube;

use RuntimeException;

final class TrendService
{
    private const ENDPOINT = 'https://www.googleapis.com/youtube/v3/videos';
    private const SEARCH_ENDPOINT = 'https://www.googleapis.com/youtube/v3/search';
    private const CACHE_TTL = 1800;

    /** @var array<string,array{expires:int,data:array<int,array<string,mixed>>}> */
    private static array $cache = array();

    /**
     * @return array<int,array<string,mixed>>
     */
    public function fetch(string $regionCode, string $categoryId, string $period, string $sort, int $limit = 50): array
    {
        $limit = $this->normalizeLimit($limit);
        $cacheKey = implode(':', array($regionCode, $categoryId, $period, $sort, $limit));
        $now = time();
        $cached = $this->readCache($cacheKey, $now);
        if ($cached !== null) {
            return $cached;
        }

        $apiKey = getenv('YOUTUBE_API_KEY') ?: '';
        if ($apiKey === '') {
            throw new RuntimeException('YOUTUBE_API_KEY is not configured.');
        }

        $youtubeCategoryId = $this->youtubeCategoryId($categoryId);
        $params = array(
            'part' => 'snippet,statistics,contentDetails',
            'chart' => 'mostPopular',
            'regionCode' => $regionCode,
            'maxResults' => '50',
            'key' => $apiKey,
        );
        if ($youtubeCategoryId !== '') {
            $params['videoCategoryId'] = $youtubeCategoryId;
        }

        $items = array();
        $pageToken = '';
        while (count($items) < $limit) {
            $pageParams = $params;
            if ($pageToken !== '') {
                $pageParams['pageToken'] = $pageToken;
            }

            $payload = $this->getJson(self::ENDPOINT . '?' . http_build_query($pageParams));
            $pageItems = (isset($payload['items']) && is_array($payload['items'])) ? $payload['items'] : array();
            foreach ($pageItems as $item) {
                $items[] = $item;
            }

            $pageToken = isset($payload['nextPageToken']) ? (string)$payload['nextPageToken'] : '';
            if ($pageToken === '' || count($pageItems) === 0) {
                break;
            }
        }
        $cutoff = time() - $this->periodHours($period) * 3600;

        $videos = array();
        foreach ($items as $item) {
            if (!is_array($item)) {
                continue;
            }
            $snippet = (isset($item['snippet']) && is_array($item['snippet'])) ? $item['snippet'] : array();
            $statistics = (isset($item['statistics']) && is_array($item['statistics'])) ? $item['statistics'] : array();
            $publishedAt = isset($snippet['publishedAt']) ? (string)$snippet['publishedAt'] : '';
            $publishedTs = strtotime($publishedAt);
            if ($publishedTs === false || $publishedTs < $cutoff) {
                continue;
            }

            $viewCount = isset($statistics['viewCount']) ? (int)$statistics['viewCount'] : 0;
            $likeCount = isset($statistics['likeCount']) ? (int)$statistics['likeCount'] : 0;
            $commentCount = isset($statistics['commentCount']) ? (int)$statistics['commentCount'] : 0;
            $videoId = isset($item['id']) ? (string)$item['id'] : '';
            if ($videoId === '') {
                continue;
            }

            $videos[] = array(
                'videoId' => $videoId,
                'title' => isset($snippet['title']) ? (string)$snippet['title'] : '',
                'channelTitle' => isset($snippet['channelTitle']) ? (string)$snippet['channelTitle'] : '',
                'thumbnailUrl' => $this->thumbnailUrl($snippet),
                'publishedAt' => $publishedAt,
                'viewCount' => $viewCount,
                'likeCount' => $likeCount,
                'commentCount' => $commentCount,
                'trendScore' => $this->trendScore($viewCount, $likeCount, $commentCount, $publishedTs),
                'youtubeUrl' => "https://www.youtube.com/watch?v={$videoId}",
                'categoryId' => $categoryId,
                'regionCode' => $regionCode,
            );
        }

        usort($videos, function (array $a, array $b) use ($sort): int {
            if ($sort === 'views') {
                return $b['viewCount'] <=> $a['viewCount'];
            }
            if ($sort === 'latest') {
                return strtotime((string)$b['publishedAt']) <=> strtotime((string)$a['publishedAt']);
            }
            return $b['trendScore'] <=> $a['trendScore'];
        });

        $videos = array_slice($videos, 0, $limit);
        $this->writeCache($cacheKey, $videos, $now);

        return $videos;
    }

    /**
     * @return array<int,array<string,mixed>>
     */
    public function search(string $regionCode, string $keyword, string $period, string $sort, int $limit = 50): array
    {
        $keyword = trim($keyword);
        $keywords = $this->searchKeywords($keyword);
        if (count($keywords) === 0) {
            return array();
        }

        $limit = $this->normalizeLimit($limit);
        $cacheKey = implode(':', array('search-v5', $regionCode, md5(implode('|', $keywords)), $period, $sort, $limit));
        $now = time();
        $cached = $this->readCache($cacheKey, $now);
        if ($cached !== null) {
            return $cached;
        }

        $apiKey = getenv('YOUTUBE_API_KEY') ?: '';
        if ($apiKey === '') {
            throw new RuntimeException('YOUTUBE_API_KEY is not configured.');
        }

        $cutoff = time() - $this->periodHours($period) * 3600;

        $videoIds = array();
        foreach ($keywords as $searchKeyword) {
            $searchParams = array(
                'part' => 'snippet',
                'type' => 'video',
                'q' => $searchKeyword,
                'regionCode' => $regionCode,
                'publishedAfter' => gmdate('c', $cutoff),
                'maxResults' => '50',
                'order' => $sort === 'latest' ? 'date' : 'relevance',
                'key' => $apiKey,
            );

            $pageToken = '';
            $keywordCount = 0;
            while ($keywordCount < $limit) {
                $pageParams = $searchParams;
                if ($pageToken !== '') {
                    $pageParams['pageToken'] = $pageToken;
                }

                $searchPayload = $this->getJson(self::SEARCH_ENDPOINT . '?' . http_build_query($pageParams));
                $searchItems = (isset($searchPayload['items']) && is_array($searchPayload['items'])) ? $searchPayload['items'] : array();
                foreach ($searchItems as $item) {
                    if (!is_array($item)) {
                        continue;
                    }
                    $id = (isset($item['id']) && is_array($item['id'])) ? $item['id'] : array();
                    $videoId = isset($id['videoId']) ? (string)$id['videoId'] : '';
                    if ($videoId !== '') {
                        $videoIds[$videoId] = true;
                        $keywordCount++;
                    }
                    if ($keywordCount >= $limit) {
                        break;
                    }
                }

                $pageToken = isset($searchPayload['nextPageToken']) ? (string)$searchPayload['nextPageToken'] : '';
                if ($pageToken === '' || count($searchItems) === 0) {
                    break;
                }
            }
        }

        if (count($videoIds) === 0) {
            $this->writeCache($cacheKey, array(), $now);
            return array();
        }

        $items = array();
        foreach (array_chunk(array_keys($videoIds), 50) as $ids) {
            $videosParams = array(
                'part' => 'snippet,statistics,contentDetails',
                'id' => implode(',', $ids),
                'maxResults' => '50',
                'key' => $apiKey,
            );

            $payload = $this->getJson(self::ENDPOINT . '?' . http_build_query($videosParams));
            $pageItems = (isset($payload['items']) && is_array($payload['items'])) ? $payload['items'] : array();
            foreach ($pageItems as $item) {
                $items[] = $item;
            }
        }
        $videos = $this->videosFromItems($items, $regionCode, 'search', $cutoff, $keyword);
        $this->sortVideos($videos, $sort);
        $videos = array_slice($videos, 0, $limit);
        $this->writeCache($cacheKey, $videos, $now);

        return $videos;
    }

    /**
     * @param array<int,mixed> $items
     * @return array<int,array<string,mixed>>
     */
    private function videosFromItems(array $items, string $regionCode, string $categoryId, int $cutoff, string $keyword = ''): array
    {
        $videos = array();
        foreach ($items as $item) {
            if (!is_array($item)) {
                continue;
            }
            $snippet = (isset($item['snippet']) && is_array($item['snippet'])) ? $item['snippet'] : array();
            if ($keyword !== '' && !$this->matchesKeyword($snippet, $keyword)) {
                continue;
            }
            $statistics = (isset($item['statistics']) && is_array($item['statistics'])) ? $item['statistics'] : array();
            $publishedAt = isset($snippet['publishedAt']) ? (string)$snippet['publishedAt'] : '';
            $publishedTs = strtotime($publishedAt);
            if ($publishedTs === false || $publishedTs < $cutoff) {
                continue;
            }

            $viewCount = isset($statistics['viewCount']) ? (int)$statistics['viewCount'] : 0;
            $likeCount = isset($statistics['likeCount']) ? (int)$statistics['likeCount'] : 0;
            $commentCount = isset($statistics['commentCount']) ? (int)$statistics['commentCount'] : 0;
            $videoId = isset($item['id']) ? (string)$item['id'] : '';
            if ($videoId === '') {
                continue;
            }

            $videos[] = array(
                'videoId' => $videoId,
                'title' => isset($snippet['title']) ? (string)$snippet['title'] : '',
                'channelTitle' => isset($snippet['channelTitle']) ? (string)$snippet['channelTitle'] : '',
                'thumbnailUrl' => $this->thumbnailUrl($snippet),
                'publishedAt' => $publishedAt,
                'viewCount' => $viewCount,
                'likeCount' => $likeCount,
                'commentCount' => $commentCount,
                'trendScore' => $this->trendScore($viewCount, $likeCount, $commentCount, $publishedTs),
                'youtubeUrl' => "https://www.youtube.com/watch?v={$videoId}",
                'categoryId' => $categoryId,
                'regionCode' => $regionCode,
            );
        }

        return $videos;
    }

    /**
     * Search mode should be stricter than YouTube's broad relevance matching.
     * Every whitespace-separated keyword token must appear in the title, channel,
     * description, or tags so "브이로그 " does not return generic 브이로그 videos.
     *
     * @param array<string,mixed> $snippet
     */
    private function matchesKeyword(array $snippet, string $keyword): bool
    {
        foreach ($this->searchKeywords($keyword) as $searchKeyword) {
            if ($this->matchesSingleKeyword($snippet, $searchKeyword)) {
                return true;
            }
        }

        return false;
    }

    /**
     * @param array<string,mixed> $snippet
     */
    private function matchesSingleKeyword(array $snippet, string $keyword): bool
    {
        $tokens = $this->keywordTokens($keyword);
        if (count($tokens) === 0) {
            return true;
        }

        $title = isset($snippet['title']) ? (string)$snippet['title'] : '';
        $channelTitle = isset($snippet['channelTitle']) ? (string)$snippet['channelTitle'] : '';

        if (count($tokens) > 1) {
            $titleText = $this->normalizeText($title);
            $channelTitleText = $this->normalizeText(trim($channelTitle . ' ' . $title));
            $compactKeyword = str_replace(' ', '', $this->normalizeText($keyword));
            $compactTitle = str_replace(' ', '', $titleText);
            $compactChannelTitle = str_replace(' ', '', $channelTitleText);

            return $this->tokensInOrder($titleText, $tokens)
                || $this->tokensInOrder($channelTitleText, $tokens)
                || ($compactKeyword !== '' && strpos($compactTitle, $compactKeyword) !== false)
                || ($compactKeyword !== '' && strpos($compactChannelTitle, $compactKeyword) !== false);
        }

        $haystackParts = array($title, $channelTitle, isset($snippet['description']) ? (string)$snippet['description'] : '');
        if (isset($snippet['tags']) && is_array($snippet['tags'])) {
            foreach ($snippet['tags'] as $tag) {
                if (is_scalar($tag)) {
                    $haystackParts[] = (string)$tag;
                }
            }
        }

        $haystack = $this->normalizeText(implode(' ', $haystackParts));
        foreach ($tokens as $token) {
            if ($token === '') {
                continue;
            }
            if (strpos($haystack, $token) === false) {
                return false;
            }
        }

        return true;
    }

    /**
     * @return array<int,string>
     */
    private function searchKeywords(string $keyword): array
    {
        $parts = preg_split('/[,，]+/u', $keyword);
        if ($parts === false) {
            $parts = explode(',', $keyword);
        }

        $keywords = array();
        foreach ($parts as $part) {
            $value = trim((string)$part);
            if ($value !== '') {
                $keywords[] = $value;
            }
        }

        return array_values(array_unique($keywords));
    }

    /**
     * @param array<int,string> $tokens
     */
    private function tokensInOrder(string $haystack, array $tokens): bool
    {
        $offset = 0;
        foreach ($tokens as $token) {
            $position = strpos($haystack, $token, $offset);
            if ($position === false) {
                return false;
            }
            $offset = $position + strlen($token);
        }

        return true;
    }

    /**
     * @return array<int,string>
     */
    private function keywordTokens(string $keyword): array
    {
        $keyword = trim(str_replace(array('"', "'"), ' ', $keyword));
        if ($keyword === '') {
            return array();
        }

        $parts = preg_split('/\s+/u', $keyword);
        if ($parts === false) {
            $parts = preg_split('/\s+/', $keyword) ?: array();
        }

        $tokens = array();
        foreach ($parts as $part) {
            $token = $this->normalizeText((string)$part);
            if ($token !== '') {
                $tokens[] = $token;
            }
        }

        return array_values(array_unique($tokens));
    }

    private function normalizeText(string $value): string
    {
        $original = $value;
        $value = function_exists('mb_strtolower')
            ? mb_strtolower($value, 'UTF-8')
            : strtolower($value);
        $normalized = preg_replace('/[^\p{L}\p{N}]+/u', ' ', $value);
        if ($normalized === null) {
            $fallback = function_exists('mb_strtolower')
                ? mb_strtolower($original, 'UTF-8')
                : strtolower($original);
            $normalized = preg_replace('/[^A-Za-z0-9가-힣]+/', ' ', $fallback) ?? '';
        }

        return trim(preg_replace('/\s+/u', ' ', $normalized) ?? $normalized);
    }

    /**
     * @param array<int,array<string,mixed>> $videos
     */
    private function sortVideos(array &$videos, string $sort): void
    {
        usort($videos, function (array $a, array $b) use ($sort): int {
            if ($sort === 'views') {
                return $b['viewCount'] <=> $a['viewCount'];
            }
            if ($sort === 'latest') {
                return strtotime((string)$b['publishedAt']) <=> strtotime((string)$a['publishedAt']);
            }
            return $b['trendScore'] <=> $a['trendScore'];
        });
    }

    /**
     * @return array<int,array<string,mixed>>|null
     */
    private function readCache(string $cacheKey, int $now): ?array
    {
        if (function_exists('apcu_fetch')) {
            $success = false;
            $value = apcu_fetch('youtube_trends:' . $cacheKey, $success);
            if ($success && is_array($value)) {
                /** @var array<int,array<string,mixed>> $value */
                return $value;
            }
        }

        if (isset(self::$cache[$cacheKey]) && self::$cache[$cacheKey]['expires'] > $now) {
            return self::$cache[$cacheKey]['data'];
        }

        return null;
    }

    /**
     * @param array<int,array<string,mixed>> $videos
     */
    private function writeCache(string $cacheKey, array $videos, int $now): void
    {
        if (function_exists('apcu_store')) {
            apcu_store('youtube_trends:' . $cacheKey, $videos, self::CACHE_TTL);
        }

        self::$cache[$cacheKey] = array(
            'expires' => $now + self::CACHE_TTL,
            'data' => $videos,
        );
    }

    /**
     * @return array<string,mixed>
     */
    private function getJson(string $url): array
    {
        $context = stream_context_create(array(
            'http' => array(
                'method' => 'GET',
                'header' => "Accept: application/json\r\n",
                'ignore_errors' => true,
                'timeout' => 10,
            ),
        ));
        $raw = @file_get_contents($url, false, $context);
        if ($raw === false) {
            throw new RuntimeException('Failed to call YouTube Data API.');
        }

        $status = 0;
        if (isset($http_response_header[0]) && preg_match('#HTTP/\S+\s+(\d+)#', $http_response_header[0], $matches)) {
            $status = (int)$matches[1];
        }
        if ($status < 200 || $status >= 300) {
            throw new RuntimeException('YouTube Data API returned HTTP ' . $status . '.');
        }

        $decoded = json_decode($raw, true);
        if (!is_array($decoded)) {
            throw new RuntimeException('YouTube Data API response is not valid JSON.');
        }

        return $decoded;
    }

    private function periodHours(string $period): int
    {
        if ($period === '24h') {
            return 24;
        }
        if ($period === '3d') {
            return 72;
        }
        if ($period === '30d') {
            return 720;
        }
        return 168;
    }

    private function normalizeLimit(int $limit): int
    {
        return $limit === 100 ? 100 : 50;
    }

    private function youtubeCategoryId(string $categoryId): string
    {
        if ($categoryId === 'vtuber') {
            return '24';
        }
        return $categoryId;
    }

    private function trendScore(int $viewCount, int $likeCount, int $commentCount, int $publishedTs): int
    {
        $hoursSincePublished = (time() - $publishedTs) / 3600;
        $viewsPerHour = $viewCount / max($hoursSincePublished, 1);
        return (int)round($viewsPerHour * 100 + $likeCount * 2 + $commentCount * 8);
    }

    /**
     * @param array<string,mixed> $snippet
     */
    private function thumbnailUrl(array $snippet): string
    {
        $thumbnails = (isset($snippet['thumbnails']) && is_array($snippet['thumbnails'])) ? $snippet['thumbnails'] : array();
        foreach (array('maxres', 'standard', 'high', 'medium', 'default') as $key) {
            if (isset($thumbnails[$key]) && is_array($thumbnails[$key]) && isset($thumbnails[$key]['url'])) {
                return (string)$thumbnails[$key]['url'];
            }
        }
        return '';
    }
}
