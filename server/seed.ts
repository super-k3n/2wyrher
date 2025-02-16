
import { db } from "./db";
import { actresses } from "@shared/schema";

async function seed() {
  // Insert dummy actresses
  await db.insert(actresses).values([
    {
      name: "橋本環奈",
      description: "1999年生まれの女優。映画「銀魂」などに出演。",
    },
    {
      name: "浜辺美波",
      description: "2000年生まれの女優。ドラマ「約束のネバーランド」などに出演。",
    },
    {
      name: "上白石萌音",
      description: "1998年生まれの女優。映画「君の名は。」などに出演。",
    },
    {
      name: "広瀬すず",
      description: "1998年生まれの女優。映画「ちはやふる」などに出演。",
    },
    {
      name: "新垣結衣",
      description: "1988年生まれの女優。ドラマ「逃げるは恥だが役に立つ」などに出演。",
    },
  ]);

  console.log("Seed data inserted successfully!");
}

seed().catch(console.error);
