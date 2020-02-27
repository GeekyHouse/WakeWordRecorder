<?php
declare(strict_types=1);

namespace App\Domain\JWTManager;

use App\Domain\User\User;
use Doctrine\ORM\EntityManager;
use Firebase\JWT\JWT;

class JWTManager
{
    /** @var EntityManager $entityManager */
    protected EntityManager $entityManager;

    /** @var User|null $currentUser */
    protected ?User $currentUser = null;

    /**
     * JWTManager constructor.
     * @param EntityManager $entityManager
     */
    public function __construct(EntityManager $entityManager)
    {
        $this->entityManager = $entityManager;
    }

    /**
     * @param string $jwt
     * @param string $key
     * @param array|null $allowed_algs
     * @return User|null
     */
    public function fetchUserFromToken(string $jwt, string $key, ?array $allowed_algs = [])
    {
        $jwt = JWT::decode($jwt, $key, $allowed_algs);

        /** @var User|null $currentUser */
        $currentUser = $this->entityManager->getRepository(User::class)->findOneBy(['uuid' => $jwt->sub]);

        $this->currentUser = $currentUser;

        return $currentUser;
    }

    /**
     * @return User|null
     */
    public function getCurrentUser()
    {
        return $this->currentUser;
    }
}
