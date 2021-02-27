import { List, NBT, Tags } from "prismarine-nbt";
import convertBlockData from "../converters/block-data";
import { TagType } from "../types/tag-type";

const extractBlockData = (nbt: NBT): Tags[TagType.ByteArray] => {
  if (!nbt.value["blocks"])
    throw new Error("Input file is missing 'blocks' tag");
  const blocks = convertBlockData(
    nbt.value["blocks"] as List<TagType.Compound>
  );
  return {
    type: TagType.ByteArray,
    value: blocks,
  };
};

export default extractBlockData;
