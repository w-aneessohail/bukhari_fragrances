import { useState } from "react";
import { uploadAdminProductImages } from "../../services/adminProductService";

type ProductImageUploadProps = {
  productId: string;
  onUploaded: () => void;
};

export default function ProductImageUpload({ productId, onUploaded }: ProductImageUploadProps) {
  const [error, setError] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files?.length) return;

    setError(null);
    setIsUploading(true);

    try {
      await uploadAdminProductImages(productId, files);
      onUploaded();
      event.target.value = "";
    } catch {
      setError("Upload failed. Check Cloudinary credentials in your environment file.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="rounded-lg border border-border bg-bg-secondary p-4">
      <p className="text-sm font-medium text-text-primary">Product images</p>
      <p className="mt-1 text-xs text-text-secondary">JPEG, PNG, or WebP up to 5 MB each.</p>
      <input
        type="file"
        accept="image/jpeg,image/png,image/webp"
        multiple
        disabled={isUploading}
        onChange={handleChange}
        className="mt-3 block w-full text-sm text-text-secondary"
      />
      {isUploading ? <p className="mt-2 text-xs text-text-secondary">Uploading…</p> : null}
      {error ? <p className="mt-2 text-xs text-red-500">{error}</p> : null}
    </div>
  );
}
