import * as XLSX from "https://cdn.sheetjs.com/xlsx-0.18.12/package/xlsx.mjs";
import { yellow } from "https://deno.land/std@0.158.0/fmt/colors.ts";
import zip from "./assets/zipcodes.json" assert { type: "json" };
export function parseData(input: any[], name: string) {
  const data = input
    .map((item) => {
      return {
        name: item.name,
        priceLevel: item.priceLevel,
        phone: item.phone,
        address: item.address,
        email: item.email,
      };
    })
    .filter(
      (item) =>
        item.email !== undefined &&
        (item.priceLevel === "$$ - $$$" || item.priceLevel === "$$$$")
    )
    .map((item) => {
      if (/\d{3} \d{2}/g.test(item.address)) {
        const arr = item.address.match(/\d{3} \d{2}/g);

        return { ...item, zip: arr[0].replace(/\s/g, "") };
      } else if (/\d{5}/g.test(item.address)) {
        const arr = item.address.match(/\d{5}/g);

        return { ...item, zip: arr[0].replace(/\s/g, "") };
      } else return { ...item, zip: undefined };
    })
    .map((item) => {
      if (item.zip !== undefined) {
        const tkFound = zip.find((codes) => codes.tk === parseInt(item.zip));
        if (tkFound) {
          return { ...item, area: tkFound.territory };
        }
      }
      return item;
    })
    .map((item) => {
      if (item.phone) {
        return { ...item, phone: item.phone.replace(/\s/g, "") };
      }
      return item;
    });

  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, name);
  XLSX.writeFile(workbook, `./output/${name}.xlsx`);

  console.log(yellow(`Done with writing ${data.length} items!`));
}
