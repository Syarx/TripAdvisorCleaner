import * as mod from "https://deno.land/std@0.158.0/fmt/colors.ts";
import { parseData } from "./functions.ts";
let exit = false;
console.log(mod.green("Starting Program"));
try {
  for await (const dirEntry of Deno.readDir("./input")) {
    if (/.*.json/g.test(dirEntry.name)) {
      console.log(mod.yellow(`Reading file ${dirEntry.name}`));
      try {
        const json: any[] = JSON.parse(
          Deno.readTextFileSync(`./input/${dirEntry.name}`)
        );
        parseData(json, dirEntry.name.replace(/.json/g, ""));
      } catch (er) {
        console.error(er);
      }
    }
  }
  do {
    prompt(mod.green("Press any key to exit"));
    exit = true;
  } while (!exit);
} catch (error) {
  console.error(error);
}
