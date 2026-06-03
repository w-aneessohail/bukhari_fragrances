import type { Variants } from "framer-motion";

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 48 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
};

export const staggerContainer: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.1 }
  }
};

export const heroTagline = "Where Lahore meets luxury";

export const storyChapters = [
  {
    title: "Born in Lahore",
    body: "Bukhari Perfumes began in the heart of Lahore — blending centuries of perfumery tradition with a modern eye for elegance.",
    image: "https://images.unsplash.com/photo-1587474260584-136574528ed5?auto=format&fit=crop&w=900&q=80"
  },
  {
    title: "Crafted from nature",
    body: "From Arabian oud and South Asian jasmine to Italian bergamot, every note is selected for depth, longevity, and character.",
    image: "https://images.unsplash.com/photo-1595425970387-43581757789b?auto=format&fit=crop&w=900&q=80"
  },
  {
    title: "Worn by thousands",
    body: "Trusted across Pakistan for signature scents, gifting, and everyday luxury — worn from morning meetings to evening gatherings.",
    image: "https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&w=900&q=80"
  }
];

export const brandStats = [
  { label: "Happy customers", value: 2000, suffix: "+" },
  { label: "Fragrances", value: 50, suffix: "+" },
  { label: "Average rating", value: 5, suffix: "★" }
];

export const ingredientStops = [
  { name: "Oud", region: "Middle East", x: 62, y: 42 },
  { name: "Jasmine", region: "South Asia", x: 68, y: 48 },
  { name: "Bergamot", region: "Italy", x: 48, y: 38 }
];
