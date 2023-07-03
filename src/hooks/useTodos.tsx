import { API } from "@/api/API";
import { TTodo } from "@/types/TTodo";
import { QueryFunction, useQuery } from "@tanstack/react-query";

export const getTodoKeys = {
  all: ["getTodo"] as const,
};

type TGetQueryKey = typeof getTodoKeys.all;

const fetchTodoData: QueryFunction<TTodo[], TGetQueryKey> = async () => {
  const response = await API.get("/todos");
  return response.data;
};

const useTodos = () => {
  return useQuery({
    queryKey: getTodoKeys.all,
    queryFn: fetchTodoData,
  });
};

export { useTodos };
