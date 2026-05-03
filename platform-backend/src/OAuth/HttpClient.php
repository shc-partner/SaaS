<?php
declare(strict_types=1);

namespace CreatorDesk\OAuth;

use RuntimeException;

// OAuth ? í°/?„ë¡œ???¸ì¶œ??ì´ˆê²½??HTTP ?´ë¼?´ì–¸??
// ?¸ë? ?˜ì¡´???†ì´ file_get_contents + stream_context ë¡?êµ¬í˜„ ??curl ?•ìž¥ ?†ì–´???™ìž‘.
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
                'ignore_errors' => true, // non-2xx ?ë„ ë³¸ë¬¸??ë°›ê¸° ?„í•´
                'timeout'       => 10,
            ],
        ]);
        $raw = @file_get_contents($url, false, $ctx);
        if ($raw === false) {
            throw new RuntimeException("OAuth HTTP ?¸ì¶œ ?¤íŒ¨: {$url}");
        }
        $status = 0;
        if (isset($http_response_header[0]) && preg_match('#HTTP/\S+\s+(\d+)#', $http_response_header[0], $m)) {
            $status = (int)$m[1];
        }
        if ($status < 200 || $status >= 300) {
            throw new RuntimeException("OAuth ?‘ë‹µ ?¤ë¥˜ ({$status}) {$url}: " . substr($raw, 0, 300));
        }
        $decoded = json_decode($raw, true);
        if (!is_array($decoded)) {
            throw new RuntimeException("OAuth ?‘ë‹µ??JSON ???„ë‹˜: {$url}");
        }
        return $decoded;
    }
}
