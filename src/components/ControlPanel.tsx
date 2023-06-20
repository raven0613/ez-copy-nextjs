import { useEffect, useRef, useState } from 'react';
import styles from '../styles/controlPanel.module.scss'
import Input from './Input';

export interface ITagCard {
    tag: string;
    handleClick: () => void;
}

function TagCard({ tag, handleClick }: ITagCard) {
    return (
        <div className={styles.control__showTag_tag}
            onClick={() => {
                handleClick();
            }}
        >{tag}</div>
    )
}

export interface ISuggestList {
    handleSelect: (tag: string) => void;
    suggestTags: Array<string>;
    isToggled: boolean;
}

export function SuggestList({ handleSelect, suggestTags = [], isToggled }: ISuggestList) {
    const [currentSelect, setCurrentSelect] = useState<number>(0);
    const ref = useRef<HTMLDivElement>(null)

    useEffect(() => {
        if (suggestTags.length === 0 || !handleSelect) return;
        const event = (e: { key: string; }) => {
            if (e.key === "ArrowDown" && currentSelect < suggestTags.length - 1) setCurrentSelect(pre => pre + 1);
            if (e.key === "ArrowUp" && currentSelect > 0) setCurrentSelect(pre => pre - 1);
            if (e.key === "Enter") handleSelect(suggestTags[currentSelect]);
        }
        document.addEventListener("keydown", event);
        return () => document.removeEventListener("keydown", event);
    }, [currentSelect, handleSelect, suggestTags]);

    if (!isToggled) return <></>
    return (
        <div ref={ref}
            className={styles.control__suggest}>
            {suggestTags.map((item, i) => {
                return (
                    <div
                        onMouseEnter={() => setCurrentSelect(i)}
                        className={`
                        ${suggestTags.length === 1 ? styles.control__suggest_tag_onlyOne : styles.control__suggest_tag}
                        ${i === currentSelect && styles.isSelected}`}
                        key={item}
                        onClick={() => {
                            handleSelect(item);
                        }} >{item}
                    </div>
                )
            })}
        </div>
    )
}

export const suggestList = ({ allTags, postTags, inputTagValue }: { allTags: string[], postTags: string[], inputTagValue: string }) => {
    if (!allTags || !postTags || !inputTagValue) return [];
    const tagSet = new Set(postTags);

    // 先把已經寫的 tag 篩掉
    if (tagSet.has(inputTagValue)) return [];
    const rest = allTags.filter(item => !tagSet.has(item));

    const filteredTags = rest.filter(item => item.includes(inputTagValue) && inputTagValue !== item);
    if (filteredTags.length > 0) return [inputTagValue, ...filteredTags];
    return [inputTagValue];
}

export interface IControlPanel {
    handleSave: (value: string, tagList: Array<string>) => void;
    allTags: Array<string>;
    isCardEditing: boolean;
}

export default function ControlPanel({ handleSave, allTags, isCardEditing }: IControlPanel) {
    const [inputValue, setInputValue] = useState<string>("");
    const [inputTagValue, setInputTagValue] = useState<string>("");
    const [tagList, setTagList] = useState<Array<string>>([]);

    return (
        <div className={styles.control__container}>
            <textarea
                className={styles.control__input}
                value={inputValue}
                onChange={e => {
                    setInputValue(e.target.value);
                    // setExsitId("");
                }}
            />
            <div className={styles.control__showTag}>
                {tagList.map(item => {
                    return (
                        <TagCard
                            handleClick={() => setTagList(pre => pre.filter(it => it !== item))}
                            tag={item}
                            key={item}
                        />
                    )
                })}
            </div>
            <div className={styles.control__tag}>
                <SuggestList
                    isToggled={!isCardEditing && inputTagValue.trim().length > 0}
                    handleSelect={(tag: string) => {
                        setTagList(pre => [...pre, tag]);
                        setInputTagValue("");
                    }}
                    suggestTags={suggestList({ allTags, postTags: tagList, inputTagValue })}
                />
                <Input
                    value={inputTagValue}
                    placeholder="請輸入 tag 名稱"
                    handleChange={(keyword) => setInputTagValue(keyword)}
                />
                <button
                    className={`${styles.control__button}`}
                    disabled={!inputValue}
                    onClick={() => {
                        handleSave(inputValue, tagList);
                        setInputValue("");
                        setTagList([]);
                    }} >Save
                </button>
            </div>
        </div>
    )
}