import piexif from "piexifjs";

// API returns localized name maps (vernacularNames, groupNames) keyed by
// ISO 639-1. Only return the active language's entry; if it is missing,
// fall back to the legacy singular field (which is empty when the species
// has no vernacular name, so callers then show the scientific name).
export const pickLocalized = (map, fallback, activeCode) => {
  if (map && typeof map === "object" && map[activeCode]) {
    return map[activeCode];
  }
  return fallback;
};

export const runningOnMobile = () => {
  return (
    navigator.userAgent.match(/Android/i) ||
    navigator.userAgent.match(/webOS/i) ||
    navigator.userAgent.match(/iPhone/i) ||
    navigator.userAgent.match(/iPad/i) ||
    navigator.userAgent.match(/iPod/i) ||
    navigator.userAgent.match(/BlackBerry/i) ||
    navigator.userAgent.match(/Windows Phone/i)
  );
};

// EXIF GPS is stored as DMS rationals plus an N/S/E/W ref. Convert to a
// signed decimal degree, matching what the AI endpoint's latitude/longitude
// fields expect.
const rationalToFloat = ([num, den]) => num / den;
const dmsToDeg = (dms, ref) => {
  const [d, m, s] = dms.map(rationalToFloat);
  const sign = ref === "S" || ref === "W" ? -1 : 1;
  return sign * (d + m / 60 + s / 3600);
};

export const gpsFromExif = (exif) => {
  const gps = exif?.GPS;
  if (!gps) return null;
  const lat = gps[piexif.GPSIFD.GPSLatitude];
  const latRef = gps[piexif.GPSIFD.GPSLatitudeRef];
  const lon = gps[piexif.GPSIFD.GPSLongitude];
  const lonRef = gps[piexif.GPSIFD.GPSLongitudeRef];
  if (!lat || !latRef || !lon || !lonRef) return null;
  return { lat: dmsToDeg(lat, latRef), lon: dmsToDeg(lon, lonRef) };
};

export const getExif = (imgFile) => {
  if (imgFile.type !== "image/jpeg") {
    return Promise.resolve(undefined);
  }

  const reader = new FileReader();
  reader.readAsDataURL(imgFile);

  return new Promise((resolve, reject) => {
    reader.onloadend = () => {
      try {
        resolve(piexif.load(reader.result));
      } catch (error) {
        console.error("Error reading exif data", error);
        reject(error);
      }
    };
    reader.onerror = reject;
  });
};

export const writeExif = (imgBlob, exif) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsArrayBuffer(imgBlob);
    reader.onloadend = () => {
      const exifBytes = piexif.dump(exif);
      const base64 = btoa(
        new Uint8Array(reader.result).reduce(
          (acc, byte) => acc + String.fromCharCode(byte),
          "",
        ),
      );
      const inserted = piexif.insert(exifBytes, "data:image/jpeg;base64," + base64);
      const binary = atob(inserted.split(",")[1]);
      const buf = new ArrayBuffer(binary.length);
      const view = new Uint8Array(buf);
      for (let i = 0; i < binary.length; i++) {
        view[i] = binary.charCodeAt(i);
      }
      resolve(new Blob([buf], { type: "image/jpeg" }));
    };
    reader.onerror = reject;
  });
};
