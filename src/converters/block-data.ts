import { List, Tags } from "prismarine-nbt";
import { TagType } from "../types/tag-type";

const convertBlockData = (blocks: List<TagType.Compound>): number[] => {
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

export default convertBlockData;
