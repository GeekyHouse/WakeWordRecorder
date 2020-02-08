<?php
declare(strict_types=1);

namespace App\Application\Actions\Auth;

use App\Application\Actions\Action;
use App\Domain\JWTManager\JWTManager;
use Psr\Container\ContainerInterface;
use Psr\Http\Message\ResponseInterface as Response;

class GetCurrentUserAction extends Action
{
    /** @var ContainerInterface $container */
    protected ContainerInterface $container;

    /**
     * GetCurrentUserAction constructor.
     * @param ContainerInterface $container
     */
    public function __construct(ContainerInterface $container)
    {
        $this->container = $container;
    }

    /**
     * {@inheritdoc}
     */
    protected function action(): Response
    {
        $user = $this->container->get(JWTManager::class)->getCurrentUser();
        return $this->respondWithData($user->jsonSerialize());
    }
}
