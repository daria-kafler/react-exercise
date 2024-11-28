"use client";

import { Text, Box, Heading } from "@cruk/cruk-react-components";
import { NasaResponse, NasaSearchParams } from "../types";
import { urlNasaSearch } from "../services/nasa";
import { useQuery } from "@tanstack/react-query";
import { ImagePreview } from "./media/ImagePreview";
import { VideoPreview } from "./media/VideoPreview";
import { AudioPreview } from "./media/AudioPreview";
import { TranscriptPreview } from "./media/TranscriptPreview";
import { ToggleDescription } from "./media/ToggleDescription";

export function List({ values }: { values?: NasaSearchParams }) {

  const urlNasaSearchUrl = values
    ? urlNasaSearch(values as NasaSearchParams)
    : "";

  const { data } = useQuery<NasaResponse>(
    ["nasaSearch", values],
    () => fetch(urlNasaSearchUrl).then((res) => res.json()),
    { enabled: !!urlNasaSearchUrl.length },
  );

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
}
