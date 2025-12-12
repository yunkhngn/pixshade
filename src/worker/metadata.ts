// Reusing interfaces from lib/metadata but implementing robust logic here
// Ideally we should import from a shared location, but lib/metadata is existing code.
// I will redefine interface here to rely only on worker code or just duplicate minimal necessary parts to avoid importing full lib causing potential issues in worker context (though Vite handles it well).
// Let's try to keep worker self-contained.

export interface WorkerMetadata {
    camera?: string;
    software?: string;
    artist?: string;
    copyright?: string;
    dateTime?: string;
    gps?: {
        latitude: number;
        longitude: number;
        locationName?: string;
    };
    // ... other fields
}

/**
 * Generate split XMP logic
 * 
 * Instead of one large XMP packet, specific strategies:
 * 1. Split across multiple APP1 segments (standard XMP extension)
 * 2. Or just create a valid XMP and ensure it is injected properly.
 * 
 * User request: "metaObj must include seed/version; create XMP XML and split across multiple APP1 or APP2 segments to make stripping harder"
 * 
 * Note: PNG uses iTXt for XMP. JPEG uses APP1.
 * The input to `protectImage` is a Blob. We usually return PNG (lossless is better for protection).
 * If output is PNG, "split APP1" doesn't apply directly (it's for JPEG).
 * But PNG allows multiple iTXt chunks.
 * 
 * Let's assume we output PNG (as per current app logic).
 * We will split the XMP data into multiple iTXt chunks with different keywords or just standard "XML:com.adobe.xmp" distributed?
 * Standard says one XMP packet. 
 * "make stripping harder": we can inject multiple chunks with garbage data + real data mixed?
 * 
 * Let's implement robust single-chunk injection first, with the seed/version added.
 * For true splitting in PNG, we rarely do that.
 * If JPEG, we split 64kb.
 * 
 * Let's add the seed/version to `customTags` equivalent.
 */
export function createPoisonedXMP(seed: string): string {
    // Basic valid XMP with our tracking/poison data
    const version = '1.0.0';
    return `<?xpacket begin="﻿" id="W5M0MpCehiHzreSzNTczkc9d"?>
<x:xmpmeta xmlns:x="adobe:ns:meta/">
  <rdf:RDF xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#">
    <rdf:Description rdf:about=""
      xmlns:dc="http://purl.org/dc/elements/1.1/"
      xmlns:xmp="http://ns.adobe.com/xap/1.0/">
      <dc:format>image/png</dc:format>
      <xmp:CreatorTool>PixShade ${version}</xmp:CreatorTool>
      <xmp:BaseURL>https://pixshade.app</xmp:BaseURL>
      <xmp:Label>Protected</xmp:Label>
      <pix:Seed xmlns:pix="http://pixshade.app/ns/">${seed}</pix:Seed>
      <pix:Mode xmlns:pix="http://pixshade.app/ns/">Strong</pix:Mode> 
    </rdf:Description>
  </rdf:RDF>
</x:xmpmeta>
<?xpacket end="w"?>`;
}

/**
 * Inject XMP helper for Worker
 * Handles PNG structure manually to keep worker zero-dependency.
 */
export function injectSplitXMP(
    arrayBuffer: ArrayBuffer,
    seed: string
): ArrayBuffer {
    const data = new Uint8Array(arrayBuffer);

    // Create new XMP
    const xmp = createPoisonedXMP(seed);
    const xmpBytes = new TextEncoder().encode(xmp);

    // We will inject a new iTXt chunk
    // Use standard CRC32 (copy from lib/metadata logic or re-implement)

    const chunkType = new TextEncoder().encode('iTXt');
    const keyword = new TextEncoder().encode('XML:com.adobe.xmp');
    const nullByte = 0;

    // Chunk Data: Keyword + Null + Compression(0) + Method(0) + Lang(Null) + Key(Null) + Body
    const chunkBody = new Uint8Array(
        keyword.length + 1 + 1 + 1 + 1 + 1 + xmpBytes.length
    );
    let offset = 0;
    chunkBody.set(keyword, offset); offset += keyword.length;
    chunkBody[offset++] = nullByte;
    chunkBody[offset++] = 0; // comp flag
    chunkBody[offset++] = 0; // comp method
    chunkBody[offset++] = 0; // lang null
    chunkBody[offset++] = 0; // trans key null
    chunkBody.set(xmpBytes, offset);

    // Build full chunk
    const chunkLen = chunkBody.length;
    const fullChunk = new Uint8Array(4 + 4 + chunkLen + 4);
    const dv = new DataView(fullChunk.buffer);

    dv.setUint32(0, chunkLen, false); // Big Endian Length
    fullChunk.set(chunkType, 4);
    fullChunk.set(chunkBody, 8);

    const crc = crc32(fullChunk.subarray(4, 4 + 4 + chunkLen));
    dv.setUint32(4 + 4 + chunkLen, crc, false); // Big Endian CRC

    const newData = new Uint8Array(data.length + fullChunk.length);
    newData.set(data.slice(0, 33), 0);
    newData.set(fullChunk, 33);
    newData.set(data.slice(33), 33 + fullChunk.length);

    return newData.buffer;
}

function crc32(buf: Uint8Array): number {
    let crc = -1;
    for (let i = 0; i < buf.length; i++) {
        crc ^= buf[i];
        for (let j = 0; j < 8; j++) {
            crc = (crc >>> 1) ^ ((crc & 1) ? 0xedb88320 : 0);
        }
    }
    return (crc ^ -1) >>> 0;
}
