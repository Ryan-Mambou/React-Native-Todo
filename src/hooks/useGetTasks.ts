import { useQuery } from "@tanstack/react-query";
import taskService from "../services/task";

export const useGetTasks = () => {
    const { data: tasks, isLoading, error } = useQuery({
        queryKey: ['tasks'],
        queryFn: taskService.getTasks,
    });
    return { tasks, isLoading, error };
}