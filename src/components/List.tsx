"use client";

import { Box, Heading, Text, Pagination } from "@cruk/cruk-react-components";
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

  // Pagination!
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo(0, 0);
  }

  // Fetch data
  const { data, error, isError, isLoading} = useQuery<NasaResponse>(
    ["nasaSearch", values],
    () => 
      fetch(urlNasaSearchUrl).then((response) => {
        if (!response.ok) {
          throw new Error(`'HTTP Error:' ${response.status}, for URL: ${urlNasaSearchUrl}`);
        }
        return response.json();
      }),
    { enabled: !!urlNasaSearchUrl.length, // Fetch only if we have search params
      retry: false, // Don't retry failed requests
      onSuccess: () => {
        // For new search reset to page 1 and scroll to top
        setCurrentPage(1);
        window.scrollTo(0, 0);
      }
     }
  );
  
  // Initial app state. Checks for search params, which we don't expect to exist
  if (!urlNasaSearchUrl.length) {
    return null;
  }
  // Show loading state while making request to API
  if (isLoading && urlNasaSearchUrl.length > 0) {
    return <ErrorDisplay error="Loading..." type="loading" />;
  }
  // If request fails, stop rendering results and display an error
  // Note: Error may log twice in development potentially due to React StrictMode
  if (isError) {
    return <ErrorDisplay error={error} />;
  }
  // Validate incoming data structure, but only if we have it
  if (data && !validateNasaResponse(data)) {
    return <ErrorDisplay error={`Data validation failed: Invalid API response structure`} />;
  }

  // Handle no results found
  if (!data?.collection?.items?.length) {
    return <ErrorDisplay error="No results found" type="noResults" />;
  }

  // Results pagination info bar
  const totalItems = data.collection.items.length;
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = Math.min(startIndex + ITEMS_PER_PAGE, totalItems);
  const currentItems = data.collection.items.slice(startIndex, endIndex);

  return (
    <Box>
      <Box>
        <Text>
          Showing <strong>{startIndex + 1} - {endIndex}</strong> out of <strong>{totalItems}</strong> for: {values?.keywords}
        </Text>
      </Box>
      {/* Results List */}
      {currentItems.map((item, index) => (
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
      {/* Pagination controls */}
      {totalItems > ITEMS_PER_PAGE && (
        <Box marginTop="m">
          <Pagination
            current={currentPage}
            perPage={ITEMS_PER_PAGE}
            items={totalItems}
            pagerCallback={handlePageChange}
            aria-label="Bottom pagination"
          />
        </Box>
      )}
    </Box>
  );
};

