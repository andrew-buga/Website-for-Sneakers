export type Locale = "en" | "uk" | "ru"

export const locales: Locale[] = ["en", "uk", "ru"]
export const defaultLocale: Locale = "en"

export type Dictionary = {
  nav: {
    men: string
    women: string
    collections: string
    trends: string
    favorites: string
    cart: string
    account: string
    signIn: string
    register: string
    myAccount: string
  }
  switcher: {
    label: string
    en: string
    uk: string
    ru: string
  }
  search: {
    aria: string
    placeholder: string
    noResults: (query: string) => string
    startTyping: string
    pricePrefix: string
  }
  common: {
    back: string
    seasonal: string
    productsCount: (count: number) => string
    collectionNotFound: string
  }
    common: {
      back: "Back",
      seasonal: "Seasonal",
      productsCount: (count) => `Products (${count})`,
      collectionNotFound: "Collection not found.",
    },
  gallery: {
    noImages: string
    prev: string
    next: string
    imageAlt: (name: string, index: number) => string
    thumbAlt: (name: string, index: number) => string
  }
    gallery: {
      noImages: "No images available",
      prev: "Previous image",
      next: "Next image",
      imageAlt: (name, index) => `${name} - View ${index}`,
      thumbAlt: (name, index) => `${name} thumbnail ${index}`,
    },
  hero: {
    newArrival: string
    titleLine1: string
    titleLine2: string
    modelName: string
    modelTagline: string
    shopNow: string
    exploreCollections: string
    sideText: string
    imageAlt: string
  }
  showcase: {
    featured: string
    newDrops: string
    prev: string
    next: string
    loading: string
    empty: string
    colorLabel: string
    skuLabel: string
    collectionLabel: string
    wishlistAdd: (name: string) => string
    wishlistRemove: (name: string) => string
  }
  collections: {
    seasonal: string
    title: string
    description: string
    winter: string
    winterDescription: string
    summer: string
    summerDescription: string
    autumn: string
    autumnDescription: string
  }
  subscribe: {
    stayConnected: string
    joinUpdates: string
    description: string
    emailPlaceholder: string
    subscribeAria: string
    contactUs: string
  }
  footer: {
    description: string
    helpInfo: string
    returnsRefunds: string
    helpCenter: string
    termsConditions: string
    storeLocator: string
    aboutUs: string
    accessories: string
    privacyPolicy: string
    termsOfUse: string
    receiversAmplifiers: string
    contact: string
    contactPage: string
    portfolioLabel: string
    builtFor: string
    rights: string
  }
  catalogGrid: {
    empty: string
    standardColorway: string
    wishlistAdd: (name: string) => string
    wishlistRemove: (name: string) => string
  }
  filters: {
    size: string
    color: string
    price: string
    minPrice: (value: number) => string
    maxPrice: (value: number) => string
    range: (min: number, max: number) => string
  }
  reviews: {
    title: string
    basedOn: (count: number) => string
    writeReview: string
    rating: string
    shareExperience: string
    posting: string
    postReview: string
    onlyRegistered: string
    signIn: string
    loading: string
    empty: string
    beFirst: string
    helpful: (count: number) => string
    signInToLike: string
    minLength: string
    createFailed: string
  }
  cart: {
    empty: string
    continueShopping: string
    back: string
    title: string
    size: string
    color: string
    orderSummary: string
    subtotal: string
    shipping: string
    tax: string
    total: string
    proceed: string
    clear: string
  }
  favorites: {
    eyebrow: string
    title: string
    description: string
    empty: string
    exploreTrends: string
  }
  product: {
    loading: string
    notFound: string
    back: string
    color: string
    size: string
    chooseSize: string
    quantity: string
    addToCart: string
    added: string
    outOfStock: string
    inStock: (count: number) => string
    addError: string
    wishlistAdd: string
    wishlistRemove: string
    defaultColor: string
    oneSize: string
  }
  infoPages: {
    contactTitle: string
    contactSubtitle: string
    contactPhone: string
    contactEmail: string
    contactResponse: string
    accessoriesTitle: string
    accessoriesSubtitle: string
    accessoriesP1: string
    accessoriesP2: string
    accessoriesP3: string
    storeTitle: string
    storeSubtitle: string
    storeP1: string
    storeP2: string
    storeP3: string
    storeP4: string
    helpTitle: string
    helpSubtitle: string
    helpP1: string
    helpP2: string
    helpP3: string
    helpP4Prefix: string
    helpP4Link: string
    helpP4Suffix: string
    helpPaginationPrefix: string
    helpPaginationLink: string
    helpPaginationSuffix: string
    paginationTitle: string
    paginationSubtitle: string
    paginationP1: string
    paginationP2: string
    paginationP3: string
    paginationP4: string
    privacyTitle: string
    privacySubtitle: string
    privacyP1: string
    privacyP2: string
    privacyP3: string
    privacyP4: string
    termsTitle: string
    termsSubtitle: string
    termsP1: string
    termsP2: string
    termsP3: string
    termsP4: string
    useTitle: string
    useSubtitle: string
    useP1: string
    useP2: string
    useP3: string
    useP4: string
    receiversTitle: string
    receiversSubtitle: string
    receiversP1: string
    receiversP2: string
    receiversP3: string
  }
  returns: {
    title: string
    description: string
    heroTitleLine1: string
    heroTitleLine2: string
    heroDescription: string
    badgeReturnWindow: string
    badgeFreeShipping: string
    badgeFreeExchange: string
    howItWorks: string
    stepLabel: string
    steps: { step: string; title: string; description: string }[]
    startReturn: string
    contactSupport: string
    conditionsTitle: string
    acceptedTitle: string
    notAcceptedTitle: string
    accepted: string[]
    notAccepted: string[]
    faqTitle: string
    faqs: { q: string; a: string }[]
    stillQuestions: string
    stillQuestionsBody: string
    emailSupport: string
    contactForm: string
  }
  pages: {
    home: {
      metadataTitle: string
      metadataDescription: string
      ogTitle: string
      ogDescription: string
    }
    men: {
      metadataTitle: string
      metadataDescription: string
      ogTitle: string
      ogDescription: string
      eyebrow: string
      title: string
      description: string
    }
    women: {
      metadataTitle: string
      metadataDescription: string
      ogTitle: string
      ogDescription: string
      eyebrow: string
      title: string
      description: string
    }
    trends: {
      metadataTitle: string
      metadataDescription: string
      ogTitle: string
      ogDescription: string
      eyebrow: string
      title: string
      description: string
    }
    collections: {
      metadataTitle: string
      metadataDescription: string
      ogTitle: string
      ogDescription: string
      eyebrow: string
      title: string
      description: string
      allProducts: string
    }
  }
}

