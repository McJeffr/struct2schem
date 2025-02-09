import { promisify } from "util";
import { NBT, parse, writeUncompressed } from "prismarine-nbt";
import { gzipSync } from "zlib";
import { TagType } from "./types/tag-type";
import extractDataVersion from "./extractors/data-version";
import extractDimensions from "./extractors/dimensions";
import extractPalette from "./extractors/extract-palette";
import extractBlockData from "./extractors/block-data";

const struct2schem = async (file: ArrayBuffer): Promise<Buffer> => {
  return promisify(parse)(file).then((nbt) => {
    const dataVersion = extractDataVersion(nbt);
    const dimensions = extractDimensions(nbt);
    const paletteTag = extractPalette(nbt);
    const blockDataTag = extractBlockData(nbt);

    const schematicTag: NBT = {
      type: TagType.Compound,
      name: "Schematic",
      value: {
        Version: { type: TagType.Int, value: 2 },
        DataVersion: { type: TagType.Int, value: dataVersion },
        Width: { type: TagType.Int, value: dimensions.width },
        Height: { type: TagType.Int, value: dimensions.height },
        Length: { type: TagType.Int, value: dimensions.length },
        Palette: paletteTag,
        BlockData: blockDataTag,
      },
    };

    const uncompressedSchematic = writeUncompressed(schematicTag);
    return gzipSync(Buffer.from(uncompressedSchematic));
  });
};

export default struct2schem;
