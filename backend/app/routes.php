<?php
declare(strict_types=1);

use App\Application\Actions\Auth\{GetCurrentUserAction};
use App\Application\Actions\OAuth\{FacebookAction,
    FacebookCallbackAction,
    GithubCallbackAction,
    GoogleAction,
    GoogleCallbackAction
};
use App\Application\Actions\Record\{DownloadAction, UploadAction};
use App\Application\Actions\WakeWord\WakeWordGetMultipleAction;
use App\Application\Middleware\ForceAuthenticationMiddleware;
use Psr\Http\Message\{ResponseInterface as Response, ServerRequestInterface as Request};
use Slim\App;
use Slim\Exception\HttpNotFoundException;
use Slim\Interfaces\RouteCollectorProxyInterface as Group;

return function (App $app) {
    $app->options('/{routes:.+}', function (Request $request, Response $response) {
        // CORS Pre-Flight OPTIONS Request Handler
        return $response;
    });

    $app->group('/api', function (Group $group) {
        $group->group('/oauth', function (Group $group) {
            $group->get('/github/callback', GithubCallbackAction::class);
            $group->get('/google', GoogleAction::class);
            $group->get('/google/callback', GoogleCallbackAction::class);
            $group->get('/facebook', FacebookAction::class);
            $group->get('/facebook/callback', FacebookCallbackAction::class);
        });

        $group->group('/wake-word', function (Group $group) {
            $group->get('/', WakeWordGetMultipleAction::class);
            $group->get('/{uuid}', WakeWordGetOneAction::class);
        });

        $group->group('/auth', function (Group $group) {
            $group->get('/me/user', GetCurrentUserAction::class);
        })->add(ForceAuthenticationMiddleware::class);

        $group->group('/record', function (Group $group) {
            $group->post('/upload', UploadAction::class);
            $group->get('/download/{trainingDataUuid}', DownloadAction::class);
        })->add(ForceAuthenticationMiddleware::class);
    });

    $app->map(['GET', 'POST', 'PUT', 'DELETE', 'PATCH'], '/{routes:.+}', function ($request, $response) {
        throw new HttpNotFoundException($request);
    });
};
