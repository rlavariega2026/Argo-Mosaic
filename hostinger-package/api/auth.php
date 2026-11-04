<?php
require_once __DIR__ . '/config.php';

$pdo = getDbConnection();
$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'POST') {
    $data = getJsonInput();
    $username = trim($data['username'] ?? '');
    $password = trim($data['password'] ?? '');

    // Check DB first
    $stmt = $pdo->prepare("SELECT * FROM argo_admins WHERE username = :u LIMIT 1");
    $stmt->execute([':u' => $username]);
    $admin = $stmt->fetch();

    $valid = false;
    if ($admin) {
        if ($admin['password_hash'] === $password || password_verify($password, $admin['password_hash'])) {
            $valid = true;
        }
    } else if ($username === ADMIN_DEFAULT_USER && $password === ADMIN_DEFAULT_PASS) {
        $valid = true;
    }

    if ($valid) {
        echo json_encode([
            'success' => true,
            'token' => 'argo-auth-' . bin2hex(random_bytes(16)),
            'user' => ['username' => $username, 'role' => 'administrator']
        ]);
    } else {
        http_response_code(401);
        echo json_encode(['success' => false, 'message' => 'Usuario o contraseña incorrectos. / Invalid credentials.']);
    }
    exit();
}

http_response_code(405);
echo json_encode(['message' => 'Method Not Allowed']);
