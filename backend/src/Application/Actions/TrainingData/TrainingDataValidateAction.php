<?php
declare(strict_types=1);

namespace App\Application\Actions\TrainingData;

use App\Application\Actions\Action;
use App\Application\Actions\ActionPayload;
use App\Domain\JWTManager\JWTManager;
use App\Domain\TrainingData\TrainingData;
use App\Domain\TrainingDataValidation\TrainingDataValidation;
use Doctrine\ORM\EntityManager;
use Exception;
use Psr\Container\ContainerInterface;
use Psr\Http\Message\ResponseInterface as Response;
use Slim\Exception\HttpNotFoundException;
use Slim\Exception\HttpUnauthorizedException;

class TrainingDataValidateAction extends Action
{
    /** @var ContainerInterface $container */
    protected ContainerInterface $container;

    /**
     * WakeWordGetMultipleAction constructor.
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
        $trainingDataUuid = $this->resolveArg('trainingDataUuid');
        $user = $this->container->get(JWTManager::class)->getCurrentUser();

        if (!$user) {
            throw new HttpUnauthorizedException($this->request);
        }

        /** @var TrainingData $trainingData */
        $trainingData = $em->getRepository(TrainingData::class)->findOneBy(['uuid' => $trainingDataUuid]);
        if (!$trainingData) {
            throw new HttpNotFoundException($this->request);
        }

        $validation = new TrainingDataValidation();
        $validation->setUser($user)
            ->setTrainingData($trainingData)
            ->setValidated(true);
        $em->persist($validation);
        $em->flush();

        return $this->respond(new ActionPayload(201));
    }
}
