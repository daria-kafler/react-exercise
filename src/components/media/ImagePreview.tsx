import { Text } from "@cruk/cruk-react-components";
import { LinkType } from "../../types";

/**
 * Props for the ImagePreview component
 * @interface ImagePreviewProps
 */
interface ImagePreviewProps {
  /** Array of links from NASA API, first link contains image URL */
  links?: LinkType[];
  title: string;
}

/**
 * Component to display image content from NASA API.
 * Features:
 * - Responsive image display
 * - Fallback for missing images
 * - Accessibility labels
 *
 * @param props - Component props
 * @param props.links - Array of media links from NASA API
 * @param props.title - Title/alt text for the image
 */
export const ImagePreview: React.FC<ImagePreviewProps> = ({ links, title }) => {
  const imageLink = links?.[0]?.href;

  if (!imageLink) {
    return <Text>Image preview not available</Text>;
  }
  return (
    <img
      src={imageLink}
      alt={title}
      aria-label="Image"
      data-testid="image-component"
      style={{ maxWidth: "85%" }}
    />
  );
};
