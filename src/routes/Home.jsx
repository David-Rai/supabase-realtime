import React from "react";
import { useNavigate } from "react-router";

const Home = () => {
  const navigate = useNavigate();

  return (
    <main className="h-screen w-full flex flex-col items-center justify-center">
      <h1 className="text-2xl my-4">Practise project for Realtime features with supabase</h1>

      {/* All methods */}
      <section className="flex flex-col justify-start">
        <div
          className="underline text-blue-600 cursor-pointer"
          onClick={() => navigate("/postgreschanges")}
        >
         1. Postgres changes
        </div>
         <div
          className="underline text-blue-600 cursor-pointer"
          onClick={() => navigate("/broadcast")}
        >
         2. Broadcast messages
        </div>
      </section>
    </main>
  );
};

export default Home;
