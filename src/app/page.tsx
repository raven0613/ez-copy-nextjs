"use client";
import { useEffect, useRef, useState } from 'react';
import uuid from 'react-uuid';
import Image from 'next/image'
import styles from '../styles/page.module.scss'
import scrollStyle from '../styles/scrollbar.module.scss'
import TextCard from '../components/TextCard'
import ClusterList from '@/components/ClusterList';
import Input from '@/components/Input';
import ControlPanel from '@/components/ControlPanel';

interface IFilter {
  textList: Array<IUnit | ICluster>
  keyword: string;
  shownTagList?: Array<string>;
}

const getDisplayList = ({ textList, keyword, shownTagList }: IFilter) => {
  const tagSet = new Set<string>(shownTagList);
  const keywordFilteredList: (IUnit[] | ICluster[]) = textList.filter(item => item.value.includes(keyword));

  if (!shownTagList || shownTagList.length === 0) return textList;

  const tagFilteredList = (keywordFilteredList as IUnit[]).filter(item => {
    const tags: string[] = item.tagList;
    return tags.some(tag => tagSet.has(tag));
  });
  return tagFilteredList;
}

interface ICluster {
  id: string;
  value: string;
}

export interface IUnit {
  id: string;
  value: string;
  tagList: Array<string>;
  bgColor?: string;
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

  const [displayTextList, setDisplayTextList] = useState<Array<IUnit>>(getDisplayList({ textList, keyword: textKeyword, shownTagList }) as IUnit[]);

  useEffect(() => {
    if (!localStorage.getItem("ez-copy")) return;
    const initialData = JSON.parse(localStorage.getItem("ez-copy") || "");
    setTextList(initialData.posts || []);
    setAllTagList(initialData.tags || [])
    setShownTagList(initialData.shownTag || []);
    setDisplayTextList(getDisplayList({
      textList: initialData.posts || [],
      keyword: "",
      shownTagList: initialData.shownTag || []
    }) as IUnit[])
  }, []);

  // 點選 tags
  function handleClick(tag: string, isShown: boolean) {
    if (editingId) setEditingId("");
    const newShownTags = isShown ? shownTagList.filter(item => item !== tag) : [...shownTagList, tag];
    setShownTagList(newShownTags);

    setDisplayTextList(getDisplayList({
      textList: textList || [],
      keyword: textKeyword || "",
      shownTagList: newShownTags || []
    }) as IUnit[]);

    const saveData = {
      user: {},
      tags: allTagList,
      shownTag: newShownTags,
      posts: textList
    }
    localStorage.setItem("ez-copy", JSON.stringify(saveData));
  }
  function handleClickAll(isSelectAll: boolean) {
    if (editingId) setEditingId("");
    const newShownTags = isSelectAll ? [] : allTagList;
    setShownTagList(newShownTags);

    setDisplayTextList(getDisplayList({
      textList: textList || [],
      keyword: textKeyword || "",
      shownTagList: newShownTags || []
    }) as IUnit[]);

    const saveData = {
      user: {},
      tags: allTagList,
      shownTag: isSelectAll ? [] : allTagList,
      posts: textList
    }
    localStorage.setItem("ez-copy", JSON.stringify(saveData));
  }
  function handleClear() {
    if (editingId) setEditingId("");

    setDisplayTextList(getDisplayList({
      textList: textList || [],
      keyword: textKeyword || "",
      shownTagList: []
    }) as IUnit[]);

    const saveData = {
      user: {},
      tags: allTagList,
      shownTag: [],
      posts: textList
    }
    localStorage.setItem("ez-copy", JSON.stringify(saveData));
    setShownTagList([]);
  }
  function handleSubmitEdit({ oldValue, newValue }: { oldValue: string, newValue: string }) {
    if (allTagList.some(item => item === newValue)) return;
    const newAllTag = allTagList.map(item => {
      if (item === oldValue) return newValue;
      return item;
    });
    const newShownTag = shownTagList.map(item => {
      if (item === oldValue) return newValue;
      return item;
    });
    const newTextList = textList.map(item => {
      const newTags = item.tagList.map(tag => {
        if (tag === oldValue) return newValue;
        return tag;
      })
      return { ...item, tagList: newTags };
    });
    setAllTagList(newAllTag);
    setShownTagList(newShownTag);
    setTextList(newTextList);

    setDisplayTextList(getDisplayList({
      textList: newTextList || [],
      keyword: textKeyword || "",
      shownTagList: newShownTag || []
    }) as IUnit[]);

    const saveData = {
      user: {},
      tags: newAllTag,
      shownTag: newShownTag,
      posts: newTextList
    }
    localStorage.setItem("ez-copy", JSON.stringify(saveData));
  }
  function handleDelete(tag: string) {
    const newAllTag = allTagList.filter(item => item !== tag);
    const newShownTag = shownTagList.filter(item => item !== tag);
    const newTextList = textList.map(item => {
      const newTags = item.tagList.filter(tg => tg !== tag)
      return { ...item, tagList: newTags };
    });
    setAllTagList(newAllTag);
    setShownTagList(newShownTag);
    setTextList(newTextList);

    setDisplayTextList(getDisplayList({
      textList: newTextList || [],
      keyword: textKeyword || "",
      shownTagList: newShownTag || []
    }) as IUnit[]);

    const saveData = {
      user: {},
      tags: newAllTag,
      shownTag: newShownTag,
      posts: newTextList
    }
    localStorage.setItem("ez-copy", JSON.stringify(saveData));
  }

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
          isTextEditing={editingId !== "" && editingId !== undefined}
          handleClick={handleClick}
          handleClickAll={handleClickAll}
          handleClear={handleClear}
          handleClickEdit={() => setEditingId("")}
          handleSubmitEdit={handleSubmitEdit}
          handleDelete={handleDelete}
        />
      </section>

