import { Text } from "@cruk/cruk-react-components";

/**
 * Props for the AudioPreview component
 * @interface AudioPreviewProps
 */
interface AudioPreviewProps {
  title: string;
  href?: string;
}

/**
 * Component to display audio content from NASA API.
 * Features:
 * - Native audio controls
 * - Fallback for missing audio
 * - Accessibility labels
 *
 * @param props - Component props
 * @param props.title - Title of the audio clip
 * @param props.href - URL of the audio file
 */
export const AudioPreview: React.FC<AudioPreviewProps> = ({ title, href }) => {
  // Check for audio url
  if (!href) {
    return <Text>Audio not available</Text>;
  }
  return (
    <audio controls aria-label="Audio preview" data-testid="audio-component">
      <source src={href} title={title} />
    </audio>
  );
};
