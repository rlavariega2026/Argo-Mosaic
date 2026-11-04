<?php
require_once __DIR__ . '/config.php';

$pdo = getDbConnection();
$method = $_SERVER['REQUEST_METHOD'];
$id = $_GET['id'] ?? null;

switch ($method) {
    case 'GET':
        if ($id) {
            $stmt = $pdo->prepare("SELECT * FROM argo_orders WHERE id = :id OR order_number = :id LIMIT 1");
            $stmt->execute([':id' => $id]);
            $order = $stmt->fetch();
            if ($order) {
                $order['items'] = json_decode($order['items_json'] ?? '[]', true);
                $order['paymentDetails'] = json_decode($order['payment_details'] ?? 'null', true);
                echo json_encode(['success' => true, 'order' => $order]);
            } else {
                http_response_code(404);
                echo json_encode(['success' => false, 'message' => 'Order not found']);
            }
        } else {
            $stmt = $pdo->query("SELECT * FROM argo_orders ORDER BY created_at DESC");
            $orders = $stmt->fetchAll();
            $orders = array_map(function($o) {
                $o['items'] = json_decode($o['items_json'] ?? '[]', true);
                $o['paymentDetails'] = json_decode($o['payment_details'] ?? 'null', true);
                return $o;
            }, $orders);
            echo json_encode(['success' => true, 'orders' => $orders]);
        }
        break;

    case 'POST':
        $data = getJsonInput();
        $items = $data['items'] ?? [];
        $orderId = 'ord-' . time() . '-' . rand(100, 999);
        $orderNum = 'ARGO-' . date('Y') . '-' . rand(10000, 99999);

        // Calculate verified subtotal on server
        $subtotal = 0;
        foreach ($items as &$item) {
            $pStmt = $pdo->prepare("SELECT price, price_per_box, price_per_sqft FROM argo_products WHERE id = :pid LIMIT 1");
            $pStmt->execute([':pid' => $item['productId']]);
            $p = $pStmt->fetch();
            $unitPrice = $p ? (($item['unitType'] ?? 'box') === 'sqft' ? ($p['price_per_sqft'] ?: $p['price']) : ($p['price_per_box'] ?: $p['price'])) : floatval($item['unitPrice']);
            $itemTotal = round($unitPrice * intval($item['quantity']), 2);
            $subtotal += $itemTotal;
            $item['unitPrice'] = $unitPrice;
            $item['total'] = $itemTotal;
        }

        $deliveryMethod = $data['deliveryMethod'] ?? 'warehouse_pickup';
        $shippingCost = ($deliveryMethod === 'freight_delivery') ? 180.00 : 0.00;
        $salesTax = round($subtotal * 0.0825, 2); // 8.25% TX Tax
        $total = round($subtotal + $shippingCost + $salesTax, 2);

        $stmt = $pdo->prepare("INSERT INTO argo_orders 
            (id, order_number, customer_name, company_name, email, phone, delivery_address, city, state, zip_code, delivery_method, subtotal, shipping_cost, sales_tax, total, payment_status, order_status, payment_details, notes, items_json)
            VALUES (:id, :num, :cname, :comp, :em, :ph, :addr, :city, :st, :zip, :dm, :sub, :ship, :tax, :tot, :pstatus, :ostatus, :pdet, :notes, :items)");

        $customer = $data['customer'] ?? [];
        $stmt->execute([
            ':id' => $orderId,
            ':num' => $orderNum,
            ':cname' => trim(($customer['firstName'] ?? '') . ' ' . ($customer['lastName'] ?? '')),
            ':comp' => $customer['companyName'] ?? '',
            ':em' => $customer['email'] ?? '',
            ':ph' => $customer['phone'] ?? '',
            ':addr' => $customer['deliveryAddress'] ?? '',
            ':city' => $customer['city'] ?? '',
            ':st' => $customer['state'] ?? '',
            ':zip' => $customer['zipCode'] ?? '',
            ':dm' => $deliveryMethod,
            ':sub' => $subtotal,
            ':ship' => $shippingCost,
            ':tax' => $salesTax,
            ':tot' => $total,
            ':pstatus' => $data['paymentStatus'] ?? 'Pending',
            ':ostatus' => 'Received',
            ':pdet' => json_encode($data['paymentDetails'] ?? null),
            ':notes' => $data['notes'] ?? '',
            ':items' => json_encode($items)
        ]);

        http_response_code(201);
        echo json_encode([
            'success' => true,
            'order' => [
                'id' => $orderId,
                'orderNumber' => $orderNum,
                'total' => $total,
                'subtotal' => $subtotal
            ]
        ]);
        break;

    case 'PATCH':
    case 'PUT':
        if (!$id) {
            http_response_code(400);
            echo json_encode(['success' => false, 'message' => 'Missing ID']);
            exit();
        }
        $data = getJsonInput();
        if (isset($data['orderStatus'])) {
            $stmt = $pdo->prepare("UPDATE argo_orders SET order_status = :st WHERE id = :id OR order_number = :id");
            $stmt->execute([':st' => $data['orderStatus'], ':id' => $id]);
        }
        if (isset($data['paymentStatus'])) {
            $stmt = $pdo->prepare("UPDATE argo_orders SET payment_status = :st WHERE id = :id OR order_number = :id");
            $stmt->execute([':st' => $data['paymentStatus'], ':id' => $id]);
        }
        echo json_encode(['success' => true]);
        break;

    default:
        http_response_code(405);
        echo json_encode(['message' => 'Method Not Allowed']);
}
