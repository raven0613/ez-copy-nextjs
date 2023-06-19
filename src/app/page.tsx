"use client";
import Image from 'next/image'
import styles from '../styles/page.module.scss'
import scrollStyle from '../styles/scrollbar.module.scss'
import { useEffect, useState } from 'react';
import uuid from 'react-uuid';
import TextCard from '../components/TextCard'
import ClusterList from '@/components/ClusterList';
import Input from '@/components/Input';
import ControlPanel from '@/components/ControlPanel';

interface IFilter {
  targetList: Array<IUnit | ICluster>
  keyword: string;
  tagList?: Array<string>;
}

const getDisplayList = ({ targetList, keyword, tagList }: IFilter) => {
  const tagSet = new Set<string>(tagList);
  const keywordFilteredList: (IUnit[] | ICluster[]) = targetList.filter(item => item.value.includes(keyword));

  if (!tagList || tagList.length === 0) return [];
  const clusterFilteredList = (keywordFilteredList as IUnit[]).filter(item => {
    const tags: string[] = item.tagList;
    return tags.some(tag => tagSet.has(tag));
  });
  return clusterFilteredList || [];
}

interface ICluster {
  id: string;
  value: string;
}

export interface IUnit {
  id: string;
  value: string;
  tagList: Array<string>;
}

export default function Home() {
  const [textList, setTextList] = useState<Array<IUnit>>([]);
  const [allTagList, setAllTagList] = useState<Array<string>>([]);
  const [shownTagList, setShownTagList] = useState<Array<string>>([]);

  const [existId, setExsitId] = useState<string>("");
  const [editingId, setEditingId] = useState<string>("");
  const [copiedId, setCopiedId] = useState<string>("");
  const [textKeyword, setTextKeyword] = useState<string>("");
  const [tagKeyword, setTagKeyword] = useState<string>("");

  const displayList = getDisplayList({ targetList: textList, keyword: textKeyword, tagList: shownTagList });
  // console.log(displayList)

  useEffect(() => {
    if (!localStorage.getItem("ez-copy")) return;
    const initialData = JSON.parse(localStorage.getItem("ez-copy") || "");
    setTextList(initialData.posts || []);
    setAllTagList(initialData.tags || [])
    setShownTagList(initialData.shownTag || []);
  }, []);


  return (
    <main className={styles.main}>
      <section className={styles.main_sidebar}>
        <Input
          value={tagKeyword}
          placeholder='搜尋 tag'
          handleChange={(value) => setTagKeyword(value)}
        />
        <ClusterList
          allTagList={allTagList}
          filteredTagList={allTagList.filter(item => item.includes(tagKeyword))}
          shownTagList={shownTagList}
          handleClick={(tag: string, isShown: boolean) => {
            if (isShown) setShownTagList(pre => pre.filter(item => item !== tag));
            else setShownTagList(pre => [...pre, tag]);

            const saveData = {
              user: {},
              tags: allTagList,
              shownTag: isShown ? shownTagList.filter(item => item !== tag) : [...shownTagList, tag],
              posts: textList
            }
            localStorage.setItem("ez-copy", JSON.stringify(saveData));
          }}
          handleClickAll={(isSelectAll: boolean) => {
            if (isSelectAll) setShownTagList([]);
            else setShownTagList(allTagList);
            const saveData = {
              user: {},
              tags: allTagList,
              shownTag: isSelectAll ? [] : allTagList,
              posts: textList
            }
            localStorage.setItem("ez-copy", JSON.stringify(saveData));
          }}
          handleClear={() => {
            const saveData = {
              user: {},
              tags: allTagList,
              shownTag: [],
              posts: textList
            }
            localStorage.setItem("ez-copy", JSON.stringify(saveData));
            setShownTagList([]);
          }}
        />
      </section>

      <section className={`${styles.main_center}`}>
        <Input
          value={textKeyword}
          placeholder='搜尋關鍵字'
          handleChange={(keyword) => setTextKeyword(keyword)}
        />
        <div className={`${styles.main_center_cards} ${scrollStyle.scroll_bar}`}>
          {displayList.length > 0 && displayList.map(unit =>
            <TextCard
              key={unit.id}
              data={unit as IUnit}
              allTags={allTagList}
              handleSave={({ id, value, tagList }) => {
                // save post
                setTextList(pre => pre.map(item => {
                  if (item.id === id) return { id, value, tagList };
                  return item;
                }));
                setEditingId("");

                // save tags
                const allTagSet = new Set(allTagList);
                const filteredTags = tagList.filter(item => !allTagSet.has(item));
                setAllTagList(pre => [...pre, ...filteredTags]);
                const shownTagSet = new Set(shownTagList);
                const filteredShownTags = tagList.filter(item => !shownTagSet.has(item));
                setShownTagList(pre => [...pre, ...filteredShownTags])

                const saveData = {
                  user: {},
                  tags: [...allTagList, ...filteredTags],
                  shownTag: [...shownTagList, ...filteredShownTags],
                  posts: [...textList, { id: uuid(), value, tagList, bgColor: "" }]
                }
                localStorage.setItem("ez-copy", JSON.stringify(saveData));
              }}
              handleDelete={(id: string) => {
                setTextList(pre => pre.filter(item => item.id !== id));
                localStorage.setItem("ez-copy", JSON.stringify(textList.filter(item => item.id !== id)));
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
          {textList.length === 0 && <span>No Data</span>}
        </div>
        <ControlPanel
          allTags={allTagList}
          isCardEditing={editingId.length > 0}
          handleSave={(inputValue: string, tagList: Array<string>) => {
            if (!inputValue) return;
            const existedUnit = textList.find(item => item.value === inputValue);
            if (existedUnit) return setExsitId(existedUnit.id);

            // save post
            setTextList(pre => [...pre, { id: uuid(), value: inputValue, tagList }]);

            // save tags
            const allTagSet = new Set(allTagList);
            const filteredTags = tagList.filter(item => !allTagSet.has(item));
            setAllTagList(pre => [...pre, ...filteredTags]);
            const shownTagSet = new Set(shownTagList);
            const filteredShownTags = tagList.filter(item => !shownTagSet.has(item));
            setShownTagList(pre => [...pre, ...filteredShownTags])

            const saveData = {
              user: {},
              tags: [...allTagList, ...filteredTags],
              shownTag: [...shownTagList, ...filteredShownTags],
              posts: [...textList, { id: uuid(), value: inputValue, tagList, bgColor: "" }]
            }
            localStorage.setItem("ez-copy", JSON.stringify(saveData));
          }}
        />
      </section>
    </main>
  )
}
