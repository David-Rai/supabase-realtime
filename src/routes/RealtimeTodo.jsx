//Practising the Postgress changes realtime features

import React, { useEffect } from "react";
import { useRef, useState } from "react";
import supabase from "@/config/supabase";

const RealtimeTodo = () => {
  const textRef = useRef(null);
  const [todos, setTodos] = useState([]);

  //****Fetching previous todos*** */
  useEffect(() => {
    fetchPreviousTodos();
  }, []);

  const fetchPreviousTodos = async () => {
    const { error, data } = await supabase.from("todos").select();

    if (error) {
      return console.log("error fetching previous data", error.message);
    }
    if (data.length > 0) {
      setTodos(data);
      return console.log("fetched todos", data);
    }

    console.log("zero todos");
  };

  //*****Subscribing to the postgres table changes**** */
  useEffect(() => {
    console.log("Subscribing to the postgres changes");
    const changes = supabase
      .channel("postgres-table-changes")
      .on(
        "postgres_changes",
        {
          schema: "public",
          event: "*",
        },
        (payload) => {
          console.log("payload", payload);
          const event_type = payload.eventType;
          const { new: newTodo } = payload;

          switch (event_type) {
            case "INSERT":
              setTodos((prev) => [...prev, newTodo]);
              break;
            case "DELETE":
              setTodos((prev) => prev.filter((p) => p.id !== newTodo.id));
              break;
            default:
              console.log("Event", event_type);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeAllChannels();
      console.log("Unsubscribed from all channels");
    };
  }, []);

  //****Handling Add Todos** */
  const handleAddTodo = async () => {
    const text = textRef.current.value;
    if (!text || text === null) return console.log("no text");

    const res = await supabase.from("todos").insert({ text });
    // console.log("Todo is inserted", res);
  };

  return (
    <main className="h-screen w-full flex items-center flex-col justify-center">
      {/* Heading */}
      <h1 className="text-3xl">Realtime todos</h1>
      {/* Input field + button  */}
      <div className="flex w-full gap-2 items-center justify-center">
        <input
          ref={textRef}
          className="border-1 border-black px-3 py-4 h-[60px] rounded-md"
          type="text"
          placeholder="Add you todos"
        />
        <button
          className="px-3 h-[60px] text-white my-3 cursor-pointer bg-purple-700 
        transition-all 
        hover:bg-purple-400 rounded-lg"
          onClick={handleAddTodo}
        >
          Add todo
        </button>
      </div>
      {/* Rendering all the todos */}
      <section className="h-[60%] w-full px-5 list-decimal overflow-x-scroll">
        {todos.length > 0 ? (
          todos.map((t) => <TodoChild key={t.id} t={t} />)
        ) : (
          <h1>No previous todos</h1>
        )}
      </section>
    </main>
  );
};

const TodoChild = ({ t }) => {
  return (
    <div className="flex gap-2 bg-gray-200 mt-5 rounded-md p-5 w-full">
      <h5>{t.id}.</h5>
      <h3>{t.text}</h3>
    </div>
  );
};

export default RealtimeTodo;
