import { jsPDF } from 'jspdf';
import QRCode from 'qrcode';
import { Product, Language } from '../types';

export async function generateProductTechSheetPdf(product: Product, lang: Language = 'en'): Promise<void> {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 14;

  // Header background banner - Deep architectural blue
  doc.setFillColor(24, 43, 73); // #182b49 (Argo Mosaic Navy)
  doc.rect(0, 0, pageWidth, 28, 'F');

  // Brand Name
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(18);
  doc.text('ARGO MOSAIC', margin, 14);

  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(200, 220, 255);
  doc.text(
    lang === 'es'
      ? 'FICHA TÉCNICA OFICIAL • TEXAS WHOLESALE & ARCHITECTURAL SURFACES'
      : 'OFFICIAL TECHNICAL SPECIFICATION SHEET • TEXAS WHOLESALE & SURFACES',
    margin,
    21
  );

  // Top right contact
  doc.setFontSize(7.5);
  doc.text('Dallas, TX • contact@argomosaic.com • +1 (214) 790-2840', pageWidth - margin, 14, { align: 'right' });
  doc.text('www.argomosaic.com', pageWidth - margin, 20, { align: 'right' });

  let y = 36;

  // Product Title Header
  doc.setTextColor(20, 25, 35);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  const name = lang === 'es' ? (product.nameEs || product.nameEn) : product.nameEn;
  doc.text(name, margin, y);

  y += 7;
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(90, 100, 115);
  doc.text(
    `${lang === 'es' ? 'Colección' : 'Collection'}: ${product.category}  |  ${lang === 'es' ? 'Modelo' : 'Model'}: ${product.model || 'N/A'}  |  SKU: ${product.sku}  |  ${lang === 'es' ? 'Dimensiones' : 'Size'}: ${product.size || 'N/A'}`,
    margin,
    y
  );

  y += 8;
  // Divider
  doc.setDrawColor(220, 225, 235);
  doc.setLineWidth(0.5);
  doc.line(margin, y, pageWidth - margin, y);

  y += 6;

  // Two columns: Left for description & QR code, Right for Quick Highlights
  const colWidth = (pageWidth - margin * 2 - 8) / 2;

  // Commercial description box
  doc.setFillColor(248, 250, 252);
  doc.rect(margin, y, colWidth, 38, 'F');
  doc.setDrawColor(230, 235, 245);
  doc.rect(margin, y, colWidth, 38, 'S');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(24, 43, 73);
  doc.text(lang === 'es' ? 'DESCRIPCIÓN ARQUITECTÓNICA' : 'ARCHITECTURAL DESCRIPTION', margin + 4, y + 6);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(60, 70, 85);
  const desc = lang === 'es' ? (product.descriptionEs || product.descriptionEn) : product.descriptionEn;
  const splitDesc = doc.splitTextToSize(desc || 'Premium surface engineered for residential and commercial spaces.', colWidth - 8);
  doc.text(splitDesc.slice(0, 5), margin + 4, y + 12);

  // QR Code on right side of top block
  const qrX = margin + colWidth + 8;
  doc.setFillColor(248, 250, 252);
  doc.rect(qrX, y, colWidth, 38, 'F');
  doc.setDrawColor(230, 235, 245);
  doc.rect(qrX, y, colWidth, 38, 'S');

  try {
    const liveUrl = window.location.origin ? `${window.location.origin}/?tab=models&product=${product.id}` : `https://argomosaic.com/product/${product.id}`;
    const qrDataUrl = await QRCode.toDataURL(liveUrl, { margin: 1, width: 140 });
    doc.addImage(qrDataUrl, 'PNG', qrX + 4, y + 4, 30, 30);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(24, 43, 73);
    doc.text(lang === 'es' ? 'VERSIÓN DIGITAL Y 360°' : 'DIGITAL & 360° LIVE VIEW', qrX + 38, y + 11);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7);
    doc.setTextColor(80, 90, 105);
    const qrHelp = lang === 'es'
      ? ['Escanea este código QR con', 'tu celular para consultar', 'galería HD, stock y cotizar.']
      : ['Scan this QR code with your', 'smartphone to view HD gallery,', 'live stock & quote online.'];
    doc.text(qrHelp, qrX + 38, y + 17);
  } catch (err) {
    console.error('QR code generation error:', err);
  }

  y += 44;

  // Technical Specifications Section
  doc.setFillColor(24, 43, 73);
  doc.rect(margin, y, pageWidth - margin * 2, 7, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(255, 255, 255);
  doc.text(lang === 'es' ? 'ESPECIFICACIONES TÉCNICAS' : 'TECHNICAL SPECIFICATIONS', margin + 4, y + 4.8);

  y += 10;

  // Specs Table Grid
  const specs = [
    { labelEn: 'Material Type', labelEs: 'Tipo de Material', val: product.specs.material },
    { labelEn: 'Edge Type', labelEs: 'Tipo de Borde', val: product.specs.edgeType },
    { labelEn: 'Finish / Surface', labelEs: 'Acabado Superficial', val: product.specs.finish },
    { labelEn: 'Shade Variation', labelEs: 'Variación de Tonalidad', val: product.specs.shadeVariation },
    { labelEn: 'Random Faces', labelEs: 'Caras Aleatorias', val: product.specs.randomFaces },
    { labelEn: 'PEI Rating', labelEs: 'Clasificación PEI', val: product.specs.peiRating },
    { labelEn: 'Printing Tech', labelEs: 'Tecnología de Impresión', val: product.specs.printingTechnology },
    { labelEn: 'Frost Resistance', labelEs: 'Resistencia a Heladas', val: product.specs.frostResistant },
    { labelEn: 'Water Resistance', labelEs: 'Resistencia al Agua', val: product.specs.waterResistant },
    { labelEn: 'Water Absorption', labelEs: 'Absorción de Agua', val: product.specs.waterAbsorption },
    { labelEn: 'Wear Resistance', labelEs: 'Resistencia al Desgaste', val: product.specs.wearResistance },
    { labelEn: 'Slip Resistance (DCOF)', labelEs: 'Antideslizante (DCOF)', val: product.specs.slipResistance },
    { labelEn: 'Residential Use', labelEs: 'Uso Residencial', val: product.specs.residentialUse },
    { labelEn: 'Commercial Use', labelEs: 'Uso Comercial', val: product.specs.commercialUse },
    { labelEn: 'Indoor Application', labelEs: 'Aplicación en Interiores', val: product.specs.indoorApplication },
    { labelEn: 'Outdoor Application', labelEs: 'Aplicación en Exteriores', val: product.specs.outdoorApplication },
    { labelEn: 'Wall Application', labelEs: 'Aplicación en Paredes', val: product.specs.wallApplication },
    { labelEn: 'Floor Application', labelEs: 'Aplicación en Pisos', val: product.specs.floorApplication },
  ];

  // Draw 2-column specs
  const col1X = margin;
  const col2X = margin + colWidth + 8;
  const half = Math.ceil(specs.length / 2);

  for (let i = 0; i < half; i++) {
    const item1 = specs[i];
    const item2 = specs[i + half];
    const rowY = y + i * 5.8;

    // Alternate row zebra striping
    if (i % 2 === 0) {
      doc.setFillColor(248, 250, 253);
      doc.rect(col1X, rowY - 3.8, colWidth, 5.8, 'F');
      if (item2) doc.rect(col2X, rowY - 3.8, colWidth, 5.8, 'F');
    }

    // Col 1
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7);
    doc.setTextColor(40, 50, 65);
    doc.text(lang === 'es' ? item1.labelEs : item1.labelEn, col1X + 2, rowY);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(80, 90, 105);
    doc.text(item1.val || '—', col1X + colWidth - 2, rowY, { align: 'right' });

    // Col 2
    if (item2) {
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(7);
      doc.setTextColor(40, 50, 65);
      doc.text(lang === 'es' ? item2.labelEs : item2.labelEn, col2X + 2, rowY);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(80, 90, 105);
      doc.text(item2.val || '—', col2X + colWidth - 2, rowY, { align: 'right' });
    }
  }

  y += half * 5.8 + 6;

  // Packaging and Logistics Section
  doc.setFillColor(24, 43, 73);
  doc.rect(margin, y, pageWidth - margin * 2, 7, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(255, 255, 255);
  doc.text(lang === 'es' ? 'EMPAQUE Y LOGÍSTICA (ESTÁNDAR EE. UU.)' : 'PACKAGING & LOGISTICS (US STANDARD)', margin + 4, y + 4.8);

  y += 11;

  // Box Info Box
  doc.setFillColor(255, 255, 255);
  doc.setDrawColor(210, 218, 230);
  doc.rect(col1X, y, colWidth, 38, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(24, 43, 73);
  doc.text(lang === 'es' ? 'INFORMACIÓN POR CAJA' : 'BOX INFORMATION', col1X + 4, y + 6);

  const boxRows = [
    { label: lang === 'es' ? 'Piezas por caja:' : 'Pieces per Box:', val: product.packaging.piecesPerBox ?? '—' },
    { label: lang === 'es' ? 'Pies cuadrados por caja:' : 'Sq Ft per Box:', val: product.packaging.sqFtPerBox ? `${product.packaging.sqFtPerBox} sq ft` : '—' },
    { label: lang === 'es' ? 'Peso por caja:' : 'Weight per Box:', val: product.packaging.weightLbsPerBox ? `${product.packaging.weightLbsPerBox} lbs` : '—' },
    { label: lang === 'es' ? 'Dimensiones de caja:' : 'Box Dimensions:', val: product.packaging.boxDimensions ?? '—' },
  ];

  boxRows.forEach((r, idx) => {
    const rowY = y + 13 + idx * 5.5;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(70, 80, 95);
    doc.text(r.label, col1X + 4, rowY);
    doc.setFont('helvetica', 'bold');
    doc.text(String(r.val), col1X + colWidth - 4, rowY, { align: 'right' });
  });

  // Pallet Info Box
  doc.setFillColor(255, 255, 255);
  doc.rect(col2X, y, colWidth, 38, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(24, 43, 73);
  doc.text(lang === 'es' ? 'INFORMACIÓN POR PALLET' : 'PALLET INFORMATION', col2X + 4, y + 6);

  const palletRows = [
    { label: lang === 'es' ? 'Piezas por pallet:' : 'Pieces per Pallet:', val: product.packaging.piecesPerPallet ?? '—' },
    { label: lang === 'es' ? 'Pies cuadrados por pallet:' : 'Sq Ft per Pallet:', val: product.packaging.sqFtPerPallet ? `${product.packaging.sqFtPerPallet} sq ft` : '—' },
    { label: lang === 'es' ? 'Peso por pallet:' : 'Weight per Pallet:', val: product.packaging.weightLbsPerPallet ? `${product.packaging.weightLbsPerPallet} lbs` : '—' },
    { label: lang === 'es' ? 'Dimensiones de pallet:' : 'Pallet Dimensions:', val: product.packaging.palletDimensions ?? '—' },
  ];

  palletRows.forEach((r, idx) => {
    const rowY = y + 13 + idx * 5.5;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(70, 80, 95);
    doc.text(r.label, col2X + 4, rowY);
    doc.setFont('helvetica', 'bold');
    doc.text(String(r.val), col2X + colWidth - 4, rowY, { align: 'right' });
  });

  // Footer Disclaimer
  doc.setFontSize(6.5);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(140, 150, 165);
  doc.text(
    lang === 'es'
      ? 'ARGO MOSAIC • Todos los derechos reservados. Especificaciones comerciales y de empaque sujetas a calibración de lote. Verifique muestras físicas antes de la instalación.'
      : 'ARGO MOSAIC • All rights reserved. Commercial and packaging specifications subject to batch calibration. Verify physical samples before final installation.',
    pageWidth / 2,
    pageHeight - 8,
    { align: 'center' }
  );

  doc.save(`${product.sku || 'ARGO-MOSAIC'}-tech-sheet.pdf`);
}
