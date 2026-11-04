<?php
require_once __DIR__ . '/config.php';

$pdo = getDbConnection();
$method = $_SERVER['REQUEST_METHOD'];
$id = $_GET['id'] ?? null;

switch ($method) {
    case 'GET':
        $stmt = $pdo->query("SELECT * FROM argo_sales_reps ORDER BY name ASC");
        $reps = $stmt->fetchAll();
        $reps = array_map(function($r) {
            $r['assignedCategories'] = json_decode($r['assigned_categories'] ?? '[]', true);
            $r['photoUrl'] = $r['photo_url'];
            return $r;
        }, $reps);
        echo json_encode(['success' => true, 'salesReps' => $reps]);
        break;

    case 'POST':
        $data = getJsonInput();
        $newId = $data['id'] ?? ('rep-' . time());
        $stmt = $pdo->prepare("INSERT INTO argo_sales_reps 
            (id, name, title, photo_url, phone, whatsapp, email, languages, assigned_categories)
            VALUES (:id, :name, :title, :photo, :phone, :wa, :em, :lang, :cats)");
        $stmt->execute([
            ':id' => $newId,
            ':name' => $data['name'] ?? '',
            ':title' => $data['title'] ?? '',
            ':photo' => $data['photoUrl'] ?? '',
            ':phone' => $data['phone'] ?? '',
            ':wa' => $data['whatsapp'] ?? '',
            ':em' => $data['email'] ?? '',
            ':lang' => $data['languages'] ?? 'English / Español',
            ':cats' => json_encode($data['assignedCategories'] ?? [])
        ]);
        http_response_code(201);
        echo json_encode(['success' => true, 'id' => $newId]);
        break;

    case 'PUT':
        if (!$id) {
            http_response_code(400);
            echo json_encode(['success' => false, 'message' => 'Missing ID']);
            exit();
        }
        $data = getJsonInput();
        $stmt = $pdo->prepare("UPDATE argo_sales_reps SET
            name = :name, title = :title, photo_url = :photo, phone = :phone, whatsapp = :wa,
            email = :em, languages = :lang, assigned_categories = :cats WHERE id = :id");
        $stmt->execute([
            ':id' => $id,
            ':name' => $data['name'] ?? '',
            ':title' => $data['title'] ?? '',
            ':photo' => $data['photoUrl'] ?? '',
            ':phone' => $data['phone'] ?? '',
            ':wa' => $data['whatsapp'] ?? '',
            ':em' => $data['email'] ?? '',
            ':lang' => $data['languages'] ?? 'English / Español',
            ':cats' => json_encode($data['assignedCategories'] ?? [])
        ]);
        echo json_encode(['success' => true, 'id' => $id]);
        break;

    case 'DELETE':
        if (!$id) {
            http_response_code(400);
            echo json_encode(['success' => false, 'message' => 'Missing ID']);
            exit();
        }
        $stmt = $pdo->prepare("DELETE FROM argo_sales_reps WHERE id = :id");
        $stmt->execute([':id' => $id]);
        echo json_encode(['success' => true]);
        break;

    default:
        http_response_code(405);
        echo json_encode(['message' => 'Method Not Allowed']);
}
