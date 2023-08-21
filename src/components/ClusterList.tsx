import { useEffect, useRef, useState } from 'react';
import styles from '../styles/cluster.module.scss';
import textCardStyles from '../styles/textCard.module.scss';
import { More } from './More';
import Input from './Input';
import SettingIcon from './svg/SettingIcon';
import CheckIcon from './svg/CheckIcon';
import useClosePanel from '@/hooks/useClosePanel';

interface IClusterCard {
    value: string;
    index: number;
    handleClick: (tag: string, isShown: boolean) => void;
    isShown: boolean;
    handleClickMore: (tag: string) => void;
    isShowMore: boolean;
    handleEdit: (option: string) => void;
    handleSubmit: (data: { oldValue: string, newValue: string }) => void;
    handleDelete: (option: string) => void;
    handleMoveCard: (dragIndex: number, hoverIndex: number) => void;
    isEditing: boolean;
}

export function ClusterCard({ value, handleClick, isShown, handleClickMore, isShowMore, handleEdit, handleDelete, isEditing, handleSubmit, index, handleMoveCard }: IClusterCard) {
    const [editValue, setEditValue] = useState<string>("");
    const cardRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        value && setEditValue(value);
    }, [value]);

    return (
        <>
            <div
                className={`${styles.cluster__card} ${isShown && styles.cluster__card_show}`}
                onClick={() => handleClick(value, isShown)}
                ref={cardRef}
            >
                {!isEditing && value}
                {isEditing && <input
                    placeholder="請輸入 tag 名稱"
                    onFocus={(e) => e.currentTarget.setSelectionRange(e.currentTarget.value.length, e.currentTarget.value.length)}
                    onClick={e => e.stopPropagation()}
                    className={styles.cluster__card_input}
                    value={editValue}
                    onChange={e => setEditValue(e.target.value)}
                />}

                {isEditing && <button
                    onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        handleSubmit({ oldValue: value, newValue: editValue });
                    }}
                    className={`${styles.cluster__card_moreBtn} ${styles.cluster__card_moreBtn_check}`}
                >
                    <CheckIcon />
                </button>}

                {!isEditing && <button
                    onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        handleClickMore(value);
                    }}
                    className={`${styles.cluster__card_moreBtn}
                    ${isShowMore && styles.cluster__card_moreBtn_clicked}
                    `}
                >
                    <SettingIcon />
                </button>}
                <More
                    options={["edit", "delete"]}
                    handleClick={(option) => {
                        if (option === "edit") handleEdit(value);
                        else if (option === "delete") handleDelete(value);
                    }}
                    isShow={isShowMore}
                />
            </div>

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
    handleClickEdit: () => void;
    handleSubmitEdit: (data: { oldValue: string, newValue: string }) => void;
    handleDelete: (tag: string) => void;
    isTextEditing: boolean;
}

export default function ClusterList({ handleClick, allTagList, shownTagList, filteredTagList, handleClickAll, handleClear, handleSubmitEdit, handleDelete, isTextEditing, handleClickEdit }: IClusterList) {
    const [showMoreTag, setShowMoreTag] = useState<string>("");
    const [editingTag, setEditingTag] = useState<string>("");
    const [isSelectAll, setIsSelectAll] = useState<boolean>(false);
    const shownTagSet = new Set(shownTagList);

    useEffect(() => {
        if (allTagList.length === 0 && shownTagList.length === 0) return;
        if (allTagList.length === shownTagList.length) setIsSelectAll(true);
        else setIsSelectAll(false);
    }, [allTagList.length, shownTagList.length])

    useEffect(() => {
        if (!isTextEditing) return;
        setEditingTag("");
    }, [isTextEditing])

    useEffect(() => {
        const event = () => {
            if (!showMoreTag) return;
            setShowMoreTag("");
        }
        document.addEventListener("click", event);
        return () => document.removeEventListener("click", event);
    }, [showMoreTag]);

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
                {filteredTagList.map((item, i) => {
                    return (
                        <ClusterCard
                            key={`${i}-${item}`}
                            index={i}
                            value={item}
                            isShown={shownTagSet.has(item)}
                            handleClick={(tag: string, isShown: boolean) => {
                                handleClick(tag, isShown);
                            }}
                            handleClickMore={(tag: string) => {
                                setShowMoreTag(tag);
                                setEditingTag("");
                            }}
                            handleEdit={(option: string) => {
                                setEditingTag(option);
                                handleClickEdit();
                            }}
                            handleSubmit={({ oldValue, newValue }) => {
                                handleSubmitEdit({ oldValue, newValue });
                                setEditingTag("");
                            }}
                            handleDelete={(tag: string) => {
                                handleDelete(tag);
                            }}
                            handleMoveCard={(dragIndex: number, hoverIndex: number) => {

                            }}
                            isShowMore={showMoreTag === item}
                            isEditing={editingTag === item}
                        />
                    )
                })}
            </div>
        </>
    )
}