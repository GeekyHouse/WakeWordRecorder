<?php
declare(strict_types=1);

namespace App\Application\Actions\WakeWord;

use App\Application\Actions\Action;
use App\Domain\TrainingData\TrainingData;
use App\Domain\WakeWord\WakeWord;
use Doctrine\ORM\EntityManager;
use Exception;
use JMS\Serializer\GraphNavigatorInterface;
use JMS\Serializer\Handler\HandlerRegistry;
use JMS\Serializer\JsonSerializationVisitor;
use JMS\Serializer\SerializerBuilder;
use Psr\Container\ContainerInterface;
use Psr\Http\Message\ResponseInterface as Response;
use Ramsey\Uuid\Uuid;
use Ramsey\Uuid\UuidInterface;

class WakeWordGetMultipleAction extends Action
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
        /*$filters = array_intersect_key($this->resolveQueryParam('filters', true, []), array_flip([
            'label'
        ]));*/
        $em = $this->container->get(EntityManager::class);
        $query = $em->createQueryBuilder()
            ->select('w as wake_word')
            ->addSelect('count(t) as count_training_data')
            ->addSelect('count(t2) as count_training_data_validated')
            ->from(WakeWord::class, 'w')
            ->leftJoin(TrainingData::class, 't', 'WITH', 't.wake_word = w.uuid')
            ->leftJoin(TrainingData::class, 't2', 'WITH', 't2.wake_word = w.uuid AND t2.is_validated = true')
            ->groupBy('w')
            ->orderBy('w.label', 'ASC')
            ->getQuery()
        ;
        /** @var WakeWord[] $wakeWords */
        $wakeWords = $query->getResult();

        return $this->respondWithData(array_map(function ($data) {
            foreach ($data as &$d) {
                if (is_object($d)) {
                    $className = get_class($d);
                    if (in_array('JsonSerializable', class_implements($className))) {
                        $d = $d->jsonSerialize(['short']);
                    }
                }

            }
            return $data;
        }, $wakeWords));
    }
}
