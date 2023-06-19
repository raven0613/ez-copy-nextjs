import { useEffect, useRef, useState } from "react";
import styles from '../styles/textCard.module.scss'
import useAutosizeTextarea from "../hooks/useAutosizeTextarea"
import { IUnit } from "@/app/page";
import { SuggestList, ISuggestList, suggestList } from "@/components/ControlPanel"

interface ITextCard {
    data: IUnit
    handleSave: (data: { id: string, value: string, tagList: string[] }) => void;
    handleDelete: (id: string) => void;
    handleClick: (id: string) => void;
    handleEdit: (id: string) => void;
    idEditing: boolean;
    isExist: boolean;
    allTags: Array<string>;
}

export default function TextCard({ data, handleSave, handleDelete, handleClick, handleEdit, idEditing, isExist, allTags }: ITextCard) {
    const [inputValue, setInputValue] = useState<string>("");
    const [inputTagValue, setInputTagValue] = useState<string>("");
    const [isClicked, setIsClicked] = useState<boolean>(false);
    const [tagList, setTagList] = useState<Array<string>>([]);

    const inputRef = useRef<HTMLTextAreaElement>(null);
    useAutosizeTextarea(inputRef, inputValue, idEditing);

    useEffect(() => {
        return () => setIsClicked(false);
    }, []);
    useEffect(() => {
        if (!data) return;
        setTagList(data.tagList)
    }, [data]);

    return (
        <div
            className={`${styles.textCard} ${isExist && styles.textCard__exsit}`}
            onClick={() => {
                handleClick(data.id);
                setIsClicked(true);
            }}
        >
            {!idEditing && data.value}
            {idEditing &&
                <textarea
                    ref={inputRef}
                    autoFocus
                    className={styles.textCard__textarea}
                    onFocus={(e) => e.currentTarget.setSelectionRange(e.currentTarget.value.length, e.currentTarget.value.length)}
                    onClick={e => e.stopPropagation()}
                    value={inputValue}
                    onChange={e => setInputValue(e.target.value)}
                />}
            <div className={styles.textCard__editTag}>
                {idEditing && tagList.map(item => {
                    return (
                        <div
                            key={item}
                            className={styles.textCard__editTag_tag}
                            onClick={() => setTagList(pre => pre.filter(tag => tag !== item))}
                        >{item}</div>
                    )
                })}
            </div>
            <div className={styles.textCard__control}>
                <div className={styles.textCard__tags}>
                    {!idEditing && data.tagList.map(item => {
                        return (
                            <div key={item} className={styles.textCard__tags_tag}>#{item}</div>
                        )
                    })}
                    <SuggestList
                        handleSelect={(tag: string) => {
                            setTagList(pre => [...pre, tag]);
                            setInputTagValue("");
                        }}
                        suggestTags={suggestList({ allTags, postTags: tagList, inputTagValue })}
                        isToggled={idEditing && inputTagValue.trim().length > 0}
                    />
                    {idEditing &&
                        <input
                            placeholder="請輸入 tag 名稱"
                            onFocus={(e) => e.currentTarget.setSelectionRange(e.currentTarget.value.length, e.currentTarget.value.length)}
                            onClick={e => e.stopPropagation()}
                            className={styles.textCard__input}
                            value={inputTagValue}
                            onChange={e => setInputTagValue(e.target.value)}
                        />}
                </div>
                <div className={styles.textCard__buttons}>
                    {idEditing && <button
                        className={`${styles.textCard__button} ${styles.textCard__button_submit}`}
                        onClick={e => {
                            e.stopPropagation();
                            handleSave({ id: data.id, value: inputValue, tagList });
                        }}
                    >V
                    </button>}
                    {!idEditing && <button
                        className={`${styles.textCard__button} ${styles.textCard__button_edit}`}
                        onClick={e => {
                            e.stopPropagation();
                            handleEdit(data.id);
                            setInputValue(data.value);
                        }}
                    >E
                    </button>}
                    <button
                        className={`${styles.textCard__button} ${styles.textCard__button_delete}`}
                        onClick={e => {
                            e.stopPropagation();
                            handleDelete(data.id);
                        }}
                    >X
                    </button>
                </div>
            </div>
            <span
                className={`${styles.textCard__hint} ${isClicked && styles.textCard__hint_active}`}
                onAnimationEnd={() => setIsClicked(false)}
            >
                copied
            </span>
        </div>
    )
}