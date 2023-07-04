import { API } from "@/api/API";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { getTodoKeys } from "./useTodos";

interface IUnCheckTodo {
  id: string;
}
export const unCheckTodo = async (UnCheckTodo: IUnCheckTodo) => {
  const response = await API.put(`/todos/uncheck/${UnCheckTodo.id}`);
  return response.data;
};

const useUnCheckTodo = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: unCheckTodo,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: getTodoKeys.all });
    },
  });
};
export { useUnCheckTodo };
