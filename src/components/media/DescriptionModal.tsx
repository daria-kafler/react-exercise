import { Modal, Text, Button, Box, Heading } from "@cruk/cruk-react-components";
import { useState } from 'react';
import { NasaSearchParams } from '../../types';


interface DescriptionModalProps {
    description: string;
    title: string;
    maxPreviewLength?: number;
    mediaType?: NasaSearchParams["mediaType"];
}

interface TextSegment {
    speaker: string;
    content: string;
}

export const DescriptionModal: React.FC<DescriptionModalProps> = ({
    description,
    title,
    maxPreviewLength = 500,
    mediaType
}) => {
    const [showModal, setShowModal] = useState(false);
    const toggleModal = () => setShowModal(!showModal);

    // Format audio transcripts with speaker names
    const formatAudioTranscript = (text: string): TextSegment[] => {
        // Split on full names that precede a colon, excluding URLs
        const segments = text.split(/(?=(?![hH]ttps?:\/\/)[A-Z][A-Za-z]+(?:\s+[A-Z][A-Za-z]+)*(?:\s+\([A-Za-z\s]+\))?\s*:)/);
        
        return segments.map(segment => {
            // Match full names (one or more words starting with capital letters) followed by colon
            const match = segment.match(/^([A-Z][A-Za-z]+(?:\s+[A-Z][A-Za-z]+)*(?:\s+\([A-Za-z\s]+\))?)\s*:(.+)/s);
            
            if (match && match[1] && match[2]) {
                return {
                    speaker: match[1].trim(),
                    content: match[2].trim()
                };
            }
            
            return {
                speaker: '',
                content: segment.trim()
            };
        }).filter(segment => segment.content.length > 0);
    };

    // For non-audio content, just return the text as a single segment
    const formatRegularText = (text: string): TextSegment[] => {
        return [{
            speaker: '',
            content: text
        }];
    };

    const formattedSegments = mediaType === 'audio' 
        ? formatAudioTranscript(description)
        : formatRegularText(description);

    const plainPreview = description.length > maxPreviewLength
        ? `${description.slice(0, maxPreviewLength)}...`
        : description;

    return (
        <Box>
            {/* Preview text */}
            <Box marginBottom="s">
                <Text>
                    {plainPreview}
                </Text>
            </Box>
            
            {/* Read More button in its own box */}
            {description.length > maxPreviewLength && (
                <Box marginBottom="m">
                    <Button
                        onClick={toggleModal}
                        appearance="secondary"
                    >
                        Read more
                    </Button>
                </Box>
            )}

            {showModal && (
                <Modal 
                    closeFunction={toggleModal} 
                    modalName="description-modal"
                >
                    <Heading h2 marginTop="none" marginBottom="m" textSize="xl">
                        {title}
                    </Heading>

                    {/* Scrollable content area */}
                    <Box 
                        style={{
                            maxHeight: '60vh',
                            overflowY: 'auto',
                            paddingRight: '1rem',
                            marginBottom: '1rem'
                        }}
                    >
                        {formattedSegments.map((segment, index) => (
                            <Box key={index} marginBottom="m">
                                {segment.speaker && (
                                    <Text
                                        style={{
                                            fontWeight: 'bold',
                                            color: '#2e008b'
                                        }}
                                    >
                                        {segment.speaker}:
                                    </Text>
                                )}
                                <Text>{segment.content}</Text>
                            </Box>
                        ))}
                    </Box>

                    {/* Footer with close button */}
                    <Box>
                        <Button 
                            appearance="primary" 
                            onClick={toggleModal}
                        >
                            Close
                        </Button>
                    </Box>
                </Modal>
            )}
        </Box>
    );
};