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

/** Maximum number of items to display per page */
const ITEMS_PER_PAGE = 10;

/**
 * List component displays search results from NASA's media library.
 * Features:
 * - Paginated results display
 * - Different media type renderers (image, video, audio)
 * - Error handling and loading states
 * - Results count and current search display
 * 
 * @param {Object} props - Component props
 * @param {NasaSearchParams} [props.values] - Search parameters from the form
 */
export function List({ values }: { values?: NasaSearchParams }) {
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);

  // Construct NASA API URL from search parameters
  const urlNasaSearchUrl = values
    ? urlNasaSearch(values as NasaSearchParams)
    : "";

  /**
   * Handles page changes in the pagination component.
   * Scrolls to top of results when page changes.
   */
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo(0, 0);
  }

  /**
   * Fetch and manage NASA API data using React Query.
   * - Enabled only when search parameters exist
   * - No retry on failure
   * - Resets to page 1 on new search
   */
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
      retry: false,
      onSuccess: () => {
        setCurrentPage(1);
        window.scrollTo(0, 0);
      }
     }
  );
  
  // Handle different application states
  if (!urlNasaSearchUrl.length) {
    return null; // Initial app state, no search made yet
  }

  if (isLoading && urlNasaSearchUrl.length > 0) {
    return <ErrorDisplay error="Loading..." type="loading" />;
  }

  if (isError) {
    return <ErrorDisplay error={error} />; // Note: Error may log twice in development potentially due to React StrictMode
  }

  if (data && !validateNasaResponse(data)) {
    return <ErrorDisplay error={`Data validation failed: Invalid API response structure`} />;
  }

  if (!data?.collection?.items?.length) {
    return <ErrorDisplay error="No results found" type="noResults" />;
  }

  // / Calculate pagination values
  const totalItems = data.collection.items.length;
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = Math.min(startIndex + ITEMS_PER_PAGE, totalItems);
  const currentItems = data.collection.items.slice(startIndex, endIndex);

  return (
    <Box>
      {/* Results count and search terms display */}
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
              {/* Render media compinent based on type */}
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
              {/* Render description modal */}
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

      {/* Show pagination if we have more than one page of results */}
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

