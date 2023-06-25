import { IUnit } from "@/app/page";

interface IUseLocalStorage {
    user: {};
    tags: Array<string>;
    shownTag: Array<string>;
    posts: IUnit;
}

export default function useLocalStorage({ }: IUseLocalStorage) {

    localStorage.setItem("ez-copy", JSON.stringify({}));
}