import EuropeFlag from "./EuropeFlag";
import PolandFlag from "./PolandFlag";
import UKFlag from "./UKFlag";
import UkraineFlag from "./UkraineFlag";

type CurrencyIconProps = {
  currency: string;
  size?: "large" | "medium";
};

const CurrencyFlagIcon = ({ currency, size = "large" }: CurrencyIconProps) => {
  const svgSize = size === "medium" ? 24 : 32;
  switch (currency) {
    case "EUR":
      return <EuropeFlag size={svgSize} />;
    case "PLN":
      return <PolandFlag size={svgSize} />;
    case "GBP":
      return <UKFlag size={svgSize} />;
    case "UAH":
      return <UkraineFlag size={svgSize} />;
    default:
      return null;
  }
};

export default CurrencyFlagIcon;
