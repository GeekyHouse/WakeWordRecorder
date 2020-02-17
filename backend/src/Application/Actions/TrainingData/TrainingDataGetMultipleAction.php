<?php
declare(strict_types=1);

namespace App\Application\Actions\TrainingData;

use App\Application\Actions\Action;
use App\Domain\TrainingData\TrainingData;
use App\Domain\WakeWord\WakeWord;
use Doctrine\Common\Collections\Criteria;
use Doctrine\ORM\EntityManager;
use Doctrine\ORM\Query\Expr\Join;
use Doctrine\ORM\Tools\Pagination\Paginator;
use Exception;
use Psr\Container\ContainerInterface;
use Psr\Http\Message\ResponseInterface as Response;

class TrainingDataGetMultipleAction extends Action
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
        $page = $this->resolveQueryParam('page', true, 1);
        $maxPerPage = $this->resolveQueryParam('max_per_page', true, null);

        $filters = array_intersect_key($this->resolveQueryParam('filters', true, []), array_flip([
            'wake_word',
            'is_validated'
        ]));
        $criteria = Criteria::create();
        foreach ($filters as $key => $value) {
            $criteria->andWhere(Criteria::expr()->eq($key, $value));
        }
        $em = $this->container->get(EntityManager::class);

        $queryBuilder = $em->createQueryBuilder()
            ->select('t as training_data')
            ->from(TrainingData::class, 't')
            ->innerJoin(WakeWord::class, 'w', Join::WITH, 't.wake_word = w.uuid')
            ->addCriteria($criteria)
            ->orderBy('t.created', 'ASC');
        if ($maxPerPage) {
            $queryBuilder->setFirstResult(($page - 1) * $maxPerPage)
                ->setMaxResults($maxPerPage);
        } else {
            $page = 1;
        }
        $query = $queryBuilder->getQuery();

        $paginator = new Paginator($query, false);
        $total = count($paginator);

        /** @var TrainingData[] $trainingData */
        $trainingData = $paginator->getIterator()->getArrayCopy(); // ->getResult();

        return $this->respondWithData([
            'total' => $total,
            'current_page' => (int)$page,
            'page_count' => $maxPerPage ? ceil($total / $maxPerPage) : 1,
            'items_per_page' => (int)$maxPerPage,
            'data' => array_map(function ($data) {
                foreach ($data as &$d) {
                    if (is_object($d)) {
                        $className = get_class($d);
                        if (in_array('JsonSerializable', class_implements($className))) {
                            $d = $d->jsonSerialize(['short']);
                        }
                    }

                }
                return $data;
            }, $trainingData)
        ]);
    }
}
