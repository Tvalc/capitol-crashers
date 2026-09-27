// Every issue of the comic. `path` is relative to story/, `file` is the
// issue's data module (also relative to story/).
export const ISSUES = [
  {
    n: 1,
    path: "./",
    file: "panels.js",
    where: "both",
    title: "Two Roads to the Capitol",
    dek: "The origin story: Kampala and Queens, Michigan and Detroit, and the road that brought them to the same street.",
  },
  {
    n: 2,
    path: "mamdani/",
    file: "issue-2.js",
    where: "queens",
    title: "Audacious",
    dek: "Zohran Mamdani's record, from the taxi hunger strike to the rent freeze.",
  },
  {
    n: 3,
    path: "el-sayed/",
    file: "issue-3.js",
    where: "detroit",
    title: "Receipts",
    dek: "Abdul El-Sayed's record, from rebuilding Detroit's health department to the Senate primary.",
  },
];
