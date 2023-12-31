import { useState } from 'react';
import styles from '../styles/more.module.scss'
import { RenderIcon } from './RenderIcon';

interface IMore {
    options: Array<string>;
    handleClick: (option: string) => void;
    isShow: boolean;
}

export function MoreRightClick({ options, handleClick, isShow }: IMore) {
    return (
        <div className={`${styles.more_r__container} ${!isShow ? styles.hidden : ""}`}>
            {options?.map((item) => {
                return (
                    <div
                        key={item}
                        onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            handleClick(item);
                        }}
                        className={`${styles.more_r__option} ${`styles.more__option_${item}`}`}
                    >
                        <RenderIcon option={item} />
                    </div>
                )
            })}
        </div>
    )
}