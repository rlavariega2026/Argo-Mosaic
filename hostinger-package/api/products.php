<?php
require_once __DIR__ . '/config.php';

$pdo = getDbConnection();
$method = $_SERVER['REQUEST_METHOD'];
$id = $_GET['id'] ?? null;

switch ($method) {
    case 'GET':
        if ($id) {
            $stmt = $pdo->prepare("SELECT * FROM argo_products WHERE id = :id OR sku = :id LIMIT 1");
            $stmt->execute([':id' => $id]);
            $product = $stmt->fetch();
            if (!$product) {
                http_response_code(404);
                echo json_encode(['success' => false, 'message' => 'Product not found']);
                exit();
            }
            // Decode JSON columns
            $product['specs'] = json_decode($product['specs_json'] ?? '{}', true);
            $product['packaging'] = json_decode($product['packaging_json'] ?? '{}', true);
            $product['documents'] = json_decode($product['documents_json'] ?? '{}', true);
            
            // Fetch gallery
            $gStmt = $pdo->prepare("SELECT * FROM argo_product_gallery WHERE product_id = :pid ORDER BY display_order ASC");
            $gStmt->execute([':pid' => $product['id']]);
            $product['gallery'] = $gStmt->fetchAll();

            echo json_encode(['success' => true, 'product' => $product]);
        } else {
            $category = $_GET['category'] ?? null;
            $status = $_GET['status'] ?? null;
            $search = $_GET['search'] ?? null;

            $query = "SELECT * FROM argo_products WHERE 1=1";
            $params = [];

            if ($category && $category !== 'all') {
                $query .= " AND category = :cat";
                $params[':cat'] = $category;
            }
            if ($status) {
                $query .= " AND status = :st";
                $params[':st'] = $status;
            }
            if ($search) {
                $query .= " AND (name_en LIKE :s OR name_es LIKE :s OR model LIKE :s OR sku LIKE :s)";
                $params[':s'] = "%$search%";
            }

            $query .= " ORDER BY created_at DESC";
            $stmt = $pdo->prepare($query);
            $stmt->execute($params);
            $rows = $stmt->fetchAll();

            $products = array_map(function($p) use ($pdo) {
                $p['specs'] = json_decode($p['specs_json'] ?? '{}', true);
                $p['packaging'] = json_decode($p['packaging_json'] ?? '{}', true);
                $p['documents'] = json_decode($p['documents_json'] ?? '{}', true);

                $gStmt = $pdo->prepare("SELECT * FROM argo_product_gallery WHERE product_id = :pid ORDER BY display_order ASC");
                $gStmt->execute([':pid' => $p['id']]);
                $p['gallery'] = $gStmt->fetchAll();
                return $p;
            }, $rows);

            echo json_encode(['success' => true, 'products' => $products]);
        }
        break;

    case 'POST':
        $data = getJsonInput();
        $newId = $data['id'] ?? ('prod-' . time() . '-' . substr(md5(uniqid()), 0, 4));

        $stmt = $pdo->prepare("INSERT INTO argo_products 
            (id, name_en, name_es, model, category, brand, description_en, description_es, size, product_type, availability, price, price_per_box, price_per_sqft, sku, badge, status, stock, youtube_video_url, primary_image, ambient_image, gallery_style, specs_json, packaging_json, documents_json) 
            VALUES (:id, :name_en, :name_es, :model, :category, :brand, :description_en, :description_es, :size, :product_type, :availability, :price, :price_per_box, :price_per_sqft, :sku, :badge, :status, :stock, :youtube_video_url, :primary_image, :ambient_image, :gallery_style, :specs_json, :packaging_json, :documents_json)");

        $stmt->execute([
            ':id' => $newId,
            ':name_en' => $data['nameEn'] ?? 'New Surface',
            ':name_es' => $data['nameEs'] ?? 'Nueva Superficie',
            ':model' => $data['model'] ?? '',
            ':category' => $data['category'] ?? 'LVP',
            ':brand' => $data['brand'] ?? 'ARGO MOSAIC',
            ':description_en' => $data['descriptionEn'] ?? '',
            ':description_es' => $data['descriptionEs'] ?? '',
            ':size' => $data['size'] ?? '',
            ':product_type' => $data['productType'] ?? '',
            ':availability' => $data['availability'] ?? 'In Stock',
            ':price' => $data['price'] ?? 0.00,
            ':price_per_box' => $data['pricePerBox'] ?? 0.00,
            ':price_per_sqft' => $data['pricePerSqFt'] ?? 0.00,
            ':sku' => $data['sku'] ?? ('AM-' . strtoupper(substr(md5(uniqid()), 0, 6))),
            ':badge' => $data['badge'] ?? 'none',
            ':status' => $data['status'] ?? 'published',
            ':stock' => $data['stock'] ?? 0,
            ':youtube_video_url' => $data['youtubeVideoUrl'] ?? '',
            ':primary_image' => $data['primaryImage'] ?? '',
            ':ambient_image' => $data['ambientImage'] ?? '',
            ':gallery_style' => $data['galleryStyle'] ?? 'editorial',
            ':specs_json' => json_encode($data['specs'] ?? []),
            ':packaging_json' => json_encode($data['packaging'] ?? []),
            ':documents_json' => json_encode($data['documents'] ?? [])
        ]);

        // Insert gallery
        if (!empty($data['gallery']) && is_array($data['gallery'])) {
            $gIns = $pdo->prepare("INSERT INTO argo_product_gallery (id, product_id, url, title, type, display_order) VALUES (:id, :pid, :url, :title, :type, :ord)");
            foreach ($data['gallery'] as $idx => $g) {
                $gIns->execute([
                    ':id' => $g['id'] ?? ('img-' . time() . '-' . $idx),
                    ':pid' => $newId,
                    ':url' => $g['url'] ?? '',
                    ':title' => $g['title'] ?? '',
                    ':type' => $g['type'] ?? 'gallery',
                    ':ord' => $idx
                ]);
            }
        }

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

        $stmt = $pdo->prepare("UPDATE argo_products SET
            name_en = :name_en, name_es = :name_es, model = :model, category = :category, brand = :brand,
            description_en = :description_en, description_es = :description_es, size = :size,
            product_type = :product_type, availability = :availability, price = :price,
            price_per_box = :price_per_box, price_per_sqft = :price_per_sqft, sku = :sku,
            badge = :badge, status = :status, stock = :stock, youtube_video_url = :youtube_video_url,
            primary_image = :primary_image, ambient_image = :ambient_image, gallery_style = :gallery_style,
            specs_json = :specs_json, packaging_json = :packaging_json, documents_json = :documents_json
            WHERE id = :id");

        $stmt->execute([
            ':id' => $id,
            ':name_en' => $data['nameEn'] ?? '',
            ':name_es' => $data['nameEs'] ?? '',
            ':model' => $data['model'] ?? '',
            ':category' => $data['category'] ?? 'LVP',
            ':brand' => $data['brand'] ?? 'ARGO MOSAIC',
            ':description_en' => $data['descriptionEn'] ?? '',
            ':description_es' => $data['descriptionEs'] ?? '',
            ':size' => $data['size'] ?? '',
            ':product_type' => $data['productType'] ?? '',
            ':availability' => $data['availability'] ?? 'In Stock',
            ':price' => $data['price'] ?? 0.00,
            ':price_per_box' => $data['pricePerBox'] ?? 0.00,
            ':price_per_sqft' => $data['pricePerSqFt'] ?? 0.00,
            ':sku' => $data['sku'] ?? '',
            ':badge' => $data['badge'] ?? 'none',
            ':status' => $data['status'] ?? 'published',
            ':stock' => $data['stock'] ?? 0,
            ':youtube_video_url' => $data['youtubeVideoUrl'] ?? '',
            ':primary_image' => $data['primaryImage'] ?? '',
            ':ambient_image' => $data['ambientImage'] ?? '',
            ':gallery_style' => $data['galleryStyle'] ?? 'editorial',
            ':specs_json' => json_encode($data['specs'] ?? []),
            ':packaging_json' => json_encode($data['packaging'] ?? []),
            ':documents_json' => json_encode($data['documents'] ?? [])
        ]);

        // Re-sync gallery
        if (isset($data['gallery']) && is_array($data['gallery'])) {
            $pdo->prepare("DELETE FROM argo_product_gallery WHERE product_id = :pid")->execute([':pid' => $id]);
            $gIns = $pdo->prepare("INSERT INTO argo_product_gallery (id, product_id, url, title, type, display_order) VALUES (:id, :pid, :url, :title, :type, :ord)");
            foreach ($data['gallery'] as $idx => $g) {
                $gIns->execute([
                    ':id' => $g['id'] ?? ('img-' . time() . '-' . $idx),
                    ':pid' => $id,
                    ':url' => $g['url'] ?? '',
                    ':title' => $g['title'] ?? '',
                    ':type' => $g['type'] ?? 'gallery',
                    ':ord' => $idx
                ]);
            }
        }

        echo json_encode(['success' => true, 'id' => $id]);
        break;

    case 'DELETE':
        if (!$id) {
            http_response_code(400);
            echo json_encode(['success' => false, 'message' => 'Missing ID']);
            exit();
        }
        $stmt = $pdo->prepare("DELETE FROM argo_products WHERE id = :id");
        $stmt->execute([':id' => $id]);
        echo json_encode(['success' => true]);
        break;

    default:
        http_response_code(405);
        echo json_encode(['message' => 'Method Not Allowed']);
}
