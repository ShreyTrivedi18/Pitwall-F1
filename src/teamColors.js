const MAP = {
  "red bull": "#3671C6", "redbull": "#3671C6",
  "ferrari": "#E8002D",
  "mclaren": "#FF8000",
  "mercedes": "#27F4D2",
  "aston martin": "#229971", "astonmartin": "#229971",
  "alpine": "#0093CC",
  "williams": "#64C4FF",
  "rb": "#6692FF", "racing bulls": "#6692FF",
  "kick sauber": "#52E252", "sauber": "#52E252",
  "haas": "#B6BABD",
};

export function teamColor(name = "") {
  const n = name.toLowerCase();
  for (const [k, v] of Object.entries(MAP)) {
    if (n.includes(k)) return v;
  }
  return "#666";
}