const dictionaries: Record<Locale, Dictionary> = {
  en: {
    nav: {
      men: "Men",
      women: "Women",
      collections: "Collections",
      trends: "Trends",
      favorites: "Favorites",
      cart: "Cart",
      account: "Account",
      signIn: "Sign In",
      register: "Register",
      myAccount: "My account",
    },
    switcher: {
      label: "Language",
      en: "EN",
      uk: "UK",
      ru: "RU",
    },
    search: {
      aria: "Search",
      placeholder: "Search products...",
      noResults: (query) => `No products found for "${query}"`,
      startTyping: "Start typing to search...",
      pricePrefix: "$",
    },
    hero: {
      newArrival: "New Arrival",
      titleLine1: "New",
      titleLine2: "Sneakers",
      modelName: "Streater Impossible'20",
      modelTagline: "Easy. Airy. Universal.",
      shopNow: "Shop now",
      exploreCollections: "Explore collections",
      sideText: "See What's New",
      imageAlt: "Streater Impossible'20 — New arrival sneaker, lightweight and airy athletic footwear",
    },
    showcase: {
      featured: "Featured",
      newDrops: "New Drops",
      prev: "Previous product",
      next: "Next product",
      loading: "Loading featured products...",
      empty: "No products available yet.",
      colorLabel: "Color",
      skuLabel: "SKU",
      collectionLabel: "Collection",
      wishlistAdd: (name) => `Add ${name} to favorites`,
      wishlistRemove: (name) => `Remove ${name} from favorites`,
    },
    collections: {
      seasonal: "Seasonal",
      title: "Collections",
      description: "Explore curated edits built for changing conditions and everyday comfort.",
      winter: "Winter collection",
      winterDescription: "Warm, durable, and ready for the cold season.",
      summer: "Summer collection",
      summerDescription: "Light, breathable, and built for warm weather movement.",
      autumn: "Autumn collection",
      autumnDescription: "Balanced comfort and richer tones for changing conditions.",
    },
    subscribe: {
      stayConnected: "Stay Connected",
      joinUpdates: "Join Our Updates",
      description: "Get the latest updates on new arrivals, exclusive deals, and more delivered straight to your inbox.",
      emailPlaceholder: "Enter your email",
      subscribeAria: "Subscribe",
      contactUs: "Contact us",
    },
    footer: {
      description: "Streater Store — modern sneaker portfolio, design, and innovation.",
      helpInfo: "Help & Information",
      returnsRefunds: "Returns & Refunds",
      helpCenter: "Help center",
      termsConditions: "Terms & Conditions",
      storeLocator: "Store Locator",
      aboutUs: "About us",
      accessories: "Accessories",
      privacyPolicy: "Privacy Policy",
      termsOfUse: "Terms of use",
      receiversAmplifiers: "Receivers & Amplifiers",
      contact: "Contact",
      contactPage: "Contact page",
      portfolioLabel: "Portfolio:",
      builtFor: "Built for performance, comfort, and everyday style.",
      rights: "© 2026 Streater. All rights reserved.",
    },
    catalogGrid: {
      empty: "No products found.",
      standardColorway: "Standard colorway",
      wishlistAdd: (name) => `Add ${name} to favorites`,
      wishlistRemove: (name) => `Remove ${name} from favorites`,
    },
    filters: {
      size: "Size",
      color: "Color",
      price: "Price",
      minPrice: (value) => `Min Price: $${value}`,
      maxPrice: (value) => `Max Price: $${value}`,
      range: (min, max) => `$${min} - $${max}`,
    },
    reviews: {
      title: "Customer Reviews",
      basedOn: (count) => `Based on ${count} reviews`,
      writeReview: "Write a Review",
      rating: "Rating",
      shareExperience: "Share your experience with this product",
      posting: "Posting...",
      postReview: "Post review",
      onlyRegistered: "Only registered users can write reviews.",
      signIn: "Sign in",
      loading: "Loading reviews...",
      empty: "No reviews yet.",
      beFirst: "Be the first to write one.",
      helpful: (count) => `Helpful (${count})`,
      signInToLike: "Sign in to like reviews",
      minLength: "Review text should be at least 10 characters",
      createFailed: "Failed to create review",
    },
    cart: {
      empty: "Your cart is empty",
      continueShopping: "Continue Shopping",
      back: "Back",
      title: "Shopping Cart",
      size: "Size",
      color: "Color",
      orderSummary: "Order Summary",
      subtotal: "Subtotal:",
      shipping: "Shipping:",
      tax: "Tax:",
      total: "Total:",
      proceed: "Proceed to Checkout",
      clear: "Clear Cart",
    },
    favorites: {
      eyebrow: "Wishlist",
      title: "Favorites",
      description: "Sneakers that you marked with a heart.",
      empty: "No products in favorites yet.",
      exploreTrends: "Explore trends",
    },
    product: {
      loading: "Loading product...",
      notFound: "Product not found",
      back: "Back",
      color: "Color",
      size: "Size",
      chooseSize: "Choose size",
      quantity: "Quantity",
      addToCart: "Add to Cart",
      added: "Added to Cart!",
      outOfStock: "Out of Stock",
      inStock: (count) => `In Stock (${count})`,
      addError: "Please choose a size before adding this product to cart.",
      wishlistAdd: "Add to favorites",
      wishlistRemove: "Remove from favorites",
      defaultColor: "Default",
      oneSize: "One size",
    },
    infoPages: {
      contactTitle: "Contact",
      contactSubtitle: "Get in touch with support and sales.",
      contactPhone: "Phone: +40 740 116 669",
      contactEmail: "Email: official.andrew.buga@gmail.com",
      contactResponse: "Response time: usually within 24 hours on business days.",
      accessoriesTitle: "Accessories",
      accessoriesSubtitle: "Complete your sneaker setup with extra gear.",
      accessoriesP1: "Available accessories include socks, laces, cleaning kits, carry bags, and shoe care products. New arrivals are announced in the \"Updates\" section.",
      accessoriesP2: "Accessory catalog is updated with each seasonal collection release. Limited edition items are available during special events.",
      accessoriesP3: "Contact support for bulk or team orders. Custom branding is available for teams and organizations.",
      storeTitle: "Store Locator",
      storeSubtitle: "Store details and pickup locations.",
      storeP1: "Main store: Strada Universitatii 13, Suceava, Romania. Additional pop-up locations are announced seasonally.",
      storeP2: "Working hours: Monday to Saturday, 10:00 - 20:00. Closed Sundays and holidays.",
      storeP3: "Pickup orders are prepared after payment and confirmation email. Bring your order confirmation for fast pickup.",
      storeP4: "For store events and launches, follow our Behance portfolio.",
      helpTitle: "Help Center",
      helpSubtitle: "Support for orders, account, and delivery.",
      helpP1: "For account issues, visit your profile page to review your details and set a default delivery address. You can update your email, phone, and shipping info at any time.",
      helpP2: "For checkout problems, double-check selected size, stock status, and delivery information. If payment fails, try another method or contact support.",
      helpP3: "Order tracking is available in your account. For lost packages or delays, contact support with your order ID.",
      helpP4Prefix: "For any unresolved issue, use the ",
      helpP4Link: "contact page",
      helpP4Suffix: " and include your order id if available. Our team responds within 24 hours on business days.",
      helpPaginationPrefix: "Need tips on browsing product lists? Read the ",
      helpPaginationLink: "pagination guide",
      helpPaginationSuffix: ".",
      paginationTitle: "Pagination",
      paginationSubtitle: "How product pages and listings are split and navigated.",
      paginationP1: "Product listings are organized by category and collection, allowing you to quickly find the latest drops or classic styles. Each page is paginated for fast loading and easy navigation.",
      paginationP2: "Use the top navigation or search bar to jump directly to your desired product. Filters help narrow down by size, color, or collection.",
      paginationP3: "On mobile, tap the menu icon to switch between pages. Pagination controls appear at the bottom for easy browsing.",
      paginationP4: "If you can't find a product, check the \"Trends\" or \"Favorites\" section for curated picks.",
      privacyTitle: "Privacy Policy",
      privacySubtitle: "How we store and process customer data.",
      privacyP1: "We store account and order data required to process purchases and support delivery. Personal data is never shared with third parties except for payment and shipping providers.",
      privacyP2: "Authentication data is protected with hashed passwords and secure cookies. Payment information is processed securely and never stored on our servers.",
      privacyP3: "Customers can request profile updates or account deletion through support contacts. Data removal requests are processed within 7 days.",
      privacyP4: "For privacy questions, contact us at official.andrew.buga@gmail.com.",
      termsTitle: "Terms & Conditions",
      termsSubtitle: "Basic conditions for placing orders on this website.",
      termsP1: "All orders are subject to stock availability and payment confirmation. Orders may be cancelled if payment is not received within 24 hours.",
      termsP2: "Prices, promotions, and item availability can change without prior notice. We strive to keep catalog data accurate, but errors may occur.",
      termsP3: "By placing an order, the customer confirms billing and shipping details are accurate. Incorrect information may delay delivery.",
      termsP4: "Returns and exchanges are accepted within 14 days of delivery. See the help center for details.",
      useTitle: "Terms of Use",
      useSubtitle: "Rules for using the website and account features.",
      useP1: "Users must provide accurate registration information and protect account credentials. Sharing login details is not allowed.",
      useP2: "Abuse of checkout, spam actions, or unauthorized access attempts may lead to account restrictions or permanent bans.",
      useP3: "Feature availability can differ by region and may be updated at any time. We reserve the right to modify site features for security or performance reasons.",
      useP4: "By using this site, you agree to comply with all applicable laws and regulations.",
      receiversTitle: "Receivers & Amplifiers",
      receiversSubtitle: "Audio partner products for training and lifestyle.",
      receiversP1: "This section covers selected audio devices compatible with mobile training setups. We offer curated picks for sneakerheads who value sound quality.",
      receiversP2: "Current catalog includes compact amplifiers, wireless receivers, and Bluetooth speakers for personal use. New models are added each season.",
      receiversP3: "For technical specs and compatibility questions, use the contact page or follow our GitHub for open-source integrations.",
    },
    returns: {
      title: "Returns & Refunds",
      description: "Easy 30-day returns on all Streater sneakers. Learn how to return or exchange your order — simple, fast, and free.",
      heroTitleLine1: "Hassle-free returns.",
      heroTitleLine2: "30 days, no drama.",
      heroDescription: "Changed your mind? Wrong size? No problem. We make returns simple so you can shop with confidence. Most refunds land back in your account within a week.",
      badgeReturnWindow: "30-day return window",
      badgeFreeShipping: "Free return shipping (EU)",
      badgeFreeExchange: "Free size exchanges",
      howItWorks: "How it works",
      stepLabel: "Step",
      steps: [
        {
          step: "1",
          title: "Start your return",
          description: "Go to your account order history or contact our support team. Select the item you'd like to return and choose a reason.",
        },
        {
          step: "2",
          title: "Pack & ship",
          description: "Pack the item in its original box with all accessories (laces, tags, insoles). Print the prepaid return label we'll send you by email.",
        },
        {
          step: "3",
          title: "We inspect it",
          description: "Once we receive your parcel, our team inspects the product within 2 business days to confirm it's in original, unworn condition.",
        },
        {
          step: "4",
          title: "Get your refund",
          description: "The refund is issued back to your original payment method within 5–7 business days after inspection is complete.",
        },
      ],
      startReturn: "Start a return",
      contactSupport: "Contact support",
      conditionsTitle: "Return conditions",
      acceptedTitle: "✓ Accepted",
      notAcceptedTitle: "✗ Not accepted",
      accepted: [
        "Unworn, unmarked soles",
        "Original box & packaging intact",
        "All tags still attached",
        "Returned within 30 days of delivery",
        "Defective or incorrectly shipped items (48 h window)",
      ],
      notAccepted: [
        "Worn or washed sneakers",
        "Missing laces, insoles, or original box",
        "Items returned after 30 days",
        "Personalised or custom orders",
        "Limited-edition & final-sale drops",
      ],
      faqTitle: "Frequently asked questions",
      faqs: [
        {
          q: "How long do I have to return?",
          a: "You have 30 days from the date of delivery to initiate a return. Items must be unworn, in original packaging, with all tags attached.",
        },
        {
          q: "Can I exchange for a different size?",
          a: "Yes! Simply select ‘Exchange’ when starting your return. If the size you want is in stock, we’ll ship it immediately after receiving your return. If not, we’ll issue a full refund.",
        },
        {
          q: "Is return shipping free?",
          a: "Return shipping is free for all orders shipped within the EU. For international returns, a small flat fee of €5 applies and is deducted from your refund.",
        },
        {
          q: "What if the item arrived damaged?",
          a: "If your sneakers arrived with a defect or damage, contact us within 48 hours of delivery. We'll arrange a free pick-up and send you a brand-new pair or a full refund — your choice.",
        },
        {
          q: "What items cannot be returned?",
          a: "Worn, washed, or altered items cannot be returned. Customised, personalised, or limited-edition drops are final sale and cannot be returned or exchanged.",
        },
        {
          q: "When will I see the money on my card?",
          a: "After we approve your return, the refund is processed within 5–7 business days. Depending on your bank, it may take 1–3 extra days to appear on your statement.",
        },
      ],
      stillQuestions: "Still have questions?",
      stillQuestionsBody: "Our support team is available Monday – Friday, 9 am – 6 pm (CET).",
      emailSupport: "Email support",
      contactForm: "Contact form",
    },
    pages: {
      home: {
        metadataTitle: "Streater Sneakers — Shop New Drops | Sneakers Online",
        metadataDescription: "Streater — the online sneaker store for fresh kicks. Shop men's & women's athletic shoes, running sneakers, and streetwear. Free EU shipping, easy 30-day returns.",
        ogTitle: "Streater Sneakers — Shop New Drops",
        ogDescription: "Shop the freshest sneakers at Streater. Men's & women's athletic shoes with free EU shipping.",
      },
      men: {
        metadataTitle: "Men's Sneakers — Athletic & Streetwear Shoes",
        metadataDescription: "Shop men's sneakers at Streater. Performance running shoes, streetwear kicks, and lifestyle footwear. Free EU shipping.",
        ogTitle: "Men's Sneakers — Streater",
        ogDescription: "Performance and lifestyle sneakers for men. Shop new drops with free EU shipping.",
        eyebrow: "Shop",
        title: "Men",
        description: "Performance and lifestyle sneakers curated for men.",
      },
      women: {
        metadataTitle: "Women's Sneakers — Athletic & Lifestyle Shoes",
        metadataDescription: "Shop women's sneakers at Streater. Comfort-first silhouettes, new-season looks, and streetwear styles. Free EU shipping.",
        ogTitle: "Women's Sneakers — Streater",
        ogDescription: "Comfort-first women's sneakers and new-season styles. Free EU shipping.",
        eyebrow: "Shop",
        title: "Women",
        description: "Comfort-first silhouettes and new-season looks for women.",
      },
      trends: {
        metadataTitle: "Trending Sneakers — Shop New Drops",
        metadataDescription: "The hottest sneakers right now at Streater. Shop trending athletic shoes, running shoes & streetwear kicks with free EU shipping.",
        ogTitle: "Trending Sneakers — Streater",
        ogDescription: "Most-purchased sneakers right now. Shop the hottest drops with free EU shipping.",
        eyebrow: "Hot Now",
        title: "Trends",
        description: "Most purchased sneakers right now.",
      },
      collections: {
        metadataTitle: "Sneaker Collections — Seasonal Drops",
        metadataDescription: "Explore Streater's seasonal sneaker collections. Running, streetwear, and lifestyle footwear for men & women.",
        ogTitle: "Sneaker Collections — Streater",
        ogDescription: "Seasonal sneaker drops and curated collections for every style.",
        eyebrow: "Seasonal",
        title: "Collections",
        description: "Browse seasonal drops and explore all available products.",
        allProducts: "All Products",
      },
    },
  },
  uk: {
    nav: {
      men: "Чоловіки",
      women: "Жінки",
      collections: "Колекції",
      trends: "Тренди",
      favorites: "Улюблене",
      cart: "Кошик",
      account: "Акаунт",
      signIn: "Увійти",
      register: "Реєстрація",
      myAccount: "Мій акаунт",
    },
    switcher: {
      label: "Мова",
      en: "EN",
      uk: "UK",
      ru: "RU",
    },
    search: {
      aria: "Пошук",
      placeholder: "Пошук товарів...",
      noResults: (query) => `Нічого не знайдено за запитом "${query}"`,
      startTyping: "Почни вводити, щоб шукати...",
      pricePrefix: "₴",
    },
    common: {
      back: "Назад",
      seasonal: "Сезонне",
      productsCount: (count) => `Товари (${count})`,
      collectionNotFound: "Колекцію не знайдено.",
    },
    gallery: {
      noImages: "Немає доступних зображень",
      prev: "Попереднє зображення",
      next: "Наступне зображення",
      imageAlt: (name, index) => `${name} - Перегляд ${index}`,
      thumbAlt: (name, index) => `${name} мініатюра ${index}`,
    },
    hero: {
      newArrival: "Новий реліз",
      titleLine1: "Нові",
      titleLine2: "Кросівки",
      modelName: "Streater Impossible'20",
      modelTagline: "Легкі. Повітряні. Універсальні.",
      shopNow: "Купити зараз",
      exploreCollections: "Переглянути колекції",
      sideText: "Дивись новинки",
      imageAlt: "Streater Impossible'20 — нові кросівки, легкі та повітряні",
    },
    showcase: {
      featured: "Вибране",
      newDrops: "Свіжі релізи",
      prev: "Попередній товар",
      next: "Наступний товар",
      loading: "Завантажуємо добірку...",
      empty: "Поки що немає товарів.",
      colorLabel: "Колір",
      skuLabel: "Артикул",
      collectionLabel: "Колекція",
      wishlistAdd: (name) => `Додати ${name} до улюбленого`,
      wishlistRemove: (name) => `Прибрати ${name} з улюбленого`,
    },
    collections: {
      seasonal: "Сезонне",
      title: "Колекції",
      description: "Кураторські добірки для змінної погоди та щоденного комфорту.",
      winter: "Зимова колекція",
      winterDescription: "Теплі, витривалі та готові до холодного сезону.",
      summer: "Літня колекція",
      summerDescription: "Легкі, дихаючі та створені для теплого руху.",
      autumn: "Осіння колекція",
      autumnDescription: "Збалансований комфорт і глибші відтінки для зміни погоди.",
    },
    subscribe: {
      stayConnected: "Залишайся на зв'язку",
      joinUpdates: "Підписатися на оновлення",
      description: "Отримуй нові релізи, ексклюзивні пропозиції та інші новини прямо на пошту.",
      emailPlaceholder: "Введи свій email",
      subscribeAria: "Підписатися",
      contactUs: "Написати нам",
    },
    footer: {
      description: "Streater Store — сучасне портфоліо кросівок, дизайн і інновації.",
      helpInfo: "Допомога та інформація",
      returnsRefunds: "Повернення та відшкодування",
      helpCenter: "Центр допомоги",
      termsConditions: "Умови та правила",
      storeLocator: "Пошук магазинів",
      aboutUs: "Про нас",
      accessories: "Аксесуари",
      privacyPolicy: "Політика конфіденційності",
      termsOfUse: "Умови користування",
      receiversAmplifiers: "Ресівери та підсилювачі",
      contact: "Контакти",
      contactPage: "Сторінка контактів",
      portfolioLabel: "Портфоліо:",
      builtFor: "Створено для комфорту, стилю та щоденного руху.",
      rights: "© 2026 Streater. Всі права захищено.",
    },
    catalogGrid: {
      empty: "Нічого не знайдено.",
      standardColorway: "Стандартна гама",
      wishlistAdd: (name) => `Додати ${name} до улюбленого`,
      wishlistRemove: (name) => `Прибрати ${name} з улюбленого`,
    },
    filters: {
      size: "Розмір",
      color: "Колір",
      price: "Ціна",
      minPrice: (value) => `Мін. ціна: $${value}`,
      maxPrice: (value) => `Макс. ціна: $${value}`,
      range: (min, max) => `$${min} - $${max}`,
    },
    reviews: {
      title: "Відгуки покупців",
      basedOn: (count) => `На основі ${count} відгуків`,
      writeReview: "Написати відгук",
      rating: "Оцінка",
      shareExperience: "Поділись враженнями про цей товар",
      posting: "Публікуємо...",
      postReview: "Опублікувати",
      onlyRegistered: "Лише зареєстровані користувачі можуть залишати відгуки.",
      signIn: "Увійти",
      loading: "Завантажуємо відгуки...",
      empty: "Відгуків поки немає.",
      beFirst: "Стань першим, хто напише.",
      helpful: (count) => `Корисно (${count})`,
      signInToLike: "Увійди, щоб ставити вподобайки",
      minLength: "Текст відгуку має містити щонайменше 10 символів",
      createFailed: "Не вдалося створити відгук",
    },
    cart: {
      empty: "Кошик порожній",
      continueShopping: "Повернутись до покупок",
      back: "Назад",
      title: "Кошик",
      size: "Розмір",
      color: "Колір",
      orderSummary: "Підсумок замовлення",
      subtotal: "Проміжний підсумок:",
      shipping: "Доставка:",
      tax: "Податок:",
      total: "Разом:",
      proceed: "Перейти до оплати",
      clear: "Очистити кошик",
    },
    favorites: {
      eyebrow: "Улюблене",
      title: "Обране",
      description: "Кросівки, які ти відмітив серцем.",
      empty: "Улюблених товарів поки немає.",
      exploreTrends: "Перейти до трендів",
    },
    product: {
      loading: "Завантажуємо товар...",
      notFound: "Товар не знайдено",
      back: "Назад",
      color: "Колір",
      size: "Розмір",
      chooseSize: "Обери розмір",
      quantity: "Кількість",
      addToCart: "Додати в кошик",
      added: "Додано в кошик!",
      outOfStock: "Немає в наявності",
      inStock: (count) => `В наявності (${count})`,
      addError: "Будь ласка, обери розмір перед додаванням у кошик.",
      wishlistAdd: "Додати до улюбленого",
      wishlistRemove: "Прибрати з улюбленого",
      defaultColor: "Стандарт",
      oneSize: "Один розмір",
    },
    infoPages: {
      contactTitle: "Контакти",
      contactSubtitle: "Зв'яжіться з підтримкою або продажами.",
      contactPhone: "Телефон: +40 740 116 669",
      contactEmail: "Email: official.andrew.buga@gmail.com",
      contactResponse: "Відповідь зазвичай протягом 24 годин у робочі дні.",
      accessoriesTitle: "Аксесуари",
      accessoriesSubtitle: "Доповни образ корисними дрібницями.",
      accessoriesP1: "У наявності: шкарпетки, шнурки, набори для чистки, сумки та засоби догляду. Новинки — у розділі «Оновлення».",
      accessoriesP2: "Каталог оновлюється з кожним сезонним релізом. Лімітовані товари з'являються під час спецподій.",
      accessoriesP3: "Для оптових або командних замовлень звертайся в підтримку. Можливе брендування для команд та організацій.",
      storeTitle: "Пошук магазинів",
      storeSubtitle: "Адреси магазинів і пункти самовивозу.",
      storeP1: "Головний магазин: Strada Universitatii 13, Suceava, Romania. Додаткові pop-up локації з'являються сезонно.",
      storeP2: "Графік: понеділок–субота, 10:00–20:00. Неділя та свята — вихідні.",
      storeP3: "Самовивіз доступний після оплати й email-підтвердження. Візьми підтвердження замовлення.",
      storeP4: "За подіями та релізами стеж за нашим Behance.",
      helpTitle: "Центр допомоги",
      helpSubtitle: "Підтримка для замовлень, акаунту та доставки.",
      helpP1: "Для питань по акаунту переглянь профіль: там можна змінити email, телефон і адресу доставки.",
      helpP2: "Якщо проблеми з оплатою — перевір розмір, наявність та дані доставки. Спробуй інший метод або звернись у підтримку.",
      helpP3: "Трекінг доступний у акаунті. У разі затримки або втрати — напиши в підтримку з номером замовлення.",
      helpP4Prefix: "Для невирішених питань пиши на ",
      helpP4Link: "сторінці контактів",
      helpP4Suffix: " і додай номер замовлення, якщо є. Відповідаємо протягом 24 годин у робочі дні.",
      helpPaginationPrefix: "Потрібні підказки щодо каталогу? Читай ",
      helpPaginationLink: "гайд по пагінації",
      helpPaginationSuffix: ".",
      paginationTitle: "Пагінація",
      paginationSubtitle: "Як працює перегортання сторінок у каталозі.",
      paginationP1: "Каталог організовано за категоріями та колекціями, тож ти швидко знайдеш новинки або класику. Сторінки розбиті для швидкого завантаження.",
      paginationP2: "Використовуй навігацію зверху або пошук, щоб знайти потрібний товар. Фільтри допомагають по розміру, кольору чи колекції.",
      paginationP3: "На мобільному натисни іконку меню для переходу між сторінками. Пагінація — внизу.",
      paginationP4: "Не знайшов товар? Перевір «Тренди» або «Улюблене».",
      privacyTitle: "Політика конфіденційності",
      privacySubtitle: "Як ми зберігаємо і обробляємо дані.",
      privacyP1: "Ми зберігаємо дані акаунту та замовлень для обробки покупок і доставки. Дані не передаються третім сторонам, окрім платіжних і доставчих сервісів.",
      privacyP2: "Паролі хешуються, а авторизація захищена cookies. Платіжні дані обробляються безпечно і не зберігаються на наших серверах.",
      privacyP3: "Клієнт може запросити оновлення профілю або видалення акаунту через підтримку. Запити обробляються до 7 днів.",
      privacyP4: "Питання приватності — на email official.andrew.buga@gmail.com.",
      termsTitle: "Умови та правила",
      termsSubtitle: "Основні правила оформлення замовлень.",
      termsP1: "Усі замовлення залежать від наявності та підтвердження оплати. Якщо оплата не отримана за 24 години, замовлення можуть скасувати.",
      termsP2: "Ціни, акції та доступність можуть змінюватись без попередження. Ми стараємось тримати дані актуальними, але помилки можливі.",
      termsP3: "Оформлюючи замовлення, клієнт підтверджує правильність платіжних та доставчих даних. Помилки можуть затримати доставку.",
      termsP4: "Повернення та обміни можливі протягом 14 днів. Деталі — у центрі допомоги.",
      useTitle: "Умови користування",
      useSubtitle: "Правила використання сайту та акаунту.",
      useP1: "Користувачі мають надавати коректні дані та захищати свої логіни. Передача доступу третім особам заборонена.",
      useP2: "Зловживання оплатою, спам чи спроби несанкціонованого доступу можуть призвести до обмежень або бану.",
      useP3: "Функції можуть відрізнятися за регіонами й оновлюватися в будь-який час. Ми можемо змінювати функціонал для безпеки або продуктивності.",
      useP4: "Користуючись сайтом, ти погоджуєшся з чинними законами та правилами.",
      receiversTitle: "Ресівери та підсилювачі",
      receiversSubtitle: "Аудіо-партнери для тренувань і стилю.",
      receiversP1: "Добірка аудіо-пристроїв, сумісних із мобільними тренуваннями. Для тих, хто любить якісний звук.",
      receiversP2: "У каталозі: компактні підсилювачі, бездротові ресівери та Bluetooth-колонки для особистого використання. Нові моделі щосезону.",
      receiversP3: "За технічними питаннями пиши на сторінці контактів або дивись інтеграції на GitHub.",
    },
    returns: {
      title: "Повернення та відшкодування",
      description: "Легке повернення за 30 днів. Дізнайся, як повернути або обміняти замовлення — просто, швидко і безкоштовно.",
      heroTitleLine1: "Повернення без стресу.",
      heroTitleLine2: "30 днів, без драми.",
      heroDescription: "Передумав? Не підійшов розмір? Без проблем. Ми робимо повернення простим, щоб ти купував спокійно. Більшість повернень надходять протягом тижня.",
      badgeReturnWindow: "30 днів на повернення",
      badgeFreeShipping: "Безкоштовне повернення (EU)",
      badgeFreeExchange: "Безкоштовний обмін розміру",
      howItWorks: "Як це працює",
      stepLabel: "Крок",
      steps: [
        {
          step: "1",
          title: "Почни повернення",
          description: "Перейди в історію замовлень в акаунті або напиши в підтримку. Обери товар і причину повернення.",
        },
        {
          step: "2",
          title: "Упакуй і відправ",
          description: "Упакуй товар в оригінальну коробку з усіма аксесуарами. Роздрукуй наклейку для повернення, яку надішлемо email-ом.",
        },
        {
          step: "3",
          title: "Ми перевіряємо",
          description: "Після отримання посилки наша команда перевіряє товар протягом 2 робочих днів.",
        },
        {
          step: "4",
          title: "Отримай кошти",
          description: "Повернення коштів на оригінальний метод оплати зазвичай займає 5–7 робочих днів після перевірки.",
        },
      ],
      startReturn: "Почати повернення",
      contactSupport: "Зв'язатися з підтримкою",
      conditionsTitle: "Умови повернення",
      acceptedTitle: "✓ Приймається",
      notAcceptedTitle: "✗ Не приймається",
      accepted: [
        "Не носилися, підошви без слідів",
        "Оригінальна коробка та упаковка",
        "Всі бірки на місці",
        "Повернення протягом 30 днів",
        "Брак або помилка в доставці (48 год)",
      ],
      notAccepted: [
        "Ношені або випрані кросівки",
        "Відсутні шнурки, устілки або коробка",
        "Повернення після 30 днів",
        "Персоналізовані або кастомні замовлення",
        "Лімітовані дропи та final sale",
      ],
      faqTitle: "Часті питання",
      faqs: [
        {
          q: "Скільки є часу на повернення?",
          a: "У тебе є 30 днів з моменту доставки, щоб ініціювати повернення. Товар має бути не ношеним і в оригінальній упаковці.",
        },
        {
          q: "Чи можна обміняти розмір?",
          a: "Так. Обери «Обмін» під час повернення. Якщо розмір є в наявності — відправимо одразу після отримання повернення, якщо ні — повернемо кошти.",
        },
        {
          q: "Повернення безкоштовне?",
          a: "Повернення безкоштовне для замовлень у межах ЄС. Для міжнародних повернень діє фіксована плата €5.",
        },
        {
          q: "Що робити, якщо товар прийшов з браком?",
          a: "Напиши нам протягом 48 годин після доставки. Ми організуємо безкоштовний забір і надішлемо нову пару або повернемо кошти.",
        },
        {
          q: "Які товари не можна повернути?",
          a: "Ношені, випрані або змінені товари. Кастомні й лімітовані дропи не підлягають поверненню.",
        },
        {
          q: "Коли повернуться кошти?",
          a: "Після підтвердження повернення кошти надходять протягом 5–7 робочих днів. Банк може додатково затримати на 1–3 дні.",
        },
      ],
      stillQuestions: "Є ще питання?",
      stillQuestionsBody: "Підтримка доступна з понеділка по п'ятницю, 9:00–18:00 (CET).",
      emailSupport: "Написати в підтримку",
      contactForm: "Форма контактів",
    },
    pages: {
      home: {
        metadataTitle: "Streater Sneakers — Нові релізи | Кросівки онлайн",
        metadataDescription: "Streater — магазин кросівок онлайн. Нові дропи для чоловіків і жінок, біг та streetwear. Безкоштовна доставка по ЄС, 30 днів на повернення.",
        ogTitle: "Streater Sneakers — Нові релізи",
        ogDescription: "Купуй найсвіжіші кросівки у Streater. Доставка по ЄС.",
      },
      men: {
        metadataTitle: "Чоловічі кросівки — Біг та streetwear",
        metadataDescription: "Кросівки для чоловіків у Streater. Біг, streetwear і lifestyle моделі. Безкоштовна доставка по ЄС.",
        ogTitle: "Чоловічі кросівки — Streater",
        ogDescription: "Спортивні та lifestyle моделі для чоловіків. Нові дропи з доставкою по ЄС.",
        eyebrow: "Купити",
        title: "Чоловіки",
        description: "Добірка спортивних і lifestyle кросівок для чоловіків.",
      },
      women: {
        metadataTitle: "Жіночі кросівки — Біг та lifestyle",
        metadataDescription: "Кросівки для жінок у Streater. Комфортні силуети й трендові моделі. Безкоштовна доставка по ЄС.",
        ogTitle: "Жіночі кросівки — Streater",
        ogDescription: "Комфортні силуети та нові релізи для жінок. Доставка по ЄС.",
        eyebrow: "Купити",
        title: "Жінки",
        description: "Комфортні силуети й нові сезони для жінок.",
      },
      trends: {
        metadataTitle: "Трендові кросівки — Нові дропи",
        metadataDescription: "Найгарячіші кросівки у Streater. Біг, lifestyle та streetwear із доставкою по ЄС.",
        ogTitle: "Тренди — Streater",
        ogDescription: "Найпопулярніші дропи прямо зараз. Доставка по ЄС.",
        eyebrow: "Гаряче",
        title: "Тренди",
        description: "Найпопулярніші кросівки просто зараз.",
      },
      collections: {
        metadataTitle: "Колекції кросівок — Сезонні дропи",
        metadataDescription: "Сезонні колекції Streater: біг, streetwear і lifestyle для чоловіків та жінок.",
        ogTitle: "Колекції — Streater",
        ogDescription: "Сезонні дропи та кураторські колекції.",
        eyebrow: "Сезонне",
        title: "Колекції",
        description: "Переглядай сезонні дропи та весь каталог.",
        allProducts: "Усі товари",
      },
    },
  },
  ru: {
    nav: {
      men: "Мужское",
      women: "Женское",
      collections: "Коллекции",
      trends: "Тренды",
      favorites: "Избранное",
      cart: "Корзина",
      account: "Аккаунт",
      signIn: "Войти",
      register: "Регистрация",
      myAccount: "Мой аккаунт",
    },
    switcher: {
      label: "Язык",
      en: "EN",
      uk: "UK",
      ru: "RU",
    },
    search: {
      aria: "Поиск",
      placeholder: "Поиск товаров...",
      noResults: (query) => `Ничего не найдено по запросу "${query}"`,
      startTyping: "Начни вводить, чтобы искать...",
      pricePrefix: "₽",
    },
    common: {
      back: "Назад",
      seasonal: "Сезонное",
      productsCount: (count) => `Товары (${count})`,
      collectionNotFound: "Коллекция не найдена.",
    },
    gallery: {
      noImages: "Нет доступных изображений",
      prev: "Предыдущее изображение",
      next: "Следующее изображение",
      imageAlt: (name, index) => `${name} - Просмотр ${index}`,
      thumbAlt: (name, index) => `${name} миниатюра ${index}`,
    },
    hero: {
      newArrival: "Новый релиз",
      titleLine1: "Новые",
      titleLine2: "Кроссовки",
      modelName: "Streater Impossible'20",
      modelTagline: "Легкие. Воздушные. Универсальные.",
      shopNow: "Купить сейчас",
      exploreCollections: "Смотреть коллекции",
      sideText: "Смотри новинки",
      imageAlt: "Streater Impossible'20 — новые кроссовки, легкие и воздушные",
    },
    showcase: {
      featured: "Подборка",
      newDrops: "Свежие релизы",
      prev: "Предыдущий товар",
      next: "Следующий товар",
      loading: "Загружаем подборку...",
      empty: "Пока нет товаров.",
      colorLabel: "Цвет",
      skuLabel: "Артикул",
      collectionLabel: "Коллекция",
      wishlistAdd: (name) => `Добавить ${name} в избранное`,
      wishlistRemove: (name) => `Убрать ${name} из избранного`,
    },
    collections: {
      seasonal: "Сезонное",
      title: "Коллекции",
      description: "Кураторские подборки для разной погоды и ежедневного комфорта.",
      winter: "Зимняя коллекция",
      winterDescription: "Теплые, прочные и готовые к холодному сезону.",
      summer: "Летняя коллекция",
      summerDescription: "Легкие, дышащие и созданы для теплого движения.",
      autumn: "Осенняя коллекция",
      autumnDescription: "Сбалансированный комфорт и насыщенные оттенки для смены погоды.",
    },
    subscribe: {
      stayConnected: "Будь на связи",
      joinUpdates: "Подписаться на обновления",
      description: "Получай новые релизы, эксклюзивные предложения и новости на почту.",
      emailPlaceholder: "Введи свой email",
      subscribeAria: "Подписаться",
      contactUs: "Связаться с нами",
    },
    footer: {
      description: "Streater Store — современное портфолио кроссовок, дизайн и инновации.",
      helpInfo: "Помощь и информация",
      returnsRefunds: "Возвраты и компенсации",
      helpCenter: "Центр помощи",
      termsConditions: "Условия и правила",
      storeLocator: "Поиск магазинов",
      aboutUs: "О нас",
      accessories: "Аксессуары",
      privacyPolicy: "Политика конфиденциальности",
      termsOfUse: "Условия использования",
      receiversAmplifiers: "Ресиверы и усилители",
      contact: "Контакты",
      contactPage: "Страница контактов",
      portfolioLabel: "Портфолио:",
      builtFor: "Создано для комфорта, стиля и ежедневного движения.",
      rights: "© 2026 Streater. Все права защищены.",
    },
    catalogGrid: {
      empty: "Ничего не найдено.",
      standardColorway: "Стандартная гамма",
      wishlistAdd: (name) => `Добавить ${name} в избранное`,
      wishlistRemove: (name) => `Убрать ${name} из избранного`,
    },
    filters: {
      size: "Размер",
      color: "Цвет",
      price: "Цена",
      minPrice: (value) => `Мин. цена: $${value}`,
      maxPrice: (value) => `Макс. цена: $${value}`,
      range: (min, max) => `$${min} - $${max}`,
    },
    reviews: {
      title: "Отзывы покупателей",
      basedOn: (count) => `На основе ${count} отзывов`,
      writeReview: "Написать отзыв",
      rating: "Оценка",
      shareExperience: "Поделись впечатлениями о товаре",
      posting: "Публикуем...",
      postReview: "Опубликовать",
      onlyRegistered: "Отзывы могут оставлять только зарегистрированные пользователи.",
      signIn: "Войти",
      loading: "Загружаем отзывы...",
      empty: "Отзывов пока нет.",
      beFirst: "Стань первым, кто напишет.",
      helpful: (count) => `Полезно (${count})`,
      signInToLike: "Войдите, чтобы поставить лайк",
      minLength: "Текст отзыва должен быть не менее 10 символов",
      createFailed: "Не удалось создать отзыв",
    },
    cart: {
      empty: "Корзина пуста",
      continueShopping: "Продолжить покупки",
      back: "Назад",
      title: "Корзина",
      size: "Размер",
      color: "Цвет",
      orderSummary: "Итого",
      subtotal: "Подытог:",
      shipping: "Доставка:",
      tax: "Налог:",
      total: "Итого:",
      proceed: "Перейти к оплате",
      clear: "Очистить корзину",
    },
    favorites: {
      eyebrow: "Избранное",
      title: "Избранное",
      description: "Кроссовки, которые ты отметил сердцем.",
      empty: "Избранных товаров пока нет.",
      exploreTrends: "Перейти к трендам",
    },
    product: {
      loading: "Загружаем товар...",
      notFound: "Товар не найден",
      back: "Назад",
      color: "Цвет",
      size: "Размер",
      chooseSize: "Выбери размер",
      quantity: "Количество",
      addToCart: "Добавить в корзину",
      added: "Добавлено в корзину!",
      outOfStock: "Нет в наличии",
      inStock: (count) => `В наличии (${count})`,
      addError: "Пожалуйста, выбери размер перед добавлением в корзину.",
      wishlistAdd: "Добавить в избранное",
      wishlistRemove: "Убрать из избранного",
      defaultColor: "Стандарт",
      oneSize: "Один размер",
    },
    infoPages: {
      contactTitle: "Контакты",
      contactSubtitle: "Свяжитесь с поддержкой или продажами.",
      contactPhone: "Телефон: +40 740 116 669",
      contactEmail: "Email: official.andrew.buga@gmail.com",
      contactResponse: "Ответ обычно в течение 24 часов в рабочие дни.",
      accessoriesTitle: "Аксессуары",
      accessoriesSubtitle: "Дополните образ полезными деталями.",
      accessoriesP1: "Доступны носки, шнурки, наборы для чистки, сумки и средства ухода. Новинки — в разделе «Обновления».",
      accessoriesP2: "Каталог обновляется с каждым сезонным релизом. Лимитированные товары появляются на специальных событиях.",
      accessoriesP3: "Для оптовых или командных заказов обращайтесь в поддержку. Возможен брендинг для команд и организаций.",
      storeTitle: "Поиск магазинов",
      storeSubtitle: "Адреса магазинов и пункты самовывоза.",
      storeP1: "Главный магазин: Strada Universitatii 13, Suceava, Romania. Дополнительные pop-up локации появляются сезонно.",
      storeP2: "График: понедельник–суббота, 10:00–20:00. Воскресенье и праздники — выходные.",
      storeP3: "Самовывоз доступен после оплаты и email-подтверждения. Возьмите подтверждение заказа.",
      storeP4: "За событиями и релизами следите на Behance.",
      helpTitle: "Центр помощи",
      helpSubtitle: "Поддержка по заказам, аккаунту и доставке.",
      helpP1: "По вопросам аккаунта зайди в профиль: там можно изменить email, телефон и адрес доставки.",
      helpP2: "Если проблемы с оплатой — проверь размер, наличие и данные доставки. Попробуй другой метод или обратись в поддержку.",
      helpP3: "Трекинг доступен в аккаунте. При задержке или потере — напиши в поддержку с номером заказа.",
      helpP4Prefix: "Если вопрос не решен, напиши на ",
      helpP4Link: "странице контактов",
      helpP4Suffix: " и добавь номер заказа, если есть. Отвечаем в течение 24 часов в рабочие дни.",
      helpPaginationPrefix: "Нужны подсказки по каталогу? Читай ",
      helpPaginationLink: "гайд по пагинации",
      helpPaginationSuffix: ".",
      paginationTitle: "Пагинация",
      paginationSubtitle: "Как устроено перелистывание каталога.",
      paginationP1: "Каталог организован по категориям и коллекциям, поэтому легко найти новинки или классику. Страницы разбиты для быстрой загрузки.",
      paginationP2: "Используй навигацию или поиск, чтобы быстро найти товар. Фильтры помогают по размеру, цвету и коллекции.",
      paginationP3: "На мобильном нажми иконку меню, чтобы переключать страницы. Пагинация находится внизу.",
      paginationP4: "Не нашел товар? Проверь «Тренды» или «Избранное».",
      privacyTitle: "Политика конфиденциальности",
      privacySubtitle: "Как мы храним и обрабатываем данные.",
      privacyP1: "Мы храним данные аккаунта и заказов для обработки покупок и доставки. Данные не передаются третьим сторонам, кроме платежных и доставочных сервисов.",
      privacyP2: "Пароли хешируются, авторизация защищена cookies. Платежные данные обрабатываются безопасно и не хранятся на наших серверах.",
      privacyP3: "Клиент может запросить обновление профиля или удаление аккаунта через поддержку. Запросы обрабатываются до 7 дней.",
      privacyP4: "Вопросы приватности — на email official.andrew.buga@gmail.com.",
      termsTitle: "Условия и правила",
      termsSubtitle: "Основные правила оформления заказов.",
      termsP1: "Все заказы зависят от наличия и подтверждения оплаты. Если оплата не поступила за 24 часа, заказ могут отменить.",
      termsP2: "Цены, акции и доступность могут изменяться без предупреждения. Мы стараемся поддерживать данные актуальными, но ошибки возможны.",
      termsP3: "Оформляя заказ, клиент подтверждает корректность платежных и доставочных данных. Ошибки могут задержать доставку.",
      termsP4: "Возвраты и обмены возможны в течение 14 дней. Подробности — в центре помощи.",
      useTitle: "Условия использования",
      useSubtitle: "Правила использования сайта и аккаунта.",
      useP1: "Пользователи должны указывать корректные данные и защищать учетные данные. Передача доступа третьим лицам запрещена.",
      useP2: "Злоупотребления, спам или попытки несанкционированного доступа могут привести к ограничениям или бану.",
      useP3: "Функции могут различаться по регионам и обновляться в любое время. Мы можем изменять функционал ради безопасности или производительности.",
      useP4: "Используя сайт, вы соглашаетесь с применимыми законами и правилами.",
      receiversTitle: "Ресиверы и усилители",
      receiversSubtitle: "Аудио-партнеры для тренировок и стиля.",
      receiversP1: "Подборка аудио-устройств для мобильных тренировок. Для тех, кто ценит качественный звук.",
      receiversP2: "В каталоге: компактные усилители, беспроводные ресиверы и Bluetooth-колонки для личного использования. Новые модели каждый сезон.",
      receiversP3: "По техническим вопросам пишите на странице контактов или смотрите интеграции на GitHub.",
    },
    returns: {
      title: "Возвраты и компенсации",
      description: "Легкие возвраты в течение 30 дней. Узнай, как вернуть или обменять заказ — просто, быстро и бесплатно.",
      heroTitleLine1: "Возврат без лишних хлопот.",
      heroTitleLine2: "30 дней, без драмы.",
      heroDescription: "Передумал? Не подошел размер? Без проблем. Мы делаем возврат простым, чтобы ты покупал спокойно. Большинство возвратов приходит в течение недели.",
      badgeReturnWindow: "30 дней на возврат",
      badgeFreeShipping: "Бесплатный возврат (EU)",
      badgeFreeExchange: "Бесплатный обмен размера",
      howItWorks: "Как это работает",
      stepLabel: "Шаг",
      steps: [
        {
          step: "1",
          title: "Начни возврат",
          description: "Перейди в историю заказов или напиши в поддержку. Выбери товар и причину возврата.",
        },
        {
          step: "2",
          title: "Упакуй и отправь",
          description: "Упакуй товар в оригинальную коробку с аксессуарами. Распечатай наклейку на возврат, которую мы пришлем на email.",
        },
        {
          step: "3",
          title: "Мы проверяем",
          description: "После получения посылки наша команда проверяет товар в течение 2 рабочих дней.",
        },
        {
          step: "4",
          title: "Получите возврат",
          description: "Возврат средств на исходный способ оплаты обычно занимает 5–7 рабочих дней после проверки.",
        },
      ],
      startReturn: "Начать возврат",
      contactSupport: "Связаться с поддержкой",
      conditionsTitle: "Условия возврата",
      acceptedTitle: "✓ Принимается",
      notAcceptedTitle: "✗ Не принимается",
      accepted: [
        "Не носились, подошвы без следов",
        "Оригинальная коробка и упаковка",
        "Все бирки на месте",
        "Возврат в течение 30 дней",
        "Брак или ошибка в доставке (48 ч)",
      ],
      notAccepted: [
        "Ношеные или выстиранные кроссовки",
        "Нет шнурков, стелек или коробки",
        "Возврат после 30 дней",
        "Персонализированные или кастомные заказы",
        "Лимитированные дропы и final sale",
      ],
      faqTitle: "Частые вопросы",
      faqs: [
        {
          q: "Сколько времени на возврат?",
          a: "У вас есть 30 дней с момента доставки, чтобы инициировать возврат. Товар должен быть не ношенным и в оригинальной упаковке.",
        },
        {
          q: "Можно обменять размер?",
          a: "Да. Выберите «Обмен» при оформлении возврата. Если размер есть — отправим сразу, если нет — вернем деньги.",
        },
        {
          q: "Возврат бесплатный?",
          a: "Возврат бесплатный для заказов в ЕС. Для международных возвратов действует фиксированная плата €5.",
        },
        {
          q: "Что делать, если пришел брак?",
          a: "Напишите в течение 48 часов после доставки. Организуем бесплатный забор и отправим новую пару или вернем деньги.",
        },
        {
          q: "Какие товары нельзя вернуть?",
          a: "Ношеные, выстиранные или измененные товары. Кастомные и лимитированные дропы не подлежат возврату.",
        },
        {
          q: "Когда вернутся деньги?",
          a: "После подтверждения возврата деньги приходят в течение 5–7 рабочих дней. Банк может задержать на 1–3 дня.",
        },
      ],
      stillQuestions: "Остались вопросы?",
      stillQuestionsBody: "Поддержка доступна с понедельника по пятницу, 9:00–18:00 (CET).",
      emailSupport: "Написать в поддержку",
      contactForm: "Форма контактов",
    },
    pages: {
      home: {
        metadataTitle: "Streater Sneakers — Новые релизы | Кроссовки онлайн",
        metadataDescription: "Streater — магазин кроссовок онлайн. Новые дропы для мужчин и женщин, бег и streetwear. Доставка по ЕС, 30 дней на возврат.",
        ogTitle: "Streater Sneakers — Новые релизы",
        ogDescription: "Покупай свежие кроссовки у Streater. Доставка по ЕС.",
      },
      men: {
        metadataTitle: "Мужские кроссовки — Бег и streetwear",
        metadataDescription: "Кроссовки для мужчин в Streater. Бег, streetwear и lifestyle модели. Доставка по ЕС.",
        ogTitle: "Мужские кроссовки — Streater",
        ogDescription: "Спортивные и lifestyle модели для мужчин. Новые дропы с доставкой по ЕС.",
        eyebrow: "Покупай",
        title: "Мужское",
        description: "Подборка спортивных и lifestyle кроссовок для мужчин.",
      },
      women: {
        metadataTitle: "Женские кроссовки — Бег и lifestyle",
        metadataDescription: "Кроссовки для женщин в Streater. Комфортные силуэты и трендовые модели. Доставка по ЕС.",
        ogTitle: "Женские кроссовки — Streater",
        ogDescription: "Комфортные силуэты и новые релизы для женщин. Доставка по ЕС.",
        eyebrow: "Покупай",
        title: "Женское",
        description: "Комфортные силуэты и сезонные релизы для женщин.",
      },
      trends: {
        metadataTitle: "Трендовые кроссовки — Новые дропы",
        metadataDescription: "Самые горячие кроссовки сейчас в Streater. Бег, lifestyle и streetwear с доставкой по ЕС.",
        ogTitle: "Тренды — Streater",
        ogDescription: "Самые популярные дропы прямо сейчас. Доставка по ЕС.",
        eyebrow: "Горячее",
        title: "Тренды",
        description: "Самые популярные кроссовки прямо сейчас.",
      },
      collections: {
        metadataTitle: "Коллекции кроссовок — Сезонные дропы",
        metadataDescription: "Сезонные коллекции Streater: бег, streetwear и lifestyle для мужчин и женщин.",
        ogTitle: "Коллекции — Streater",
        ogDescription: "Сезонные дропы и кураторские коллекции.",
        eyebrow: "Сезонное",
        title: "Коллекции",
        description: "Смотри сезонные дропы и весь каталог.",
        allProducts: "Все товары",
      },
    },
  },
}

export function getDictionary(locale: Locale = defaultLocale) {
  return dictionaries[locale] ?? dictionaries[defaultLocale]
}

export function isLocale(value: string): value is Locale {
  return locales.includes(value as Locale)
}

export function stripLocale(pathname: string) {
  const parts = pathname.split("/")
  const maybeLocale = parts[1]
  if (maybeLocale && isLocale(maybeLocale)) {
    const rest = parts.slice(2).join("/")
    return rest ? `/${rest}` : "/"
  }
  return pathname
}

export function withLocaleHref(locale: Locale, href: string) {
  if (!href.startsWith("/")) return href
  if (locale === defaultLocale) return href
  return href === "/" ? `/${locale}` : `/${locale}${href}`
}

export function switchLocaleHref(locale: Locale, pathname: string) {
  const stripped = stripLocale(pathname)
  if (stripped.startsWith("/account") || stripped.startsWith("/checkout")) {
    return stripped
  }
  return withLocaleHref(locale, stripped)
}
