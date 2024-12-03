import { Text } from "@cruk/cruk-react-components";
import { LinkType } from "../../types";

interface ImagePreviewProps {
  links?: LinkType[];
  title: string;
}

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
      style={{ maxWidth: "100%" }}
    />
  );
};
