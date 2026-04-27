<?php
declare(strict_types=1);

namespace SiteForge\OAuth;

use RuntimeException;

// OAuth 토큰/프로필 호출용 초경량 HTTP 클라이언트.
// 외부 의존성 없이 file_get_contents + stream_context 로 구현 — curl 확장 없어도 동작.
final class HttpClient
{
    /**
     * @param array<string,string> $data
     * @param array<string,string> $headers
     * @return array<string,mixed>
     */
    public function postForm(string $url, array $data, array $headers = []): array
    {
        $body = http_build_query($data);
        $merged = array_merge([
            'Content-Type'   => 'application/x-www-form-urlencoded',
            'Accept'         => 'application/json',
        ], $headers);

        return $this->requestJson('POST', $url, $merged, $body);
    }

    /**
     * @param array<string,string> $headers
     * @return array<string,mixed>
     */
    public function getJson(string $url, array $headers = []): array
    {
        $merged = array_merge(['Accept' => 'application/json'], $headers);
        return $this->requestJson('GET', $url, $merged, null);
    }

    /**
     * @param array<string,string> $headers
     * @return array<string,mixed>
     */
    private function requestJson(string $method, string $url, array $headers, ?string $body): array
    {
        $hdr = '';
        foreach ($headers as $k => $v) $hdr .= "{$k}: {$v}\r\n";

        $ctx = stream_context_create([
            'http' => [
                'method'        => $method,
                'header'        => $hdr,
                'content'       => $body,
                'ignore_errors' => true, // non-2xx 에도 본문을 받기 위해
                'timeout'       => 10,
            ],
        ]);
        $raw = @file_get_contents($url, false, $ctx);
        if ($raw === false) {
            throw new RuntimeException("OAuth HTTP 호출 실패: {$url}");
        }
        $status = 0;
        if (isset($http_response_header[0]) && preg_match('#HTTP/\S+\s+(\d+)#', $http_response_header[0], $m)) {
            $status = (int)$m[1];
        }
        if ($status < 200 || $status >= 300) {
            throw new RuntimeException("OAuth 응답 오류 ({$status}) {$url}: " . substr($raw, 0, 300));
        }
        $decoded = json_decode($raw, true);
        if (!is_array($decoded)) {
            throw new RuntimeException("OAuth 응답이 JSON 이 아님: {$url}");
        }
        return $decoded;
    }
}
