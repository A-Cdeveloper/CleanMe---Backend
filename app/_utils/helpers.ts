import { format } from "date-fns";

export const getDisplayName = (name: string) => {
  if (!name) return "";
  return name
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase())
    .join("");
};

export const generateBounds = (
  position: { lat: number; lng: number },
  distanceKm: number
) => {
  // Approximate 1 degree of latitude = 111km
  const degreeToKm = 111;

  // Calculate the latitude and longitude offset in degrees
  const latOffset = distanceKm / degreeToKm;
  const lngOffset =
    distanceKm / (degreeToKm * Math.cos((position.lat * Math.PI) / 180));

  // Generate the bounding box
  const northEast = {
    lat: position.lat + latOffset,
    lng: position.lng + lngOffset,
  };

  const southWest = {
    lat: position.lat - latOffset,
    lng: position.lng - lngOffset,
  };

  return {
    northEast,
    southWest,
  };
};

export const calculateDistanceFromBounds = (
  position: { lat: number; lng: number },
  bounds: {
    northEast: { lat: number; lng: number };
    southWest: { lat: number; lng: number };
  }
): number => {
  const degreeToKm = 111;

  const latDifference = bounds.northEast.lat - position.lat;
  const lngDifference = bounds.northEast.lng - position.lng;

  const latDistanceKm = Math.abs(latDifference * degreeToKm);

  const averageLat = (bounds.northEast.lat + bounds.southWest.lat) / 2;
  const lngDistanceKm = Math.abs(
    lngDifference * degreeToKm * Math.cos((averageLat * Math.PI) / 180)
  );

  return Math.round(Math.max(latDistanceKm, lngDistanceKm));
};

export const convertLatLngToString = (position: {
  lat: number;
  lng: number;
}): string => {
  return `Latitude: ${position.lat},\n Longitude: ${position.lng}`;
};

export const formatDate = (dateString: string) => {
  return dateString ? format(new Date(dateString), "dd.MM.yyyy") : "-";
};

export const sortByPropertyLength = <T>(
  array: T[],
  property: keyof T,
  order: "asc" | "desc" = "asc"
): T[] => {
  return [...array].sort((a, b) => {
    const countA = Array.isArray(a[property])
      ? (a[property] as unknown[]).length
      : 0;
    const countB = Array.isArray(b[property])
      ? (b[property] as unknown[]).length
      : 0;
    return order === "asc" ? countA - countB : countB - countA;
  });
};

export const wait = (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms));