      <section className={`${styles.main_center}`}>
        <Input
          value={textKeyword}
          placeholder='搜尋關鍵字'
          handleChange={(keyword) => setTextKeyword(keyword)}
        />
        <div className={`${styles.main_center_cards} ${scrollStyle.scroll_bar}`}>
          {displayTextList.length > 0 && displayTextList.map((unit, i) =>
            <TextCard
              key={unit.id}
              index={i}
              data={unit as IUnit}
              allTags={allTagList}
              handleSave={({ id, value, tagList, bgColor }) => {
                // save post
                const editedList = textList.map(item => {
                  if (item.id === id) return { id, value, tagList, bgColor };
                  return item;
                })
                setTextList(editedList);
                setEditingId("");

                // save tags
                const allTagSet = new Set(allTagList);
                const filteredTags = tagList.filter(item => !allTagSet.has(item));
                const editedAllTagList = [...allTagList, ...filteredTags];
                setAllTagList(editedAllTagList);

                setDisplayTextList(getDisplayList({
                  textList: editedList || [],
                  keyword: textKeyword || "",
                  shownTagList: shownTagList || []
                }) as IUnit[]);

                const saveData = {
                  user: {},
                  tags: editedAllTagList,
                  shownTag: shownTagList,
                  posts: editedList
                }
                localStorage.setItem("ez-copy", JSON.stringify(saveData));
              }}
              handleDelete={(id: string) => {
                const newTextList = textList.filter(item => item.id !== id);
                // setTextList(pre => pre.filter(item => item.id !== id));
                setTextList(newTextList);
                setEditingId("");

                const saveData = {
                  user: {},
                  tags: allTagList,
                  shownTag: shownTagList,
                  posts: textList.filter(item => item.id !== id)
                }
                setDisplayTextList(getDisplayList({
                  textList: newTextList || [],
                  keyword: textKeyword,
                  shownTagList: shownTagList || []
                }) as IUnit[]);
                localStorage.setItem("ez-copy", JSON.stringify(saveData));
              }}
              handleClick={(id: string) => {
                navigator.clipboard.writeText(unit.value);
                setCopiedId(id);
              }}
              handleEdit={(id: string) => setEditingId(id)}
              handleMoveCard={(dragIndex: number, hoverIndex: number) => {
                const dragPostId = displayTextList[dragIndex].id;
                const hoverPostId = displayTextList[hoverIndex].id;
                let dragPostIndexInAllPost: number = 0;
                let hoverPostIndexInAllPost: number = 0;
                for (let i = 0; i < textList.length; i++) {
                  if (textList[i].id === dragPostId) dragPostIndexInAllPost = i;
                  if (textList[i].id === hoverPostId) hoverPostIndexInAllPost = i;
                }

                const newDisplayTextList = [...displayTextList];
                [newDisplayTextList[dragIndex], newDisplayTextList[hoverIndex]] = [newDisplayTextList[hoverIndex], newDisplayTextList[dragIndex]]
                setDisplayTextList(newDisplayTextList);
                const newTextList = [...textList];
                [newTextList[dragPostIndexInAllPost], newTextList[hoverPostIndexInAllPost]] = [newTextList[hoverPostIndexInAllPost], newTextList[dragPostIndexInAllPost]]
                setTextList(newTextList);

                const saveData = {
                  user: {},
                  tags: allTagList,
                  shownTag: shownTagList,
                  posts: newTextList
                }
                localStorage.setItem("ez-copy", JSON.stringify(saveData));
              }}
              handleChangeColor={(id: string, color: string) => {
                const editedList = textList.map(item => {
                  if (item.id === id) return { ...item, bgColor: color };
                  return item;
                })
                setTextList(editedList);

                setDisplayTextList(getDisplayList({
                  textList: editedList || [],
                  keyword: textKeyword || "",
                  shownTagList: shownTagList || []
                }) as IUnit[]);

                const saveData = {
                  user: {},
                  tags: allTagList,
                  shownTag: shownTagList,
                  posts: editedList
                }
                localStorage.setItem("ez-copy", JSON.stringify(saveData));
              }}
              idEditing={editingId === unit.id}
              isExist={existId === unit.id}
            />
          )}
        </div>
        <ControlPanel
          allTags={allTagList}
          isCardEditing={editingId.length > 0}
          handleSave={(inputValue: string, tagList: Array<string>) => {
            if (!inputValue) return;
            const existedUnit = textList.find(item => item.value === inputValue);
            if (existedUnit) return setExsitId(existedUnit.id);

            // save post
            const newTextList = [...textList, { id: uuid(), value: inputValue, tagList, bgColor: "#f1f0ef" }];
            setTextList(newTextList);

            // save tags
            const allTagSet = new Set(allTagList);
            const filteredTags = tagList.filter(item => !allTagSet.has(item));
            const newAllTagList = [...allTagList, ...filteredTags];
            setAllTagList(newAllTagList);
            const shownTagSet = new Set(shownTagList);
            const filteredShownTags = tagList.filter(item => !shownTagSet.has(item));
            const newShownTagList = [...shownTagList, ...filteredShownTags];
            setShownTagList(newShownTagList)

            setDisplayTextList(getDisplayList({
              textList: newTextList || [],
              keyword: textKeyword,
              shownTagList: shownTagList || []
            }) as IUnit[]);

            const saveData = {
              user: {},
              tags: newAllTagList,
              shownTag: newShownTagList,
              posts: newTextList
            }
            localStorage.setItem("ez-copy", JSON.stringify(saveData));
          }}
        />
      </section>
    </main>
  )
}
