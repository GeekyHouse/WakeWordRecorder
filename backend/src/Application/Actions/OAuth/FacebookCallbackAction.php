<?php
declare(strict_types=1);

namespace App\Application\Actions\OAuth;

use App\Domain\Provider\Provider;
use App\Domain\User\User;
use Doctrine\ORM\EntityManager;
use Exception;
use Psr\Http\Message\ResponseInterface as Response;

class FacebookCallbackAction extends AbstractCallbackAction
{
    /**
     * {@inheritdoc}
     * @return Response
     * @throws Exception
     */
    protected function action(): Response
    {
        session_start();
        $client = $this->getFacebookClient();
        $helper = $client->getRedirectLoginHelper();
        $state = $helper->getPersistentDataHandler();
        // don't know why, hack to avoid CSRF error (but session already started...)
        if (isset($_GET['state'])) {
            $state->set('state', $_GET['state']);
        }
        $redirect_url = $state->get('redirect_url') ?? '/';
        $accessToken = $helper->getAccessToken('http://' . $_SERVER['HTTP_HOST'] . '/api/oauth/facebook/callback');
        if (!$accessToken->isLongLived()) {
            // Exchanges a short-lived access token for a long-lived one
            $oAuth2Client = $client->getOAuth2Client();
            $accessToken = $oAuth2Client->getLongLivedAccessToken($accessToken);
        }
        $fields = [
            'id',
            'birthday',
            'email',
            'first_name',
            'gender',
            'last_name',
            'name',
            'name_format',
            'picture.width(400).height(400)'
        ];
        $response = $client->get('/me?fields='.implode(',', $fields), $accessToken->getValue());
        $facebookUser = $response->getGraphUser();

        $em = $this->container->get(EntityManager::class);

        /** @var Provider $provider */
        $provider = $em->getRepository(Provider::class)->findOneBy(['label' => 'facebook']);

        $user = $em->getRepository(User::class)->findOneBy([
            'external_id' => (string)$facebookUser->getId(),
            'provider' => $provider
        ]);
        if (!$user) {
            $user = new User();
        }

        $user->setAvatarUrl($facebookUser->getPicture()->getUrl())
            ->setEmail($facebookUser->getEmail())
            ->setExternalId($facebookUser->getId())
            ->setName($facebookUser->getName())
            // ->setPseudonym()
            ->setProvider($provider)
            ->setToken($accessToken->getValue());
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
