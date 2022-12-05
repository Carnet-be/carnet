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

export const BRAND:Array<TBrand>=[
    {
        title:"Acura",
        model:["1/12 MASERATI MODELS","1/18 SOLIDO","A-Class"],
        buildYear:["2022","2023"]
    },
    {
        title:"Audi",
        model:["A4 allroad 1","A6 allroad 1","A8","A4 allroad 2","A6 allroad 1","A8 2"],
        buildYear:["2022","2023","2021","2018"]
    },
    {
        title:"Hyundai",
        model:["1/12 MASERATI MODELS","1/18 SOLIDO","A-Class","A4 allroad","A6 allroad","A8"],
        buildYear:["2022","2023"]
    },
    {
        title:"Nissan",
        model:["Altima","Armada","A8"],
        buildYear:["2022","2023","2021","2018"]
    },
]
export const TRANSMISSION = ["Manual", "Automatique", "Semi-automatique"];

export const INTERIOR_LINING = [
  "Leather",
  "Half leather",
  "Alcantara",
  "Fabric",
  "Skai / Artificial leather",
];
