/* eslint-disable @typescript-eslint/no-explicit-any */
import { NavbarPublic } from "../_components/navbarPublic";

const LayoutGarage = ({ children }: any) => {
  return (
    <div>
      <NavbarPublic />
      {children}
    </div>
  );
};

export default LayoutGarage;
