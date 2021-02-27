import { NBT, Tags } from "prismarine-nbt";
import { TagType } from "../types/tag-type";

const extractDataVersion = (nbt: NBT): number => {
  if (!nbt.value["DataVersion"])
    throw new Error("Input file is missing 'DataVersion' tag");
  const dataVersion = nbt.value["DataVersion"] as Tags[TagType.Int];
  return dataVersion.value;
};

export default extractDataVersion;
