<?php
declare(strict_types=1);

use DI\Container;
use Doctrine\Common\Annotations\AnnotationRegistry;
use Doctrine\DBAL\Types\Type;
use Doctrine\ORM\EntityManager;
use Doctrine\ORM\Tools\Console\ConsoleRunner;
use Ramsey\Uuid\Doctrine\UuidType;

define('APP_ROOT', __DIR__);

// Add Doctrine custom type
Type::addType('uuid', UuidType::class);

/** @var Container $container */
$container = require_once APP_ROOT . '/app/container.php';


AnnotationRegistry::registerLoader('class_exists');

return ConsoleRunner::createHelperSet($container->get(EntityManager::class));
