import { useState, useEffect } from "react";

function App() {
  const [tasks, setTasks] = useState("");
  const [notes, setNotes] = useState("");
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    try {
      const res = await fetch("http://127.0.0.1:8000/logs");
      if (res.ok) {
        const data = await res.json();
        setLogs(data.logs);
      }
    } catch (error) {
      console.error("Failed to fetch logs:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Split tasks by newline and filter out empty lines
    const completedTasks = tasks.split('\n').filter(task => task.trim() !== '');

    const res = await fetch("http://127.0.0.1:8000/log", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        completed_tasks: completedTasks,
        notes: notes || null
      }),
    });

    if (res.ok) {
      alert("Log submitted!");
      setTasks(""); // Clear the tasks input
      setNotes(""); // Clear the notes input
      fetchLogs(); // Refresh the logs after submission
    } else {
      alert("Failed to submit log.");
    }
  };

  return (
    <div style={{ padding: "2rem" }}>
      <h1>Accountability Log</h1>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: "1rem" }}>
          <label htmlFor="tasks" style={{ display: "block", marginBottom: "0.5rem" }}>
            Completed Tasks (one per line):
          </label>
          <textarea
            id="tasks"
            value={tasks}
            onChange={(e) => setTasks(e.target.value)}
            placeholder="Enter your completed tasks, one per line"
            rows={5}
            cols={50}
            style={{ width: "100%", maxWidth: "500px" }}
          />
        </div>
        
        <div style={{ marginBottom: "1rem" }}>
          <label htmlFor="notes" style={{ display: "block", marginBottom: "0.5rem" }}>
            Additional Notes:
          </label>
          <textarea
            id="notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Any additional notes or reflections"
            rows={3}
            cols={50}
            style={{ width: "100%", maxWidth: "500px" }}
          />
        </div>

        <button 
          type="submit" 
          style={{ 
            marginTop: "1rem",
            padding: "0.5rem 1rem",
            backgroundColor: "#007bff",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer"
          }}
        >
          Submit Log
        </button>
      </form>

      <div style={{ marginTop: "2rem" }}>
        <h2>Previous Logs</h2>
        {logs.length === 0 ? (
          <p>No logs found.</p>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            {logs.map((log, index) => (
              <div 
                key={index}
                style={{
                  padding: "1rem",
                  border: "1px solid #ddd",
                  borderRadius: "4px",
                  backgroundColor: "#00000"
                }}
              >
                <h3 style={{ margin: "0 0 0.5rem 0" }}>Date: {log.date}</h3>
                <div>
                  <strong>Completed Tasks:</strong>
                  <ul style={{ margin: "0.5rem 0" }}>
                    {log.completed_tasks.map((task, taskIndex) => (
                      <li key={taskIndex}>{task}</li>
                    ))}
                  </ul>
                </div>
                {log.notes && (
                  <div>
                    <strong>Notes:</strong>
                    <p style={{ margin: "0.5rem 0" }}>{log.notes}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
