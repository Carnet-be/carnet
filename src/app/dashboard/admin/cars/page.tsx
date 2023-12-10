"use client"
import { api } from "~/trpc/server";
import { AdminSearchSection, CarsTable, TabsSection } from "./_components";
import { Chip, Tab, Tabs } from "@nextui-org/react";
import { GalleryHorizontal, Music, VideoIcon } from "lucide-react";

// const data = await api.public.carData.query()
// const cars = await api.car.getCars.query()

function CarsPage() {
    return (
        <div className="space-y-8">
            <div>
                <div>
                    <h1>
                        Cars
                    </h1>
                    <span className="text-sm text-gray-400">
                        Manage all the cars in the platform
                    </span>
                </div>
            </div>
            <AdminSearchSection data={[]} />

           <TabsSection/>

            <div>
                <CarsTable>
                    {[]}
                </CarsTable>
            </div>
        </div>

    );
}

export default CarsPage;