import { useEffect, useRef, useState } from "react";
import styles from '../styles/page.module.scss'
import useAutosizeTextarea from "../hooks/useAutosizeTextarea"
import { IUnit } from "@/app/page";

interface ITextCard {
    data: IUnit
    handleSave: (data: { id: string, value: string, tagNames: string[] }) => void;
    handleDelete: (id: string) => void;
    handleClick: (id: string) => void;
    handleEdit: (id: string) => void;
    idEditing: boolean;
    isExist: boolean;
}

export default function TextCard({ data, handleSave, handleDelete, handleClick, handleEdit, idEditing, isExist }: ITextCard) {
    const [inputValue, setInputValue] = useState<string>("");
    const [isClicked, setIsClicked] = useState<boolean>(false);
    const inputRef = useRef<HTMLTextAreaElement>(null);
    useAutosizeTextarea(inputRef, inputValue, idEditing);
    useEffect(() => {
        return () => setIsClicked(false);
    }, []);

    return (
        <div
            className={`${styles.main_text} ${isExist && styles.main_text__exsit}`}
            onClick={() => {
                handleClick(data.id);
                setIsClicked(true);
            }}>

            {!idEditing && data.value}
            {idEditing &&
                <textarea
                    ref={inputRef}
                    autoFocus
                    onFocus={(e) => e.currentTarget.setSelectionRange(e.currentTarget.value.length, e.currentTarget.value.length)}
                    onClick={e => e.stopPropagation()}
                    className={styles.main_text__input}
                    value={inputValue}
                    onChange={e => setInputValue(e.target.value)}
                />}

            <div className={styles.main_text__buttons}>
                {idEditing && <button
                    className={`${styles.main_text__button} ${styles.main_text__button_submit}`}
                    onClick={e => {
                        e.stopPropagation();
                        handleSave({ id: data.id, value: inputValue, tagNames: data.tagNames });
                    }}
                >V
                </button>}
                {!idEditing && <button
                    className={`${styles.main_text__button} ${styles.main_text__button_edit}`}
                    onClick={e => {
                        e.stopPropagation();
                        handleEdit(data.id);
                        setInputValue(data.value);
                    }}
                >E
                </button>}
                <button
                    className={`${styles.main_text__button} ${styles.main_text__button_delete}`}
                    onClick={e => {
                        e.stopPropagation();
                        handleDelete(data.id);
                    }}
                >X
                </button>
            </div>
            <span
                className={`${styles.main_text__hint} ${isClicked && styles.main_text__hint_active}`}
                onAnimationEnd={() => setIsClicked(false)}
            >
                copied
            </span>
        </div>
    )
}