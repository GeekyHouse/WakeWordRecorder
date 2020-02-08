<?php
declare(strict_types=1);

namespace App\Application\Actions\Record;

use App\Application\Actions\Action;
use App\Domain\JWTManager\JWTManager;
use App\Domain\TrainingData\TrainingData;
use App\Domain\WakeWord\WakeWord;
use Doctrine\ORM\EntityManager;
use Exception;
use Psr\Container\ContainerInterface;
use Psr\Http\Message\{ResponseInterface as Response, UploadedFileInterface};
use Slim\Exception\{HttpBadRequestException, HttpNotFoundException};

class UploadAction extends Action
{
    /** @var ContainerInterface $container */
    protected ContainerInterface $container;

    /**
     * UploadAction constructor.
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

        $rawFile = $this->resolveFile('file');
        $wakeWordUuid = $this->resolveBodyArg('wake_word_uuid');

        $wakeWord = $em->getRepository(WakeWord::class)->findOneBy(['uuid' => $wakeWordUuid]);

        if (!$wakeWord) {
            throw new HttpNotFoundException($this->request);
        }

        if ($rawFile->getError() !== UPLOAD_ERR_OK) {
            throw new HttpBadRequestException($this->request, $rawFile->getError());
        }

        $fileName = $this->moveUploadedFile(SOUNDS_PATH, $rawFile);

        $trainingData = new TrainingData();
        $trainingData->setFileName($fileName);
        $trainingData->setUser($user);
        $trainingData->setWakeWord($wakeWord);
        $em->persist($trainingData);
        $em->flush();

        return $this->respondWithData($trainingData->jsonSerialize());
    }

    /**
     * @param $directory
     * @param UploadedFileInterface $uploadedFile
     * @return string
     * @throws Exception
     */
    protected function moveUploadedFile($directory, UploadedFileInterface $uploadedFile)
    {
        $extension = pathinfo($uploadedFile->getClientFilename(), PATHINFO_EXTENSION);
        $basename = bin2hex(random_bytes(40));
        $filename = sprintf('%s.%0.8s', $basename, $extension);

        $uploadedFile->moveTo($directory . DIRECTORY_SEPARATOR . $filename);

        return $filename;
    }
}
