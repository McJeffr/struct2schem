import { createReadStream, createWriteStream, readFile, writeFile } from "fs";
import { NBT, parse, writeUncompressed } from "prismarine-nbt";
import type { Tags, List } from "prismarine-nbt";
import { pipeline } from "stream";
import { createGzip } from "zlib";

// These are not exported by the typings file.
export enum TagType {
  Byte = "byte",
  Short = "short",
  Int = "int",
  Long = "long",
  Float = "float",
  Double = "double",
  ByteArray = "byteArray",
  String = "string",
  List = "list",
  Compound = "compound",
  IntArray = "intArray",
  LongArray = "longArray",
}

readFile("test/test_large.nbt", (err, data) => {
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
    const blocks = collectBlocks(
      data.value["blocks"] as List<TagType.Compound>
    );
    const blockDataTag: Tags[TagType.ByteArray] = {
      type: TagType.ByteArray,
      value: blocks.map((block) => block.state),
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

const convertPalette = (
  structPalette: List<TagType.Compound>
): Tags[TagType.Compound] => {
  const blockStates = structPalette.value.value.reduce<
    Record<string, Tags[TagType.Int]>
  >((acc, cur, idx) => {
    const blockState = convertBlock(
      cur as Record<string, undefined | Tags[TagType]>
    );
    acc[blockState] = { type: TagType.Int, value: idx };
    return acc;
  }, {});

  return {
    type: TagType.Compound,
    value: blockStates,
  };
};

const convertBlock = (
  block: Record<string, undefined | Tags[TagType]>
): string => {
  const name = block["Name"] as Tags[TagType.String];
  const properties = block["Properties"] as Tags[TagType.Compound] | undefined;

  if (properties) {
    const props = Object.entries(properties.value).map((property: any) => {
      const name = property[0] as string;
      const value = property[1] as Tags[TagType.String];
      return `${name}=${value.value}`;
    });

    return `${name.value}[${props.join(",")}]`;
  } else {
    return name.value;
  }
};

const collectBlockData = (blocks: List<TagType.Compound>): number[] => {
  const positions = blocks.value.value.map((block) => {
    const state = block["state"] as Tags[TagType.Int];
    const pos = block["pos"] as List<TagType.Int>;
    const x = pos.value.value[0];
    const y = pos.value.value[1];
    const z = pos.value.value[2];

    return { x, y, z, state: state.value };
  });

  positions.sort((a, b) => {
    if (a.y - b.y < 0) {
      return -1;
    } else if (a.y - b.y > 0) {
      return 1;
    }

    if (a.z - b.z < 0) {
      return -1;
    } else if (a.z - b.z > 0) {
      return 1;
    }

    if (a.x - b.x < 0) {
      return -1;
    } else if (a.x - b.x > 0) {
      return 1;
    }
    return 0;
  });

  return positions.map((position) => position.state);
};
