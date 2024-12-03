export const mockNasaApiResponse = {
  collection: {
    items: [
      // Image response structure
      {
        href: "mock://nasa-api/image/MOCK_IMG_001/collection.json",
        data: [
          {
            title: "Mock Lunar Surface Photo",
            nasa_id: "MOCK_IMG_001",
            date_created: "2024-01-01T00:00:00Z",
            media_type: "image",
            description:
              "Test image showing lunar surface details captured during mock mission simulation. High-resolution photograph taken under controlled conditions.",
          },
        ],
        links: [
          {
            href: "mock://nasa-api/image/MOCK_IMG_001/thumb.jpg",
            rel: "preview",
            render: "image",
          },
        ],
      },
      // Video response structure
      {
        href: "mock://nasa-api/video/MOCK_VID_001/collection.json",
        data: [
          {
            title: "Mock Space Launch Sequence",
            nasa_id: "MOCK_VID_001",
            date_created: "2024-01-02T00:00:00Z",
            media_type: "video",
            description:
              "Test video footage showing spacecraft launch preparation and execution sequence. Created for testing media playback functionality.",
          },
        ],
        links: [
          {
            href: "mock://nasa-api/video/MOCK_VID_001/thumb.jpg",
            rel: "preview",
            render: "image",
          },
          {
            href: "mock://nasa-api/video/MOCK_VID_001/video.srt",
            rel: "captions",
          },
        ],
      },
      // Audio response structure
      {
        href: "mock://nasa-api/audio/MOCK_AUD_001/collection.json",
        data: [
          {
            center: "Cape Cat",
            date_created: "1900-01-02T00:00:00Z",
            description:
              "Gary Jordan (Host): Welcome everyone to our live launch broadcast of NASA's PACE mission. Today we're going to witness a remarkable achievement. Kelly Haston: Thank you Gary. I'm excited to guide you through this historic launch.",
            keywords: [
              "PACE",
              "Moon",
              "Aerosol",
              "Cloud",
              "ocean Ecosystem",
              "Mars",
            ],
            location: "SLC-40, CCSFS",
            media_type: "audio",
            nasa_id:
              "KSC-20240208-AU-LMM01-0001-SpaceX_PACE_Live_Launch_Coverage_1Blast1_2Blast2-M4428",
            photographer: "NASA/Lorne Mathre",
            title: "PACE Live Launch Coverage - (1) Blast 1 and (2) Blast 2",
            album: ["SpaceX_PACE"],
          },
        ],
      },
    ],
  },
};
