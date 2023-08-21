import { useEffect, useRef, useState } from "react";
import { useDrag, useDrop } from 'react-dnd';
import type { Identifier, XYCoord } from 'dnd-core';
import styles from '../styles/textCard.module.scss'
import useAutosizeTextarea from "../hooks/useAutosizeTextarea"
import { IUnit } from "@/app/page";
import { SuggestList, ISuggestList, suggestList } from "@/components/ControlPanel"
import EditIcon from "./svg/EditIcon";
import DeleteIcon from "./svg/DeleteIcon";
import CheckIcon from "./svg/CheckIcon";

export const ItemTypes = {
    TEXTCARD: 'card',
}

interface DragItem {
    index: number
    id: string
    type: string
}

interface ITextCard {
    data: IUnit;
    index: number;
    handleSave: (data: { id: string, value: string, tagList: string[] }) => void;
    handleDelete: (id: string) => void;
    handleClick: (id: string) => void;
    handleEdit: (id: string) => void;
    handleMoveCard: (dragIndex: number, hoverIndex: number) => void;
    idEditing: boolean;
    isExist: boolean;
    allTags: Array<string>;
}

export default function TextCard({ data, index, handleSave, handleDelete, handleClick, handleEdit, handleMoveCard, idEditing, isExist, allTags }: ITextCard) {
    const [inputValue, setInputValue] = useState<string>("");
    const [inputTagValue, setInputTagValue] = useState<string>("");
    const [isClicked, setIsClicked] = useState<boolean>(false);
    const [tagList, setTagList] = useState<Array<string>>([]);
    const cardRef = useRef<HTMLDivElement>(null);
    const id = data.id;

    const inputRef = useRef<HTMLTextAreaElement>(null);
    useAutosizeTextarea(inputRef, inputValue, idEditing);

    useEffect(() => {
        return () => setIsClicked(false);
    }, []);
    useEffect(() => {
        if (!data) return;
        setTagList(data.tagList)
    }, [data]);

    const [{ handlerId }, drop] = useDrop<DragItem, void, { handlerId: Identifier | null }>({
        accept: ItemTypes.TEXTCARD,
        collect(monitor) {
            return {
                handlerId: monitor.getHandlerId(),
            }
        },
        hover(item: DragItem, monitor) {
            if (!cardRef.current) return;
            const dragIndex = item.index // 原本是 item.index
            const hoverIndex = index

            // Don't replace items with themselves
            if (dragIndex === hoverIndex) return;

            // Determine rectangle on screen
            const hoverBoundingRect = cardRef.current?.getBoundingClientRect();

            // Get vertical middle
            const hoverMiddleY =
                (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;

            // Determine mouse position
            const clientOffset = monitor.getClientOffset();

            // Get pixels to the top
            const hoverClientY = (clientOffset as XYCoord).y - hoverBoundingRect.top;

            // Only perform the move when the mouse has crossed half of the items height
            // When dragging downwards, only move when the cursor is below 50%
            // When dragging upwards, only move when the cursor is above 50%

            // Dragging downwards
            if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
                return
            }
            // Dragging upwards
            if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
                return
            }
            // Time to actually perform the action
            handleMoveCard(dragIndex, hoverIndex)

            // Note: we're mutating the monitor item here!
            // Generally it's better to avoid mutations,
            // but it's good here for the sake of performance
            // to avoid expensive index searches.
            item.index = hoverIndex
        },
    })
    const [{ isDragging }, drag] = useDrag({
        type: ItemTypes.TEXTCARD,
        item: () => {
            return { id, index }
        },
        collect: (monitor: any) => ({
            isDragging: monitor.isDragging(),
        }),
    })
    drag(drop(cardRef));
    return (
        <div
            ref={cardRef}
            data-handler-id={handlerId}
            className={`${styles.textCard} ${isExist && styles.textCard__exsit} ${isDragging && styles.textCard__isDragging}`}
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
                    >
                        <CheckIcon />
                    </button>}
                    {!idEditing && <button
                        className={`${styles.textCard__button} ${styles.textCard__button_edit}`}
                        onClick={e => {
                            e.stopPropagation();
                            handleEdit(data.id);
                            setInputValue(data.value);
                        }}
                    >
                        <EditIcon />
                    </button>}
                    <button
                        className={`${styles.textCard__button} ${styles.textCard__button_delete}`}
                        onClick={e => {
                            e.stopPropagation();
                            handleDelete(data.id);
                        }}
                    >
                        <DeleteIcon />
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