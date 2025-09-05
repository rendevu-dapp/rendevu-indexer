// types
type Metadata = {
  title: string;
  description: string;
  image: string;
  location?: {
    placeId?: string;
    name: string;
    address?: string;
    latitude: string;
    longitude: string;
  };
  virtualLink?: string;
};

export const fetchEventMetadata = async (
  metadataHash: string
): Promise<Metadata> => {
  const targetUrl = `https://api.thegraph.com/ipfs/api/v0/cat?arg=${metadataHash}`;
  const response = await fetch(targetUrl);
  if (!response.ok) {
    const data = await response.text();
    console.log(data);
    throw new Error(`Failed to fetch metadata: ${response.statusText}`);
  }
  return await response.json();
};
