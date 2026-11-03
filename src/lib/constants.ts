import { ProductCategory } from '@prisma/client';

export const FALLBACK_PRODUCTS = [
  {
    id: 'prod-apex-shell',
    name: 'Apex Bio-Shell 3L Storm Jacket',
    slug: 'apex-bio-shell-3l-jacket',
    description:
      'The definitive ultra-light mountain storm shell. Engineered with our proprietary 100% bio-based Polyether-Ester monolithic membrane. Zero PFAS, zero fluorochemicals, fully circular monomaterial construction.',
    category: ProductCategory.SHELLS,
    basePrice: 380.0,
    isMonomaterial: true,
    polymerType: '100% Bio-Polyether-Ester',
    weightGrams: 178,
    hydrostaticMm: 25000,
    mvtrRating: 35000,
    pfasFree: true,
    heroImage:
      'https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&q=80&w=1200',
    images: [
      'https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&q=80&w=1200',
    ],
    isPublished: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 'prod-kinetic-fleece',
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
    heroImage:
      'https://images.unsplash.com/photo-1578587018452-892bacefd3f2?auto=format&fit=crop&q=80&w=1200',
    images: [
      'https://images.unsplash.com/photo-1578587018452-892bacefd3f2?auto=format&fit=crop&q=80&w=1200',
    ],
    isPublished: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 'prod-strider-short',
    name: 'Strider 5" Technical Trail Short',
    slug: 'strider-5-technical-trail-short',
    description:
      'Zero-bounce integrated 360-degree waist belt system capable of holding a 500ml soft flask, phone, and 6 gels without chafing.',
    category: ProductCategory.BOTTOMS,
    basePrice: 125.0,
    isMonomaterial: true,
    polymerType: '100% Circular Bio-Polymer',
    weightGrams: 98,
    hydrostaticMm: null,
    mvtrRating: 50000,
    pfasFree: true,
    heroImage:
      'https://images.unsplash.com/photo-1591195853828-11db59a44f6b?auto=format&fit=crop&q=80&w=1200',
    images: [
      'https://images.unsplash.com/photo-1591195853828-11db59a44f6b?auto=format&fit=crop&q=80&w=1200',
    ],
    isPublished: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];
