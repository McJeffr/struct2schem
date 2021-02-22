import { createReadStream, createWriteStream, readFile, writeFile } from "fs";
import { NBT, parse, writeUncompressed, Tags, List } from "prismarine-nbt";
import { pipeline } from "stream";
import { createGzip } from "zlib";
import convertBlockData from "./converters/block-data";
import convertPalette from "./converters/palette";
import { TagType } from "./types/tag-type";

const struct2schem = (file: string = "test/test_large.nbt") => {
  readFile(file, (err, data) => {
    if (err) console.log(err);

    parse(data, (err, data) => {
      if (err) console.log(err);

      /* DataVersion */
      if (!data.value["DataVersion"]) return; //TODO: Throw error or something
      const dataVersionTag = data.value["DataVersion"] as Tags[TagType.Int];

      /* Dimensions */
      if (!data.value["size"]) return; //TODO: Throw error or something
      const sizeTag = data.value["size"] as List<TagType.Int>;
      const width = sizeTag.value.value[0];
      const height = sizeTag.value.value[1];
      const length = sizeTag.value.value[2];

      /* Palette */
      if (!data.value["palette"]) return; //TODO: Throw error or something
      const structPalette = data.value["palette"] as List<TagType.Compound>;
      const paletteTag = convertPalette(structPalette);

      /* BlockData */
      if (!data.value["blocks"]) return; //TODO: Throw error or something
      const blocks = convertBlockData(
        data.value["blocks"] as List<TagType.Compound>
      );
      const blockDataTag: Tags[TagType.ByteArray] = {
        type: TagType.ByteArray,
        value: blocks,
      };

      // @ts-ignore
      const schematicTag: NBT = {
        type: TagType.Compound,
        name: "Schematic",
        value: {
          Version: { type: TagType.Int, value: 2 },
          DataVersion: dataVersionTag,
          Width: { type: TagType.Int, value: width },
          Height: { type: TagType.Int, value: height },
          Length: { type: TagType.Int, value: length },
          Palette: paletteTag,
          BlockData: blockDataTag,
        },
      };

      console.log(schematicTag);

      const written = writeUncompressed(schematicTag);
      writeFile("test/out.schem", Buffer.from(written), (err) => {
        if (err) console.log(err);
      });

      const source = createReadStream("test/out.schem");
      const destination = createWriteStream("test/out_compressed.schem");

      const gzip = createGzip();
      pipeline(source, gzip, destination, (err) => {
        if (err) {
          console.error("An error occurred:", err);
          process.exitCode = 1;
        }
      });

      parse(written, (err, data) => {
        if (err) console.log(err);
        console.log(data);
      });
    });
  });
};

export default struct2schem;

struct2schem();
