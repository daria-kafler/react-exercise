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
            description: "Test image showing lunar surface details captured during mock mission simulation. High-resolution photograph taken under controlled conditions."
          }
        ],
        links: [
          {
            href: "mock://nasa-api/image/MOCK_IMG_001/thumb.jpg",
            rel: "preview",
            render: "image"
          }
        ]
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
            description: "Test video footage showing spacecraft launch preparation and execution sequence. Created for testing media playback functionality."
          }
        ],
        links: [
          {
            href: "mock://nasa-api/video/MOCK_VID_001/thumb.jpg",
            rel: "preview",
            render: "image"
          },
          {
            href: "mock://nasa-api/video/MOCK_VID_001/video.srt",
            rel: "captions"
          }
        ]
      },
    ],
  },
}