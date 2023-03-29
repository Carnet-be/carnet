import { useContext } from "react";
import { LangCommonContext } from "../../pages/hooks";

const BigTitle = ({ title }: { title?: string }) => {
  const common = useContext(LangCommonContext);
  return title ? (
    <h2>{title}</h2>
  ) : (
    <h2>
      {common("quotes.big title")} <span className="text-primary">CARNET</span>
    </h2>
  );
};
export default BigTitle;
