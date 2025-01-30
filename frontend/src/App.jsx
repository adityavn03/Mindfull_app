import { useState, useEffect } from "react";
import "./index.css";


function App() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [userId, setUserId] = useState(null);
  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [habitName, setHabitName] = useState("");
  const [habits, setHabits] = useState([]);

  const registerUser = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/users/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();
      if (res.ok) {
        alert(`User registered successfully! Your ID: ${data.userId}`);
        setUserId(data.userId);
        setUserName(name);
        setUserEmail(email);
        fetchHabits();
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error("Registration error:", error);
    }
  };

  const addHabit = async () => {
    if (userId) return alert("Please register first!");


    const tempHabit = { habitName, _id: Date.now(), completed: false };
    setHabits([...habits, tempHabit]);

    try {
      const res = await fetch("http://localhost:5000/api/habits", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, habitName }),
      });

      if (!res.ok) {
        const errorData = await res.json();
      }

      setHabitName("");
      fetchHabits();
    } catch (error) {
      console.error("Error adding habit:", error);
    }
  };

  const fetchHabits = async () => {
    if (!userId) return;
    try {
      const res = await fetch(`http://localhost:5000/api/habits/${userId}`);
      const data = await res.json();
      setHabits(data);
    } catch (error) {
      console.error("Error fetching habits:", error);
    }
  };

  const toggleHabit = async (id) => {
    setHabits((prevHabits) =>
      prevHabits.map((habit) =>
        habit._id === id ? { ...habit, completed: !habit.completed } : habit
      )
    );

    try {
      await fetch(`http://localhost:5000/api/habits/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          completed: !habits.find((habit) => habit._id === id).completed,
        }),
      });

      fetchHabits(); 
    } catch (error) {
      console.error("Error updating habit:", error);
    }
  };

  const deleteHabit = async (id) => {
    setHabits((prevHabits) => prevHabits.filter((habit) => habit._id !== id));

    try {
      await fetch(`http://localhost:5000/api/habits/${id}`, { method: "DELETE" });
    } catch (error) {
      console.error("Error deleting habit:", error);
    }
  };

  useEffect(() => {
    fetchHabits();
  }, [userId]);

  return (
    <div style={{ padding: "20px", maxWidth: "500px", margin: "auto" }}>
      <h2>Register</h2>
      <input type="text" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} />
      <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
      <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
      <button onClick={registerUser}>Register</button>

      {userId && (
        <div style={{ marginTop: "20px" }}>
          <h3>Welcome, {userName}!</h3>
          <p>Email: {userEmail}</p>
        </div>
      )}

      <h2>Habits</h2>
      <input type="text" placeholder="New Habit" value={habitName} onChange={(e) => setHabitName(e.target.value)} />
      <button onClick={addHabit}>Add MindFull</button>

      <ul>
        {habits.map((habit) => (
          <li key={habit._id} style={{ textDecoration: habit.completed ? "line-through" : "none" }}>
            {habit.habitName}
            <button onClick={() => toggleHabit(habit._id)}>✔</button>
            <button onClick={() => deleteHabit(habit._id)}>❌</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
