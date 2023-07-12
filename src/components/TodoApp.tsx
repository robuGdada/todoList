import TodoInfo from "@/components/TodoInfo";
import { useTodos } from "@/hooks/useTodos";

import { useRouter } from "next/router";
import React from "react";

const TodoApp = () => {
  const router = useRouter();
  const { data } = useTodos();
  return (
    <>
      <header className="header">
        <button className="btn-login">Login</button>
      </header>
      <div className="btn">
        <button className="btn-add" onClick={() => router.push("/create-todo")}>
          Add a todo
        </button>
      </div>
      <div className="todo-info">
        {data && data.map((todo) => <TodoInfo key={todo.id} todo={todo} />)}
      </div>
    </>
  );
};

export default TodoApp;
