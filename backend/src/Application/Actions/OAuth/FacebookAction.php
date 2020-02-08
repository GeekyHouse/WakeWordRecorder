<?php
declare(strict_types=1);

namespace App\Application\Actions\OAuth;

use Exception;
use Psr\Http\Message\ResponseInterface as Response;

class FacebookAction extends AbstractCallbackAction
{
    /**
     * {@inheritdoc}
     * @return Response
     * @throws Exception
     */
    protected function action(): Response
    {
        session_start();
        $redirect_url = $this->resolveQueryParam('redirect_url', true, '/');
        $client = $this->getFacebookClient();
        $helper = $client->getRedirectLoginHelper();
        $state = $helper->getPersistentDataHandler();
        $state->set('redirect_url', $redirect_url);
        $permissions = ['email'];
        $url = $helper->getLoginUrl('http://' . $_SERVER['HTTP_HOST'] . '/api/oauth/facebook/callback', $permissions);
        header('Location: ' . filter_var($url, FILTER_SANITIZE_URL));
        exit;
    }
}
