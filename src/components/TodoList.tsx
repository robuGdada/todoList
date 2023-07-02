import { useGet } from "@/hooks/useGet";
import React, { useState } from "react";

const TodoList = () => {
  const [todo, setTodo] = useState("");
  const { data } = useGet();
  return (
    <>
      <header>
        <button className="btn-login">Login</button>
      </header>
      <div className="container">
        <input className="input" placeholder="Title" />
        <textarea className="text-area" placeholder="Description" />
        <button className="btn-submit">Submit</button>
        {data}
      </div>
    </>
  );
};

export { TodoList };
