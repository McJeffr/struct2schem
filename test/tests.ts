import { expect } from "chai";
import { readFile } from "fs/promises";
import { promisify } from "util";
import { NBT, parse, Tags } from "prismarine-nbt";
import struct2schem from "../src/index";
import { TagType } from "../src/types/tag-type";

describe("Test converter", () => {
  it("can convert structures to schematics", async () => {
    const structBuffer: Buffer = await readFile("./test/test_large.nbt");
    const schemBuffer: Buffer = await struct2schem(structBuffer);
    const parsedSchem: NBT = await promisify(parse)(schemBuffer);

    /* Check for mandatory properties */
    expect(parsedSchem.type).to.equal("compound");
    expect(parsedSchem.name).to.equal("Schematic");

    /* Check for Version */
    let versionTag = parsedSchem.value["Version"];
    expect(versionTag).to.not.be.undefined;
    versionTag = versionTag as Tags[TagType.Int];
    expect(versionTag.type).to.equal(TagType.Int);
    expect(versionTag.value).to.equal(2);

    /* Check for DataVersion */
    let dataVersionTag = parsedSchem.value["DataVersion"];
    expect(dataVersionTag);
    dataVersionTag = dataVersionTag as Tags[TagType.Int];
    expect(dataVersionTag.type).to.equal(TagType.Int);
    expect(dataVersionTag.value).to.equal(2580);

    /* Check for Width */
    let widthTag = parsedSchem.value["Width"];
    expect(widthTag);
    widthTag = widthTag as Tags[TagType.Int];
    expect(widthTag.type).to.equal(TagType.Int);
    expect(widthTag.value).to.equal(2);

    /* Check for Height */
    let heightTag = parsedSchem.value["Height"];
    expect(heightTag);
    heightTag = heightTag as Tags[TagType.Int];
    expect(heightTag.type).to.equal(TagType.Int);
    expect(heightTag.value).to.equal(3);

    /* Check for Length */
    let lengthTag = parsedSchem.value["Length"];
    expect(lengthTag);
    lengthTag = lengthTag as Tags[TagType.Int];
    expect(lengthTag.type).to.equal(TagType.Int);
    expect(lengthTag.value).to.equal(4);

    /* Check for Palette */
    let paletteTag = parsedSchem.value["Palette"];
    expect(paletteTag);
    paletteTag = paletteTag as Tags[TagType.Compound];
    expect(paletteTag.type).to.equal(TagType.Compound);

    expect(Object.keys(paletteTag.value).length).to.equal(5);

    /* Check for BlockData */
    let blockDataTag = parsedSchem.value["BlockData"];
    expect(blockDataTag);
    blockDataTag = blockDataTag as Tags[TagType.ByteArray];
    expect(blockDataTag.type).to.equal(TagType.ByteArray);
    expect(blockDataTag.value.length).to.equal(24);
  });
});
