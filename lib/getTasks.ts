import data from './tasksDB.json';
import { TaskData } from './types';

export default async function GetTasks() {
  const allTasks: TaskData[] = [];

  data?.forEach((doc: TaskData) => {
    const newTask: TaskData = {
      ...doc
    };
    allTasks.push(newTask);
  });

  return { allTasks };
}
