import { List, Tags } from "prismarine-nbt";
import { TagType } from "../types/tag-type";

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

export default convertPalette;
