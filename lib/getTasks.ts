import data from './tasksDB.json';

export interface TaskData {
  id: number;
  uuid: string;
  date: string;
  description: string;
  status: string;
  operator: string;
  equipment: string;
  station: string;
}

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
