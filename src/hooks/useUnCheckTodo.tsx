import { API } from "@/api/API";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { getTodoKeys } from "./useTodos";

interface IUnCheckTodo {
  id: string;
  completed?: number;
}
export const unCheckTodo = async (UnCheckTodo: IUnCheckTodo) => {
  const response = await API.put(`/todos/uncheck/${UnCheckTodo.id}`);
  return response.data;
};

const useUnCheckTodo = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: unCheckTodo,
    onMutate: async (newTodo) => {
      // Cancel any outgoing refetches
      // (so they don't overwrite our optimistic update)
      await queryClient.cancelQueries({ queryKey: getTodoKeys.all });

      // Snapshot the previous value
      const previousTodos: IUnCheckTodo[] =
        queryClient.getQueryData(getTodoKeys.all) || [];

      const val = previousTodos.map((a: IUnCheckTodo) => {
        if (Number(a.id) === Number(newTodo.id)) {
          return {
            ...a,
            completed: 0,
          };
        } else {
          return a;
        }
      });

      // Optimistically update to the new value
      queryClient.setQueryData(getTodoKeys.all, () => val);

      // Return a context object with the snapshotted value
      return { previousTodos };
    },
    onError: (err, newTodo, context) => {
      queryClient.setQueryData(getTodoKeys.all, context?.previousTodos);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: getTodoKeys.all });
    },
  });
};
export { useUnCheckTodo };
