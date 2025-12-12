/**
 * Metadata Poisoning
 * 
 * Injects misleading EXIF and XMP metadata to confuse AI scrapers
 * and disrupt automated data collection.
 */

// Collection of misleading metadata values
const FAKE_CAMERAS = [
    'Nokia 3310',
    'Sony FDR-AX1 4K Camcorder',
    'Kodak Brownie',
    'Polaroid SX-70',
    'Game Boy Camera',
    'Nintendo DSi',
    'Apple Newton',
    'Palm Pilot',
];

const FAKE_SOFTWARE = [
    'MS Paint 3.11',
    'Photoshop 1.0',
    'GIMP 0.54',
    'Corel Photo-Paint 3',
    'MacPaint',
    'Deluxe Paint II',
];

const FAKE_ARTISTS = [
    'Unknown Artist',
    'Anonymous',
    'AI Generated',
    'Stock Photo',
    'Public Domain',
    'Creative Commons',
    'Royalty Free',
];

const FAKE_COPYRIGHTS = [
    '© 1901 Public Domain',
    'CC0 - No Rights Reserved',
    'Copyleft - Share Freely',
    '© Unknown',
    'All Rights Reversed',
    'No Copyright - Free Use',
];

const FAKE_LOCATIONS = [
    { lat: 0, lng: 0, name: 'Null Island' },
    { lat: 90, lng: 0, name: 'North Pole' },
    { lat: -90, lng: 0, name: 'South Pole' },
    { lat: 27.9881, lng: 86.925, name: 'Mount Everest' },
    { lat: 36.0544, lng: -112.1401, name: 'Grand Canyon' },
    { lat: -23.5505, lng: -46.6333, name: 'São Paulo, Brazil' },
];

/**
 * Generate random date in the past
 */
function generateFakeDate(): string {
    const year = 1990 + Math.floor(Math.random() * 20);
    const month = String(Math.floor(Math.random() * 12) + 1).padStart(2, '0');
    const day = String(Math.floor(Math.random() * 28) + 1).padStart(2, '0');
    const hour = String(Math.floor(Math.random() * 24)).padStart(2, '0');
    const minute = String(Math.floor(Math.random() * 60)).padStart(2, '0');
    const second = String(Math.floor(Math.random() * 60)).padStart(2, '0');
    return `${year}:${month}:${day} ${hour}:${minute}:${second}`;
}

/**
 * Pick random item from array
 */
function pickRandom<T>(arr: T[]): T {
    return arr[Math.floor(Math.random() * arr.length)];
}

/**
 * Generate poisoned metadata object
 */
export interface PoisonedMetadata {
    camera: string;
    software: string;
    artist: string;
    copyright: string;
    dateTime: string;
    gps: {
        latitude: number;
        longitude: number;
        locationName: string;
    };
    customTags: Record<string, string>;
}

export function generatePoisonedMetadata(): PoisonedMetadata {
    const location = pickRandom(FAKE_LOCATIONS);

    return {
        camera: pickRandom(FAKE_CAMERAS),
        software: pickRandom(FAKE_SOFTWARE),
        artist: pickRandom(FAKE_ARTISTS),
        copyright: pickRandom(FAKE_COPYRIGHTS),
        dateTime: generateFakeDate(),
        gps: {
            latitude: location.lat,
            longitude: location.lng,
            locationName: location.name,
        },
        customTags: {
            'ImageDescription': 'This image has been protected against AI training.',
            'UserComment': 'Metadata intentionally scrambled by PixShade.',
            'XPComment': 'Anti-AI protection applied.',
            'XPKeywords': 'protected;anti-ai;pixshade;do-not-train',
        },
    };
}

/**
 * Create XMP metadata string
 */
function createXmpMetadata(metadata: PoisonedMetadata): string {
    return `<?xpacket begin="﻿" id="W5M0MpCehiHzreSzNTczkc9d"?>
<x:xmpmeta xmlns:x="adobe:ns:meta/">
  <rdf:RDF xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#">
    <rdf:Description rdf:about=""
      xmlns:dc="http://purl.org/dc/elements/1.1/"
      xmlns:xmp="http://ns.adobe.com/xap/1.0/"
      xmlns:photoshop="http://ns.adobe.com/photoshop/1.0/"
      xmlns:exif="http://ns.adobe.com/exif/1.0/">
      <dc:creator><rdf:Seq><rdf:li>${metadata.artist}</rdf:li></rdf:Seq></dc:creator>
      <dc:rights><rdf:Alt><rdf:li xml:lang="x-default">${metadata.copyright}</rdf:li></rdf:Alt></dc:rights>
      <dc:description><rdf:Alt><rdf:li xml:lang="x-default">${metadata.customTags['ImageDescription']}</rdf:li></rdf:Alt></dc:description>
      <xmp:CreatorTool>${metadata.software}</xmp:CreatorTool>
      <xmp:CreateDate>${metadata.dateTime.replace(' ', 'T')}</xmp:CreateDate>
      <photoshop:Credit>Protected by PixShade - Anti-AI Training</photoshop:Credit>
      <exif:Make>${metadata.camera.split(' ')[0]}</exif:Make>
      <exif:Model>${metadata.camera}</exif:Model>
      <exif:GPSLatitude>${metadata.gps.latitude}</exif:GPSLatitude>
      <exif:GPSLongitude>${metadata.gps.longitude}</exif:GPSLongitude>
    </rdf:Description>
  </rdf:RDF>
</x:xmpmeta>
<?xpacket end="w"?>`;
}

