import * as XLSX from "https://cdn.sheetjs.com/xlsx-0.18.12/package/xlsx.mjs";
import { yellow } from "https://deno.land/std@0.158.0/fmt/colors.ts";
import { lodash } from "https://deno.land/x/deno_ts_lodash/mod.ts";
import zip from "./assets/zipcodes.json" assert { type: "json" };
export function parseData(input: any[], name: string) {
  const original = input.length;
  console.log(
    `${name} temp closed = ${
      input.filter((item) => item.isClosed === true).length
    }`,
    `${name} long closed = ${
      input.filter((item) => item.isLongClosed === true).length
    }`
  );
  const data = input
    .map((item) => {
      return {
        name: item.name,
        priceLevel: item.priceLevel,
        phone: item.phone,
        address: item.address,
        email: item.email,
        webUrl: item.webUrl,
        website: item.website,
        LongClosed: item.isLongClosed,
        TemporaryClosed: item.isClosed,
      };
    })
    .filter(
      (item) =>
        item.email !== undefined &&
        (item.priceLevel === "$$ - $$$" || item.priceLevel === "$$$$") &&
        item.LongClosed === false
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
    })
    .map((item) => ({
      ...item,
      TemporaryClosed: item.TemporaryClosed ? "ναί" : "όχι",
      LongClosed: item.LongClosed ? "ναί" : "όχι",
    }));

  const dataUniq = lodash.uniqWith(
    data,
    (a, b) =>
      a.email === b.email &&
      a.name === b.name &&
      a.address === b.address &&
      a.phone === b.phone
  );
  const worksheet = XLSX.utils.json_to_sheet(dataUniq);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, name);
  XLSX.writeFile(workbook, `./output/${name}.xlsx`);

  console.log(
    yellow(`Done with writing ${dataUniq.length}/${original} items!`)
  );
}
