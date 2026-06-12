import bcrypt from "bcryptjs";
import { PrismaClient } from "@prisma/client";
import { Decimal } from "@prisma/client/runtime/library";

const prisma = new PrismaClient();

const perfumeImages = [
  "https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&w=900&h=1100&q=80",
  "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=900&h=1100&q=80",
  "https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&w=900&h=1100&q=80",
  "https://images.unsplash.com/photo-1615634260167-c8cdede054de?auto=format&fit=crop&w=900&h=1100&q=80",
  "https://images.unsplash.com/photo-1523293182086-7651a899d37f?auto=format&fit=crop&w=900&h=1100&q=80",
  "https://images.unsplash.com/photo-1591375372226-3531cf2bdf4f?auto=format&fit=crop&w=900&h=1100&q=80"
] as const;

function productImage(index: number, altIndex = 0) {
  return perfumeImages[(index + altIndex) % perfumeImages.length];
}

const productSeeds = [
  {
    name: "Bukhari Oud Royale",
    slug: "bukhari-oud-royale",
    description: "A regal oud blend crafted for evening wear with smoky depth and warm spice.",
    price: 8900,
    salePrice: 7900,
    stock: 60,
    sku: "BK-OR-001",
    categorySlug: "oud-attar",
    gender: "UNISEX",
    concentration: "PARFUM",
    scentFamily: "WOODY",
    isFeatured: true,
    tags: ["oud", "royal", "night"],
    images: [productImage(0), productImage(1)],
    notes: [
      { noteType: "TOP", ingredientName: "Saffron", intensity: 7 },
      { noteType: "HEART", ingredientName: "Rose", intensity: 8 },
      { noteType: "BASE", ingredientName: "Agarwood", intensity: 10 }
    ],
    sizes: [
      { sizeMl: 50, price: 7900, stock: 30 },
      { sizeMl: 100, price: 12900, stock: 20 }
    ]
  },
  {
    name: "Lahore Midnight Amber",
    slug: "lahore-midnight-amber",
    description: "Amber-rich signature scent from Bukhari Perfumes with a soft tobacco trail.",
    price: 7600,
    salePrice: null,
    stock: 70,
    sku: "BK-AM-002",
    categorySlug: "niche-collection",
    gender: "UNISEX",
    concentration: "EAU_DE_PARFUM",
    scentFamily: "ORIENTAL",
    isFeatured: true,
    tags: ["amber", "warm", "lahore"],
    images: [productImage(1), productImage(2)],
    notes: [
      { noteType: "TOP", ingredientName: "Bergamot", intensity: 6 },
      { noteType: "HEART", ingredientName: "Amber", intensity: 9 },
      { noteType: "BASE", ingredientName: "Tobacco", intensity: 8 }
    ],
    sizes: [
      { sizeMl: 50, price: 7600, stock: 35 },
      { sizeMl: 100, price: 11800, stock: 20 }
    ]
  },
  {
    name: "Jasmine Dusk",
    slug: "jasmine-dusk",
    description: "A floral evening profile built around South Asian jasmine and creamy woods.",
    price: 6400,
    salePrice: 5900,
    stock: 80,
    sku: "BK-JD-003",
    categorySlug: "niche-collection",
    gender: "WOMEN",
    concentration: "EAU_DE_PARFUM",
    scentFamily: "FLORAL",
    isFeatured: false,
    tags: ["jasmine", "floral", "elegant"],
    images: [productImage(2)],
    notes: [
      { noteType: "TOP", ingredientName: "Pear", intensity: 5 },
      { noteType: "HEART", ingredientName: "Jasmine", intensity: 10 },
      { noteType: "BASE", ingredientName: "Sandalwood", intensity: 6 }
    ],
    sizes: [
      { sizeMl: 50, price: 5900, stock: 30 },
      { sizeMl: 100, price: 9800, stock: 18 }
    ]
  },
  {
    name: "Citrus Minar",
    slug: "citrus-minar",
    description: "Fresh and bright daytime scent inspired by Lahore mornings and citrus orchards.",
    price: 5200,
    salePrice: null,
    stock: 100,
    sku: "BK-CM-004",
    categorySlug: "signature-eau-de-parfum",
    gender: "MEN",
    concentration: "EAU_DE_TOILETTE",
    scentFamily: "CITRUS",
    isFeatured: false,
    tags: ["fresh", "citrus", "daytime"],
    images: [productImage(3)],
    notes: [
      { noteType: "TOP", ingredientName: "Grapefruit", intensity: 8 },
      { noteType: "HEART", ingredientName: "Neroli", intensity: 6 },
      { noteType: "BASE", ingredientName: "Vetiver", intensity: 5 }
    ],
    sizes: [
      { sizeMl: 50, price: 5200, stock: 45 },
      { sizeMl: 100, price: 8500, stock: 30 }
    ]
  },
  {
    name: "Velvet Saffron",
    slug: "velvet-saffron",
    description: "Spiced saffron with a velvety rose core and resinous dry down.",
    price: 8300,
    salePrice: null,
    stock: 55,
    sku: "BK-VS-005",
    categorySlug: "niche-collection",
    gender: "UNISEX",
    concentration: "PARFUM",
    scentFamily: "ORIENTAL",
    isFeatured: true,
    tags: ["saffron", "luxury", "spiced"],
    images: [productImage(4)],
    notes: [
      { noteType: "TOP", ingredientName: "Saffron", intensity: 9 },
      { noteType: "HEART", ingredientName: "Damask Rose", intensity: 7 },
      { noteType: "BASE", ingredientName: "Labdanum", intensity: 8 }
    ],
    sizes: [
      { sizeMl: 50, price: 8300, stock: 24 },
      { sizeMl: 100, price: 13600, stock: 16 }
    ]
  },
  {
    name: "Noor Al Musk",
    slug: "noor-al-musk",
    description: "Clean white musk signature with soft floral facets and lasting comfort.",
    price: 5900,
    salePrice: 5400,
    stock: 90,
    sku: "BK-NM-006",
    categorySlug: "signature-eau-de-parfum",
    gender: "WOMEN",
    concentration: "EAU_DE_PARFUM",
    scentFamily: "FRESH",
    isFeatured: false,
    tags: ["musk", "clean", "daily"],
    images: [productImage(5)],
    notes: [
      { noteType: "TOP", ingredientName: "Aldehydes", intensity: 6 },
      { noteType: "HEART", ingredientName: "White Flowers", intensity: 6 },
      { noteType: "BASE", ingredientName: "White Musk", intensity: 9 }
    ],
    sizes: [
      { sizeMl: 50, price: 5400, stock: 40 },
      { sizeMl: 100, price: 8900, stock: 25 }
    ]
  },
  {
    name: "Imperial Cedar",
    slug: "imperial-cedar",
    description: "A woody masculine profile centered on cedar, patchouli, and dry amber.",
    price: 6800,
    salePrice: null,
    stock: 75,
    sku: "BK-IC-007",
    categorySlug: "signature-eau-de-parfum",
    gender: "MEN",
    concentration: "EAU_DE_PARFUM",
    scentFamily: "WOODY",
    isFeatured: false,
    tags: ["cedar", "masculine", "classic"],
    images: [productImage(0, 2)],
    notes: [
      { noteType: "TOP", ingredientName: "Pink Pepper", intensity: 5 },
      { noteType: "HEART", ingredientName: "Cedarwood", intensity: 9 },
      { noteType: "BASE", ingredientName: "Patchouli", intensity: 7 }
    ],
    sizes: [
      { sizeMl: 50, price: 6800, stock: 30 },
      { sizeMl: 100, price: 10800, stock: 20 }
    ]
  },
  {
    name: "Rosewood Attar",
    slug: "rosewood-attar",
    description: "Traditional attar concentration balancing rich rose and dark woods.",
    price: 4700,
    salePrice: null,
    stock: 110,
    sku: "BK-RA-008",
    categorySlug: "oud-attar",
    gender: "UNISEX",
    concentration: "ATTAR",
    scentFamily: "CHYPRE",
    isFeatured: false,
    tags: ["attar", "rose", "traditional"],
    images: [productImage(1, 1)],
    notes: [
      { noteType: "TOP", ingredientName: "Geranium", intensity: 6 },
      { noteType: "HEART", ingredientName: "Turkish Rose", intensity: 8 },
      { noteType: "BASE", ingredientName: "Oud Accord", intensity: 8 }
    ],
    sizes: [
      { sizeMl: 12, price: 4700, stock: 50 },
      { sizeMl: 24, price: 8600, stock: 25 }
    ]
  },
  {
    name: "Aqua Souk",
    slug: "aqua-souk",
    description: "Marine-citrus blend with a clean aquatic profile for hot weather days.",
    price: 5100,
    salePrice: 4600,
    stock: 95,
    sku: "BK-AS-009",
    categorySlug: "signature-eau-de-parfum",
    gender: "UNISEX",
    concentration: "EAU_DE_TOILETTE",
    scentFamily: "AQUATIC",
    isFeatured: false,
    tags: ["aquatic", "summer", "fresh"],
    images: [productImage(2, 1)],
    notes: [
      { noteType: "TOP", ingredientName: "Lemon Peel", intensity: 7 },
      { noteType: "HEART", ingredientName: "Sea Notes", intensity: 8 },
      { noteType: "BASE", ingredientName: "Ambergris Accord", intensity: 6 }
    ],
    sizes: [
      { sizeMl: 50, price: 4600, stock: 42 },
      { sizeMl: 100, price: 7900, stock: 28 }
    ]
  },
  {
    name: "Gourmand Majlis",
    slug: "gourmand-majlis",
    description: "Dessert-inspired scent with vanilla, coffee and caramelized warmth.",
    price: 7100,
    salePrice: null,
    stock: 65,
    sku: "BK-GM-010",
    categorySlug: "niche-collection",
    gender: "UNISEX",
    concentration: "EAU_DE_PARFUM",
    scentFamily: "GOURMAND",
    isFeatured: true,
    tags: ["gourmand", "vanilla", "coffee"],
    images: [productImage(3, 2)],
    notes: [
      { noteType: "TOP", ingredientName: "Cinnamon", intensity: 6 },
      { noteType: "HEART", ingredientName: "Coffee", intensity: 8 },
      { noteType: "BASE", ingredientName: "Vanilla", intensity: 9 }
    ],
    sizes: [
      { sizeMl: 50, price: 7100, stock: 26 },
      { sizeMl: 100, price: 11500, stock: 17 }
    ]
  }
] as const;

