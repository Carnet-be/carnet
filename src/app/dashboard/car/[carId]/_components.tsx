"use client"



import React from "react";
import { Tabs, Tab, Card, CardBody, CardHeader, Chip } from "@nextui-org/react";
import { type FullCar } from "~/types";
import RatingStar from "~/app/_components/ui/ratingStar";


export function ContentCarPage({ car }: { car: FullCar }) {
    const taps = ["description", "options", "rating"] as const
    type Tap = typeof taps[number]
    const [selected, setSelected] = React.useState<Tap>("description");
    const rating = [
        {
          title: "Handling",
          // list: HANDLING,
          rate: car?.specsRating?.handling,
        },
        {
          title: "Exterior",
          //list: EXTERIOR,
          rate: car?.specsRating?.exterior,
        },
        {
          title: "Interior",
          //  list: INTERIOR,
          rate: car?.specsRating?.interior,
        },
        {
          title: "Tires",
          //list: TIRES,
          rate: car?.specsRating?.tires,
        },
      ];
    
    return (
        <div className="flex w-full flex-col">
            <Tabs
                aria-label="Options"
                selectedKey={selected}
                onSelectionChange={(v) => setSelected(v.toString() as Tap)}
            >
                <Tab key="description" title="Description">
                    <Card>
                        <CardBody>
                            <p className="whitespace-pre-line">{car.description}</p>
                            {!car.description && <div className="text-center font-light opacity-50">No description</div>}
                        </CardBody>
                    </Card>
                </Tab>
                <Tab key="options" title="Options">
                    <Card>
                        <CardBody>
                            <div className="flex flex-wrap gap-3">
                                {car.options
                                    .map((k) => {
                                        return <div key={k.id} className="text-sm opacity-70 rounded-xl border p-1 px-2 transition-all duration-300 border-primary text-primary text-opacity-100">
                                            {k.option.name}
                                        </div>;
                                    })}
                                     {car.options.length == 0 && <div className="text-center font-light opacity-50">No options !</div>}
                            </div>
                        </CardBody>
                    </Card>
                </Tab>
                <Tab key="rating" title="Rating">
                    <Card>
                        <CardBody>
                            {rating
                                .filter((r) => !!r.rate)
                                .map((r, i) => {
                                    return (
                                        <div key={i} className="flex flex-row items-center gap-2">
                                            <h6 className="min-w-[100px]">{r.title} :</h6>

                                            <RatingStar
                                                value={r.rate!}

                                            />


                                        </div>
                                    );
                                })}
                                {rating
                                .filter((r) => !!r.rate).length == 0 && <div className="text-center font-light opacity-50">No rating !</div>}
                        </CardBody>
                    </Card>
                </Tab>
            </Tabs>
        </div>
    );
}

