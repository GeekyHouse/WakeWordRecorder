<?php
declare(strict_types=1);

namespace App\Application\Actions\OAuth;

use Google_Exception;
use Psr\Http\Message\ResponseInterface as Response;

class GoogleAction extends AbstractCallbackAction
{
    /**
     * {@inheritdoc}
     * @throws Google_Exception
     */
    protected function action(): Response
    {
        $redirect_url = $this->resolveQueryParam('redirect_url', true, '/');
        $client = $this->getGoogleClient();
        $client->setState(json_encode(['redirect_url' => $redirect_url]));
        header('Location: ' . filter_var($client->createAuthUrl(), FILTER_SANITIZE_URL));
        exit;
    }
}
