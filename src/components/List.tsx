"use client";

import { Box, Heading, Text } from "@cruk/cruk-react-components";
import { NasaResponse, NasaSearchParams } from "../types";
import { urlNasaSearch } from "../services/nasa";
import { useQuery } from "@tanstack/react-query";
import { ImagePreview } from "./media/ImagePreview";
import { VideoPreview } from "./media/VideoPreview";
import { AudioPreview } from "./media/AudioPreview";
import { validateNasaResponse } from "../utilities/validateNasaResponse";
import { ErrorDisplay } from './ErrorDisplay';
import { DescriptionModal } from "./media/DescriptionModal";
import { useState } from "react";


const ITEMS_PER_PAGE = 10;

export function List({ values }: { values?: NasaSearchParams }) {
  const [currentPage, setCurrentPage] = useState(1);

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
  // If request fails, stop rendering results and display an error
  if (isError) {
    // Note: Error may log twice in development potentially due to React StrictMode
    return <ErrorDisplay error={error} />;
  }
  // Validate incoming data, but only if we have it
  if (data && !validateNasaResponse(data)) {
    return <ErrorDisplay error={`Data validation failed: Invalid API response structure`} />;
  }

  // Handle no results found
  if (!data?.collection?.items?.length) {
    return <ErrorDisplay error="No results found" type="noResults" />;
  }

  // PAGINATION TIME
  const totalItems = data.collection.items.length;
  const startIndex = (currentPage -1) * ITEMS_PER_PAGE;
  const endIndex = Math.min(startIndex + ITEMS_PER_PAGE, totalItems);

  return (
    <Box>
      {/* TODO: Pagination if have time */}
      <Box>
        <Text>
          Showing <strong>{startIndex + 1} - {endIndex}</strong> out of <strong>{totalItems}</strong> for: {values?.keywords}
        </Text>
      </Box>
      {/* Results List */}
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
              {/* Description handling */}
              {item.data[0].description && (
                <DescriptionModal 
                description={item.data[0].description}
                title={item.data[0].title}
                mediaType={item.data[0].media_type}
                />
              )}
            </>
          )}
        </Box>
      ))}
    </Box>
  );
};

