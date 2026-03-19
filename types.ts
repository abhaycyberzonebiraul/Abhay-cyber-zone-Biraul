export interface Service {
  id: string;
  title: string;
  description: string;
  iconName: string;
}

export interface Feature {
  title: string;
  description: string;
  iconName: string;
}

export interface SiteContent {
  hero: {
    heading: string;
    tagline: string;
    ctaPrimary: string;
    ctaSecondary: string;
  };
  services: {
    title: string;
    description: string;
    items: Service[];
  };
  features: {
    title: string;
    description: string;
    items: Feature[];
  };
  contact: {
    phone: string;
    whatsapp: string;
    location: string;
    email: string;
  };
  theme: {
    primaryColor: string;
    secondaryColor: string;
    backgroundColor: string;
    isDarkMode: boolean;
    showServices: boolean;
    showFeatures: boolean;
    showContact: boolean;
  };
  images: {
    logo: string;
    background: string;
    heroBg: string;
    featuresImg: string;
  };
}
