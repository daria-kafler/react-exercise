import { Text } from "@cruk/cruk-react-components";
import { LinkType } from "../../types";

interface ImagePreviewProps {
    links?: LinkType[];
    title: string;
}

export const ImagePreview: React.FC<ImagePreviewProps> = ({ links, title }) => {
    const imageURL = links?.[0]?.href;
    
    if (!imageURL) {
        return <Text>Image preview not available</Text>
    }
    return  (
        <img 
            src={imageURL}
            alt={title}
            style={{ maxWidth: '100%' }}
        />
    );
};