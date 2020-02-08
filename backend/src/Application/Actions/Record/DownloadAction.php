<?php
declare(strict_types=1);

namespace App\Application\Actions\Record;

use App\Application\Actions\Action;
use App\Domain\JWTManager\JWTManager;
use App\Domain\TrainingData\TrainingData;
use Doctrine\ORM\EntityManager;
use Exception;
use Psr\Container\ContainerInterface;
use Psr\Http\Message\ResponseInterface as Response;
use Slim\Exception\{HttpNotFoundException, HttpUnauthorizedException};

class DownloadAction extends Action
{
    /** @var ContainerInterface $container */
    protected ContainerInterface $container;

    /**
     * DownloadAction constructor.
     * @param ContainerInterface $container
     */
    public function __construct(ContainerInterface $container)
    {
        $this->container = $container;
    }

    /**
     * @return Response
     * @throws Exception
     */
    public function action(): Response
    {
        $em = $this->container->get(EntityManager::class);
        $user = $this->container->get(JWTManager::class)->getCurrentUser();

        $trainingDataUuid = $this->resolveArg('trainingDataUuid');

        /** @var TrainingData $trainingData */
        $trainingData = $em->getRepository(TrainingData::class)->findOneBy(['uuid' => $trainingDataUuid]);
        if (!$trainingData) {
            throw new HttpNotFoundException($this->request);
        }

        if ($trainingData->getUser() !== $user) {
            throw new HttpUnauthorizedException($this->request);
        }

        $file = SOUNDS_PATH . '/' . $trainingData->getFileName();

        if (!file_exists($file)) {
            throw new HttpNotFoundException($this->request);
        }

        header('Content-Description: File Transfer');
        header('Content-Type: ' . mime_content_type($file));
        // "inline" if we want to read it on browser
        header('Content-Disposition: attachment; filename="' . basename($trainingDataUuid) . '.wav"');
        header('Expires: 0');
        header('Cache-Control: must-revalidate');
        header('Pragma: public');
        header('Content-Length: ' . filesize($file));
        readfile($file);
        exit;
    }
}
