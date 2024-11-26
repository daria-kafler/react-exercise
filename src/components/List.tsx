"use client";

import { useTheme } from "styled-components";
import { Text, Box } from "@cruk/cruk-react-components";
import { NasaResponse, NasaSearchParams } from "../types";
import { urlNasaSearch } from "../services/nasa";
import { useQuery } from "@tanstack/react-query";

export function List() {
  // let's see what the theme values are for image sizes
  const theme = useTheme();
  console.log('THEME VALUES:', theme);

  // TODO: values need ot change accordign to form submits
  const values: NasaSearchParams = {
    keywords: "mars",
    mediaType: "audio",
    yearStart: 2000,
  };

  const urlNasaSearchUrl = values
    ? urlNasaSearch(values as NasaSearchParams)
    : "";

  // TODO: is this needed? 
  console.log("Search Input:", urlNasaSearchUrl); 

  const { data } = useQuery<NasaResponse>(
    ["nasaSearch", values],
    () => fetch(urlNasaSearchUrl).then((res) => res.json()),
    { enabled: !!urlNasaSearchUrl.length },
  );

  // Basic list displays titles
  // TODO: Show each media displayed as type.  
  return (
    <Box>
      {data?.collection.items.slice(0, 10).map((item, index) => (
        <Box key={index} marginBottom="s">
          {item.data[0] && (
            <>
              <Text>{item.data[0].title}</Text>
              {/* media_type handling */}
              {/* image */}
              {item.data[0].media_type === "image" && (
                item.links ? (
                  <img
                    src={item.links[0].href}
                    alt={item.data[0].title}
                    style={{ maxWidth: '100%' }}
                  />
                ) : (
                  <Text>Image preview not available</Text>
                )
              )}
              {/* video */}
              {item.data[0].media_type === "video" && (
                item.links ? (
                  <video controls style={{ maxWidth: '100%' }}>
                    <source src={item.links[0].href} />
                  </video>
                ) : (
                  <Text>Video preview not available</Text>
                )
              )}
              {/* audio */}
              {item.data[0].media_type === "audio" && (
                item.links ? (
                  <audio controls>
                    <source src={item.links[0].href} />
                  </audio>
                ) : (
                  <Text>Audio preview not available</Text>
                )
              )}
              <Text>{item.data[0].description}</Text>
            </>
          )}
        </Box>
      ))}
    </Box>
  );
}
