import React, { useRef } from "react";
import supabase from "./supabase";
import { useState, useEffect } from "react";

const App = () => {
  const textRef = useRef(null);
  const [todos, setTodos] = useState([]);

  //Adding new todo to supabase
  const handleAdd = async () => {
    const text = textRef.current.value;
    if (text === null || !text) return;
    const res = await supabase.from("todos").insert({ text });
    // console.log(res);
    textRef.current.value = "";
  };

  //Getting all the previews todos  on initials
  const getall = async () => {
    const res = await supabase.from("todos").select();
    console.log(res.data);
    setTodos(res.data);
  };

  useEffect(() => {
    getall();
  }, []);

  useEffect(() => {
    // Realtime
    const channel = supabase
      .channel("todos")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "todos" },
        (payload) => {
          const { eventType } = payload;
          const newRecord = payload.new;
          const oldRecord = payload.old;

          // console.log(payload);
          console.log("Payload came with this event", eventType);

          //Insert todos
          if (eventType === "INSERT") {
            return setTodos((prev) => [...prev, newRecord]);
          }

          //Update todos
          if (eventType === "UPDATE") {
            return setTodos((prev) =>
              prev.map((p) => (p.id === newRecord.id ? newRecord : p))
            );
          }

          //Delete todos
          if (eventType === "DELETE") {
            return setTodos((prev) =>
              prev.filter((p) => p.id !== newRecord.id)
            );
          }
        }
      )
      .subscribe();

    //Cleanup functions
    return () => {
      //**Very crucials**/
      supabase.removeChannel(channel);
    };
  }, [supabase]);

  return (
    <main className="flex items-center flex-col justify-start pt-32 h-screen w-full">
      <h1 className="text-2xl">Add your todos</h1>
      <div>
        <input
          type="text"
          className="border-1 rounded-md mx-2 my-6 px-6 py-4"
          placeholder="Enter new todo"
          ref={textRef}
        />
        <button onClick={handleAdd}>Add</button>
        <ul className="list-disc">
          {todos.map((t) => (
            <li className="" key={t.id}>
              {t.text}
            </li>
          ))}
        </ul>
      </div>
    </main>
  );
};

export default App;
