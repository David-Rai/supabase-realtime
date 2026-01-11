import React from "react";
import supabase from "@/config/supabase";
import { Button } from "@/components/ui/button";
import { useRef, useState, useEffect } from "react";

const Home = () => {
  const roomNameRef = useRef(null);
  const channelRef = useRef(null);

  //**********Adding new todo to supabase*********
  const handleAdd = async () => {
    if (!channelRef.current) return;

    const room_name = roomNameRef.current.value;
    if (room_name === null || !room_name) return;
    console.log("creating this room", room_name);

    //Saving into the DB
    const res=await supabase.from("rooms").insert({creater_id,roomName})

    channelRef.current.send({
      type: "broadcast",
      event: "message",
      payload: { text },
    });
  };

//******Joinging default room chat-1 and listening for the event-message**** */
  useEffect(() => {
    channelRef.current = supabase.channel("chat-1");
    console.log("channel established",channelRef.current)
    channelRef.current
      .on(
        "broadcast",
        {
          event: "message",
        },
        (payload) => console.log(payload)
      )
      .subscribe();

    return () => {
      supabase.removeAllChannels();
    };

  }, []);

  return (
    <main className="flex items-center flex-col justify-center h-screen w-full">
      <div className="flex flex-col items-center justify-center gap-2 mt-4 w-[80%]">
        <input
          type="text"
          className="border-1 rounded-md h-full px-4 py-2 w-full"
          placeholder="Enter room name"
          ref={roomNameRef}
        />
        <Button className="w-full" onClick={handleAdd}>
          Add
        </Button>
      </div>
    </main>
  );
};

export default Home;
