"use client";

import { Modal, Text, Button, Box, Heading } from "@cruk/cruk-react-components";
import { useState } from "react";
import { NasaSearchParams } from "../../types";

/**
 * Props for the DescriptionModal component
 * @interface DescriptionModalProps
 */
interface DescriptionModalProps {
  /** Full description text to display */
  description: string;
  /** Title of the media item */
  title: string;
  /** Maximum length of preview text before truncation. Defaults to 500 characters */
  maxPreviewLength?: number;
  /** Type of media - affects text formatting (especially for audio transcripts) */
  mediaType?: NasaSearchParams["mediaType"];
}

/**
 * Represents a segment of text, to differentiate between speaker and content in interviews
 * Used primarily for formatting audio transcripts
 * @interface TextSegment
 */
interface TextSegment {
  speaker: string;
  content: string;
}

/**
 * Modal component for displaying media descriptions with special handling for audio transcripts.
 * Features:
 * - Truncated preview with "Read more" button
 * - Full text in modal dialog
 * - Special formatting for audio transcripts (speaker segmentation)
 * - Responsive layout with scrollable content
 */
export const DescriptionModal: React.FC<DescriptionModalProps> = ({
  description,
  title,
  maxPreviewLength = 500,
  mediaType,
}) => {
  // Modal state
  const [showModal, setShowModal] = useState(false);
  const toggleModal = () => setShowModal(!showModal);

  /**
   * Formats audio transcript text into speaker segments.
   * Handles complex cases like:
   * - Multiple speakers
   * - Speaker names with titles/roles in parentheses
   * - URLs in text (excluded from speaker detection)
   *
   * @param text - Raw transcript text
   * @returns Array of text segments with speaker attributions
   */
  const formatAudioTranscript = (text: string): TextSegment[] => {
    // Split on full names that precede a colon, excluding URLs
    const segments = text.split(
      /(?=(?![hH]ttps?:\/\/)[A-Z][A-Za-z]+(?:\s+[A-Z][A-Za-z]+)*(?:\s+\([A-Za-z\s]+\))?\s*:)/,
    );

    return segments
      .map((segment) => {
        // Match full names (one or more words starting with capital letters) followed by colon
        const match = segment.match(
          /^([A-Z][A-Za-z]+(?:\s+[A-Z][A-Za-z]+)*(?:\s+\([A-Za-z\s]+\))?)\s*:(.+)/s,
        );

        if (match?.[1]?.trim() && match?.[2]?.trim()) {
          return {
            speaker: match[1].trim(),
            content: match[2].trim(),
          };
        }

        return {
          speaker: "",
          content: segment.trim(),
        };
      })
      .filter((segment) => segment.content.length > 0);
  };

  /**
   * Formats non-audio text as a single segment.
   * Used for regular descriptions that don't need speaker segmentation.
   */
  const formatRegularText = (text: string): TextSegment[] => {
    return [
      {
        speaker: "",
        content: text,
      },
    ];
  };

  // Choose formatting based on media type
  const formattedSegments =
    mediaType === "audio"
      ? formatAudioTranscript(description)
      : formatRegularText(description);

  // Create truncated preview if needed
  const plainPreview =
    description.length > maxPreviewLength
      ? `${description.slice(0, maxPreviewLength)}...`
      : description;

  return (
    <Box>
      {/* Preview text */}
      <Box marginBottom="s" aria-label="description" data-testid="preview-text">
        <Text>{plainPreview}</Text>
      </Box>

      {/* Show Read More button only if content is truncated */}
      {description.length > maxPreviewLength && (
        <Box marginBottom="m">
          <Button onClick={toggleModal} appearance="secondary">
            Read more
          </Button>
        </Box>
      )}

      {/* Modal with full content */}
      {showModal && (
        <Modal closeFunction={toggleModal} modalName="description-modal">
          <Heading h2 marginTop="none" marginBottom="m" textSize="xl">
            {title}
          </Heading>

          {/* Scrollable content area */}
          <Box
            style={{
              maxHeight: "60vh",
              overflowY: "auto",
              paddingRight: "1rem",
              marginBottom: "1rem",
            }}
            data-testid="modal-content"
          >
            {formattedSegments.map((segment, index) => (
              <Box
                key={index}
                marginBottom="m"
                data-testid="speaker-segmentation"
              >
                {segment.speaker && (
                  <Text
                    style={{
                      fontWeight: "bold",
                      color: "#2e008b",
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
            <Button appearance="primary" onClick={toggleModal}>
              Close
            </Button>
          </Box>
        </Modal>
      )}
    </Box>
  );
};
