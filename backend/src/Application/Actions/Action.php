<?php
declare(strict_types=1);

namespace App\Application\Actions;

use App\Domain\DomainException\DomainRecordNotFoundException;
use Psr\Http\Message\{ResponseInterface as Response, ServerRequestInterface as Request};
use Slim\Exception\{HttpBadRequestException, HttpNotFoundException};

abstract class Action
{
    /**
     * @var Request
     */
    protected Request $request;

    /**
     * @var Response
     */
    protected Response $response;

    /**
     * @var array
     */
    protected ?array $args;

    /**
     * @var array
     */
    protected ?array $bodyArgs;

    /**
     * @var array
     */
    protected ?array $queryParams;

    /**
     * @var array
     */
    protected ?array $files;

    /**
     * @param Request $request
     * @param Response $response
     * @param array $args
     * @return Response
     * @throws HttpNotFoundException
     * @throws HttpBadRequestException
     */
    public function __invoke(Request $request, Response $response, ?array $args = null): Response
    {
        $this->request = $request;
        $this->response = $response;
        $this->args = $args;
        $this->bodyArgs = $this->request->getParsedBody();
        $this->queryParams = $this->request->getQueryParams();
        $this->files = $this->request->getUploadedFiles();

        try {
            return $this->action();
        } catch (DomainRecordNotFoundException $e) {
            throw new HttpNotFoundException($this->request, $e->getMessage());
        }
    }

    /**
     * @return Response
     * @throws DomainRecordNotFoundException
     * @throws HttpBadRequestException
     */
    abstract protected function action(): Response;

    /**
     * @param string $name
     * @return mixed
     * @throws HttpBadRequestException
     */
    protected function resolveArg(string $name)
    {
        if (!isset($this->args[$name])) {
            throw new HttpBadRequestException($this->request, "Could not resolve argument `{$name}`.");
        }

        return $this->args[$name];
    }

    /**
     * @param string $name
     * @return mixed
     * @throws HttpBadRequestException
     */
    protected function resolveBodyArg(string $name)
    {
        if (!isset($this->bodyArgs[$name])) {
            throw new HttpBadRequestException($this->request, "Could not resolve argument `{$name}`.");
        }

        return $this->bodyArgs[$name];
    }

    /**
     * @param string $name
     * @param bool|null $optional
     * @param mixed|null $default
     * @return mixed
     * @throws HttpBadRequestException
     */
    protected function resolveQueryParam(string $name, ?bool $optional = false, $default = null)
    {
        if (!$optional && !isset($this->queryParams[$name])) {
            throw new HttpBadRequestException($this->request, "Could not resolve argument `{$name}`.");
        }
        if ($optional && !isset($this->queryParams[$name])) {
            return $default;
        }

        return $this->queryParams[$name];
    }

    /**
     * @param string $name
     * @return mixed
     * @throws HttpBadRequestException
     */
    protected function resolveFile(string $name)
    {
        if (!isset($this->files[$name])) {
            throw new HttpBadRequestException($this->request, "Could not resolve file `{$name}`.");
        }

        return $this->files[$name];
    }

    /**
     * @param array|object|null $data
     * @return Response
     */
    protected function respondWithData($data = null): Response
    {
        $payload = new ActionPayload(200, $data);
        return $this->respond($payload);
    }

    /**
     * @param ActionPayload $payload
     * @return Response
     */
    protected function respond(ActionPayload $payload): Response
    {
        $json = json_encode($payload, JSON_PRETTY_PRINT);
        $this->response->getBody()->write($json);
        return $this->response->withHeader('Content-Type', 'application/json');
    }

    /**
     * @return bool
     */
    protected function isSecure(): bool
    {
        $serverParams = $this->request->getServerParams();
        return ((!empty($serverParams['HTTPS']) && $serverParams['HTTPS'] !== 'off')
            || (!empty($serverParams['HTTP_X_FORWARDED_PROTO']) && $serverParams['HTTP_X_FORWARDED_PROTO'] == 'https')
            || (!empty($serverParams['HTTP_X_FORWARDED_SSL']) && $serverParams['HTTP_X_FORWARDED_SSL'] == 'on')
            || (isset($serverParams['HTTP_X_FORWARDED_PORT']) && $serverParams['HTTP_X_FORWARDED_PORT'] == 443)
            || (isset($serverParams['REQUEST_SCHEME']) && $serverParams['REQUEST_SCHEME'] == 'https'));
    }
}
