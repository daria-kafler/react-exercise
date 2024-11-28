"use client";

import { Text, Box, Heading } from "@cruk/cruk-react-components";
import { NasaResponse, NasaSearchParams } from "../types";
import { urlNasaSearch } from "../services/nasa";
import { useQuery } from "@tanstack/react-query";
import { ImagePreview } from "./media/ImagePreview";
import { VideoPreview } from "./media/VideoPreview";

export function List({ values }: { values?: NasaSearchParams }) {

  const urlNasaSearchUrl = values
    ? urlNasaSearch(values as NasaSearchParams)
    : "";

  const { data } = useQuery<NasaResponse>(
    ["nasaSearch", values],
    () => fetch(urlNasaSearchUrl).then((res) => res.json()),
    { enabled: !!urlNasaSearchUrl.length },
  );

  const truncateDescription = (text: String, maxLength: number ) => 
    text.length > maxLength ? `${text.slice(0, maxLength)}...` : text;

  const openDescriptionNewWindow = (text: string) => {
    const newWindow = window.open('', '_blank');
    if (newWindow) {
        // Format text into dialogue 
        // Adding line breaks before speaker name
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

  // Display media results
  return (
    <Box>
      {data?.collection.items.slice(0, 10).map((item, index) => (
        <Box key={index} marginBottom="s">
          {item.data[0] && (
            <>
              <Heading h2>{item.data[0].title}</Heading>
              {/* Media types to render */}
              {item.data[0].media_type === "image" && (
                <ImagePreview
                  links={item.links}
                  title={item.data[0].title}
                />
              )}
              {item.data[0].media_type === "video" && (
                <VideoPreview
                  links={item.links}
                  title={item.data[0].title}
                /> 
              )}
              {item.data[0].media_type === "audio" && (
                item.href ? (
                  <audio controls>
                    <source src={item.href} />
                  </audio>
                ) : (
                  <Text>Audio preview not available</Text>
                )
              )}

              {/* Description is conditional for media type */}
              {item.data[0].media_type === "audio" ? (
                item.data[0].description && ( // Checking if there is a description, otherwise it'll break
                  <Text onClick={() => openDescriptionNewWindow(item.data[0].description)}>
                    {`${item.data[0].description.slice(0,500)}... [Click to read the full episode transcript]`}
                  </Text>
                )
              ) : (
                item.data[0].description && (
                  <Text>{truncateDescription(item.data[0].description, 500)}</Text>
                )
              )}
            </>
          )}
        </Box>
      ))}
    </Box>
  );
}
