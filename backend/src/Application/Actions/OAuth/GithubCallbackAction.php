<?php
declare(strict_types=1);

namespace App\Application\Actions\OAuth;

use Exception;
use App\Domain\{Provider\Provider, ProviderApi\Github, User\User};
use Doctrine\ORM\EntityManager;
use Psr\Http\Message\ResponseInterface as Response;
use Slim\Exception\HttpBadRequestException;

class GithubCallbackAction extends AbstractCallbackAction
{
    /**
     * {@inheritdoc}
     * @throws Exception
     */
    protected function action(): Response
    {
        $em = $this->container->get(EntityManager::class);

        /** @var Provider $provider */
        $provider = $em->getRepository(Provider::class)->findOneBy(['label' => 'github']);

        $code = $this->resolveQueryParam('code');
        $redirect_url = $this->resolveQueryParam('redirect_url', true, '/');

        $result = $this->container->get(Github::class)->getAccessToken($code);
        $json_result = json_decode((string)$result->getBody());
        if ($json_result->error) {
            throw new HttpBadRequestException($this->request, $json_result->error_description);
        }

        $token = $json_result->access_token;

        $result = $this->container->get(Github::class)->getUserData($token);
        $json_result = json_decode((string)$result->getBody());

        $user = $em->getRepository(User::class)->findOneBy([
            'external_id' => (string)$json_result->id,
            'provider' => $provider
        ]);
        if (!$user) {
            $user = new User();
        }

        $user->setAvatarUrl($json_result->avatar_url)
            ->setEmail($json_result->email)
            ->setExternalId($json_result->id ? (string)$json_result->id : null)
            ->setName($json_result->name)
            ->setPseudonym($json_result->login)
            ->setProvider($provider)
            ->setToken($token);
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
