// Static public assets. Paths are relative to the Next.js public root.
export const staticImages = {
  brand: {
    logo: '/assets/images/logo.png',
  },
  fallback: {
    property: '/assets/images/placeholder.jpg',
    image: '/assets/images/placeholder.svg',
  },
  home: {
    hero: '/assets/images/hero-bg-2.jpg',
    propertyInterior: '/assets/images/property-home.jpg',
  },
  search: {
    banner: '/assets/images/search-bg.webp',
  },
  developer: {
    banner: '/assets/images/developer-bg.webp',
    inquiryForm: '/assets/images/developer-form.webp',
  },
} as const;
