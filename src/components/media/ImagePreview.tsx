import { Text } from "@cruk/cruk-react-components";
import { LinkType } from "../../types";

interface ImagePreviewProps {
    links?: LinkType[];
    title: string;
}

export const ImagePreview: React.FC<ImagePreviewProps> = ({ links, title }) => {
    // Check for link array and if has href
    const imageLink = links && links[0]?.href;
    
    if (!imageLink) {
        return <Text>Image preview not available</Text>
    }
    return  (
        <img 
            src={imageLink}
            alt={title}
            aria-label="Image"
            data-testid="image-component"
            style={{ maxWidth: '100%' }}
        />
    );
};