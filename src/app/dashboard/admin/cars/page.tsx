import { api } from "~/trpc/server";
import { AdminSearchSection, CarTypeSwitch, CarsTable, TabsSection } from "./_components";

// const data = await api.public.carData.query()
// const cars = await api.car.getCars.query()

async function CarsPage() {
    const count = await api.bo.car.getCounts.query()
    const filters = await api.bo.car.getFilters.query()
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
            <CarTypeSwitch counts={count} />
            <AdminSearchSection filters={filters} />

            <TabsSection />

            <div>
                <CarsTable />
            </div>
        </div>

    );
}

export default CarsPage;