/**
 * Inject XMP metadata into PNG blob
 * PNG uses iTXt chunks for XMP data
 */
export async function injectMetadataIntoPng(
    pngBlob: Blob,
    metadata: PoisonedMetadata
): Promise<Blob> {
    const arrayBuffer = await pngBlob.arrayBuffer();
    const data = new Uint8Array(arrayBuffer);

    // Verify PNG signature
    const pngSignature = [137, 80, 78, 71, 13, 10, 26, 10];
    for (let i = 0; i < 8; i++) {
        if (data[i] !== pngSignature[i]) {
            throw new Error('Invalid PNG file');
        }
    }

    // Create XMP data chunk
    const xmpString = createXmpMetadata(metadata);
    const xmpBytes = new TextEncoder().encode(xmpString);

    // Create iTXt chunk for XMP
    const keyword = 'XML:com.adobe.xmp';
    const keywordBytes = new TextEncoder().encode(keyword);

    // iTXt chunk structure:
    // keyword (null-terminated)
    // compression flag (1 byte) = 0 (uncompressed)
    // compression method (1 byte) = 0
    // language tag (null-terminated) = ""
    // translated keyword (null-terminated) = ""
    // text

    const chunkData = new Uint8Array([
        ...keywordBytes,
        0, // null terminator
        0, // compression flag
        0, // compression method
        0, // language tag (empty, null terminated)
        0, // translated keyword (empty, null terminated)
        ...xmpBytes,
    ]);

    // Calculate CRC32
    const chunkType = new TextEncoder().encode('iTXt');
    const crc = crc32([...chunkType, ...chunkData]);

    // Build chunk: length (4 bytes) + type (4 bytes) + data + crc (4 bytes)
    const chunkLength = chunkData.length;
    const chunk = new Uint8Array(12 + chunkLength);

    // Length (big-endian)
    chunk[0] = (chunkLength >> 24) & 0xff;
    chunk[1] = (chunkLength >> 16) & 0xff;
    chunk[2] = (chunkLength >> 8) & 0xff;
    chunk[3] = chunkLength & 0xff;

    // Type
    chunk.set(chunkType, 4);

    // Data
    chunk.set(chunkData, 8);

    // CRC (big-endian)
    chunk[8 + chunkLength] = (crc >> 24) & 0xff;
    chunk[8 + chunkLength + 1] = (crc >> 16) & 0xff;
    chunk[8 + chunkLength + 2] = (crc >> 8) & 0xff;
    chunk[8 + chunkLength + 3] = crc & 0xff;

    // Find IHDR chunk end (it comes right after signature)
    // Signature is 8 bytes, IHDR chunk starts at offset 8
    let offset = 8;
    const ihdrLength = (data[8] << 24) | (data[9] << 16) | (data[10] << 8) | data[11];
    offset += 4 + 4 + ihdrLength + 4; // length + type + data + crc

    // Insert our chunk after IHDR
    const newData = new Uint8Array(data.length + chunk.length);
    newData.set(data.slice(0, offset), 0);
    newData.set(chunk, offset);
    newData.set(data.slice(offset), offset + chunk.length);

    return new Blob([newData], { type: 'image/png' });
}

/**
 * CRC32 calculation for PNG chunks
 */
function crc32(data: number[]): number {
    let crc = 0xffffffff;
    const table = getCrcTable();

    for (const byte of data) {
        crc = table[(crc ^ byte) & 0xff] ^ (crc >>> 8);
    }

    return (crc ^ 0xffffffff) >>> 0;
}

// CRC32 lookup table (lazy initialization)
let crcTable: number[] | null = null;

function getCrcTable(): number[] {
    if (crcTable) return crcTable;

    crcTable = [];
    for (let n = 0; n < 256; n++) {
        let c = n;
        for (let k = 0; k < 8; k++) {
            c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
        }
        crcTable[n] = c >>> 0;
    }

    return crcTable;
}

/**
 * Apply metadata poisoning to an image blob
 */
export async function applyMetadataPoisoning(blob: Blob): Promise<Blob> {
    const metadata = generatePoisonedMetadata();
    return injectMetadataIntoPng(blob, metadata);
}
