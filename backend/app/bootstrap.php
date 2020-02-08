<?php
declare(strict_types=1);

use Doctrine\Common\Annotations\AnnotationRegistry;
use Doctrine\DBAL\Types\Type;
use Ramsey\Uuid\Doctrine\UuidType;
use Slim\App;

require_once __DIR__ . '/../vendor/autoload.php';
AnnotationRegistry::registerLoader('class_exists');

define('APP_ROOT', dirname(__DIR__));
define('SOUNDS_PATH', dirname(APP_ROOT).'/sounds');

// Add Doctrine custom type
Type::addType('uuid', UuidType::class);

// Build PHP-DI Container instance
$container = require __DIR__ . '/container.php';

// Create App instance
$app = $container->get(App::class);

// Register routes
(require __DIR__ . '/routes.php')($app);

// Register middleware
(require __DIR__ . '/middleware.php')($app);

return $app;
