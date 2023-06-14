"use client";
import Image from 'next/image'
import styles from '../styles/page.module.scss'
import { useEffect, useState } from 'react';
import uuid from 'react-uuid';
import TextCard from '../components/TextCard'
import ClusterList from '@/components/ClusterList';
import Input from '@/components/Input';

interface IFilter {
  targetList: Array<IUnit | ICluster>
  keyword: string;
  tagNames?: Array<string>;
}

const getDisplayList = ({ targetList, keyword, tagNames }: IFilter) => {
  const tagSet = new Set<string>(tagNames);
  const keywordFilteredList: (IUnit[] | ICluster[]) = targetList.filter(item => item.value.includes(keyword));

  if (!tagNames || tagNames.length === 0) return keywordFilteredList || [];
  const clusterFilteredList = (keywordFilteredList as IUnit[]).filter(item => {
    const tags: string[] = item.tagNames;
    return tags.some(tag => tagSet.has(tag));
  });
  return clusterFilteredList || [];
}

const getTags = ({ tagString }: { tagString: string }) => {
  return tagString.split("# ");
}

interface ICluster {
  id: string;
  value: string;
}

export interface IUnit {
  id: string;
  value: string;
  tagNames: Array<string>;
}

export default function Home() {
  const [textList, setTextList] = useState<Array<IUnit>>([]);
  const [tagNameList, setTagNameList] = useState<Array<string>>([]);
  const [inputValue, setInputValue] = useState<string>("");
  const [inputTagValue, setInputTagValue] = useState<string>("");
  const [existId, setExsitId] = useState<string>("");
  const [editingId, setEditingId] = useState<string>("");
  const [copiedId, setCopiedId] = useState<string>("");
  const [textKeyword, setTextKeyword] = useState<string>("");
  const [clusterKeyword, setClusterKeyword] = useState<string>("");

  const displayList = getDisplayList({ targetList: textList, keyword: textKeyword, tagNames: tagNameList });
  console.log(displayList)

  useEffect(() => {
    if (!localStorage.getItem("ez-copy")) return;
    const initialData = JSON.parse(localStorage.getItem("ez-copy") || "");
    setTextList(initialData);
  }, []);

  return (
    <main className={styles.main}>
      <section className={styles.main_sidebar}>
        <Input
          value={clusterKeyword}
          placeholder='搜尋 tag'
          handleChange={(keyword) => setClusterKeyword(keyword)}
        />
        <ClusterList
          handleClick={(tag: string) => {
            setTagNameList(pre => [...pre, tag])
          }}
        />
      </section>

      <section className={styles.main_center}>

        <Input
          value={textKeyword}
          placeholder='搜尋關鍵字'
          handleChange={(keyword) => setTextKeyword(keyword)}
        />

        {displayList.length > 0 && displayList.map(unit =>
          <TextCard
            key={unit.id}
            data={unit as IUnit}
            handleSave={({ id, value, tagNames }) => {
              setTextList(pre => pre.map(item => {
                if (item.id === id) return { id, value, tagNames };
                return item;
              }));
              setEditingId("");
              localStorage.setItem("copied", JSON.stringify(textList.map(item => {
                if (item.id === id) return { id, value };
                return item;
              })));
            }}
            handleDelete={(id: string) => {
              setTextList(pre => pre.filter(item => item.id !== id));
              localStorage.setItem("copied", JSON.stringify(textList.filter(item => item.id !== id)));
            }}
            handleClick={(id: string) => {
              navigator.clipboard.writeText(unit.value);
              setCopiedId(id);
            }}
            handleEdit={(id: string) => setEditingId(id)}
            idEditing={editingId === unit.id}
            isExist={existId === unit.id}
          />
        )}
      </section>
      {textList.length === 0 && <span>No Data</span>}
      <textarea
        className={styles.main_input}
        value={inputValue}
        onChange={e => {
          setInputValue(e.target.value);
          setExsitId("");
        }}
      />
      <div className={styles.main_input__tag}>
        <Input
          value={inputTagValue}
          placeholder="請輸入 tag"
          handleChange={(keyword) => setInputTagValue(keyword)}
        />
        <button
          className={`${styles.main_button}`}
          disabled={!inputValue}
          onClick={() => {
            if (!inputValue) return;
            const existedUnit = textList.find(item => item.value === inputValue);
            if (existedUnit) return setExsitId(existedUnit.id);
            setTextList(pre => [...pre, { id: uuid(), value: inputValue, tagNames: tagNameList }]);
            setInputValue("");

            localStorage.setItem("ez-copy", JSON.stringify([...textList, { id: uuid(), value: inputValue, tagNames: tagNameList }]));

          }} >Save
        </button>
      </div>
      <span className={styles.main_tip}>例：#work #food #memo</span>
    </main>
  )
}
