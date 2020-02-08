<?php

namespace App\Application\Middleware;

use App\Domain\JWTManager\JWTManager;
use Psr\Http\Message\{ResponseInterface, ServerRequestInterface};
use Psr\Http\Server\{MiddlewareInterface, RequestHandlerInterface};
use Slim\Exception\HttpUnauthorizedException;

/**
 * CORS middleware.
 */
final class ForceAuthenticationMiddleware implements MiddlewareInterface
{
    /** @var JWTManager $jwtManager */
    protected JWTManager $jwtManager;

    /**
     * ForceAuthenticationMiddleware constructor.
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
     * @throws HttpUnauthorizedException
     */
    public function process(ServerRequestInterface $request, RequestHandlerInterface $handler): ResponseInterface
    {
        if (!$this->jwtManager->getCurrentUser()) {
            throw new HttpUnauthorizedException($request);
        }

        return $handler->handle($request);
    }
}
