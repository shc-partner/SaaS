<?php
declare(strict_types=1);

namespace CreatorDesk\OAuth;

use RuntimeException;

// OAuth 토큰/프로필 호출에 사용하는 HTTP 클라이언트.
// curl 확장이 없어도 동작하도록 file_get_contents + stream_context로 구현.
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
        foreach ($headers as $k => $v) {
            $hdr .= "{$k}: {$v}\r\n";
        }

        $ctx = stream_context_create([
            'http' => [
                'method'        => $method,
                'header'        => $hdr,
                'content'       => $body,
                'ignore_errors' => true, // non-2xx 응답도 본문을 확인하기 위해 받습니다.
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
            throw new RuntimeException("OAuth 응답이 JSON이 아닙니다: {$url}");
        }
        return $decoded;
    }
}
