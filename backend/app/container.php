<?php
declare(strict_types=1);

use App\Domain\ProviderApi\Github;
use DI\ContainerBuilder;
use Doctrine\Common\Annotations\AnnotationReader;
use Doctrine\Common\Cache\FilesystemCache;
use Doctrine\ORM\EntityManager;
use Doctrine\ORM\Mapping\Driver\AnnotationDriver;
use Doctrine\ORM\Tools\Setup;
use GuzzleHttp\Client;
use Psr\Container\ContainerInterface;
use Selective\Config\Configuration;
use Slim\App;
use Slim\Factory\AppFactory;

$definitions = [
    Configuration::class => function () {
        return new Configuration(require __DIR__ . '/settings.php');
    },

    Github::class => function (ContainerInterface $container) {
        /** @var Configuration $configuration */
        $configuration = $container->get(Configuration::class);

        $httpClientApi = new Client([
            'base_uri' => $configuration->getString('github.api_host')
        ]);
        $httpClientOauth = new Client([
            'base_uri' => $configuration->getString('github.oauth_host')
        ]);
        return new Github(
            $httpClientApi,
            $httpClientOauth,
            $configuration->getString('github.client_id'),
            $configuration->getString('github.client_secret')
        );
    },

    EntityManager::class => function (ContainerInterface $container) {
        /** @var Configuration $configuration */
        $configuration = $container->get(Configuration::class);

        $config = Setup::createAnnotationMetadataConfiguration(
            $configuration->getArray('doctrine.metadata_dirs'),
            $configuration->getBool('doctrine.dev_mode')
        );

        $config->setMetadataDriverImpl(
            new AnnotationDriver(
                new AnnotationReader,
                $configuration->getArray('doctrine.metadata_dirs')
            )
        );

        $config->setMetadataCacheImpl(
            new FilesystemCache(
                $configuration->getString('doctrine.cache_dir')
            )
        );

        // $config->setQuoteStrategy(new AnsiQuoteStrategy());

        return EntityManager::create(
            $configuration->getArray('doctrine.connection'),
            $config
        );
    },

    App::class => function (ContainerInterface $container) {
        AppFactory::setContainer($container);
        $app = AppFactory::create();
        return $app;
    },

];

$containerBuilder = new ContainerBuilder();

// Set up settings
$containerBuilder->addDefinitions($definitions);

// Build PHP-DI Container instance
return $containerBuilder->build();
