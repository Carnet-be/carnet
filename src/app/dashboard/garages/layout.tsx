import { SearchGarage } from "./_components.client";

function Layout({ children }: { children: React.ReactNode }) {
  return <div className="space-y-1">
    <h1>Garages</h1>
    <p>
      Find a garage near you, for all your car needs.
    </p>
    <div className="flex justify-end w-full">
      <SearchGarage />
    </div>
    <div className="py-2" />
    {children}
    <div className="py-5" />
  </div>
}

export default Layout;
