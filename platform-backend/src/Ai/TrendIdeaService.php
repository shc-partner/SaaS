<?php
declare(strict_types=1);

namespace CreatorDesk\Ai;

use RuntimeException;

final class TrendIdeaService
{
    private const ENDPOINT = 'https://api.openai.com/v1/responses';
    private const DEFAULT_MODEL = 'gpt-4.1-mini';
    private const MAX_ATTEMPTS = 3;

    /**
     * @param array<string,mixed> $video
     * @return array{ideas:array<int,array<string,mixed>>,model:string,promptTokens:int|null,completionTokens:int|null,estimatedCost:float|null}
     */
    public function generateWithUsage(array $video, int $count = 5): array
    {
        $apiKey = $this->apiKey();
        $model = $this->model();
        $count = max(3, min($count, 10));

        $response = $this->postJson(self::ENDPOINT, $this->payload($model, $this->prompt($video, $count), 1800), $apiKey);
        $ideas = $this->decodeIdeas($this->extractText($response), $count);
        $usage = $this->extractUsage($response);

        return array(
            'ideas' => $ideas,
            'model' => $model,
            'promptTokens' => $usage['promptTokens'],
            'completionTokens' => $usage['completionTokens'],
            'estimatedCost' => null,
        );
    }

    /**
     * @param array<string,mixed> $video
     * @return array<int,array<string,mixed>>
     */
    public function generate(array $video, int $count = 5): array
    {
        $result = $this->generateWithUsage($video, $count);
        return $result['ideas'];
    }

    /**
     * @param array<int,array<string,mixed>> $videos
     * @return array{ideas:array<int,array<string,mixed>>,model:string,promptTokens:int|null,completionTokens:int|null,estimatedCost:float|null}
     */
    public function generateFromVideosWithUsage(array $videos, int $count = 7): array
    {
        $apiKey = $this->apiKey();
        $model = $this->model();
        $count = max(3, min($count, 10));
        $videos = array_slice(array_values($videos), 0, 30);

        $response = $this->postJson(self::ENDPOINT, $this->payload($model, $this->videosPrompt($videos, $count), 2200), $apiKey);
        $ideas = $this->decodeIdeas($this->extractText($response), $count);
        $usage = $this->extractUsage($response);

        return array(
            'ideas' => $ideas,
            'model' => $model,
            'promptTokens' => $usage['promptTokens'],
            'completionTokens' => $usage['completionTokens'],
            'estimatedCost' => null,
        );
    }

    private function apiKey(): string
    {
        $apiKey = getenv('OPENAI_API_KEY') ?: '';
        if ($apiKey === '') {
            throw new RuntimeException('OPENAI_API_KEY is not configured.');
        }
        return $apiKey;
    }

    private function model(): string
    {
        return getenv('OPENAI_MODEL') ?: self::DEFAULT_MODEL;
    }

    /**
     * @return array<string,mixed>
     */
    private function payload(string $model, string $input, int $maxOutputTokens): array
    {
        return array(
            'model' => $model,
            'input' => $input,
            'max_output_tokens' => $maxOutputTokens,
        );
    }

    /**
     * @param array<string,mixed> $video
     */
    private function prompt(array $video, int $count): string
    {
        $safeVideo = array(
            'title' => (string)($video['title'] ?? ''),
            'channelTitle' => (string)($video['channelTitle'] ?? ''),
            'publishedAt' => (string)($video['publishedAt'] ?? ''),
            'viewCount' => (int)($video['viewCount'] ?? 0),
            'likeCount' => (int)($video['likeCount'] ?? 0),
            'commentCount' => (int)($video['commentCount'] ?? 0),
            'trendScore' => (int)($video['trendScore'] ?? 0),
            'categoryId' => (string)($video['categoryId'] ?? ''),
            'youtubeUrl' => (string)($video['youtubeUrl'] ?? ''),
        );

        return implode("\n", array(
            'You are CreatorDesk, an assistant for Korean creator teams.',
            'Turn the YouTube trend video below into practical content planning ideas.',
            'Write in Korean. Use the term "콘텐츠", not "컨텐츠".',
            'Avoid copying the original title verbatim. Make ideas actionable for YouTubers, editors, and thumbnail designers.',
            'Return JSON only. No markdown.',
            'Schema: {"ideas":[{"title":"string","angle":"string","hook":"string","thumbnailText":"string","format":"string","difficulty":"쉬움|보통|어려움","targetAudience":"string","productionNotes":"string","tags":["string"]}]}',
            'Generate exactly ' . $count . ' ideas.',
            'Trend video:',
            json_encode($safeVideo, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES) ?: '{}',
        ));
    }

