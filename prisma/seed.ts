import { PrismaClient, ProductCategory, Role, PassportStatus, GarmentGrade } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('--- Cleaning existing records ---');
  await prisma.tradeInRecord.deleteMany({});
  await prisma.productPassport.deleteMany({});
  await prisma.review.deleteMany({});
  await prisma.orderItem.deleteMany({});
  await prisma.order.deleteMany({});
  await prisma.productVariant.deleteMany({});
  await prisma.product.deleteMany({});
  await prisma.address.deleteMany({});
  await prisma.user.deleteMany({});

  console.log('--- Seeding Users ---');
  // Passwords can be hashed in production; placeholder bcrypt hash for 'Sportify2026!'
  const admin = await prisma.user.create({
    data: {
      email: 'admin@sportify.com',
      name: 'Sportify Admin',
      passwordHash: '$2a$12$K8yN4k9cTjN9wQZ6V9Jzveo4oT5k7Jk.wT6N9h4E4lW8.pE8lQohe', // Sportify2026!
      role: Role.ADMIN,
      phone: '+1-303-555-0199',
    },
  });

  const athlete = await prisma.user.create({
    data: {
      email: 'runner@trail.org',
      name: 'Elena Rostova',
      passwordHash: '$2a$12$K8yN4k9cTjN9wQZ6V9Jzveo4oT5k7Jk.wT6N9h4E4lW8.pE8lQohe',
      role: Role.CUSTOMER,
      phone: '+1-801-555-0144',
      addresses: {
        create: {
          street: '1420 Mountain View Trail',
          city: 'Boulder',
          state: 'CO',
          postalCode: '80302',
          country: 'US',
          isDefault: true,
        },
      },
    },
  });

  console.log('--- Seeding Technical Products & Variants ---');

  // Product 1: Apex Bio-Shell 3L Jacket
  const apexShell = await prisma.product.create({
    data: {
      name: 'Apex Bio-Shell 3L Storm Jacket',
      slug: 'apex-bio-shell-3l-jacket',
      description:
        'The definitive ultra-light mountain storm shell. Engineered with our proprietary 100% bio-based Polyether-Ester monolithic membrane. Zero PFAS, zero fluorochemicals, fully circular monomaterial construction. Tested and certified for UTMB and Western States mandatory gear regulations.',
      category: ProductCategory.SHELLS,
      basePrice: 380.0,
      isMonomaterial: true,
      polymerType: '100% Bio-Polyether-Ester (Face, Membrane, Backer)',
      weightGrams: 178,
      hydrostaticMm: 25000,
      mvtrRating: 35000,
      pfasFree: true,
      heroImage: 'https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&q=80&w=1200',
      images: [
        'https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&q=80&w=1200',
        'https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&q=80&w=1200',
      ],
      variants: {
        create: [
          { sku: 'SPFY-APX-BLK-S', size: 'S', color: 'Granite Black', colorHex: '#18181b', stockQuantity: 35 },
          { sku: 'SPFY-APX-BLK-M', size: 'M', color: 'Granite Black', colorHex: '#18181b', stockQuantity: 60 },
          { sku: 'SPFY-APX-BLK-L', size: 'L', color: 'Granite Black', colorHex: '#18181b', stockQuantity: 40 },
          { sku: 'SPFY-APX-ALM-S', size: 'S', color: 'Alpine Moss', colorHex: '#27272a', stockQuantity: 20 },
          { sku: 'SPFY-APX-ALM-M', size: 'M', color: 'Alpine Moss', colorHex: '#27272a', stockQuantity: 45 },
          { sku: 'SPFY-APX-ALM-L', size: 'L', color: 'Alpine Moss', colorHex: '#27272a', stockQuantity: 25 },
        ],
      },
    },
  });

  // Product 2: Kinetic Aerobic Grid Fleece
  const kineticFleece = await prisma.product.create({
    data: {
      name: 'Kinetic Aerobic Grid Mid-Layer',
      slug: 'kinetic-aerobic-grid-midlayer',
      description:
        'High-output thermal regulation midlayer with channels of bi-component grid fleece. Dries 3x faster than traditional fleece while packing down to the size of a water flask.',
      category: ProductCategory.MID_LAYERS,
      basePrice: 165.0,
      isMonomaterial: true,
      polymerType: '100% Recycled Polyether-Ester',
      weightGrams: 195,
      hydrostaticMm: null,
      mvtrRating: 45000,
      pfasFree: true,
      heroImage: 'https://images.unsplash.com/photo-1578587018452-892bacefd3f2?auto=format&fit=crop&q=80&w=1200',
      images: [
        'https://images.unsplash.com/photo-1578587018452-892bacefd3f2?auto=format&fit=crop&q=80&w=1200',
      ],
      variants: {
        create: [
          { sku: 'SPFY-KNT-BLK-S', size: 'S', color: 'Obsidian', colorHex: '#09090b', stockQuantity: 50 },
          { sku: 'SPFY-KNT-BLK-M', size: 'M', color: 'Obsidian', colorHex: '#09090b', stockQuantity: 75 },
          { sku: 'SPFY-KNT-BLK-L', size: 'L', color: 'Obsidian', colorHex: '#09090b', stockQuantity: 30 },
        ],
      },
    },
  });

  // Product 3: Strider Technical Trail Short
  const trailShort = await prisma.product.create({
    data: {
      name: 'Strider 5" Technical Trail Short',
      slug: 'strider-5-technical-trail-short',
      description:
        'Zero-bounce integrated 360-degree waist belt system capable of holding a 500ml soft flask, phone, and 6 gels without chafing. Bonded hem construction with non-fluorinated water repellency.',
      category: ProductCategory.BOTTOMS,
      basePrice: 125.0,
      isMonomaterial: true,
      polymerType: '100% Circular Bio-Polymer',
      weightGrams: 98,
      hydrostaticMm: null,
      mvtrRating: 50000,
      pfasFree: true,
      heroImage: 'https://images.unsplash.com/photo-1591195853828-11db59a44f6b?auto=format&fit=crop&q=80&w=1200',
      images: [
        'https://images.unsplash.com/photo-1591195853828-11db59a44f6b?auto=format&fit=crop&q=80&w=1200',
      ],
      variants: {
        create: [
          { sku: 'SPFY-STR-S', size: 'S', color: 'Deep Charcoal', colorHex: '#27272a', stockQuantity: 40 },
          { sku: 'SPFY-STR-M', size: 'M', color: 'Deep Charcoal', colorHex: '#27272a', stockQuantity: 80 },
          { sku: 'SPFY-STR-L', size: 'L', color: 'Deep Charcoal', colorHex: '#27272a', stockQuantity: 50 },
        ],
      },
    },
  });

  // Product 4: Alpine Weather Tights
  const weatherTight = await prisma.product.create({
    data: {
      name: 'Alpine Sub-Zero Weather Tights',
      slug: 'alpine-sub-zero-weather-tights',
      description:
        'Targeted wind-proof and waterproof thigh panels with breathable compression calves. Built for high-altitude ridgelines and below-freezing ultra trail blocks.',
      category: ProductCategory.BOTTOMS,
      basePrice: 175.0,
      isMonomaterial: true,
      polymerType: '100% Monomaterial Stretch PEE',
      weightGrams: 210,
      hydrostaticMm: 15000,
      mvtrRating: 30000,
      pfasFree: true,
      heroImage: 'https://images.unsplash.com/photo-1506629082955-511b1aa562c8?auto=format&fit=crop&q=80&w=1200',
      images: [
        'https://images.unsplash.com/photo-1506629082955-511b1aa562c8?auto=format&fit=crop&q=80&w=1200',
      ],
      variants: {
        create: [
          { sku: 'SPFY-TGT-S', size: 'S', color: 'Slate Black', colorHex: '#09090b', stockQuantity: 30 },
          { sku: 'SPFY-TGT-M', size: 'M', color: 'Slate Black', colorHex: '#09090b', stockQuantity: 60 },
          { sku: 'SPFY-TGT-L', size: 'L', color: 'Slate Black', colorHex: '#09090b', stockQuantity: 40 },
        ],
      },
    },
  });

  console.log('--- Seeding Digital Product Passports (DPP) ---');
  // Seeding passport that can be verified immediately via /passport/SPFY-2026-APEX-008492
  await prisma.productPassport.create({
    data: {
      serialNumber: 'SPFY-2026-APEX-008492',
      nfcTagId: 'NFC-8492-9901-X',
      productId: apexShell.id,
      currentOwnerId: athlete.id,
      manufactureBatch: 'BATCH-2026-Q1-PORTUGAL',
      manufactureDate: new Date('2026-02-14'),
      tier1Factory: 'Porto Precision Ultrasonic Assembly (Facility #402), Portugal',
      tier2Mill: 'Taichung Bio-Polymer Advanced Clean-Energy Mill (Facility #12), Taiwan',
      carbonFootprintKg: 4.12,
      waterUsageLiters: 18.5,
      guaranteedBuybackUSD: 110.0,
      status: PassportStatus.ACTIVE,
      currentGrade: GarmentGrade.MINT,
    },
  });

  await prisma.productPassport.create({
    data: {
      serialNumber: 'SPFY-2026-APEX-008493',
      nfcTagId: 'NFC-8493-9902-Y',
      productId: apexShell.id,
      manufactureBatch: 'BATCH-2026-Q1-PORTUGAL',
      manufactureDate: new Date('2026-02-14'),
      tier1Factory: 'Porto Precision Ultrasonic Assembly (Facility #402), Portugal',
      tier2Mill: 'Taichung Bio-Polymer Advanced Clean-Energy Mill (Facility #12), Taiwan',
      carbonFootprintKg: 4.12,
      waterUsageLiters: 18.5,
      guaranteedBuybackUSD: 110.0,
      status: PassportStatus.ACTIVE,
      currentGrade: GarmentGrade.MINT,
    },
  });

  console.log('--- Seed Completed Successfully ---');
}

main()
  .catch((e) => {
    console.error('Seed error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
