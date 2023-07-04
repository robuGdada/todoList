import { API } from "@/api/API";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { getTodoKeys } from "./useTodos";

interface ICheckTodo {
  id: string;
}
export const CheckTodo = async (checkTodo: ICheckTodo) => {
  const response = await API.put(`/todos/check/${checkTodo.id}`);
  return response.data;
};

const useCheckTodo = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: CheckTodo,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: getTodoKeys.all });
    },
  });
};
export { useCheckTodo };