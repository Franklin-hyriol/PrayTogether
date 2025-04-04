import "./icomoon.scss";
import IcoMoon, { IconProps } from "react-icomoon";
import iconSet from "../../assets/fonts/font-icon/selection.json";

const Icon = (props: IconProps) => <IcoMoon className="iconMoon" iconSet={iconSet} {...props} />;

export default Icon;