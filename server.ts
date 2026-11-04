import express, { Request, Response } from 'express';
import fs from 'fs';
import path from 'path';
import multer from 'multer';
import JSZip from 'jszip';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;
const isProd = process.env.NODE_ENV === 'production';

// Ensure data and uploads folders exist
const DATA_DIR = path.join(__dirname, 'data');
const UPLOADS_DIR = path.join(__dirname, 'public', 'uploads');
if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
if (!fs.existsSync(UPLOADS_DIR)) fs.mkdirSync(UPLOADS_DIR, { recursive: true });

const DB_FILE = path.join(DATA_DIR, 'argo_mosaic_db.json');

// Multer storage for uploaded product & company images
const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, UPLOADS_DIR);
  },
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const cleanName = path.basename(file.originalname, ext).replace(/[^a-zA-Z0-9_-]/g, '_');
    cb(null, `${cleanName}_${Date.now()}${ext}`);
  },
});
const upload = multer({
  storage,
  limits: { fileSize: 25 * 1024 * 1024 }, // 25MB limit for high-res architectural photos
  fileFilter: (_req, file, cb) => {
    const allowed = /jpeg|jpg|png|webp|avif|svg|pdf/;
    const ext = allowed.test(path.extname(file.originalname).toLowerCase());
    const mime = allowed.test(file.mimetype);
    if (ext || mime) {
      cb(null, true);
    } else {
      cb(new Error('Formato de archivo no soportado. Solo imágenes y PDF.'));
    }
  },
});

app.use(express.json({ limit: '20mb' }));
app.use(express.urlencoded({ extended: true, limit: '20mb' }));

// Serve uploads statically
app.use('/uploads', express.static(UPLOADS_DIR));

// Initial database structure
interface DatabaseSchema {
  products: any[];
  orders: any[];
  quotes: any[];
  samples: any[];
  salesReps: any[];
  settings: {
    companyName: string;
    logoUrl: string;
    descriptionEn: string;
    descriptionEs: string;
    phone: string;
    whatsapp: string;
    email: string;
    website: string;
    warehouseAddress: string;
    city: string;
    state: string;
    zipCode: string;
    businessHours: string;
    googleMapsEmbedUrl: string;
    paypalClientId: string;
    paypalSecretKey: string;
    paypalMode: 'sandbox' | 'live';
    lowStockThreshold: number;
    homeHeroTitleEn: string;
    homeHeroTitleEs: string;
    homeHeroSubtitleEn: string;
    homeHeroSubtitleEs: string;
    homeHeroImage: string;
  };
  admin: {
    username: string;
    passwordHash: string; // Default simple token for admin portal
  };
}

