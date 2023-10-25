import { deleteTodo, updateTodo } from '@/firestore/todo';
import { Task } from '@/types/todo.interface';
import React from 'react';
import { BiPencil, BiTrashAlt } from 'react-icons/bi';

export default function Item({ data, onEdit }: { data: Task; onEdit: any }) {
  const { id, todo, isCompleted } = data;

  const handleToggleStatus = () => {
    updateTodo({ id, todo, isCompleted: !isCompleted });
  };

  const handleDelete = () => {
    deleteTodo(id);
  };

  const handleOnClickEdit = () => {
    onEdit(data);
  };

  return (
    <>
      <div className="w-full p-4 bg-white hover:bg-slate-100 flex border-gray-200 rounded-lg shadow-lg text-black">
        <div className="flex items-center justify-between w-full">
          <div>
            <input
              checked={data.isCompleted ? true : false}
              id={'checked-box-' + data.id}
              type="checkbox"
              value=""
              className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
              onChange={handleToggleStatus}
            />
            {data.isCompleted ? (
              <>
                <del className="ml-2 text-sm font-medium  ">{data.todo}</del>
              </>
            ) : (
              <>
                <label
                  htmlFor="checked-box"
                  className="ml-2 text-sm font-medium  "
                >
                  {data.todo}
                </label>
              </>
            )}
          </div>
          <div className="flex">
            <BiPencil
              className="text-slate-700 mx-2"
              onClick={handleOnClickEdit}
            ></BiPencil>
            <BiTrashAlt
              className="text-red-500"
              onClick={handleDelete}
            ></BiTrashAlt>
          </div>
        </div>
      </div>
    </>
  );
}
