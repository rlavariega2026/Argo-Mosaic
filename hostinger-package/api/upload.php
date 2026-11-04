<?php
require_once __DIR__ . '/config.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['message' => 'Method Not Allowed']);
    exit();
}

if (!isset($_FILES['file']) || $_FILES['file']['error'] !== UPLOAD_ERR_OK) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'No file uploaded or upload error code: ' . ($_FILES['file']['error'] ?? 'missing')]);
    exit();
}

$file = $_FILES['file'];
$uploadDir = __DIR__ . '/../uploads/';
if (!is_dir($uploadDir)) {
    mkdir($uploadDir, 0755, true);
}

$allowedExtensions = ['jpg', 'jpeg', 'png', 'webp', 'avif', 'svg', 'pdf'];
$ext = strtolower(pathinfo($file['name'], PATHINFO_EXTENSION));

if (!in_array($ext, $allowedExtensions)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Formato no permitido. Solo imágenes JPG, PNG, WEBP, AVIF, SVG y documentos PDF.']);
    exit();
}

// Check max 25MB
if ($file['size'] > 25 * 1024 * 1024) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'El archivo supera el límite de 25MB.']);
    exit();
}

$safeBase = preg_replace('/[^a-zA-Z0-9_-]/', '_', pathinfo($file['name'], PATHINFO_FILENAME));
$filename = $safeBase . '_' . time() . '_' . rand(1000, 9999) . '.' . $ext;
$targetPath = $uploadDir . $filename;

if (move_uploaded_file($file['tmp_name'], $targetPath)) {
    echo json_encode([
        'success' => true,
        'fileUrl' => '/uploads/' . $filename,
        'filename' => $filename,
        'size' => $file['size']
    ]);
} else {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Error al guardar el archivo en el servidor.']);
}
