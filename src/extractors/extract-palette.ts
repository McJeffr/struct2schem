import { List, NBT, Tags } from "prismarine-nbt";
import convertPalette from "../converters/palette";
import { TagType } from "../types/tag-type";

const extractPalette = (nbt: NBT): Tags[TagType.Compound] => {
  if (!nbt.value["palette"])
    throw new Error("Input file is missing 'palette' tag");
  const structPalette = nbt.value["palette"] as List<TagType.Compound>;
  return convertPalette(structPalette);
};

export default extractPalette;
