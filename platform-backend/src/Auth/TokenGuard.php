<?php
declare(strict_types=1);

namespace CreatorDesk\Auth;

use CreatorDesk\Http\Request;

// ì»¨íŠ¸ë¡¤ëŸ¬?ì„œ "?„ì¬ ë¡œê·¸?¸í•œ ?¬ìš©?? ë¥??»ê¸° ?„í•œ ?‡ì? ?¬í¼.
// ë³„ë„ ë¯¸ë“¤?¨ì–´ ê³„ì¸µ???„ì§ ?†ìœ¼ë¯€ë¡????¼ìš°???¨ìœ„ë¡?ëª…ì‹œ?ìœ¼ë¡??¸ì¶œ?œë‹¤.
final class TokenGuard
{
    public function __construct(
        private Service $service = new Service(),
    ) {}

    /** ?„ì¬ ?”ì²­??Bearer ? í°?¼ë¡œ ?¬ìš©???•ë³´ë¥?ì°¾ì•„ ë°˜í™˜. ?†ê±°??ë§Œë£Œë©?null. */
    public function user(Request $req): ?array
    {
        $token = $req->bearerToken();
        if ($token === null) return null;
        return $this->service->me($token);
    }

    public function userId(Request $req): ?int
    {
        $u = $this->user($req);
        return $u === null ? null : (int)$u['id'];
    }
}
