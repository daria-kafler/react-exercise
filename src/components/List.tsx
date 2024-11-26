"use client";

import { Text, Box } from "@cruk/cruk-react-components";
import { NasaResponse, NasaSearchParams } from "../types";
import { urlNasaSearch } from "../services/nasa";
import { useQuery } from "@tanstack/react-query";

export function List() {
  const values: NasaSearchParams = {
    keywords: "moon",
    mediaType: "audio",
    yearStart: 2000,
  };

  const urlNasaSearchUrl = values
    ? urlNasaSearch(values as NasaSearchParams)
    : "";

  console.log(urlNasaSearchUrl);

  const { data } = useQuery<NasaResponse>(
    ["nasaSearch", values],
    () => fetch(urlNasaSearchUrl).then((res) => res.json()),
    { enabled: !!urlNasaSearchUrl.length },
  );

  // Basic list displays titles
  // TODO: Display as images, video, or audio clips
  return (
    <Box paddingVertical="auto">
      {data?.collection.items.slice(0, 10).map((item, index) => (
        <Box key={index} paddingVertical="s">
          <Text>{item.data[0].title}</Text>
        </Box>
      ))}
    </Box>
  );
}
