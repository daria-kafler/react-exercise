import { Text, Box } from "@cruk/cruk-react-components";
import { LinkType } from "../../types";
import { useState } from "react";

interface VideoPreviewProps {
    links?: LinkType[];
    title: string;
}

export const VideoPreview: React.FC<VideoPreviewProps> = ({ links, title }) => {
    const [isVideo, setIsVideo] = useState(false); // Tracks if the video elemnt is shown

    // Check for links
    if (!links?.length) {
        return <Text>Video preview unavailable</Text>
    }

    const videoExtensions = ['.srt', '.vtt', '.mp4'];
    
    // Find thumbnail and video links
    let thumbnailLink = '';
    let videoLink = '';
    for (const link of links) {
        if (link.render === 'image' && !thumbnailLink) {
            thumbnailLink = link.href;
        }
        if (videoExtensions.some(extension => link.href?.endsWith(extension)) && !videoLink) {
            videoLink = link.href;
        }

        // if (thumbnailLink && videoLink) break;
    }
    // If no video is available
    if (!videoLink) {
        return <Text>Video unavailable</Text>
    }
    // If only video exists, skip thumbnail
    if (!thumbnailLink) {
        return (
            <Box>
                <video 
                    src={videoLink}
                    title={title}
                    controls
                    autoPlay
                    style={{ maxWidth: '100%' }}
                />
            </Box>
        );
    }
    
    // Render with thumbnail, replace thumbnail with video onClick
    return  (
        <Box>
            {!isVideo ? (
                <img 
                    src={thumbnailLink}
                    alt={`${title} preview`}
                    style={{ maxWidth: '85%', cursor: 'pointer' }}
                    onClick={() => setIsVideo(true)}
                    aria-label="Play video"
                />
            ) : (
                <video 
                    src={videoLink}
                    title={title}
                    controls
                    autoPlay
                    style={{ maxWidth: '100%' }}
                />
            )}
        </Box>
    );
};