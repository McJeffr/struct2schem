import { List, NBT } from "prismarine-nbt";
import { TagType } from "../types/tag-type";

const extractDimensions = (
  nbt: NBT
): { width: number; height: number; length: number } => {
  if (!nbt.value["size"]) throw new Error("Input file is missing 'size' tag");
  const sizeTag = nbt.value["size"] as List<TagType.Int>;
  if (sizeTag.value.value.length < 3)
    throw new Error("'size' tag array does not contain enough elements");

  const width = sizeTag.value.value[0];
  const height = sizeTag.value.value[1];
  const length = sizeTag.value.value[2];

  return { width, height, length };
};

export default extractDimensions;
