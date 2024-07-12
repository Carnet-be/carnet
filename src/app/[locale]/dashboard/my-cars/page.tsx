import { BannierAddAuction, CarsSection } from "./_components";
const MyCars = () => {
  return (
    <div className="space-y-10">
      <BannierAddAuction />
      {/* <CarTypeSwitch
        counts={{ direct: count?.direct ?? 0, auction: count?.auction ?? 0 }}
      />
      <TabsSection
        filter={{
          belongsTo: orgId ?? userId ?? undefined,
        }}
      /> */}
      <CarsSection />
    </div>
  );
};

export default MyCars;
