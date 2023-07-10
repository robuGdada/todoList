import { API } from "@/api/API";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { getTodoKeys } from "./useTodos";

interface NewTodo {
  title: string;
  description: string;
  imageUrl: string;
}
export const createTodo = async (newTodo: NewTodo) => {
  const response = await API.post("/todos", newTodo);
  return response.data;
};

const useTodoAdd = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createTodo,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: getTodoKeys.all });
    },
  });
};
export { useTodoAdd };
