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
          const {new:newTodo}=payload

          switch (event_type) {
            case "INSERT":
              console.log("New todo inserted",newTodo);
              setTodos([...todos,newTodo])
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
      <div className="flex flex-col gap-2">
        <input
          ref={textRef}
          className="border-1 border-black px-3 py-4 rounded-md"
          type="text"
          placeholder="Add you todos"
        />
        <button onClick={handleAddTodo}>Add todo</button>
      </div>

      <ul className="list-decimal">
        {todos.length > 0 ? (
          todos.map((t) => <li key={t.id}>{t.text}</li>)
        ) : (
          <h1>No previous todos</h1>
        )}
      </ul>
    </main>
  );
};

export default RealtimeTodo;