    /**
     * @param array<int,array<string,mixed>> $videos
     */
    private function videosPrompt(array $videos, int $count): string
    {
        $safeVideos = array();
        foreach ($videos as $video) {
            if (!is_array($video)) {
                continue;
            }
            $safeVideos[] = array(
                'title' => (string)($video['title'] ?? ''),
                'channelTitle' => (string)($video['channelTitle'] ?? ''),
                'publishedAt' => (string)($video['publishedAt'] ?? ''),
                'viewCount' => (int)($video['viewCount'] ?? 0),
                'likeCount' => (int)($video['likeCount'] ?? 0),
                'commentCount' => (int)($video['commentCount'] ?? 0),
                'trendScore' => (int)($video['trendScore'] ?? 0),
                'categoryId' => (string)($video['categoryId'] ?? ''),
                'youtubeUrl' => (string)($video['youtubeUrl'] ?? ''),
            );
        }

        return implode("\n", array(
            'You are CreatorDesk, an assistant for Korean creator teams.',
            'Analyze the YouTube trend video list below and turn recurring topics, angles, formats, and audience signals into practical content planning ideas.',
            'Write in Korean. Use the term "콘텐츠", not "컨텐츠".',
            'Do not simply copy one video title. Synthesize patterns across multiple videos.',
            'Make ideas actionable for YouTubers, editors, thumbnail designers, and channel managers.',
            'Return JSON only. No markdown.',
            'Schema: {"ideas":[{"title":"string","angle":"string","hook":"string","thumbnailText":"string","format":"string","difficulty":"쉬움|보통|어려움","targetAudience":"string","productionNotes":"string","tags":["string"]}]}',
            'Generate exactly ' . $count . ' ideas.',
            'Trend videos:',
            json_encode($safeVideos, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES) ?: '[]',
        ));
    }

    /**
     * @return array<int,array<string,mixed>>
     */
    private function decodeIdeas(string $text, int $count): array
    {
        $decoded = json_decode($text, true);
        if (!is_array($decoded)) {
            $decoded = json_decode($this->extractJsonObject($text), true);
        }
        if (!is_array($decoded) || !isset($decoded['ideas']) || !is_array($decoded['ideas'])) {
            throw new RuntimeException('AI idea response is not valid JSON.');
        }

        return array_slice(array_map(array($this, 'normalizeIdea'), $decoded['ideas']), 0, $count);
    }

    /**
     * @param array<string,mixed> $idea
     * @return array<string,mixed>
     */
    private function normalizeIdea(array $idea): array
    {
        $tags = isset($idea['tags']) && is_array($idea['tags']) ? $idea['tags'] : array();
        return array(
            'title' => trim((string)($idea['title'] ?? '')),
            'angle' => trim((string)($idea['angle'] ?? '')),
            'hook' => trim((string)($idea['hook'] ?? '')),
            'thumbnailText' => trim((string)($idea['thumbnailText'] ?? '')),
            'format' => trim((string)($idea['format'] ?? '')),
            'difficulty' => trim((string)($idea['difficulty'] ?? '보통')),
            'targetAudience' => trim((string)($idea['targetAudience'] ?? '')),
            'productionNotes' => trim((string)($idea['productionNotes'] ?? '')),
            'tags' => array_values(array_filter(array_map('strval', $tags))),
        );
    }

