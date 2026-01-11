# Supabase Realtime features

- Postgres changes(INSERT,UPDATE,DELETE)
- Presense (Realtime sync)
- Boardcast from Database

## 1. Postgres changes

```bash

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
```

# 2. BroadCast

- Send low-latency messages using the client libs, REST, or your Database

## Creating the broadcast channels and receiving

```bash
  //******Creating broadcast channel**** */
  useEffect(() => {
    const mychannel = supabase.channel("demo");

    mychannel.on(
      "broadcast",
      {
        event: "message",
      },
      (payload) => console.log(payload)
    ).subscribe

    return () => {
      supabase.removeAllChannels();
    };
  }, []);
```

## Sending via broadcast

```bash
    //Sending event via broadcast
    mychannel.current.send({
      type: "broadcast",
      event: "message",
      payload: { message: "hey badar" },
    })
```
