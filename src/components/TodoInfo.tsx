import { TTodo } from "@/types/TTodo";
import React from "react";

interface TodoInfoProps {
  todo: TTodo | undefined;
}

const TodoInfo = ({ todo }: TodoInfoProps) => {
  if (!todo) {
    return null;
  }

  return (
    <>
      <div key={todo.id}>
        <h3>{todo.title}</h3>
      </div>
    </>
  );
};

export default TodoInfo;
