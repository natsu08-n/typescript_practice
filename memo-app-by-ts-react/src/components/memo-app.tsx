"use client";

import { useState, useEffect } from "react";
import { Memo } from "../types";
import { STORAGE_KEY, readLocalStorage, saveLocalStorage } from "../storage";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function MemoApp() {
  const [memos, setMemos] = useState<Memo[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");

  useEffect(() => {
    const loadedMemos = readLocalStorage(STORAGE_KEY);
    if (loadedMemos.length === 0) {
      const newMemo = createNewMemo([]);
      setMemos([newMemo]);
      saveLocalStorage(STORAGE_KEY, [newMemo]);
    } else {
      setMemos(loadedMemos);
      setTitle(loadedMemos[0].title);
      setBody(loadedMemos[0].body);
    }
  }, []);

  const createNewMemo = (currentMemos: Memo[]): Memo => {
    const timestamp = Date.now();
    return {
      id: timestamp.toString() + currentMemos.length.toString(),
      title: `新規メモ ${currentMemos.length + 1}`,
      body: "",
      createdAt: timestamp,
      updatedAt: timestamp,
    };
  };

  const handleAddMemo = () => {
    const newMemo = createNewMemo(memos);
    const newMemos = [...memos, newMemo];
    setMemos(newMemos);
    setSelectedIndex(newMemos.length - 1);
    setTitle(newMemo.title);
    setBody(newMemo.body);
    setIsEditing(true);
    saveLocalStorage(STORAGE_KEY, newMemos);
  };

  const handleSelectMemo = (index: number) => {
    setSelectedIndex(index);
    setTitle(memos[index].title);
    setBody(memos[index].body);
    setIsEditing(false);
  };

  const handleSave = () => {
    const updatedMemos = memos.map((memo, index) => {
      if (index === selectedIndex) {
        return {
          ...memo,
          title,
          body,
          updatedAt: Date.now(),
        };
      }
      return memo;
    });
    setMemos(updatedMemos);
    setIsEditing(false);
    saveLocalStorage(STORAGE_KEY, updatedMemos);
  };

  const handleDelete = () => {
    if (memos.length === 1) {
      alert("最後のメモは削除できません");
      return;
    }

    const newMemos = memos.filter((_, index) => index !== selectedIndex);
    const newIndex =
      selectedIndex >= newMemos.length ? newMemos.length - 1 : selectedIndex;
    setMemos(newMemos);
    setSelectedIndex(newIndex);
    setTitle(newMemos[newIndex].title);
    setBody(newMemos[newIndex].body);
    setIsEditing(false);
    saveLocalStorage(STORAGE_KEY, newMemos);
  };

  return (
    <div className="flex h-screen max-h-screen p-4 gap-4">
      <Card className="w-64">
        <CardContent className="p-4">
          <Button onClick={handleAddMemo} className="w-full mb-4">
            新規メモ
          </Button>
          <ScrollArea className="h-[calc(100vh-8rem)]">
            <div className="space-y-2">
              {memos.map((memo, index) => (
                <div
                  key={memo.id}
                  onClick={() => handleSelectMemo(index)}
                  className={`p-2 rounded cursor-pointer ${
                    selectedIndex === index
                      ? "bg-primary text-primary-foreground"
                      : "hover:bg-secondary"
                  }`}
                >
                  {memo.title}
                </div>
              ))}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>

      <Card className="flex-1">
        <CardContent className="p-4 h-full flex flex-col gap-4">
          <div className="flex gap-2">
            <Input
              value={title}
              onChange={e => setTitle(e.target.value)}
              disabled={!isEditing}
              className="text-lg font-bold"
            />
            {isEditing ? (
              <Button onClick={handleSave}>保存</Button>
            ) : (
              <Button onClick={() => setIsEditing(true)}>編集</Button>
            )}
            <Button variant="destructive" onClick={handleDelete}>
              削除
            </Button>
          </div>
          <Textarea
            value={body}
            onChange={e => setBody(e.target.value)}
            disabled={!isEditing}
            className="flex-1 resize-none"
          />
        </CardContent>
      </Card>
    </div>
  );
}
