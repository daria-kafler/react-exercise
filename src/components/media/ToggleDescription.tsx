import { Text, Box, Button } from "@cruk/cruk-react-components";
import { useState } from 'react';

interface ToggleDescriptionProps {
    description: string;
    maxLength?: number;
}

export const ToggleDescription: React.FC<ToggleDescriptionProps> = ({ 
    description, 
    maxLength = 500 
}) => {
    const [isExpanded, setIsExpanded] = useState(false);
    
    const shouldToggle = description.length > maxLength;

    return (
        <Box>
            <Text 
                onClick={() => setIsExpanded(!isExpanded)} // Toggle only if text is longer than maxLength
                style={{ cursor: shouldToggle ? 'pointer' : 'default' }} // Show pointer only i fcan toggle 
                aria-label={isExpanded ? 'Collapse description' : 'Expand description'}
            >
                {isExpanded 
                    ? description
                    : (shouldToggle ? `${description.slice(0, maxLength)}...` : description )
                    }
                {shouldToggle && (
                    <Button>
                        {isExpanded ? 'Show less' : 'Read more'}
                    </Button>
                )}
            </Text>
        </Box>
    );
};