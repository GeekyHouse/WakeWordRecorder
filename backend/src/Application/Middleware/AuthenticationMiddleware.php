<?php

namespace App\Application\Middleware;

use App\Domain\JWTManager\JWTManager;
use Dflydev\FigCookies\FigRequestCookies;
use Psr\Http\Message\{ResponseInterface, ServerRequestInterface};
use Psr\Http\Server\{MiddlewareInterface, RequestHandlerInterface};

/**
 * CORS middleware.
 */
final class AuthenticationMiddleware implements MiddlewareInterface
{
    /** @var JWTManager $jwtManager */
    protected JWTManager $jwtManager;

    /**
     * AuthenticationMiddleware constructor.
     * @param JWTManager $jwtManager
     */
    public function __construct(JWTManager $jwtManager)
    {
        $this->jwtManager = $jwtManager;
    }

    /**
     * Invoke middleware.
     *
     * @param ServerRequestInterface $request The request
     * @param RequestHandlerInterface $handler The handler
     *
     * @return ResponseInterface The response
     */
    public function process(ServerRequestInterface $request, RequestHandlerInterface $handler): ResponseInterface
    {
        $cookie = FigRequestCookies::get($request, 'x-token');
        if (!$cookie->getValue()) {
            return $handler->handle($request);
        }
        $secret = getenv("JWT_SECRET");
        $this->jwtManager->fetchUserFromToken($cookie->getValue(), $secret, ['HS256']);

        return $handler->handle($request);
    }
}
