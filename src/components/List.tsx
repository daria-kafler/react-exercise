"use client";

import { Box, Heading } from "@cruk/cruk-react-components";
import { NasaResponse, NasaSearchParams } from "../types";
import { urlNasaSearch } from "../services/nasa";
import { useQuery } from "@tanstack/react-query";
import { ImagePreview } from "./media/ImagePreview";
import { VideoPreview } from "./media/VideoPreview";
import { AudioPreview } from "./media/AudioPreview";
import { TranscriptPreview } from "./media/TranscriptPreview";
import { ToggleDescription } from "./media/ToggleDescription";
import { validateNasaResponse } from "../utilities/validateNasaResponse";
import { ErrorDisplay } from './ErrorDisplay';

export function List({ values }: { values?: NasaSearchParams }) {

  const urlNasaSearchUrl = values
    ? urlNasaSearch(values as NasaSearchParams)
    : "";

  // Fetch data, validate data, handle errors
  const { data, error, isError, isLoading} = useQuery<NasaResponse>(
    ["nasaSearch", values],
    () => 
      fetch(urlNasaSearchUrl).then((response) => {
        if (!response.ok) {
          throw new Error(`'HTTP Error:' ${response.status}, for URL: ${urlNasaSearchUrl}`);
        }
        return response.json();
      }),
    { enabled: !!urlNasaSearchUrl.length,
      retry: false, // disable retries
     }
  );
  
  // Handle initial state message
  if (!urlNasaSearchUrl.length) {
    return null;
  }
  // Handle loading
  if (isLoading && urlNasaSearchUrl.length > 0) {
    return <ErrorDisplay error="Loading..." type="loading" />;
  }

  if (isError) {
    // Note: Error may log twice in development potentially due to React StrictMode
    return <ErrorDisplay error={error} />;
  }

  // Only validate data if we have it
  if (data && !validateNasaResponse(data)) {
    return <ErrorDisplay error={`Data validation failed: Invalid API response structure`} />;
  }

  if (!data?.collection?.items?.length) {
    return <ErrorDisplay error="No results found" type="noResults" />;
  }

  return (
    <Box>
      {/* TODO: Pagination if have time */}
      {/* TODO: Loading message if have time */}
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
                <AudioPreview 
                href={item.href}
                title={item.data[0].title}
                />
              )}

              {/* Description is conditional for media type */}
              {item.data[0].media_type === "audio" ? (
                <TranscriptPreview 
                  description={item.data[0].description}
                />
              ) : (
                item.data[0].description && (
                  <ToggleDescription description={item.data[0].description} />
                )
              )}
            </>
          )}
        </Box>
      ))}
    </Box>
  );
};