    /**
     * @param array<string,mixed> $payload
     * @return array<string,mixed>
     */
    private function postJson(string $url, array $payload, string $apiKey): array
    {
        $body = json_encode($payload, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
        if ($body === false) {
            throw new RuntimeException('Failed to encode OpenAI request.');
        }

        $context = stream_context_create(array(
            'http' => array(
                'method' => 'POST',
                'header' => implode("\r\n", array(
                    'Content-Type: application/json',
                    'Accept: application/json',
                    'Authorization: Bearer ' . $apiKey,
                )) . "\r\n",
                'content' => $body,
                'ignore_errors' => true,
                'timeout' => 30,
            ),
        ));

        $lastRaw = '';
        $lastStatus = 0;
        $lastError = null;

        for ($attempt = 1; $attempt <= self::MAX_ATTEMPTS; $attempt++) {
            error_clear_last();
            $raw = @file_get_contents($url, false, $context);
            $lastError = error_get_last();

            if ($raw === false) {
                if ($attempt < self::MAX_ATTEMPTS) {
                    usleep($attempt * 500000);
                    continue;
                }
                throw new RuntimeException('Failed to call OpenAI API' . $this->phpErrorSuffix($lastError) . '.');
            }

            $lastRaw = $raw;
            $lastStatus = $this->httpStatus($http_response_header ?? array());
            if ($this->shouldRetryStatus($lastStatus) && $attempt < self::MAX_ATTEMPTS) {
                usleep($attempt * 500000);
                continue;
            }

            break;
        }

        if ($lastStatus < 200 || $lastStatus >= 300) {
            throw new RuntimeException('OpenAI API returned HTTP ' . $lastStatus . $this->errorMessageSuffix($lastRaw));
        }

        $decoded = json_decode($lastRaw, true);
        if (!is_array($decoded)) {
            throw new RuntimeException('OpenAI API response is not valid JSON.');
        }
        return $decoded;
    }

    /** @param array<int,string> $headers */
    private function httpStatus(array $headers): int
    {
        if (isset($headers[0]) && preg_match('#HTTP/\S+\s+(\d+)#', $headers[0], $matches)) {
            return (int)$matches[1];
        }
        return 0;
    }

    private function shouldRetryStatus(int $status): bool
    {
        return in_array($status, array(429, 500, 502, 503, 504), true);
    }

    private function errorMessageSuffix(string $raw): string
    {
        $decoded = json_decode($raw, true);
        if (!is_array($decoded)) {
            return '.';
        }

        $message = $decoded['error']['message'] ?? $decoded['message'] ?? null;
        if (!is_string($message) || trim($message) === '') {
            return '.';
        }

        return ': ' . trim($message);
    }

    /** @param array<string,mixed>|null $error */
    private function phpErrorSuffix(?array $error): string
    {
        $message = is_array($error) && isset($error['message']) ? (string)$error['message'] : '';
        if (trim($message) === '') {
            return '';
        }

        return ': ' . trim($message);
    }

    /**
     * @param array<string,mixed> $response
     */
    private function extractText(array $response): string
    {
        if (isset($response['output_text']) && is_string($response['output_text'])) {
            return trim($response['output_text']);
        }

        $chunks = array();
        $this->collectText($response['output'] ?? array(), $chunks);
        return trim(implode("\n", $chunks));
    }

    /**
     * @param mixed $value
     * @param array<int,string> $chunks
     */
    private function collectText(mixed $value, array &$chunks): void
    {
        if (is_array($value)) {
            if (isset($value['text']) && is_string($value['text'])) {
                $chunks[] = $value['text'];
            }
            foreach ($value as $child) {
                $this->collectText($child, $chunks);
            }
        }
    }

    /** @param array<string,mixed> $response @return array{promptTokens:int|null,completionTokens:int|null} */
    private function extractUsage(array $response): array
    {
        $usage = isset($response['usage']) && is_array($response['usage']) ? $response['usage'] : array();
        return array(
            'promptTokens' => isset($usage['input_tokens']) ? (int)$usage['input_tokens'] : null,
            'completionTokens' => isset($usage['output_tokens']) ? (int)$usage['output_tokens'] : null,
        );
    }

    private function extractJsonObject(string $text): string
    {
        $start = strpos($text, '{');
        $end = strrpos($text, '}');
        if ($start === false || $end === false || $end <= $start) {
            return '{}';
        }
        return substr($text, $start, $end - $start + 1);
    }
}
