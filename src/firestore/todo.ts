import { db as fireDb } from '.';
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  orderBy,
  query,
  updateDoc,
  where,
} from 'firebase/firestore';
import { Task } from '@/types/todo.interface';

const collectionName = 'todo';

const getTodos = async (): Promise<any> => {
  const collections = collection(fireDb, collectionName);
  const re = query(collections, orderBy('createdAt', 'desc'));
  const querySnapshot = await getDocs(
    query(collections, orderBy('createdAt', 'desc'))
  );
  return querySnapshot.docs;
};

const isTodoAlreadyExist = async (todo: string): Promise<boolean> => {
  const collections = collection(fireDb, collectionName);
  const q = query(collections, where('todo', '==', todo));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.length > 0;
};

const addTodo = async (todo: string): Promise<any> => {
  try {
    const isExist = await isTodoAlreadyExist(todo);
    if (!isExist) {
      const res = await addDoc(collection(fireDb, collectionName), {
        todo,
        isCompleted: false,
        createdAt: new Date().getTime(),
      });

      if (res) {
        return { success: true };
      }
    } else {
      return { success: false, message: 'Todo is already exist.' };
    }
  } catch (err) {}
};

const updateTodo = async ({ id, todo, isCompleted }: Task) => {
  try {
    const todoRef = doc(fireDb, collectionName, id);
    await updateDoc(todoRef, {
      todo,
      isCompleted,
      updatedAt: new Date().getTime(),
    });

    return { success: true };
  } catch (err) {}
};

const deleteTodo = async (id: string) => {
  try {
    const todoRef = doc(fireDb, collectionName, id);
    await deleteDoc(todoRef);
  } catch (err) {}
};

export { getTodos, addTodo, updateTodo, deleteTodo };
