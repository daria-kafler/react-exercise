import { Text } from "@cruk/cruk-react-components";

interface AudioPreviewProps {
  title: string;
  href?: string;
}

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
