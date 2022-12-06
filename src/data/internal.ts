export type TFuel = "Gasoline" | "Diesel " | "Electricity" | "Hybrid";
export type TBrand = {
  title: string;
  model: Array<string>;
  buildYear: Array<string>;
};

export const CARROSSERIE = [
  "Sedan | Berline",
  "Hatchback",
  "Station wagon | Break",
  "SUV / Crossover",
  "Convertible | Cabriolet / Roadster",
  "Coupe",
  "Off-road",
  "Van | Camionnette",
  "Minivan | MPV",
  "Minibus",
  "Pickup Truck",
  "45 km auto",
];

export const BRAND: Array<TBrand> = [
  {
    title: "Acura",
    model: ["1/12 MASERATI MODELS", "1/18 SOLIDO", "A-Class"],
    buildYear: ["2022", "2023"],
  },
  {
    title: "Audi",
    model: [
      "A4 allroad 1",
      "A6 allroad 1",
      "A8",
      "A4 allroad 2",
      "A6 allroad 1",
      "A8 2",
    ],
    buildYear: ["2022", "2023", "2021", "2018"],
  },
  {
    title: "Hyundai",
    model: [
      "1/12 MASERATI MODELS",
      "1/18 SOLIDO",
      "A-Class",
      "A4 allroad",
      "A6 allroad",
      "A8",
    ],
    buildYear: ["2022", "2023"],
  },
  {
    title: "Nissan",
    model: ["Altima", "Armada", "A8"],
    buildYear: ["2022", "2023", "2021", "2018"],
  },
];
export const TRANSMISSION = ["Manual", "Automatique", "Semi-automatique"];

export const INTERIOR_LINING = [
  "Leather",
  "Half leather",
  "Alcantara",
  "Fabric",
  "Skai / Artificial leather",
];


export const HANDLING: { [index: string]: string } = {
  1: "Doesn't start nor drive",
  2: "Starts but doesn't drive",
  3: "One or more failures are lit on the dashboard",
  4: "Only required some maintenance",
  5: "Everything still working perfectly!",
};

export const EXTERIOR: { [index: string]: string } = {
  1: "Involved in a (serious) accident",
  2: "Only tinplate damage, no structural issues",
  3: "Scratches or dents",
  4: "Slight scratches",
  5: "Perfect condition",
};
export const INTERIOR: { [index: string]: string } = {
  1: "Very bad condition (the airbags have gone off …)",
  2: "Seats in very bad condition",
  3: "Noticeable Stains or fabric damage",
  4: "Good condition (Smell of smoking)",
  5: "Excellent condition",
};
export const TIRES: { [index: string]: string } = {
  1: "Required replacement ASAP",
  2: "They have little or no tread, but can still be inflated",
  3: "Risk of receiving an inspection warning",
  4: "They have miles of experience on the track",
  5: "Less than 5000 kms and still in perfect condition!",
};