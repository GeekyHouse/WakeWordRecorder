<?php
declare(strict_types=1);

namespace App\Application\Actions\OAuth;

use App\Domain\{Provider\Provider, User\User};
use Doctrine\ORM\EntityManager;
use Exception;
use Psr\Http\Message\ResponseInterface as Response;

class GoogleCallbackAction extends AbstractCallbackAction
{
    /**
     * {@inheritdoc}
     * @return Response
     * @throws Exception
     */
    protected function action(): Response
    {
        $code = $this->resolveQueryParam('code');
        $state = $this->resolveQueryParam('state');
        $state = $state ? json_decode($state, true) : [];
        $redirect_url = $state['redirect_url'] ?? '/';

        $client = $this->getGoogleClient();
        $client->fetchAccessTokenWithAuthCode($code);
        // $access_token = $client->getAccessToken();
        // $client->setAccessToken($access_token);
        $payload = $client->verifyIdToken();

        $em = $this->container->get(EntityManager::class);

        /** @var Provider $provider */
        $provider = $em->getRepository(Provider::class)->findOneBy(['label' => 'google']);

        $user = $em->getRepository(User::class)->findOneBy([
            'external_id' => (string)$payload['sub'],
            'provider' => $provider
        ]);
        if (!$user) {
            $user = new User();
        }

        $user->setAvatarUrl($payload['picture'])
            ->setEmail($payload['email'])
            ->setExternalId($payload['sub'])
            ->setName($payload['name'])
            // ->setPseudonym()
            ->setProvider($provider)
            ->setToken($client->getAccessToken()['access_token']);
        $em->persist($user);
        $em->flush();

        // Generate JWT
        $jwt = $this->generateJWT($user, 7200);
        // Set JWT into Cookie
        $this->addJWTIntoCookie($jwt);

        return $this->response
            ->withHeader('Location', $redirect_url);
    }
}
