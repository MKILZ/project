import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabase/supabaseClient";

export default function Leaderboard() {
  const [entries, setEntries] = useState([]);
  const navigate = useNavigate();

  // Fetch leaderboard data from Supabase
  useEffect(() => {
    async function fetchLeaderboard() {
      const { data, error } = await supabase
        .from("leaderboard")
        .select("*")
        .order("score", { ascending: true })
        .limit(5); // Only show top 5

      if (error) console.error("Error fetching leaderboard:", error);
      else setEntries(data);
    }

    fetchLeaderboard();
  }, []);

  return (
    <div className="container mt-5 position-relative d-flex justify-content-center">
      {/* Top-left back button */}
      <button
        onClick={() => navigate("/")}
        className="btn btn-secondary position-absolute"
        style={{ top: "10px", left: "10px", backgroundColor: "#6c757d" }}
      >
        ← Home
      </button>

      {/* Main content box */}
      <div
        className="p-5 rounded text-center"
        style={{ backgroundColor: "white", maxWidth: "900px", width: "100%" }}
      >
        <h1 className="mb-4 display-4">All-Time Leaderboard</h1>
        <p className="lead mb-5">Top teams with the lowest scores</p>

        <table className="table table-bordered fs-5">
          <thead className="thead-light">
            <tr>
              <th scope="col">#</th>
              <th scope="col">Players</th>
              <th scope="col">Score</th>
            </tr>
          </thead>
          <tbody>
            {entries.map((entry, index) => (
              <tr key={entry.id}>
                <td className="fw-bold">{index + 1}</td>
                <td>
                  <strong>
                    {entry.player1_name}, {entry.player2_name},{" "}
                    {entry.player3_name}, {entry.player4_name}
                  </strong>
                </td>
                <td className="fw-bold">{entry.score}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
