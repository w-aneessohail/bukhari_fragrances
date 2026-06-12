type BrandWordmarkProps = {
  className?: string;
  size?: "sm" | "md" | "lg" | "hero";
};

const sizeClasses = {
  sm: "text-lg md:text-xl",
  md: "text-2xl md:text-3xl",
  lg: "text-4xl md:text-5xl",
  hero: "text-[clamp(2.75rem,7vw,5.5rem)] leading-[0.95]"
};

export default function BrandWordmark({ className = "", size = "md" }: BrandWordmarkProps) {
  return (
    <span className={`font-brand tracking-[0.02em] ${sizeClasses[size]} ${className}`} aria-label="Bukhari Perfumes">
      <span className="text-text-primary">Bukhari</span>
      <span className="text-accent-gold"> Perfumes</span>
    </span>
  );
}
