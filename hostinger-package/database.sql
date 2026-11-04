-- ============================================================
-- ARGO MOSAIC - DATABASE SCHEMA (MYSQL 8.0+ / HOSTINGER COMPATIBLE)
-- ============================================================

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ------------------------------------------------------------
-- Table: settings
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `argo_settings` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `company_name` VARCHAR(150) NOT NULL DEFAULT 'ARGO MOSAIC',
  `logo_url` TEXT,
  `description_en` TEXT,
  `description_es` TEXT,
  `phone` VARCHAR(50),
  `whatsapp` VARCHAR(50),
  `email` VARCHAR(100),
  `website` VARCHAR(150),
  `warehouse_address` VARCHAR(255),
  `city` VARCHAR(100),
  `state` VARCHAR(50),
  `zip_code` VARCHAR(20),
  `business_hours` VARCHAR(255),
  `google_maps_embed_url` TEXT,
  `paypal_client_id` VARCHAR(255),
  `paypal_secret_key` VARCHAR(255),
  `paypal_mode` ENUM('sandbox', 'live') DEFAULT 'sandbox',
  `low_stock_threshold` INT DEFAULT 50,
  `home_hero_title_en` VARCHAR(255),
  `home_hero_title_es` VARCHAR(255),
  `home_hero_subtitle_en` TEXT,
  `home_hero_subtitle_es` TEXT,
  `home_hero_image` TEXT,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------
-- Table: admins
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `argo_admins` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `username` VARCHAR(50) NOT NULL UNIQUE,
  `password_hash` VARCHAR(255) NOT NULL,
  `email` VARCHAR(100),
  `role` VARCHAR(50) DEFAULT 'admin',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------
-- Table: products
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `argo_products` (
  `id` VARCHAR(64) PRIMARY KEY,
  `name_en` VARCHAR(255) NOT NULL,
  `name_es` VARCHAR(255) NOT NULL,
  `model` VARCHAR(100),
  `category` ENUM('LVP', 'Wooden', 'Matte Series', 'Polished') NOT NULL,
  `brand` VARCHAR(100) DEFAULT 'ARGO MOSAIC',
  `description_en` LONGTEXT,
  `description_es` LONGTEXT,
  `size` VARCHAR(100),
  `product_type` VARCHAR(150),
  `availability` VARCHAR(100) DEFAULT 'In Stock',
  `price` DECIMAL(10,2) DEFAULT 0.00,
  `price_per_box` DECIMAL(10,2) DEFAULT 0.00,
  `price_per_sqft` DECIMAL(10,2) DEFAULT 0.00,
  `sku` VARCHAR(100) UNIQUE,
  `badge` ENUM('New Arrival', 'Best Seller', 'Featured', 'none') DEFAULT 'none',
  `status` ENUM('published', 'draft', 'hidden') DEFAULT 'published',
  `stock` INT DEFAULT 0,
  `youtube_video_url` VARCHAR(255),
  `primary_image` TEXT,
  `ambient_image` TEXT,
  `gallery_style` VARCHAR(50) DEFAULT 'editorial',
  `specs_json` LONGTEXT,
  `packaging_json` LONGTEXT,
  `documents_json` LONGTEXT,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX `idx_category` (`category`),
  INDEX `idx_status` (`status`),
  INDEX `idx_sku` (`sku`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------
-- Table: product_gallery
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `argo_product_gallery` (
  `id` VARCHAR(64) PRIMARY KEY,
  `product_id` VARCHAR(64) NOT NULL,
  `url` TEXT NOT NULL,
  `title` VARCHAR(255),
  `type` VARCHAR(50) DEFAULT 'gallery',
  `display_order` INT DEFAULT 0,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`product_id`) REFERENCES `argo_products`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------
-- Table: orders
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `argo_orders` (
  `id` VARCHAR(64) PRIMARY KEY,
  `order_number` VARCHAR(50) NOT NULL UNIQUE,
  `customer_name` VARCHAR(150) NOT NULL,
  `company_name` VARCHAR(150),
  `email` VARCHAR(120) NOT NULL,
  `phone` VARCHAR(50) NOT NULL,
  `delivery_address` TEXT NOT NULL,
  `city` VARCHAR(100) NOT NULL,
  `state` VARCHAR(50) NOT NULL,
  `zip_code` VARCHAR(20) NOT NULL,
  `delivery_method` VARCHAR(50) DEFAULT 'warehouse_pickup',
  `subtotal` DECIMAL(10,2) NOT NULL,
  `shipping_cost` DECIMAL(10,2) DEFAULT 0.00,
  `sales_tax` DECIMAL(10,2) DEFAULT 0.00,
  `total` DECIMAL(10,2) NOT NULL,
  `payment_status` ENUM('Pending', 'Approved', 'Failed', 'Quoted') DEFAULT 'Pending',
  `order_status` ENUM('Received', 'In Preparation', 'Ready for Pickup', 'Shipped', 'Delivered', 'Cancelled') DEFAULT 'Received',
  `payment_details` LONGTEXT,
  `notes` TEXT,
  `items_json` LONGTEXT NOT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX `idx_order_status` (`order_status`),
  INDEX `idx_payment_status` (`payment_status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------
-- Table: quotes
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `argo_quotes` (
  `id` VARCHAR(64) PRIMARY KEY,
  `quote_number` VARCHAR(50) NOT NULL UNIQUE,
  `customer_name` VARCHAR(150) NOT NULL,
  `company_name` VARCHAR(150),
  `email` VARCHAR(120) NOT NULL,
  `phone` VARCHAR(50) NOT NULL,
  `project_type` VARCHAR(100),
  `delivery_city` VARCHAR(100),
  `delivery_state` VARCHAR(50),
  `estimated_sqft` DECIMAL(10,2),
  `products_requested` LONGTEXT,
  `status` ENUM('Pending', 'In Review', 'Sent', 'Accepted', 'Declined') DEFAULT 'Pending',
  `notes` TEXT,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------
-- Table: samples
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `argo_samples` (
  `id` VARCHAR(64) PRIMARY KEY,
  `sample_number` VARCHAR(50) NOT NULL UNIQUE,
  `product_id` VARCHAR(64),
  `product_name` VARCHAR(255),
  `full_name` VARCHAR(150) NOT NULL,
  `company` VARCHAR(150),
  `email` VARCHAR(120) NOT NULL,
  `phone` VARCHAR(50) NOT NULL,
  `shipping_address` TEXT NOT NULL,
  `city` VARCHAR(100),
  `state` VARCHAR(50),
  `zip_code` VARCHAR(20),
  `status` ENUM('Requested', 'Dispatched', 'Delivered') DEFAULT 'Requested',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------
-- Table: sales_reps
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `argo_sales_reps` (
  `id` VARCHAR(64) PRIMARY KEY,
  `name` VARCHAR(150) NOT NULL,
  `title` VARCHAR(150),
  `photo_url` TEXT,
  `phone` VARCHAR(50),
  `whatsapp` VARCHAR(50),
  `email` VARCHAR(100),
  `languages` VARCHAR(100) DEFAULT 'English / Español',
  `assigned_categories` TEXT,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

SET FOREIGN_KEY_CHECKS = 1;
