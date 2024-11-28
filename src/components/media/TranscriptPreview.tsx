import { Text } from "@cruk/cruk-react-components"

interface TranscriptPreviewProps {
    description: string;
}

export const TranscriptPreview: React.FC<TranscriptPreviewProps> =({ description }) => {
    const openDescriptionNewWindow = (text: string) => {
        const newWindow = window.open('', '_blank');
    
        if (newWindow) {
        // Format text into dialogue, adding line breaks before speaker name
        const formattedText = text.replace(/([A-Za-z\s()]+):/g, '\n\n<span class="speaker">$1:</span>');
    
        newWindow.document.write(`
          <html>
            <head>
              <title>Episode Transcript</title>
              <style>
                body {
                  font-family: Arial, sans-serif;
                  line-height: 1.6;
                  max-width: 800px;
                  margin: 20px auto;
                  padding: 20px;
                  background-color: #f5f5f5;
                }
                .transcript {
                  background-color: white;
                  padding: 30px;
                  border-radius: 8px;
                  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
                  white-space: pre-wrap;
                }
                .speaker {
                  font-weight: bold;
                  color: #2e008b;
                  display: block;
                  margin-top: 1em;
                }
              </style>
            </head>
            <body>
              <div class="transcript">
                ${formattedText}
              </div>
            </body>
          </html>
        `);
        } else {
          console.log("newWindow failed to create. Check for popup blocker.");
          // TODO: Add user message too?
        }
    };

    return (
        <Text 
            onClick={() => openDescriptionNewWindow(description)}
            style={{ cursor: 'pointer' }}
            aria-label="Click to read the full episode transcript (opens in a new window)"
            title="Opens in a new window"
        >
        {`${description.slice(0,500)}... [Click to read the full episode transcript]`}
      </Text>
    )
}