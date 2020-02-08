<?php
declare(strict_types=1);

// Error reporting
error_reporting(0);
ini_set('display_errors', '0');

// Timezone
use Doctrine\ORM\Mapping\UnderscoreNamingStrategy;

date_default_timezone_set('Europe/Paris');

// Settings
$settings = [];

// Error Handling Middleware settings
$settings['error_handler_middleware'] = [

    // Should be set to false in production
    'display_error_details' => true,

    // Parameter is passed to the default ErrorHandler
    // View in rendered output by enabling the "displayErrorDetails" setting.
    // For the console and unit tests we also disable it
    'log_errors' => false,

    // Display error details in error log
    'log_error_details' => false,
];

// Doctrine configuration
$settings['doctrine'] = [
    // if true, metadata caching is forcefully disabled
    'dev_mode' => true,

    // path where the compiled metadata info will be cached
    // make sure the path exists and it is writable
    'cache_dir' => APP_ROOT . '/var/doctrine',

    // you should add any other path containing annotated entity classes
    'metadata_dirs' => [APP_ROOT . '/src/Domain'],

    'orm_default' => [
        'naming_strategy' => UnderscoreNamingStrategy::class
    ],

    'connection' => [
        'driver' => 'pdo_pgsql',
        'host' => 'postgres',
        'port' => 5432,
        'dbname' => getenv('POSTGRES_DB'),
        'user' => getenv('POSTGRES_USER'),
        'password' => getenv('POSTGRES_PASSWORD'),
        'charset' => 'utf-8'
    ],
];

$settings['github'] = [
    'api_host' => getenv('GITHUB_API_HOST'),
    'oauth_host' => getenv('GITHUB_OAUTH_HOST'),
    'client_id' => getenv('GITHUB_API_CLIENT_ID'),
    'client_secret' => getenv('GITHUB_API_CLIENT_SECRET'),
];

$settings['facebook'] = [
    'app_id' => getenv('FACEBOOK_APP_ID'),
    'app_secret' => getenv('FACEBOOK_APP_SECRET'),
];

return $settings;
