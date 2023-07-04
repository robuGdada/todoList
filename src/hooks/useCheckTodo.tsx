import { API } from "@/api/API";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { getTodoKeys } from "./useTodos";

interface ICheckTodo {
  id: string;
  completed: number;
}
export const checkTodo = async (checkTodo: ICheckTodo) => {
  const response = await API.put(`/todos/check/${checkTodo.id}`);
  return response.data;
};

const useCheckTodo = () => {
  const queryClient = useQueryClient();
  console.log(queryClient.getQueryData(getTodoKeys.all));
  return useMutation({
    mutationFn: checkTodo,
    onMutate: async (newTodo) => {
      // Cancel any outgoing refetches
      // (so they don't overwrite our optimistic update)
      await queryClient.cancelQueries({ queryKey: getTodoKeys.all });

      // Snapshot the previous value
      const previousTodos: ICheckTodo[] =
        queryClient.getQueryData(getTodoKeys.all) || [];

      const val = previousTodos.map((a: ICheckTodo) => {
        if (Number(a.id) === Number(newTodo.id)) {
          return {
            ...a,
            completed: 1,
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
export { useCheckTodo };
