<?php
declare(strict_types=1);

namespace App\Domain\ProviderApi;

use GuzzleHttp\Client;
use Psr\Http\Message\ResponseInterface;

class Github
{
    /** @var string */
    protected string $clientId;

    /** @var string */
    protected string $clientSecret;

    /** @var Client */
    protected Client $httpClientApi;

    /** @var Client */
    protected Client $httpClientOauth;

    /**
     * Github constructor.
     * @param Client $httpClientApi
     * @param Client $httpClientOauth
     * @param string $clientId
     * @param string $clientSecret
     */
    public function __construct(Client $httpClientApi, Client $httpClientOauth, string $clientId, string $clientSecret)
    {
        $this->httpClientApi = $httpClientApi;
        $this->httpClientOauth = $httpClientOauth;
        $this->clientId = $clientId;
        $this->clientSecret = $clientSecret;
    }

    /**
     * @param string $code
     * @return ResponseInterface
     */
    public function getAccessToken(string $code): ResponseInterface
    {
        return $this->httpClientOauth->post('/login/oauth/access_token',
            [
                'headers' => ['Accept' => 'application/json'],
                'query' => [
                    'client_id' => $this->clientId,
                    'client_secret' => $this->clientSecret,
                    'code' => $code,
                ]
            ]
        );
    }

    /**
     * @param string $token
     * @return ResponseInterface
     */
    public function getUserData(string $token): ResponseInterface
    {
        return $this->httpClientApi->get('/user',
            [
                'headers' => [
                    'Authorization' => 'Bearer ' . $token
                ]
            ]
        );
    }
}
