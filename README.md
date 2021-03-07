# struct2schem
This package is capable of converting Minecraft structures (.nbt) to Schematics (.schem). These schematics can then be placed into a Minecraft world using tools like WorldEdit.

## Usage
Below is a simple example of how this library can be used.
```typescript
import struct2schem from "@mcjeffr/struct2schem";

struct2schem(structBuffer)
  .then((schemBuffer) => {
    // Do something with the schem buffer, e.g. write it to a file.
  })
  .catch((err) => console.log(err));
```

A more advanced example is shown below. In this example, a file containing a structure on the local file system is read (`test/test_large.nbt`). It is then turned into a schematic. Finally, the schematic data is written to another file (`test/out.schem`).
```typescript
import { readFile, writeFile } from "fs";
import struct2schem from "@mcjeffr/struct2schem";

readFile("test/test_large.nbt", async (err, data) => {
  if (err) {
    console.log(err);
    return;
  }

  try {
    const schemBuffer = await struct2schem(data);
    writeFile("test/out.schem", schemBuffer, (err) => {
      if (err) console.log(err);
    });
  } catch (err) {
    console.log(err);
  }
});
```

## Promises
This package uses promises, as processing a structure might take a bit of time. To not freeze the main thread, this operation can be done in the background. See the second example on how to use this 

## Limitations
There are some differences between structures and schematics. Structures are capable of having multiple "palettes", which can be seen as variants of the structure that is stored. An example of these are the shipwrecks found in the Vanilla game. The type of wood used is selected by random when the structure spawns in. This package does not support these types of structures.

## Not implemented features
The following features of structures and schematics have not been implemented (yet):
- BlockEntities, e.g. chest inventories
- Entities, e.g. armor stands or mobs
- Multi-palette support, see the section on limitations
