<?php
require_once __DIR__ . '/config.php';

$pdo = getDbConnection();
$method = $_SERVER['REQUEST_METHOD'];
$id = $_GET['id'] ?? null;

switch ($method) {
    case 'GET':
        $stmt = $pdo->query("SELECT * FROM argo_samples ORDER BY created_at DESC");
        $samples = $stmt->fetchAll();
        echo json_encode(['success' => true, 'samples' => $samples]);
        break;

    case 'POST':
        $data = getJsonInput();
        $sid = 'smp-' . time() . '-' . rand(100, 999);
        $snum = 'SMP-' . date('Y') . '-' . rand(100, 999);

        $stmt = $pdo->prepare("INSERT INTO argo_samples 
            (id, sample_number, product_id, product_name, full_name, company, email, phone, shipping_address, city, state, zip_code, status)
            VALUES (:id, :num, :pid, :pname, :fname, :comp, :em, :ph, :addr, :city, :st, :zip, :stt)");

        $stmt->execute([
            ':id' => $sid,
            ':num' => $snum,
            ':pid' => $data['productId'] ?? '',
            ':pname' => $data['productName'] ?? '',
            ':fname' => $data['fullName'] ?? '',
            ':comp' => $data['company'] ?? '',
            ':em' => $data['email'] ?? '',
            ':ph' => $data['phone'] ?? '',
            ':addr' => $data['shippingAddress'] ?? '',
            ':city' => $data['city'] ?? '',
            ':st' => $data['state'] ?? '',
            ':zip' => $data['zipCode'] ?? '',
            ':stt' => 'Requested'
        ]);

        http_response_code(201);
        echo json_encode(['success' => true, 'sample' => ['id' => $sid, 'sampleNumber' => $snum]]);
        break;

    case 'PATCH':
    case 'PUT':
        if (!$id) {
            http_response_code(400);
            echo json_encode(['success' => false, 'message' => 'Missing ID']);
            exit();
        }
        $data = getJsonInput();
        if (isset($data['status'])) {
            $stmt = $pdo->prepare("UPDATE argo_samples SET status = :st WHERE id = :id OR sample_number = :id");
            $stmt->execute([':st' => $data['status'], ':id' => $id]);
        }
        echo json_encode(['success' => true]);
        break;

    default:
        http_response_code(405);
        echo json_encode(['message' => 'Method Not Allowed']);
}
