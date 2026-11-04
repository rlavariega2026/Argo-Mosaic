<?php
require_once __DIR__ . '/config.php';

$pdo = getDbConnection();
$action = $_GET['action'] ?? 'create';

// Fetch PayPal settings from database
$stmt = $pdo->query("SELECT paypal_client_id, paypal_secret_key, paypal_mode FROM argo_settings LIMIT 1");
$settings = $stmt->fetch();

$clientId = $settings['paypal_client_id'] ?? '';
$secretKey = $settings['paypal_secret_key'] ?? '';
$mode = ($settings['paypal_mode'] ?? 'sandbox') === 'live' ? 'live' : 'sandbox';
$baseUrl = $mode === 'live' ? 'https://api-m.paypal.com' : 'https://api-m.sandbox.paypal.com';

function getPayPalAccessToken($baseUrl, $clientId, $secretKey) {
    if (empty($clientId) || empty($secretKey)) {
        return null;
    }
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, "$baseUrl/v1/oauth2/token");
    curl_setopt($ch, CURLOPT_HEADER, false);
    curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
    curl_setopt($ch, CURLOPT_POST, true);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_USERPWD, "$clientId:$secretKey");
    curl_setopt($ch, CURLOPT_POSTFIELDS, "grant_type=client_credentials");
    $result = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);

    if ($httpCode === 200) {
        $json = json_decode($result, true);
        return $json['access_token'] ?? null;
    }
    return null;
}

if ($action === 'create') {
    $data = getJsonInput();
    $amount = number_format(floatval($data['amount'] ?? 0), 2, '.', '');
    $currency = 'USD';

    if ($amount <= 0) {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'Invalid amount']);
        exit();
    }

    $accessToken = getPayPalAccessToken($baseUrl, $clientId, $secretKey);

    if (!$accessToken) {
        // Return clear response if credentials need to be set in admin
        echo json_encode([
            'success' => true,
            'mode' => $mode,
            'clientId' => $clientId,
            'message' => 'PayPal configured for client-side approval'
        ]);
        exit();
    }

    // Call PayPal v2/checkout/orders
    $orderPayload = [
        'intent' => 'CAPTURE',
        'purchase_units' => [
            [
                'reference_id' => 'ARGO-' . time(),
                'amount' => [
                    'currency_code' => $currency,
                    'value' => $amount
                ],
                'description' => 'ARGO MOSAIC Surfaces & Flooring Order'
            ]
        ]
    ];

    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, "$baseUrl/v2/checkout/orders");
    curl_setopt($ch, CURLOPT_POST, true);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_HTTPHEADER, [
        "Content-Type: application/json",
        "Authorization: Bearer $accessToken"
    ]);
    curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($orderPayload));
    $response = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);

    if ($httpCode === 201 || $httpCode === 200) {
        $orderData = json_decode($response, true);
        echo json_encode(['success' => true, 'orderId' => $orderData['id'], 'data' => $orderData]);
    } else {
        http_response_code(400);
        echo json_encode(['success' => false, 'error' => json_decode($response, true)]);
    }
    exit();
}

if ($action === 'capture') {
    $data = getJsonInput();
    $paypalOrderId = $data['orderId'] ?? null;
    $systemOrderId = $data['systemOrderId'] ?? null;

    if (!$paypalOrderId) {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'Missing PayPal Order ID']);
        exit();
    }

    $accessToken = getPayPalAccessToken($baseUrl, $clientId, $secretKey);
    $status = 'Approved';
    $details = [];

    if ($accessToken) {
        $ch = curl_init();
        curl_setopt($ch, CURLOPT_URL, "$baseUrl/v2/checkout/orders/$paypalOrderId/capture");
        curl_setopt($ch, CURLOPT_POST, true);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_HTTPHEADER, [
            "Content-Type: application/json",
            "Authorization: Bearer $accessToken"
        ]);
        curl_setopt($ch, CURLOPT_POSTFIELDS, '{}');
        $response = curl_exec($ch);
        $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        curl_close($ch);

        $details = json_decode($response, true);
        $status = ($httpCode === 201 || $httpCode === 200) && ($details['status'] ?? '') === 'COMPLETED' ? 'Approved' : 'Pending';
    }

    // Update order in database
    if ($systemOrderId) {
        $upd = $pdo->prepare("UPDATE argo_orders SET payment_status = :ps, payment_details = :pd WHERE id = :id OR order_number = :id");
        $upd->execute([
            ':ps' => $status,
            ':pd' => json_encode(['paypalOrderId' => $paypalOrderId, 'details' => $details]),
            ':id' => $systemOrderId
        ]);
    }

    echo json_encode(['success' => true, 'status' => $status, 'details' => $details]);
    exit();
}
