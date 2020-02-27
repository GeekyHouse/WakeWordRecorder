<?php
declare(strict_types=1);

namespace App\Application\Actions\OAuth;

use App\Application\Actions\Action;
use App\Domain\User\User;
use DateTime;
use DateTimeImmutable;
use DateTimeZone;
use Dflydev\FigCookies\FigResponseCookies;
use Dflydev\FigCookies\Modifier\SameSite;
use Dflydev\FigCookies\SetCookie;
use Exception;
use Facebook\Exceptions\FacebookSDKException;
use Facebook\Facebook;
use Firebase\JWT\JWT;
use Google_Client;
use Google_Exception;
use Psr\Container\ContainerInterface;
use Selective\Config\Configuration;
use stdClass;

abstract class AbstractCallbackAction extends Action
{
    /** @var ContainerInterface $container */
    protected ContainerInterface $container;

    public function __construct(ContainerInterface $container)
    {
        $this->container = $container;
    }

    /**
     * @param User $user
     * @param int $duration
     * @return stdClass
     * @throws Exception
     */
    protected function generateJWT(User $user, $duration = 7200): stdClass
    {
        $now = new DateTime();
        $expires = new DateTimeImmutable('now +' . $duration . ' seconds');

        $jti = base64_encode(random_bytes(16));

        $payload = [
            "iat" => $now->getTimeStamp(),
            "nbf" => $now->getTimeStamp(),
            "exp" => $expires->getTimeStamp(),
            "jti" => $jti,
            "iss" => "", // @TODO: host of api
            "aud" => "", // @TODO: host of app
            "sub" => $user->getUuid(),
            "scope" => [],
        ];

        $secret = getenv("JWT_SECRET");
        $token = JWT::encode($payload, $secret, "HS256");

        $data = new stdClass();
        $data->token = $token;
        $data->expires = $expires;

        return $data;
    }

    /**
     * @param stdClass $jwt
     * @throws Exception
     */
    protected function addJWTIntoCookie(stdClass $jwt)
    {
        $maxAge = $jwt->expires->getTimestamp() - (new DateTime())->getTimestamp();
        $setCookie = SetCookie::create('x-token')
            ->withValue($jwt->token)
            ->withExpires($jwt->expires->setTimezone(new DateTimeZone("UTC")))
            ->withMaxAge($maxAge)
            ->withPath('/')
            ->withDomain($this->request->getUri()->getHost())
            ->withSecure($this->isSecure())
            ->withHttpOnly(false)
            //->withSameSite(SameSite::strict())
        ;
        $this->response = FigResponseCookies::set($this->response, $setCookie);
    }

    /**
     * @return Google_Client
     * @throws Google_Exception
     */
    protected function getGoogleClient(): Google_Client
    {
        $client = new Google_Client();
        $client->setAuthConfig(APP_ROOT . '/client_secret.json');
        $client->addScope(['profile', 'email']);
        $client->setRedirectUri('http://' . $_SERVER['HTTP_HOST'] . '/api/oauth/google/callback');
        // offline access will give you both an access and refresh token so that
        // your app can refresh the access token without user interaction.
        $client->setAccessType('offline');
        // Using "consent" ensures that your application always receives a refresh token.
        // If you are not using offline access, you can omit this.
        $client->setApprovalPrompt("auto");
        $client->setIncludeGrantedScopes(true); // incremental auth

        return $client;
    }

    /**
     * @return Facebook
     * @throws FacebookSDKException
     */
    protected function getFacebookClient(): Facebook
    {
        return new Facebook([
            'app_id' => $this->container->get(Configuration::class)->getString('facebook.app_id'),
            'app_secret' => $this->container->get(Configuration::class)->getString('facebook.app_secret'),
            'graph_api_version' => 'v6.0',
        ]);
    }
}
