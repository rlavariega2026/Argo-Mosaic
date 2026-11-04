<?php
/**
 * ARGO MOSAIC - Hostinger Database & Environment Configuration
 * 
 * Update these settings with your Hostinger hPanel MySQL credentials.
 */

// Enable error reporting for development, disable in strict live production
error_reporting(E_ALL);
ini_set('display_errors', '0');

// Database Credentials (Update with your Hostinger MySQL Database details)
define('DB_HOST', 'localhost');
define('DB_NAME', 'u123456789_argo_db');      // e.g. u123456789_argodb
define('DB_USER', 'u123456789_argo_user');    // e.g. u123456789_argouser
define('DB_PASS', 'YourStrongPassword2026!'); // Your database password
define('DB_CHARSET', 'utf8mb4');

// Default Admin Credentials
define('ADMIN_DEFAULT_USER', 'admin');
define('ADMIN_DEFAULT_PASS', 'argo2026!');

// CORS Headers
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, PATCH, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');
header('Content-Type: application/json; charset=UTF-8');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

/**
 * Returns PDO Database connection
 */
function getDbConnection() {
    static $pdo = null;
    if ($pdo === null) {
        $dsn = "mysql:host=" . DB_HOST . ";dbname=" . DB_NAME . ";charset=" . DB_CHARSET;
        $options = [
            PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            PDO::ATTR_EMULATE_PREPARES   => false,
        ];
        try {
            $pdo = new PDO($dsn, DB_USER, DB_PASS, $options);
        } catch (\PDOException $e) {
            http_response_code(500);
            echo json_encode([
                'success' => false,
                'message' => 'Database connection failed: ' . $e->getMessage()
            ]);
            exit();
        }
    }
    return $pdo;
}

/**
 * Get request JSON payload
 */
function getJsonInput() {
    $raw = file_get_contents('php://input');
    return json_decode($raw, true) ?? [];
}