const defaultDb: DatabaseSchema = {
  products: [
    {
      id: 'prod-sample-01',
      nameEn: 'Calacatta Texas Gold Polished Porcelain',
      nameEs: 'Porcelanato Pulido Calacatta Texas Gold',
      model: 'AM-CTG-2448',
      category: 'Polished', // LVP | Wooden | Matte Series | Polished
      brand: 'ARGO MOSAIC',
      descriptionEn: 'Ultra-refined large format porcelain surface inspired by classic Italian Calacatta marble with warm golden veining. Optimized for luxury commercial spaces and prestigious residential flooring.',
      descriptionEs: 'Superficie de porcelanato de gran formato inspirada en el mármol Calacatta italiano clásico con vetas doradas cálidas. Diseñado para espacios comerciales de lujo y residenciales de alto nivel.',
      size: '24" x 48"',
      productType: 'Rectified Porcelain Tile',
      availability: 'In Stock',
      price: 68.50,
      pricePerBox: 109.60,
      pricePerSqFt: 6.85,
      sku: 'POL-CTG-2448',
      badge: 'Best Seller', // New Arrival | Best Seller | Featured | none
      status: 'published', // published | draft | hidden
      stock: 450, // in boxes
      youtubeVideoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      gallery: [
        {
          id: 'img-1',
          url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1400&q=80',
          title: 'Main Architectural Showcase',
          type: 'main'
        },
        {
          id: 'img-2',
          url: 'https://images.unsplash.com/photo-1600565193348-f74bd3c7ccdf?auto=format&fit=crop&w=1400&q=80',
          title: 'Ambient Living Room Installation',
          type: 'ambient'
        },
        {
          id: 'img-3',
          url: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1400&q=80',
          title: 'Surface Detail and Reflection',
          type: 'detail'
        }
      ],
      galleryStyle: 'editorial', // editorial | carousel | mosaic | fullscreen | thumbnails-side
      primaryImage: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1400&q=80',
      ambientImage: 'https://images.unsplash.com/photo-1600565193348-f74bd3c7ccdf?auto=format&fit=crop&w=1400&q=80',
      specs: {
        material: 'Glazed Porcelain',
        edgeType: 'Precision Rectified',
        finish: 'High Gloss Mirror Polish',
        shadeVariation: 'V2 - Slight Variation',
        randomFaces: '8 Distinct Dynamic Faces',
        peiRating: 'PEI IV - Heavy Commercial & Residential',
        printingTechnology: 'High-Definition Digital Inkjet',
        frostResistant: 'Frost Proof (ASTM C1026 Pass)',
        waterResistant: 'Impervious Porcelain',
        waterAbsorption: 'Less than 0.5% (Impervious)',
        wearResistance: 'Deep Abrasion Resistant Class 4',
        slipResistance: 'DCOF >= 0.42 (Polished Dry)',
        residentialUse: 'High Traffic Residential, Foyers, Living, Baths',
        commercialUse: 'Hotels, Corporate Offices, Boutiques, Retail',
        indoorApplication: 'Yes - Interior Floors & Walls',
        outdoorApplication: 'Covered Porches / Vertical Walls',
        wallApplication: 'Yes - Feature Walls, Fireplaces, Bathrooms',
        floorApplication: 'Yes - Heavy Traffic Floors',
        customSpecs: [
          { labelEn: 'Chemical Resistance', labelEs: 'Resistencia Química', value: 'Resistant to Household Cleaners & Pool Salts' }
        ]
      },
      packaging: {
        piecesPerBox: 2,
        sqFtPerBox: 16.0,
        weightLbsPerBox: 72.5,
        boxDimensions: '24.5" x 48.5" x 0.9"',
        piecesPerPallet: 64,
        sqFtPerPallet: 512.0,
        weightLbsPerPallet: 2320,
        palletDimensions: '42" x 50" x 36"',
        customPackaging: []
      },
      documents: {
        catalogPdfUrl: '',
        techSheetPdfUrl: '',
        installationGuideUrl: '',
        catalogWebLink: '',
        tour360Url: 'https://matterport.com/discover',
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: 'prod-sample-02',
      nameEn: 'Austin Hill Country Natural Oak LVP',
      nameEs: 'Piso LVP Roble Natural Austin Hill Country',
      model: 'AM-LVP-748-OAK',
      category: 'LVP',
      brand: 'ARGO MOSAIC',
      descriptionEn: 'Rigid core luxury vinyl plank featuring authentic registered-embossed European oak grain. Engineered with 20mil commercial wear layer and integrated IXPE acoustic sound-dampening pad.',
      descriptionEs: 'Duela de vinilo de lujo (LVP) de núcleo rígido SPC con textura sincronizada de roble europeo. Diseñado con capa de desgaste comercial de 20 milésimas y membrana acústica IXPE integrada.',
      size: '7" x 48"',
      productType: 'Rigid Core SPC Vinyl Plank',
      availability: 'In Stock',
      price: 49.90,
      pricePerBox: 119.76,
      pricePerSqFt: 3.99,
      sku: 'LVP-OAK-748',
      badge: 'Featured',
      status: 'published',
      stock: 620,
      youtubeVideoUrl: '',
      gallery: [
        {
          id: 'img-201',
          url: 'https://images.unsplash.com/photo-1581858726788-75bc0f6a952d?auto=format&fit=crop&w=1400&q=80',
          title: 'Plank Surface Texture',
          type: 'main'
        },
        {
          id: 'img-202',
          url: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1400&q=80',
          title: 'Architectural Modern Space',
          type: 'ambient'
        }
      ],
      galleryStyle: 'thumbnails-side',
      primaryImage: 'https://images.unsplash.com/photo-1581858726788-75bc0f6a952d?auto=format&fit=crop&w=1400&q=80',
      ambientImage: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1400&q=80',
      specs: {
        material: 'Stone Plastic Composite (SPC) Core',
        edgeType: 'Micro-Bevel 4-Sided',
        finish: 'EIR Embossed in Register Matte',
        shadeVariation: 'V3 - Moderate Natural Variation',
        randomFaces: '10 Unique Board Patterns',
        peiRating: 'N/A - Commercial Wear Layer 20mil (0.5mm)',
        printingTechnology: 'High Definition Natural Wood Film',
        frostResistant: 'Stable -20F to 140F',
        waterResistant: '100% Waterproof Core',
        waterAbsorption: '0.00% Zero Hydrophobic',
        wearResistance: 'Commercial Heavy Grade Scratch Shield',
        slipResistance: 'Wet/Dry High Traction Certified',
        residentialUse: 'Lifetime Residential Use',
        commercialUse: '15-Year Commercial Warranty',
        indoorApplication: 'All Interior Floors including Kitchens and Basements',
        outdoorApplication: 'Not recommended for uncovered direct UV sun',
        wallApplication: 'Yes - Accent Planks and Columns',
        floorApplication: 'Yes - Floating Click Lock with IXPE Pad',
        customSpecs: []
      },
      packaging: {
        piecesPerBox: 10,
        sqFtPerBox: 23.36,
        weightLbsPerBox: 44.5,
        boxDimensions: '7.5" x 49" x 2.4"',
        piecesPerPallet: 55,
        sqFtPerPallet: 1284.8,
        weightLbsPerPallet: 2450,
        palletDimensions: '42" x 49" x 40"',
        customPackaging: []
      },
      documents: {
        catalogPdfUrl: '',
        techSheetPdfUrl: '',
        installationGuideUrl: '',
        catalogWebLink: '',
        tour360Url: '',
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: 'prod-sample-03',
      nameEn: 'Graphite Basalt Matte Architectural Series',
      nameEs: 'Serie Arquitectónica Mate Basalto Grafito',
      model: 'AM-MAT-3060-GRF',
      category: 'Matte Series',
      brand: 'ARGO MOSAIC',
      descriptionEn: 'Sophisticated deep basalt contemporary matte porcelain surface. Silky tactile sensation with high coefficient of friction, ideal for contemporary commercial architecture and modern residential designs.',
      descriptionEs: 'Superficie de porcelanato contemporáneo mate basalto profundo. Tacto sedoso con alto coeficiente de fricción antideslizante, idónea para arquitectura comercial contemporánea.',
      size: '30" x 60"',
      productType: 'Through-Body Architectural Porcelain',
      availability: 'In Stock',
      price: 74.00,
      pricePerBox: 185.00,
      pricePerSqFt: 7.40,
      sku: 'MAT-BAS-3060',
      badge: 'New Arrival',
      status: 'published',
      stock: 310,
      youtubeVideoUrl: '',
      gallery: [
        {
          id: 'img-301',
          url: 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1400&q=80',
          title: 'Matte Slate Texture',
          type: 'main'
        }
      ],
      galleryStyle: 'mosaic',
      primaryImage: 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1400&q=80',
      ambientImage: 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1400&q=80',
      specs: {
        material: 'Vitrified Matte Porcelain',
        edgeType: 'Laser Rectified',
        finish: 'Silk Matte Non-Glare Finish',
        shadeVariation: 'V1 - Uniform Architectural Consistency',
        randomFaces: '6 Monumental Slab Patterns',
        peiRating: 'PEI V - Extreme Commercial Traffic',
        printingTechnology: 'Nano-Particle Color Fusion',
        frostResistant: '100% Frost Proof Exterior Grade',
        waterResistant: 'Impervious Under 0.05%',
        waterAbsorption: '< 0.1%',
        wearResistance: 'Industrial Scratch & Wear Level',
        slipResistance: 'DCOF >= 0.55 R10 Slip Resistant',
        residentialUse: 'All Interior & Exterior Covered Living Areas',
        commercialUse: 'Airports, Shopping Centers, Commercial Lobbies',
        indoorApplication: 'Yes - High Performance Floors & Walls',
        outdoorApplication: 'Yes - Exterior Cladding & Walkways',
        wallApplication: 'Yes - Large Architectural Facades',
        floorApplication: 'Yes - Heavy Load Bearing Floors',
        customSpecs: []
      },
      packaging: {
        piecesPerBox: 2,
        sqFtPerBox: 25.0,
        weightLbsPerBox: 84.0,
        boxDimensions: '31" x 61" x 1.1"',
        piecesPerPallet: 40,
        sqFtPerPallet: 1000.0,
        weightLbsPerPallet: 3360,
        palletDimensions: '44" x 62" x 34"',
        customPackaging: []
      },
      documents: {
        catalogPdfUrl: '',
        techSheetPdfUrl: '',
        installationGuideUrl: '',
        catalogWebLink: '',
        tour360Url: '',
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: 'prod-sample-04',
      nameEn: 'Hacienda Handcrafted Hardwood White Oak',
      nameEs: 'Madera Natural Roble Blanco Hacienda Handcrafted',
      model: 'AM-WOOD-872-HAC',
      category: 'Wooden',
      brand: 'ARGO MOSAIC',
      descriptionEn: 'Engineered hardwood plank with wire-brushed texture, artisanal smoked treatment, and multi-ply Baltic birch substrate for extreme dimensional stability in Texas climate variations.',
      descriptionEs: 'Duela de madera de ingeniería con cepillado artesanal, tratamiento ahumado y sustrato multicapa de abedul báltico para máxima estabilidad dimensional en el clima de Texas.',
      size: '8" x 72"',
      productType: 'Engineered Hardwood Surface',
      availability: 'Made to Order / Contact Us',
      price: 88.00,
      pricePerBox: 211.20,
      pricePerSqFt: 8.80,
      sku: 'WOD-OAK-872',
      badge: 'Featured',
      status: 'published',
      stock: 180,
      youtubeVideoUrl: '',
      gallery: [
        {
          id: 'img-401',
          url: 'https://images.unsplash.com/photo-1545042679-41d22b2ca130?auto=format&fit=crop&w=1400&q=80',
          title: 'Handcrafted White Oak Plank',
          type: 'main'
        }
      ],
      galleryStyle: 'editorial',
      primaryImage: 'https://images.unsplash.com/photo-1545042679-41d22b2ca130?auto=format&fit=crop&w=1400&q=80',
      ambientImage: 'https://images.unsplash.com/photo-1545042679-41d22b2ca130?auto=format&fit=crop&w=1400&q=80',
      specs: {
        material: 'Select Grade European White Oak',
        edgeType: 'Micro Bevel Hand-Finished',
        finish: 'UV Cured Matte Urethane with Aluminum Oxide',
        shadeVariation: 'V4 - Natural Substantial Wood Grain Variation',
        randomFaces: '100% Unique Organic Lumber Planks',
        peiRating: 'Janka Hardness 1360',
        printingTechnology: 'Authentic Natural Timber Top Layer 4mm',
        frostResistant: 'Climate Controlled Interior Standard',
        waterResistant: 'Top Layer Moisture Shielding',
        waterAbsorption: 'Interior Hardwood Standard',
        wearResistance: 'Commercial 7-Coat Scratch Shield',
        slipResistance: 'Standard Natural Wood Traction',
        residentialUse: 'Luxury Residential Throughout',
        commercialUse: 'Executive Suites, Architectural Studios, Boutiques',
        indoorApplication: 'Yes - Interior Dry Areas',
        outdoorApplication: 'No - Indoor Architectural Use Only',
        wallApplication: 'Yes - Architectural Wood Ceilings & Walls',
        floorApplication: 'Yes - Nail, Glue or Float Installation',
        customSpecs: []
      },
      packaging: {
        piecesPerBox: 6,
        sqFtPerBox: 24.0,
        weightLbsPerBox: 52.0,
        boxDimensions: '8.5" x 73" x 2.8"',
        piecesPerPallet: 45,
        sqFtPerPallet: 1080.0,
        weightLbsPerPallet: 2340,
        palletDimensions: '42" x 74" x 38"',
        customPackaging: []
      },
      documents: {
        catalogPdfUrl: '',
        techSheetPdfUrl: '',
        installationGuideUrl: '',
        catalogWebLink: '',
        tour360Url: '',
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  ],
  orders: [],
  quotes: [],
  samples: [],
  salesReps: [
    {
      id: 'rep-01',
      name: 'Carlos Mendoza',
      title: 'Texas Wholesale & Architectural Representative',
      photoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80',
      phone: '+1 (214) 555-0192',
      whatsapp: '12145550192',
      email: 'cmendoza@argomosaic.com',
      languages: 'English / Español',
      assignedCategories: ['LVP', 'Polished', 'Matte Series', 'Wooden']
    },
    {
      id: 'rep-02',
      name: 'David Reynolds',
      title: 'Commercial Projects & Builder Accounts',
      photoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80',
      phone: '+1 (713) 555-0144',
      whatsapp: '17135550144',
      email: 'dreynolds@argomosaic.com',
      languages: 'English',
      assignedCategories: ['Commercial Contracts', 'Polished', 'LVP']
    }
  ],
  settings: {
    companyName: 'ARGO MOSAIC',
    logoUrl: '/assets/aistudio/Argo_Mosaic_Logo_Transparente_0aa6f2ad.png',
    descriptionEn: 'Leading importer and commercial distributor of premier architectural porcelain, tile, luxury vinyl plank (LVP), and surfaces across Texas and the United States.',
    descriptionEs: 'Líder en importación y distribución comercial de porcelanatos arquitectónicos, duela vinílica de lujo (LVP), pisos y recubrimientos de primer nivel en Texas y Estados Unidos.',
    phone: '+1 (214) 790-2840',
    whatsapp: '12147902840',
    email: 'contact@argomosaic.com',
    website: 'https://argomosaic.com',
    warehouseAddress: '11820 Regal Row, Suite 100',
    city: 'Dallas',
    state: 'Texas',
    zipCode: '75247',
    businessHours: 'Monday - Friday: 7:30 AM - 5:00 PM CST | Saturday: 8:00 AM - 1:00 PM CST',
    googleMapsEmbedUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d107297.86469614274!2d-96.88371363618635!3d32.81723145455639!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x864e995574577ee3%3A0x6e9f191b72e49c71!2sDallas%2C%20TX!5e0!3m2!1sen!2sus!4v1700000000000!5m2!1sen!2sus',
    paypalClientId: 'sb-test-argo-mosaic-client-id-tx',
    paypalSecretKey: 'sb-test-argo-mosaic-secret-tx',
    paypalMode: 'sandbox',
    lowStockThreshold: 50,
    homeHeroTitleEn: 'Architectural Surfaces Engineered for Distinction',
    homeHeroTitleEs: 'Superficies Arquitectónicas Diseñadas para la Distinción',
    homeHeroSubtitleEn: 'Direct importer of premium LVP, wood surfaces, matte collections, and high-gloss porcelain across Texas and nationwide.',
    homeHeroSubtitleEs: 'Importador directo de pisos LVP, superficies de madera, colecciones mate y porcelanatos pulidos en Texas y todo EE. UU.',
    homeHeroImage: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1920&q=85'
  },
  admin: {
    username: 'admin',
    passwordHash: 'argo2026!'
  }
};

function readDb(): DatabaseSchema {
  try {
    if (!fs.existsSync(DB_FILE)) {
      fs.writeFileSync(DB_FILE, JSON.stringify(defaultDb, null, 2), 'utf-8');
      return defaultDb;
    }
    const raw = fs.readFileSync(DB_FILE, 'utf-8');
    return JSON.parse(raw);
  } catch (err) {
    console.error('Error reading db, returning default', err);
    return defaultDb;
  }
}

function writeDb(data: DatabaseSchema) {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error saving db', err);
  }
}

// Ensure database file is initialized
readDb();

// --- API ROUTES ---

// Products API
app.get('/api/products', (_req: Request, res: Response) => {
  const db = readDb();
  res.json({ success: true, products: db.products });
});

app.get('/api/products/:id', (req: Request, res: Response) => {
  const db = readDb();
  const prod = db.products.find(p => p.id === req.params.id || p.sku === req.params.id);
  if (!prod) {
    return res.status(404).json({ success: false, message: 'Product not found' });
  }
  res.json({ success: true, product: prod });
});

app.post('/api/products', (req: Request, res: Response) => {
  const db = readDb();
  const newProduct = {
    ...req.body,
    id: req.body.id || `prod-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  db.products.unshift(newProduct);
  writeDb(db);
  res.status(201).json({ success: true, product: newProduct });
});

app.put('/api/products/:id', (req: Request, res: Response) => {
  const db = readDb();
  const index = db.products.findIndex(p => p.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ success: false, message: 'Product not found' });
  }
  const updated = {
    ...db.products[index],
    ...req.body,
    updatedAt: new Date().toISOString()
  };
  db.products[index] = updated;
  writeDb(db);
  res.json({ success: true, product: updated });
});

app.delete('/api/products/:id', (req: Request, res: Response) => {
  const db = readDb();
  const index = db.products.findIndex(p => p.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ success: false, message: 'Product not found' });
  }
  const removed = db.products.splice(index, 1);
  writeDb(db);
  res.json({ success: true, removed: removed[0] });
});

// Orders API
app.get('/api/orders', (_req: Request, res: Response) => {
  const db = readDb();
  res.json({ success: true, orders: db.orders });
});

app.post('/api/orders', (req: Request, res: Response) => {
  const db = readDb();
  const orderNumber = `ARGO-${new Date().getFullYear()}-${String(db.orders.length + 1001).padStart(5, '0')}`;
  
  // Calculate verified server subtotal
  let verifiedSubtotal = 0;
  const items = req.body.items || [];
  const processedItems = items.map((item: any) => {
    const product = db.products.find(p => p.id === item.productId);
    const unitPrice = product ? (item.unitType === 'sqft' ? (product.pricePerSqFt || product.price) : (product.pricePerBox || product.price)) : item.unitPrice;
    const itemTotal = Number((unitPrice * item.quantity).toFixed(2));
    verifiedSubtotal += itemTotal;
    return {
      ...item,
      unitPrice,
      total: itemTotal
    };
  });

  const deliveryMethod = req.body.deliveryMethod || 'warehouse_pickup';
  const shippingCost = deliveryMethod === 'freight_delivery' ? 180.00 : 0.00;
  const salesTax = Number((verifiedSubtotal * 0.0825).toFixed(2)); // Texas state sales tax 8.25%
  const grandTotal = Number((verifiedSubtotal + shippingCost + salesTax).toFixed(2));

  const newOrder = {
    id: `ord-${Date.now()}`,
    orderNumber,
    customer: req.body.customer,
    items: processedItems,
    deliveryMethod,
    subtotal: verifiedSubtotal,
    shippingCost,
    salesTax,
    total: grandTotal,
    paymentStatus: req.body.paymentStatus || 'Pending', // Pending | Approved | Failed | Quoted
    orderStatus: 'Received', // Received | In Preparation | Ready for Pickup | Shipped | Delivered | Cancelled
    paymentDetails: req.body.paymentDetails || null,
    notes: req.body.notes || '',
    createdAt: new Date().toISOString()
  };

  db.orders.unshift(newOrder);
  writeDb(db);
  res.status(201).json({ success: true, order: newOrder });
});

app.patch('/api/orders/:id', (req: Request, res: Response) => {
  const db = readDb();
  const index = db.orders.findIndex(o => o.id === req.params.id || o.orderNumber === req.params.id);
  if (index === -1) {
    return res.status(404).json({ success: false, message: 'Order not found' });
  }
  db.orders[index] = { ...db.orders[index], ...req.body, updatedAt: new Date().toISOString() };
  writeDb(db);
  res.json({ success: true, order: db.orders[index] });
});

// Quotes API
app.get('/api/quotes', (_req: Request, res: Response) => {
  const db = readDb();
  res.json({ success: true, quotes: db.quotes });
});

app.post('/api/quotes', (req: Request, res: Response) => {
  const db = readDb();
  const quoteNumber = `QT-${new Date().getFullYear()}-${String(db.quotes.length + 501).padStart(4, '0')}`;
  const newQuote = {
    id: `qt-${Date.now()}`,
    quoteNumber,
    ...req.body,
    status: 'Pending', // Pending | In Review | Sent | Accepted | Declined
    createdAt: new Date().toISOString()
  };
  db.quotes.unshift(newQuote);
  writeDb(db);
  res.status(201).json({ success: true, quote: newQuote });
});

app.patch('/api/quotes/:id', (req: Request, res: Response) => {
  const db = readDb();
  const index = db.quotes.findIndex(q => q.id === req.params.id || q.quoteNumber === req.params.id);
  if (index === -1) {
    return res.status(404).json({ success: false, message: 'Quote not found' });
  }
  db.quotes[index] = { ...db.quotes[index], ...req.body, updatedAt: new Date().toISOString() };
  writeDb(db);
  res.json({ success: true, quote: db.quotes[index] });
});

// Samples Request API
app.get('/api/samples', (_req: Request, res: Response) => {
  const db = readDb();
  res.json({ success: true, samples: db.samples || [] });
});

app.post('/api/samples', (req: Request, res: Response) => {
  const db = readDb();
  if (!db.samples) db.samples = [];
  const sampleNumber = `SMP-${new Date().getFullYear()}-${String(db.samples.length + 101).padStart(3, '0')}`;
  const newSample = {
    id: `smp-${Date.now()}`,
    sampleNumber,
    ...req.body,
    status: 'Requested', // Requested | Dispatched | Delivered
    createdAt: new Date().toISOString()
  };
  db.samples.unshift(newSample);
  writeDb(db);
  res.status(201).json({ success: true, sample: newSample });
});

// Sales Reps API
app.get('/api/sales-reps', (_req: Request, res: Response) => {
  const db = readDb();
  res.json({ success: true, salesReps: db.salesReps });
});

app.post('/api/sales-reps', (req: Request, res: Response) => {
  const db = readDb();
  const newRep = {
    ...req.body,
    id: req.body.id || `rep-${Date.now()}`
  };
  db.salesReps.push(newRep);
  writeDb(db);
  res.status(201).json({ success: true, salesRep: newRep });
});

app.put('/api/sales-reps/:id', (req: Request, res: Response) => {
  const db = readDb();
  const index = db.salesReps.findIndex(r => r.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ success: false, message: 'Sales rep not found' });
  }
  db.salesReps[index] = { ...db.salesReps[index], ...req.body };
  writeDb(db);
  res.json({ success: true, salesRep: db.salesReps[index] });
});

app.delete('/api/sales-reps/:id', (req: Request, res: Response) => {
  const db = readDb();
  const index = db.salesReps.findIndex(r => r.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ success: false, message: 'Sales rep not found' });
  }
  const removed = db.salesReps.splice(index, 1);
  writeDb(db);
  res.json({ success: true, removed: removed[0] });
});

// Settings API
app.get('/api/settings', (_req: Request, res: Response) => {
  const db = readDb();
  res.json({ success: true, settings: db.settings });
});

app.put('/api/settings', (req: Request, res: Response) => {
  const db = readDb();
  db.settings = { ...db.settings, ...req.body };
  writeDb(db);
  res.json({ success: true, settings: db.settings });
});

// Admin Auth API
app.post('/api/admin/login', (req: Request, res: Response) => {
  const { username, password } = req.body;
  const db = readDb();
  if (username === db.admin.username && password === db.admin.passwordHash) {
    // Return token
    return res.json({
      success: true,
      token: `token-${Date.now()}-${Math.random().toString(36).substr(2, 8)}`,
      user: { username: db.admin.username, role: 'administrator' }
    });
  }
  return res.status(401).json({ success: false, message: 'Credenciales inválidas / Invalid credentials' });
});

// File Upload API
app.post('/api/upload', upload.single('file'), (req: Request, res: Response) => {
  if (!req.file) {
    return res.status(400).json({ success: false, message: 'No file uploaded' });
  }
  const fileUrl = `/uploads/${req.file.filename}`;
  res.json({
    success: true,
    fileUrl,
    filename: req.file.filename,
    originalName: req.file.originalname,
    size: req.file.size
  });
});

// Hostinger Deployment Package Generator Endpoint
app.get('/api/hostinger-export', async (_req: Request, res: Response) => {
  try {
    const zip = new JSZip();
    
    // Read the Hostinger package files from the filesystem
    const hostingerDir = path.join(__dirname, 'hostinger-package');
    if (!fs.existsSync(hostingerDir)) {
      return res.status(500).json({ success: false, message: 'Hostinger package template not found' });
    }

    function addDirToZip(dirPath: string, zipFolder: JSZip) {
      const items = fs.readdirSync(dirPath);
      for (const item of items) {
        const fullPath = path.join(dirPath, item);
        const stat = fs.statSync(fullPath);
        if (stat.isDirectory()) {
          const subFolder = zipFolder.folder(item)!;
          addDirToZip(fullPath, subFolder);
        } else {
          zipFolder.file(item, fs.readFileSync(fullPath));
        }
      }
    }

    addDirToZip(hostingerDir, zip);

    // Also include the current database dump in JSON + SQL
    const db = readDb();
    zip.file('database_export.json', JSON.stringify(db, null, 2));

    const zipBuffer = await zip.generateAsync({ type: 'nodebuffer', compression: 'DEFLATE' });
    res.setHeader('Content-Type', 'application/zip');
    res.setHeader('Content-Disposition', 'attachment; filename="argo-mosaic-hostinger-production.zip"');
    res.send(zipBuffer);
  } catch (err: any) {
    console.error('Error generating Hostinger export zip', err);
    res.status(500).json({ success: false, message: err.message });
  }
});

// Start dev or production server
async function startServer() {
  if (!isProd) {
    // In development, hook Vite into express as middleware
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    // In production, serve dist folder with dynamic OpenGraph injection for WhatsApp and mobile crawlers
    app.use(express.static(path.join(__dirname, 'dist'), { index: false }));
    app.get('*', (req: Request, res: Response) => {
      const indexPath = path.join(__dirname, 'dist', 'index.html');
      if (!fs.existsSync(indexPath)) {
        return res.status(404).send('Build not found. Please run npm run build.');
      }

      const prodId = req.query.product as string;
      if (prodId) {
        try {
          const db = readDb();
          const product = db.products.find((p: any) => p.id === prodId || p.sku === prodId);
          if (product) {
            let html = fs.readFileSync(indexPath, 'utf-8');
            const title = `${product.nameEs || product.nameEn} — ARGO MOSAIC Texas`;
            const desc = (product.descriptionEs || product.descriptionEn || 'Superficie arquitectónica y recubrimiento premium disponible en bodega Dallas, Texas.').slice(0, 160);
            const img = product.primaryImage || '/assets/aistudio/Argo_Mosaic_Logo_Transparente_0aa6f2ad.png';

            html = html.replace(/<title>.*?<\/title>/, `<title>${title}</title>`);
            html = html.replace(/<meta property="og:title" content=".*?" \/>/, `<meta property="og:title" content="${title}" />`);
            html = html.replace(/<meta property="og:description" content=".*?" \/>/, `<meta property="og:description" content="${desc}" />`);
            html = html.replace(/<meta property="og:image" content=".*?" \/>/, `<meta property="og:image" content="${img}" />`);
            return res.send(html);
          }
        } catch {
          // fallback to regular index file
        }
      }
      res.sendFile(indexPath);
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`ARGO MOSAIC server running at http://0.0.0.0:${PORT} (mode: ${isProd ? 'production' : 'development'})`);
  });
}

startServer();
