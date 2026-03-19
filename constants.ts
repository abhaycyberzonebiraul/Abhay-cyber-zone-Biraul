import { SiteContent } from './types';

export const DEFAULT_CONTENT: SiteContent = {
  hero: {
    heading: "Fast & Trusted Online Services",
    tagline: "All digital services available at one place with fast processing and trusted support",
    ctaPrimary: "Contact Now",
    ctaSecondary: "WhatsApp Us",
  },
  services: {
    title: "Our Premium Services",
    description: "We provide a wide range of digital services to help your business grow and stay compliant.",
    items: [
      {
        id: '1',
        title: "GST Registration",
        description: "Get your business GST registered quickly and easily with our expert assistance.",
        iconName: "FileText",
      },
      {
        id: '2',
        title: "PAN Card Service",
        description: "New PAN card application or corrections made simple with fast processing.",
        iconName: "CreditCard",
      },
      {
        id: '3',
        title: "FSSAI Food Licence",
        description: "Essential registration for food businesses to ensure compliance and trust.",
        iconName: "Utensils",
      },
      {
        id: '4',
        title: "Udyam Registration",
        description: "Register your MSME to unlock government benefits and support schemes.",
        iconName: "Briefcase",
      },
    ],
  },
  features: {
    title: "Why Choose Abhay Cyber Zone?",
    description: "We are committed to providing the best digital service experience in Biraul. Our focus is on accuracy, speed, and customer satisfaction.",
    items: [
      {
        title: "Fast Processing",
        description: "We value your time and ensure quick turnaround for all services.",
        iconName: "Clock",
      },
      {
        title: "Trusted Service",
        description: "Thousands of satisfied local customers trust our expertise.",
        iconName: "ShieldCheck",
      },
      {
        title: "Affordable Pricing",
        description: "Premium digital services at rates that fit your budget.",
        iconName: "IndianRupee",
      },
      {
        title: "Local Support",
        description: "Dedicated support right here in Biraul for all your queries.",
        iconName: "MapPin",
      },
    ],
  },
  contact: {
    phone: "9102288372",
    whatsapp: "919102288372",
    location: "Biraul, Darbhanga, Bihar",
    email: "about.tube2.0@gmail.com",
  },
  theme: {
    primaryColor: "#00d2ff", // neon-blue
    secondaryColor: "#9d50bb", // neon-purple
    backgroundColor: "#020617", // slate-950
    isDarkMode: true,
    showServices: true,
    showFeatures: true,
    showContact: true,
  },
  images: {
    // Replace these URLs with your actual image files (e.g., "logo.png", "background.png")
    logo: "https://picsum.photos/seed/logo/200/200", 
    background: "https://picsum.photos/seed/bg/1920/1080",
    heroBg: "https://picsum.photos/seed/vibrant/1920/1080?blur=4",
    featuresImg: "https://picsum.photos/seed/cyber/800/600",
  },
};

export const PRESET_THEMES = [
  { name: 'Cyberpunk', primary: '#00d2ff', secondary: '#9d50bb' },
  { name: 'Emerald', primary: '#10b981', secondary: '#3b82f6' },
  { name: 'Sunset', primary: '#f59e0b', secondary: '#ef4444' },
  { name: 'Aurora', primary: '#a855f7', secondary: '#2dd4bf' },
  { name: 'Classic', primary: '#2563eb', secondary: '#1e40af' }
];
