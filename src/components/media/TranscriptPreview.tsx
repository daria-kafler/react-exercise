import { Text, Button } from "@cruk/cruk-react-components"
import { useState } from 'react';
import { TranscriptPageFormat } from './TranscriptPageFormat';

interface TranscriptPreviewProps {
    description: string;
}

export const TranscriptPreview: React.FC<TranscriptPreviewProps> =({ description }) => {
  const [popupError, setPopupError] = useState(false);
  const openDescriptionNewWindow = (text: string) => {
        const newWindow = window.open('', '_blank');

        if (newWindow) {
          try {
            const formattedText = text.replace(/([A-Za-z\s()]+):/g, '\n\n<span class="speaker">$1:</span>');
            newWindow.document.write(TranscriptPageFormat({ content: formattedText}));
            setPopupError(false); // Reset error state if successful
          } catch (error) {
              console.error('Failed to write transcript to new window:', error);
              setPopupError(true);
          }
      } else {
          console.error('Popup blocked: Unable to open transcript window');
          setPopupError(true);
      }
  };
        

    //     if (newWindow) {
    //     // Format text into dialogue, adding line breaks before speaker name
    //     const formattedText = text.replace(/([A-Za-z\s()]+):/g, '\n\n<span class="speaker">$1:</span>');
    
    //     newWindow.document.write(`
    //       <html>
    //         <head>
    //           <title>Episode Transcript</title>
    //           <style>
    //             body {
    //               font-family: Arial, sans-serif;
    //               line-height: 1.6;
    //               max-width: 800px;
    //               margin: 20px auto;
    //               padding: 20px;
    //               background-color: #f5f5f5;
    //             }
    //             .transcript {
    //               background-color: white;
    //               padding: 30px;
    //               border-radius: 8px;
    //               box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    //               white-space: pre-wrap;
    //             }
    //             .speaker {
    //               font-weight: bold;
    //               color: #2e008b;
    //               display: block;
    //               margin-top: 1em;
    //             }
    //           </style>
    //         </head>
    //         <body>
    //           <div class="transcript">
    //             ${formattedText}
    //           </div>
    //         </body>
    //       </html>
    //     `);
    //     } else {
    //       console.error('Popup blocked: Unable to open transcript window. URL:', window.location.href);          // TODO: Add user message too?
    //     }
    // };

    return (
      <>
        <Text
          onClick={() => openDescriptionNewWindow(description)}
          style={{ cursor: 'pointer' }}
          aria-label="Click to read the full episode transcript (opens in a new window)"
          title="Opens in a new window"
        >
          {`${description.slice(0, 500)}...`}
          <Button>
            Click to read the full episode transcript
          </Button>
        </Text>
        {popupError && (
          <Text color="error">
              Unable to open transcript. Please allow popups for this site and try again.
          </Text>
        )}
        </>
    );
};