'use client';

import React, { useEffect, useState } from 'react';
import { addTodo, updateTodo } from '@/firestore/todo';
import { Task } from '@/types/todo.interface';
import TodoItem from './todo/item';
import { collection, onSnapshot, orderBy, query } from 'firebase/firestore';
import { db } from '@/firestore';

export default function Todo() {
  const [keyword, setKeyword] = useState<string>('');
  const [edit, setEdit] = useState(false);
  const [list, setList] = useState<Task[]>([]);
  const [originalList, setOriginalList] = useState<Task[]>([]);
  const [todo, setTodo] = useState('');
  const [message, setMessage] = useState('');
  const [tempData, setTempData] = useState<Task>();

  const updateValue = (data: Task) => {
    setEdit(() => true);
    setTodo(() => data.todo);
    setTempData(() => data);
  };

  const save = async () => {
    if (todo) {
      const result = await addTodo(todo);
      if (result?.success) {
        setTodo(() => '');
        setMessage('');
      } else {
        setMessage(result?.message ?? '');
      }
    }
  };

  const update = async () => {
    const result = await updateTodo({
      id: tempData?.id ?? '',
      todo,
      isCompleted: tempData?.isCompleted ?? false,
    });

    if (result?.success) {
      setEdit(() => false);
      setTodo(() => '');
      setMessage('');
    } else {
      setMessage('Something went wrong');
    }
  };

  const cancel = () => {
    setEdit(() => false);
    setTodo(() => '');
  };

  useEffect(() => {
    const q = query(collection(db, 'todo'), orderBy('createdAt', 'desc'));
    onSnapshot(q, async (querySnapshot) => {
      const data: any[] = querySnapshot.docs.map((doc) => {
        return { id: doc.id, ...doc.data() };
      });
      setOriginalList(() => data);

      if (keyword) {
        search(keyword);
      } else {
        setList(() => data);
      }
    });
  }, []);

  const search = (value: string) => {
    setKeyword(() => value);

    if (value) {
      setList(() => originalList.filter((item) => item.todo.includes(value)));
    } else {
      setList(originalList);
    }
  };

  return (
    <div className="max-w-screen-lg flex flex-col items-center mx-auto p-8">
      <div className="rounded overflow-hidden shadow-xl w-full p-4 my-4 bg-white">
        <h1 className="font-bold text-3xl my-3 text-center">Todo Lists</h1>
        <div className="w-full">
          <div className="relative">
            <input
              type="search or create"
              value={todo}
              onChange={(e) => setTodo(e.target.value)}
              id="default-search"
              className="block w-full p-4 pl-10 text-sm bg-slate-200 text-gray-950 focus:border-none outline-none"
              placeholder="Add todo here"
              onKeyUp={(e) => {
                if (e.key === 'Enter' || e.keyCode === 13) {
                  if (edit) {
                    update();
                  } else {
                    save();
                  }
                }
              }}
            />
          </div>
        </div>

        {message && (
          <div className="w-full text-red-500">
            <p>{message}</p>
          </div>
        )}
        <div className="w-full mt-3">
          {!edit ? (
            <>
              <button
                onClick={save}
                className="bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded"
              >
                Add
              </button>
            </>
          ) : (
            <>
              <button
                onClick={update}
                className="mr-2 bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded"
              >
                Save
              </button>
              <button
                onClick={cancel}
                className="bg-transparent hover:bg-red-500 text-red-700 font-semibold hover:text-white py-2 px-4 border border-red-500 hover:border-transparent rounded"
              >
                Cancel
              </button>
            </>
          )}
        </div>
      </div>

      <div className="w-full mt-3">
        <div className="w-full">
          <input
            type="text"
            value={keyword}
            onChange={(e) => search(e.target.value)}
            id="default-search"
            className="block w-full p-4 pl-10 text-sm bg-slate-200 text-gray-950 outline-none"
            placeholder="Search..."
          />
        </div>
      </div>

      <div className="max-h-[80vh] overflow-y-auto w-full space-y-4 mt-4">
        {list.map((value) => {
          return <TodoItem data={value} key={value.id} onEdit={updateValue} />;
        })}
      </div>
    </div>
  );
}