async function main() {
  const adminPasswordHash = await bcrypt.hash("Admin@12345", 12);
  const customerPasswordHash = await bcrypt.hash("Customer@12345", 12);

  const adminUser = await prisma.user.upsert({
    where: { email: "admin@bukhariperfumes.local" },
    update: {
      name: "Bukhari Admin",
      role: "ADMIN",
      passwordHash: adminPasswordHash,
      isVerified: true,
      loyaltyPoints: 1500,
      avatar:
        "https://ui-avatars.com/api/?name=Bukhari+Admin&background=C9A227&color=1a1a1a&size=128"
    },
    create: {
      email: "admin@bukhariperfumes.local",
      name: "Bukhari Admin",
      role: "ADMIN",
      passwordHash: adminPasswordHash,
      phone: "+923001112233",
      isVerified: true,
      loyaltyPoints: 1500,
      avatar:
        "https://ui-avatars.com/api/?name=Bukhari+Admin&background=C9A227&color=1a1a1a&size=128"
    }
  });

  const reviewerUser = await prisma.user.upsert({
    where: { email: "fatima.reviews@bukhariperfumes.local" },
    update: {
      name: "Fatima S.",
      role: "CUSTOMER",
      passwordHash: customerPasswordHash,
      isVerified: true
    },
    create: {
      email: "fatima.reviews@bukhariperfumes.local",
      name: "Fatima S.",
      role: "CUSTOMER",
      passwordHash: customerPasswordHash,
      isVerified: true
    }
  });

  const customerUser = await prisma.user.upsert({
    where: { email: "customer@bukhariperfumes.local" },
    update: {
      name: "Bukhari Customer",
      role: "CUSTOMER",
      passwordHash: customerPasswordHash,
      isVerified: true,
      loyaltyPoints: 320,
      avatar:
        "https://ui-avatars.com/api/?name=Bukhari+Customer&background=3d2c29&color=f5f0eb&size=128"
    },
    create: {
      email: "customer@bukhariperfumes.local",
      name: "Bukhari Customer",
      role: "CUSTOMER",
      passwordHash: customerPasswordHash,
      phone: "+923009998877",
      isVerified: true,
      loyaltyPoints: 320,
      avatar:
        "https://ui-avatars.com/api/?name=Bukhari+Customer&background=3d2c29&color=f5f0eb&size=128"
    }
  });

  await prisma.address.createMany({
    data: [
      {
        userId: adminUser.id,
        label: "Office",
        street: "MM Alam Road 12",
        area: "Gulberg",
        city: "Lahore",
        province: "Punjab",
        postalCode: "54000",
        isDefault: true
      },
      {
        userId: customerUser.id,
        label: "Home",
        street: "Street 9, House 24",
        area: "Johar Town",
        city: "Lahore",
        province: "Punjab",
        postalCode: "54782",
        isDefault: true
      }
    ],
    skipDuplicates: true
  });

  const categories = [
    {
      name: "Signature Eau De Parfum",
      slug: "signature-eau-de-parfum",
      description: "Everyday luxury fragrances by Bukhari Perfumes.",
      image:
        "https://images.unsplash.com/photo-1615634260167-c8cdede054de?auto=format&fit=crop&w=1200&q=80"
    },
    {
      name: "Oud & Attar",
      slug: "oud-attar",
      description: "Traditional and modern oud-forward concentrated oils.",
      image:
        "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=1200&q=80"
    },
    {
      name: "Niche Collection",
      slug: "niche-collection",
      description: "Small-batch artistic creations from Bukhari Perfumes.",
      image:
        "https://images.unsplash.com/photo-1591375372226-3531cf2bdf4f?auto=format&fit=crop&w=1200&q=80"
    }
  ];

  for (const category of categories) {
    await prisma.category.upsert({
      where: { slug: category.slug },
      update: category,
      create: category
    });
  }

  for (const product of productSeeds) {
    const category = await prisma.category.findUniqueOrThrow({
      where: { slug: product.categorySlug }
    });

    await prisma.product.upsert({
      where: { slug: product.slug },
      update: {
        name: product.name,
        description: product.description,
        price: new Decimal(product.price),
        salePrice: product.salePrice ? new Decimal(product.salePrice) : null,
        stock: product.stock,
        sku: product.sku,
        categoryId: category.id,
        gender: product.gender,
        concentration: product.concentration,
        scentFamily: product.scentFamily,
        isFeatured: product.isFeatured,
        tags: [...product.tags]
      },
      create: {
        name: product.name,
        slug: product.slug,
        description: product.description,
        price: new Decimal(product.price),
        salePrice: product.salePrice ? new Decimal(product.salePrice) : null,
        stock: product.stock,
        sku: product.sku,
        categoryId: category.id,
        gender: product.gender,
        concentration: product.concentration,
        scentFamily: product.scentFamily,
        isFeatured: product.isFeatured,
        tags: [...product.tags]
      }
    });

    const dbProduct = await prisma.product.findUniqueOrThrow({
      where: { slug: product.slug }
    });

    await prisma.productImage.deleteMany({ where: { productId: dbProduct.id } });
    await prisma.scentNote.deleteMany({ where: { productId: dbProduct.id } });
    await prisma.productSize.deleteMany({ where: { productId: dbProduct.id } });

    await prisma.productImage.createMany({
      data: product.images.map((url, index) => ({
        productId: dbProduct.id,
        url,
        publicId: null,
        altText: `${product.name} image ${index + 1}`,
        isMain: index === 0,
        sortOrder: index
      }))
    });

    await prisma.scentNote.createMany({
      data: product.notes.map((note) => ({
        productId: dbProduct.id,
        noteType: note.noteType,
        ingredientName: note.ingredientName,
        intensity: note.intensity
      }))
    });

    await prisma.productSize.createMany({
      data: product.sizes.map((size) => ({
        productId: dbProduct.id,
        sizeMl: size.sizeMl,
        price: new Decimal(size.price),
        stock: size.stock
      }))
    });
  }

  await prisma.discount.upsert({
    where: { code: "WELCOME10" },
    update: {
      isActive: true,
      type: "PERCENTAGE",
      value: new Decimal(10),
      minOrder: new Decimal(3000),
      maxUses: 500
    },
    create: {
      code: "WELCOME10",
      type: "PERCENTAGE",
      value: new Decimal(10),
      minOrder: new Decimal(3000),
      maxUses: 500,
      isActive: true
    }
  });

  const oudProduct = await prisma.product.findUnique({ where: { slug: "bukhari-oud-royale" } });
  const roseProduct = await prisma.product.findUnique({ where: { slug: "rosewood-attar" } });
  const jasmineProduct = await prisma.product.findUnique({ where: { slug: "jasmine-dusk" } });

  if (oudProduct) {
    await prisma.review.upsert({
      where: {
        userId_productId: { userId: customerUser.id, productId: oudProduct.id }
      },
      update: {
        rating: 5,
        comment: "Bukhari Oud Royale is my signature scent — rich, lasting, and unmistakably premium.",
        isVerified: true,
        helpfulCount: 12
      },
      create: {
        userId: customerUser.id,
        productId: oudProduct.id,
        rating: 5,
        comment: "Bukhari Oud Royale is my signature scent — rich, lasting, and unmistakably premium.",
        isVerified: true,
        helpfulCount: 12
      }
    });
  }

  if (roseProduct) {
    await prisma.review.upsert({
      where: {
        userId_productId: { userId: adminUser.id, productId: roseProduct.id }
      },
      update: {
        rating: 5,
        comment: "Rosewood Attar is elegant and beautifully balanced for Lahore evenings.",
        isVerified: true,
        helpfulCount: 8
      },
      create: {
        userId: adminUser.id,
        productId: roseProduct.id,
        rating: 5,
        comment: "Rosewood Attar is elegant and beautifully balanced for Lahore evenings.",
        isVerified: true,
        helpfulCount: 8
      }
    });
  }

  if (jasmineProduct) {
    await prisma.review.upsert({
      where: {
        userId_productId: { userId: reviewerUser.id, productId: jasmineProduct.id }
      },
      update: {
        rating: 5,
        comment: "Jasmine Dusk is divine — soft, elegant, and lasts all day on fabric.",
        isVerified: true,
        helpfulCount: 6
      },
      create: {
        userId: reviewerUser.id,
        productId: jasmineProduct.id,
        rating: 5,
        comment: "Jasmine Dusk is divine — soft, elegant, and lasts all day on fabric.",
        isVerified: true,
        helpfulCount: 6
      }
    });
  }

  await prisma.blogPost.upsert({
    where: { slug: "discover-your-signature-scent" },
    update: {
      title: "Discover Your Signature Scent with Bukhari Perfumes",
      excerpt: "A practical guide to choosing the perfect fragrance profile for Lahore weather and lifestyle.",
      image: perfumeImages[0]
    },
    create: {
      title: "Discover Your Signature Scent with Bukhari Perfumes",
      slug: "discover-your-signature-scent",
      content:
        "Choosing a signature fragrance starts with understanding your scent family preference and concentration tolerance.",
      excerpt: "A practical guide to choosing the perfect fragrance profile for Lahore weather and lifestyle.",
      image: perfumeImages[0],
      authorId: adminUser.id,
      publishedAt: new Date(),
      tags: ["guide", "fragrance", "bukhari-perfumes"]
    }
  });

  const blogPosts = [
    {
      slug: "oud-care-guide",
      title: "How to Layer Oud for Long-Lasting Wear",
      excerpt: "Simple layering tips for attars and parfums in warm climates.",
      image: perfumeImages[1],
      content: "Start with a light citrus base, add your oud heart, and finish with a musk veil."
    },
    {
      slug: "wedding-season-fragrances",
      title: "Wedding Season Fragrance Picks from Bukhari",
      excerpt: "Elegant profiles for baraat nights, mehndi, and walima receptions.",
      image: perfumeImages[2],
      content: "Rose-forward attars and ambered parfums perform beautifully for formal events."
    },
    {
      slug: "gift-sets-that-impress",
      title: "Gift Sets That Impress Every Recipient",
      excerpt: "Curated combinations for Eid, birthdays, and corporate gifting.",
      image: perfumeImages[3],
      content: "Pair a signature EDP with a travel attar for a memorable two-piece gift."
    }
  ];

  for (const post of blogPosts) {
    await prisma.blogPost.upsert({
      where: { slug: post.slug },
      update: {
        title: post.title,
        excerpt: post.excerpt,
        image: post.image,
        content: post.content,
        publishedAt: new Date()
      },
      create: {
        title: post.title,
        slug: post.slug,
        excerpt: post.excerpt,
        image: post.image,
        content: post.content,
        authorId: adminUser.id,
        publishedAt: new Date(),
        tags: ["bukhari-perfumes", "guide"]
      }
    });
  }

  const wishlistSlugs = ["bukhari-oud-royale", "velvet-saffron", "gourmand-majlis", "lahore-midnight-amber"];
  for (const slug of wishlistSlugs) {
    const product = await prisma.product.findUnique({ where: { slug } });
    if (!product) continue;
    await prisma.wishlist.upsert({
      where: { userId_productId: { userId: customerUser.id, productId: product.id } },
      update: {},
      create: { userId: customerUser.id, productId: product.id }
    });
  }

  const cartProductSlugs = [
    { slug: "citrus-minar", quantity: 1 },
    { slug: "noor-al-musk", quantity: 2 }
  ];
  const customerCart = await prisma.cart.upsert({
    where: { userId: customerUser.id },
    update: {},
    create: { userId: customerUser.id }
  });
  await prisma.cartItem.deleteMany({ where: { cartId: customerCart.id } });
  for (const item of cartProductSlugs) {
    const product = await prisma.product.findUnique({
      where: { slug: item.slug },
      include: { sizes: { take: 1, orderBy: { sizeMl: "asc" } } }
    });
    if (!product) continue;
    const size = product.sizes[0];
    const unitPrice = size?.price ?? product.salePrice ?? product.price;
    await prisma.cartItem.create({
      data: {
        cartId: customerCart.id,
        productId: product.id,
        sizeId: size?.id ?? null,
        quantity: item.quantity,
        price: unitPrice
      }
    });
  }

  const orderSeeds = [
    {
      orderNumber: "BK-2026-0001",
      status: "DELIVERED" as const,
      paymentStatus: "PAID" as const,
      items: [
        { slug: "bukhari-oud-royale", quantity: 1, sizeLabel: "50ml" },
        { slug: "rosewood-attar", quantity: 1, sizeLabel: "12ml" }
      ],
      subtotal: 12600,
      discount: 1260,
      shipping: 250,
      total: 11590
    },
    {
      orderNumber: "BK-2026-0002",
      status: "SHIPPED" as const,
      paymentStatus: "PAID" as const,
      items: [{ slug: "jasmine-dusk", quantity: 1, sizeLabel: "50ml" }],
      subtotal: 5900,
      discount: 0,
      shipping: 250,
      total: 6150
    },
    {
      orderNumber: "BK-2026-0003",
      status: "PROCESSING" as const,
      paymentStatus: "PENDING" as const,
      items: [{ slug: "gourmand-majlis", quantity: 1, sizeLabel: "100ml" }],
      subtotal: 11500,
      discount: 0,
      shipping: 300,
      total: 11800
    }
  ];

  for (const orderSeed of orderSeeds) {
    const order = await prisma.order.upsert({
      where: { orderNumber: orderSeed.orderNumber },
      update: {
        status: orderSeed.status,
        paymentStatus: orderSeed.paymentStatus,
        subtotal: new Decimal(orderSeed.subtotal),
        discount: new Decimal(orderSeed.discount),
        shipping: new Decimal(orderSeed.shipping),
        total: new Decimal(orderSeed.total)
      },
      create: {
        userId: customerUser.id,
        orderNumber: orderSeed.orderNumber,
        status: orderSeed.status,
        subtotal: new Decimal(orderSeed.subtotal),
        discount: new Decimal(orderSeed.discount),
        shipping: new Decimal(orderSeed.shipping),
        total: new Decimal(orderSeed.total),
        paymentMethod: "COD",
        paymentStatus: orderSeed.paymentStatus
      }
    });

    await prisma.orderItem.deleteMany({ where: { orderId: order.id } });
    for (const line of orderSeed.items) {
      const product = await prisma.product.findUnique({
        where: { slug: line.slug },
        include: { images: { where: { isMain: true }, take: 1 } }
      });
      if (!product) continue;
      const unitPrice = product.salePrice ?? product.price;
      await prisma.orderItem.create({
        data: {
          orderId: order.id,
          productId: product.id,
          name: product.name,
          price: unitPrice,
          quantity: line.quantity,
          sizeLabel: line.sizeLabel,
          image: product.images[0]?.url ?? perfumeImages[0]
        }
      });
    }
  }

  const diaryEntries = [
    {
      slug: "bukhari-oud-royale",
      rating: 5,
      mood: "Confident",
      occasion: "Evening dinner",
      notes: "Rich oud with excellent projection in cooler weather.",
      daysAgo: 2
    },
    {
      slug: "citrus-minar",
      rating: 4,
      mood: "Fresh",
      occasion: "Office",
      notes: "Bright and clean — perfect for daytime meetings.",
      daysAgo: 5
    },
    {
      slug: "lahore-midnight-amber",
      rating: 5,
      mood: "Warm",
      occasion: "Family gathering",
      notes: "Comforting amber trail that lasts through the night.",
      daysAgo: 9
    }
  ];

  await prisma.scentDiary.deleteMany({ where: { userId: customerUser.id } });

  for (const entry of diaryEntries) {
    const product = await prisma.product.findUnique({ where: { slug: entry.slug } });
    if (!product) continue;
    const wornDate = new Date();
    wornDate.setDate(wornDate.getDate() - entry.daysAgo);
    await prisma.scentDiary.create({
      data: {
        userId: customerUser.id,
        productId: product.id,
        rating: entry.rating,
        mood: entry.mood,
        occasion: entry.occasion,
        notes: entry.notes,
        dateWorn: wornDate
      }
    });
  }

  console.log("Seed complete: Bukhari Perfumes sample data inserted.");
}

main()
  .catch((error) => {
    console.error("Seed failed:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
