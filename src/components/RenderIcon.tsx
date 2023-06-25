import DeleteIcon from "./svg/DeleteIcon";
import EditIcon from "./svg/EditIcon";

interface IIconMap {
    [key: string]: JSX.Element;
}

const iconMap: IIconMap = {
    "edit": <EditIcon />,
    "delete": <DeleteIcon />
}

interface IRenderIcon {
    option: string;
}

export function RenderIcon({ option }: IRenderIcon) {
    return iconMap[option];
}