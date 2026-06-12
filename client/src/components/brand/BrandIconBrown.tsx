import { EXPERIENCE_TEXTURES } from "../../constants/experienceAssets";

type BrandIconBrownProps = {
  size?: "sm" | "md" | "lg";
  className?: string;
};

const boxSize = {
  sm: "h-8 w-8",
  md: "h-12 w-12",
  lg: "h-14 w-14"
};

/** Brown BP monogram — always object-contain inside a square box (no stretch). */
export default function BrandIconBrown({ size = "md", className = "" }: BrandIconBrownProps) {
  return (
    <span
      className={`inline-flex shrink-0 items-center justify-center ${boxSize[size]} ${className}`}
      aria-hidden
    >
      <img
        src={EXPERIENCE_TEXTURES.brandIconBrown}
        alt=""
        className="max-h-full max-w-full object-contain object-center"
        draggable={false}
      />
    </span>
  );
}
