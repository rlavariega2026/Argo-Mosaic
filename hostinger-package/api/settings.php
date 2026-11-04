<?php
require_once __DIR__ . '/config.php';

$pdo = getDbConnection();
$method = $_SERVER['REQUEST_METHOD'];

switch ($method) {
    case 'GET':
        $stmt = $pdo->query("SELECT * FROM argo_settings LIMIT 1");
        $settings = $stmt->fetch();
        if (!$settings) {
            // Default settings if empty
            $settings = [
                'companyName' => 'ARGO MOSAIC',
                'logoUrl' => '/Argo-Mosaic/assets/aistudio/Argo_Mosaic_Logo_Transparente_0aa6f2ad.png',
                'descriptionEn' => 'Leading importer and commercial distributor of premier architectural porcelain, tile, and luxury vinyl surfaces in Texas and the United States.',
                'descriptionEs' => 'Líder en importación y distribución comercial de porcelanatos arquitectónicos, duela vinílica y pisos de lujo en Texas y Estados Unidos.',
                'phone' => '+1 (214) 790-2840',
                'whatsapp' => '12147902840',
                'email' => 'contact@argomosaic.com',
                'website' => 'https://argomosaic.com',
                'warehouseAddress' => '11820 Regal Row, Suite 100',
                'city' => 'Dallas',
                'state' => 'Texas',
                'zipCode' => '75247',
                'businessHours' => 'Monday - Friday: 7:30 AM - 5:00 PM CST | Saturday: 8:00 AM - 1:00 PM CST',
                'googleMapsEmbedUrl' => 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d107297.86469614274!2d-96.88371363618635!3d32.81723145455639!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x864e995574577ee3%3A0x6e9f191b72e49c71!2sDallas%2C%20TX!5e0!3m2!1sen!2sus!4v1700000000000!5m2!1sen!2sus',
                'paypalClientId' => '',
                'paypalSecretKey' => '',
                'paypalMode' => 'sandbox',
                'lowStockThreshold' => 50,
                'homeHeroTitleEn' => 'Architectural Surfaces Engineered for Distinction',
                'homeHeroTitleEs' => 'Superficies Arquitectónicas Diseñadas para la Distinción',
                'homeHeroSubtitleEn' => 'Direct importer of premium LVP, wood surfaces, matte collections, and high-gloss porcelain across Texas and nationwide.',
                'homeHeroSubtitleEs' => 'Importador directo de pisos LVP, superficies de madera, colecciones mate y porcelanatos pulidos en Texas y todo EE. UU.',
                'homeHeroImage' => 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1920&q=85'
            ];
        } else {
            // Map snake_case to camelCase
            $settings = [
                'companyName' => $settings['company_name'],
                'logoUrl' => $settings['logo_url'],
                'descriptionEn' => $settings['description_en'],
                'descriptionEs' => $settings['description_es'],
                'phone' => $settings['phone'],
                'whatsapp' => $settings['whatsapp'],
                'email' => $settings['email'],
                'website' => $settings['website'],
                'warehouseAddress' => $settings['warehouse_address'],
                'city' => $settings['city'],
                'state' => $settings['state'],
                'zipCode' => $settings['zip_code'],
                'businessHours' => $settings['business_hours'],
                'googleMapsEmbedUrl' => $settings['google_maps_embed_url'],
                'paypalClientId' => $settings['paypal_client_id'],
                'paypalSecretKey' => $settings['paypal_secret_key'],
                'paypalMode' => $settings['paypal_mode'],
                'lowStockThreshold' => intval($settings['low_stock_threshold']),
                'homeHeroTitleEn' => $settings['home_hero_title_en'],
                'homeHeroTitleEs' => $settings['home_hero_title_es'],
                'homeHeroSubtitleEn' => $settings['home_hero_subtitle_en'],
                'homeHeroSubtitleEs' => $settings['home_hero_subtitle_es'],
                'homeHeroImage' => $settings['home_hero_image']
            ];
        }
        echo json_encode(['success' => true, 'settings' => $settings]);
        break;

    case 'PUT':
    case 'POST':
        $data = getJsonInput();
        $check = $pdo->query("SELECT id FROM argo_settings LIMIT 1")->fetch();

        if ($check) {
            $stmt = $pdo->prepare("UPDATE argo_settings SET 
                company_name = :cname, logo_url = :logo, description_en = :den, description_es = :des,
                phone = :ph, whatsapp = :wa, email = :em, website = :web, warehouse_address = :addr,
                city = :city, state = :st, zip_code = :zip, business_hours = :hrs, google_maps_embed_url = :gmap,
                paypal_client_id = :ppcid, paypal_secret_key = :ppsec, paypal_mode = :ppmode,
                low_stock_threshold = :lst, home_hero_title_en = :hten, home_hero_title_es = :htes,
                home_hero_subtitle_en = :hsuben, home_hero_subtitle_es = :hsubes, home_hero_image = :himg
                WHERE id = :id");
            $params = [
                ':id' => $check['id'],
                ':cname' => $data['companyName'] ?? 'ARGO MOSAIC',
                ':logo' => $data['logoUrl'] ?? '',
                ':den' => $data['descriptionEn'] ?? '',
                ':des' => $data['descriptionEs'] ?? '',
                ':ph' => $data['phone'] ?? '',
                ':wa' => $data['whatsapp'] ?? '',
                ':em' => $data['email'] ?? '',
                ':web' => $data['website'] ?? '',
                ':addr' => $data['warehouseAddress'] ?? '',
                ':city' => $data['city'] ?? '',
                ':st' => $data['state'] ?? '',
                ':zip' => $data['zipCode'] ?? '',
                ':hrs' => $data['businessHours'] ?? '',
                ':gmap' => $data['googleMapsEmbedUrl'] ?? '',
                ':ppcid' => $data['paypalClientId'] ?? '',
                ':ppsec' => $data['paypalSecretKey'] ?? '',
                ':ppmode' => $data['paypalMode'] ?? 'sandbox',
                ':lst' => intval($data['lowStockThreshold'] ?? 50),
                ':hten' => $data['homeHeroTitleEn'] ?? '',
                ':htes' => $data['homeHeroTitleEs'] ?? '',
                ':hsuben' => $data['homeHeroSubtitleEn'] ?? '',
                ':hsubes' => $data['homeHeroSubtitleEs'] ?? '',
                ':himg' => $data['homeHeroImage'] ?? ''
            ];
            $stmt->execute($params);
        } else {
            $stmt = $pdo->prepare("INSERT INTO argo_settings 
                (company_name, logo_url, description_en, description_es, phone, whatsapp, email, website, warehouse_address, city, state, zip_code, business_hours, google_maps_embed_url, paypal_client_id, paypal_secret_key, paypal_mode, low_stock_threshold, home_hero_title_en, home_hero_title_es, home_hero_subtitle_en, home_hero_subtitle_es, home_hero_image)
                VALUES (:cname, :logo, :den, :des, :ph, :wa, :em, :web, :addr, :city, :st, :zip, :hrs, :gmap, :ppcid, :ppsec, :ppmode, :lst, :hten, :htes, :hsuben, :hsubes, :himg)");
            $stmt->execute([
                ':cname' => $data['companyName'] ?? 'ARGO MOSAIC',
                ':logo' => $data['logoUrl'] ?? '',
                ':den' => $data['descriptionEn'] ?? '',
                ':des' => $data['descriptionEs'] ?? '',
                ':ph' => $data['phone'] ?? '',
                ':wa' => $data['whatsapp'] ?? '',
                ':em' => $data['email'] ?? '',
                ':web' => $data['website'] ?? '',
                ':addr' => $data['warehouseAddress'] ?? '',
                ':city' => $data['city'] ?? '',
                ':st' => $data['state'] ?? '',
                ':zip' => $data['zipCode'] ?? '',
                ':hrs' => $data['businessHours'] ?? '',
                ':gmap' => $data['googleMapsEmbedUrl'] ?? '',
                ':ppcid' => $data['paypalClientId'] ?? '',
                ':ppsec' => $data['paypalSecretKey'] ?? '',
                ':ppmode' => $data['paypalMode'] ?? 'sandbox',
                ':lst' => intval($data['lowStockThreshold'] ?? 50),
                ':hten' => $data['homeHeroTitleEn'] ?? '',
                ':htes' => $data['homeHeroTitleEs'] ?? '',
                ':hsuben' => $data['homeHeroSubtitleEn'] ?? '',
                ':hsubes' => $data['homeHeroSubtitleEs'] ?? '',
                ':himg' => $data['homeHeroImage'] ?? ''
            ]);
        }
        echo json_encode(['success' => true]);
        break;

    default:
        http_response_code(405);
        echo json_encode(['message' => 'Method Not Allowed']);
}
