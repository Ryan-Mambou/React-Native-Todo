import { Task } from "../types/task";
import { supabase } from "../utils/supabase";

const taskService = {
  getTasks: async () => {
    const { data, error } = await supabase.from('Task').select('*');
    if (error) {
      throw error;
    }
    return data;
  },
  createTask: async (task: Task) => {
    const { data, error } = await supabase.from('Task').insert(task);
    if (error) {
      throw error;
    }
    return data;
  },

  updateTask: async (id: string, task: Task) => {
    const { data, error } = await supabase.from('Task').update(task).eq('id', id);
    if (error) {
      throw error;
    }
    return data;
  },

  deleteTask: async (id: string) => {
    const { data, error } = await supabase.from('Task').delete().eq('id', id);
    if (error) {
      throw error;
    }
    return data;
  },
};


export default taskService;