<?php
require_once __DIR__ . '/config.php';

$pdo = getDbConnection();
$method = $_SERVER['REQUEST_METHOD'];
$id = $_GET['id'] ?? null;

switch ($method) {
    case 'GET':
        $stmt = $pdo->query("SELECT * FROM argo_quotes ORDER BY created_at DESC");
        $quotes = $stmt->fetchAll();
        $quotes = array_map(function($q) {
            $q['productsRequested'] = json_decode($q['products_requested'] ?? '[]', true);
            return $q;
        }, $quotes);
        echo json_encode(['success' => true, 'quotes' => $quotes]);
        break;

    case 'POST':
        $data = getJsonInput();
        $qid = 'qt-' . time() . '-' . rand(100, 999);
        $qnum = 'QT-' . date('Y') . '-' . rand(1000, 9999);

        $stmt = $pdo->prepare("INSERT INTO argo_quotes 
            (id, quote_number, customer_name, company_name, email, phone, project_type, delivery_city, delivery_state, estimated_sqft, products_requested, status, notes)
            VALUES (:id, :num, :cname, :comp, :em, :ph, :ptype, :city, :st, :sqft, :prods, :status, :notes)");

        $stmt->execute([
            ':id' => $qid,
            ':num' => $qnum,
            ':cname' => $data['customerName'] ?? '',
            ':comp' => $data['companyName'] ?? '',
            ':em' => $data['email'] ?? '',
            ':ph' => $data['phone'] ?? '',
            ':ptype' => $data['projectType'] ?? '',
            ':city' => $data['deliveryCity'] ?? '',
            ':st' => $data['deliveryState'] ?? '',
            ':sqft' => floatval($data['estimatedSqFt'] ?? 0),
            ':prods' => json_encode($data['productsRequested'] ?? []),
            ':status' => 'Pending',
            ':notes' => $data['notes'] ?? ''
        ]);

        http_response_code(201);
        echo json_encode(['success' => true, 'quote' => ['id' => $qid, 'quoteNumber' => $qnum]]);
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
            $stmt = $pdo->prepare("UPDATE argo_quotes SET status = :st WHERE id = :id OR quote_number = :id");
            $stmt->execute([':st' => $data['status'], ':id' => $id]);
        }
        echo json_encode(['success' => true]);
        break;

    default:
        http_response_code(405);
        echo json_encode(['message' => 'Method Not Allowed']);
}
