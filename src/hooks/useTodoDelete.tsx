import { API } from "@/api/API";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { getTodoKeys } from "./useTodos";
import { useRouter } from "next/router";

interface IDeleteTodo {
  id: string;
}
export const deleteTodo = async (deleteTodo: IDeleteTodo) => {
  const response = await API.delete(`/todos/${deleteTodo.id}`);
  return response.data;
};

const useTodoDelete = () => {
  const queryClient = useQueryClient();
  const { back } = useRouter();
  return useMutation({
    mutationFn: deleteTodo,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: getTodoKeys.all });
    },
  });
};
export { useTodoDelete };
