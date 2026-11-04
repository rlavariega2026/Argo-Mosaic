<?php
/**
 * ARGO MOSAIC production configuration.
 * Sensitive database values are deployed separately in config.local.php.
 */
error_reporting(E_ALL);
ini_set('display_errors', '0');

$localConfig = __DIR__ . '/config.local.php';
if (!is_file($localConfig)) {
    http_response_code(503);
    header('Content-Type: application/json; charset=UTF-8');
    echo json_encode(['success' => false, 'message' => 'Server configuration is incomplete.']);
    exit;
}
require_once $localConfig;

header('Content-Type: application/json; charset=UTF-8');
header('X-Content-Type-Options: nosniff');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

function getDbConnection(): PDO {
    static $pdo = null;
    if ($pdo instanceof PDO) return $pdo;

    $dsn = 'mysql:host=' . DB_HOST . ';dbname=' . DB_NAME . ';charset=' . DB_CHARSET;
    try {
        $pdo = new PDO($dsn, DB_USER, DB_PASS, [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            PDO::ATTR_EMULATE_PREPARES => false,
        ]);
        return $pdo;
    } catch (PDOException $e) {
        error_log('ARGO MOSAIC database connection error: ' . $e->getMessage());
        http_response_code(500);
        echo json_encode(['success' => false, 'message' => 'Database connection failed.']);
        exit;
    }
}

function getJsonInput(): array {
    $raw = file_get_contents('php://input');
    $decoded = json_decode($raw ?: '', true);
    return is_array($decoded) ? $decoded : [];
}
