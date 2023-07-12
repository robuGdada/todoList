import { useCheckTodo } from "@/hooks/useCheckTodo";
import { useTodoDelete } from "@/hooks/useTodoDelete";
import { useUnCheckTodo } from "@/hooks/useUnCheckTodo";
import { TTodo } from "@/types/TTodo";
import { useRouter } from "next/router";
import React, { useState } from "react";
import { AiOutlineEdit } from "react-icons/Ai";
import { AiOutlineDelete } from "react-icons/Ai";

interface TodoInfoProps {
  todo: TTodo | undefined;
}

const TodoInfo = ({ todo }: TodoInfoProps) => {
  if (!todo) {
    return null;
  }
  const mutation = useTodoDelete();
  const { push } = useRouter();
  const checkMutation = useCheckTodo();
  const UnCheckMutation = useUnCheckTodo();

  const handleOnChange = () => {
    if (todo.completed !== 1) {
      checkMutation.mutate({ id: Number(todo.id) });
    } else {
      UnCheckMutation.mutate({ id: Number(todo.id) });
    }
  };
  console.log(!!todo.completed);

  return (
    <>
      <div className="info-container">
        <div key={todo.id} className="todo-box">
          <div className="horizontal-container">
            <input
              className="checkbox"
              type="checkbox"
              checked={!!todo.completed}
              onChange={handleOnChange}
            />
            <h3 className="todo-title">{todo.title}</h3>
            <p className="todo-desc">{todo.description}</p>
            {todo.imageUrl ? <img className="App" src={todo.imageUrl} /> : ""}

            <p>{todo.category.name}</p>
          </div>
          <div className="icon-container">
            <div
              className="icon-wrapper"
              onClick={() => {
                push({
                  pathname: "/edit-todo",
                  query: {
                    id: todo.id,
                    title: todo.title,
                    description: todo.description,
                    imageUrl: todo.imageUrl,
                    categoryId: todo.category.id,
                  },
                });
              }}
            >
              <AiOutlineEdit className="edit-icon" />
            </div>
            <div
              className="icon-wrapper"
              onClick={() => mutation.mutate({ id: String(todo.id) })}
            >
              <AiOutlineDelete className="delete-icon" />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default TodoInfo;
