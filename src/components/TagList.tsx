import { useEffect, useState } from 'react'
import styles from '../styles/tag.module.scss'

interface IClusterCard {
    value: string;
    handleClick: (tag: string, isShown: boolean) => void;
    isShown: boolean;
}

export function ClusterCard({ value, handleClick, isShown }: IClusterCard) {

    return (
        <>
            <div
                className={`${styles.cluster__card} ${isShown && styles.cluster__card_show}`}
                onClick={() => handleClick(value, isShown)}
            >{value}</div>
        </>
    )
}

interface ICluster {
    id: string;
    value: string;
}

interface IClusterList {
    handleClick: (tag: string, isShown: boolean) => void;
    handleClickAll: (isSelectAll: boolean) => void;
    handleClear: () => void;
    allTagList: Array<string>;
    shownTagList: Array<string>;
    filteredTagList: Array<string>;
}

export default function ClusterList({ handleClick, allTagList, shownTagList, filteredTagList, handleClickAll, handleClear }: IClusterList) {
    const [isSelectAll, setIsSelectAll] = useState<boolean>(false);
    const shownTagSet = new Set(shownTagList);
    // console.log("shownTagList", shownTagList)

    useEffect(() => {
        if (allTagList.length === 0 && shownTagList.length === 0) return;
        if (allTagList.length === shownTagList.length) setIsSelectAll(true);
        else setIsSelectAll(false);
    }, [allTagList.length, shownTagList.length])

    return (
        <>
            <div className={styles.cluster__control}>
                <div
                    className={`${styles.cluster__card} ${isSelectAll && styles.cluster__card_show}`}
                    onClick={() => {
                        handleClickAll(isSelectAll);
                        setIsSelectAll(pre => !pre);
                    }}
                >全選</div>
                <div
                    className={`${styles.cluster__card} ${styles.cancel}`}
                    onClick={() => {
                        handleClear();
                        setIsSelectAll(false);
                    }}
                >全消</div>
            </div>
            <div className={styles.cluster__container}>
                {filteredTagList.map(item => {
                    return (
                        <ClusterCard
                            key={item}
                            value={item}
                            isShown={shownTagSet.has(item)}
                            handleClick={(tag: string, isShown: boolean) => {
                                handleClick(tag, isShown);
                            }}
                        />
                    )
                })}
            </div>
        </>
    )
}