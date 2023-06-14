import { useState } from 'react'
import styles from '../styles/cluster.module.scss'

interface IClusterCard {
    id: string;
    value: string;
    handleClick: (clusterId: string) => void;
}

export function ClusterCard({ id, value, handleClick }: IClusterCard) {

    return (
        <>
            <div
                className={styles.cluster__card}
                onClick={() => handleClick(id)}
            >{value}</div>
        </>
    )
}

interface ICluster {
    id: string;
    value: string;
}

interface IClusterList {
    handleClick: (clusterId: string) => void;
}

export default function ClusterList({ handleClick }: IClusterList) {
    const [list, setList] = useState<Array<ICluster>>([]);
    return (
        <>
            <div className={styles.cluster__container}>
                {list.map(item => {
                    return (
                        <ClusterCard
                            key={item.id}
                            id={item.id}
                            value={item.value}
                            handleClick={handleClick}
                        />
                    )
                })}
            </div>
        </>
    )
}