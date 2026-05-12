import { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";

function App() {

  const [data, setData] = useState({
    username: "",
    password: ""
  });

  const [dashboard, setDashboard] = useState(null);

  const [tasks, setTasks] = useState([]);

  const [role, setRole] = useState("");

  const [newTask, setNewTask] = useState({
    title: "",
    due_date: "",
    assigned_to: 1
  });

  const BASE_URL =
    "https://team-task-manager-backend-gp2v.onrender.com";

  const login = async () => {

    try {

      const res = await axios.post(
        `${BASE_URL}/login`,
        data
      );

      localStorage.setItem(
        "token",
        res.data.token
      );

      localStorage.setItem(
        "role",
        res.data.role
      );

      setRole(res.data.role);

      await getDashboard(res.data.token);

      await getTasks(res.data.token);

    } catch (error) {

      console.log(error);

      alert("Login Failed");

    }
  };

  const logout = () => {

    localStorage.clear();

    setDashboard(null);

    setTasks([]);

  };

  const getDashboard = async (customToken = null) => {

    try {

      const token =
        customToken ||
        localStorage.getItem("token");

      const res = await axios.get(
        `${BASE_URL}/dashboard`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      setDashboard(res.data);

    } catch (error) {

      console.log(error);

    }
  };

  const getTasks = async (customToken = null) => {

    try {

      const token =
        customToken ||
        localStorage.getItem("token");

      const res = await axios.get(
        `${BASE_URL}/tasks`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      setTasks(res.data);

    } catch (error) {

      console.log(error);

    }
  };

  const createTask = async () => {

    try {

      await axios.post(
        `${BASE_URL}/tasks`,
        {
          ...newTask,
          assigned_to: 1
        },
        {
          headers: {
            Authorization:
              `Bearer ${localStorage.getItem("token")}`
          }
        }
      );

      alert("Task Created");

      getTasks();

      getDashboard();

    } catch (error) {

      console.log(error);

    }
  };

  const updateStatus = async (id) => {

    try {

      await axios.put(
        `${BASE_URL}/tasks/${id}`,
        {
          status: "Completed"
        },
        {
          headers: {
            Authorization:
              `Bearer ${localStorage.getItem("token")}`
          }
        }
      );

      getTasks();

      getDashboard();

    } catch (error) {

      console.log(error);

    }
  };

  useEffect(() => {

    const token =
      localStorage.getItem("token");

    if(token) {

      setRole(
        localStorage.getItem("role")
      );

      getDashboard();

      getTasks();
    }

  }, []);

  return (
    <div className="container">

      <h1>Team Task Manager</h1>

      {!dashboard ? (

        <div className="card">

          <input
            type="text"
            placeholder="Username"
            onChange={(e) =>
              setData({
                ...data,
                username: e.target.value
              })
            }
          />

          <input
            type="password"
            placeholder="Password"
            onChange={(e) =>
              setData({
                ...data,
                password: e.target.value
              })
            }
          />

          <button onClick={login}>
            Login
          </button>

        </div>

      ) : (

        <div>

          <h2>{role.toUpperCase()} Dashboard</h2>

          <div className="dashboard-grid">

            <div className="stat-card">
              <h3>Total Tasks</h3>
              <p>{dashboard.total_tasks}</p>
            </div>

            <div className="stat-card">
              <h3>Completed</h3>
              <p>{dashboard.completed}</p>
            </div>

            <div className="stat-card">
              <h3>Pending</h3>
              <p>{dashboard.pending}</p>
            </div>

            <div className="stat-card">
              <h3>Overdue</h3>
              <p>{dashboard.overdue}</p>
            </div>

          </div>

          {role === "admin" && (

            <div className="card">

              <h3>Create Task</h3>

              <input
                type="text"
                placeholder="Task Title"
                onChange={(e) =>
                  setNewTask({
                    ...newTask,
                    title: e.target.value
                  })
                }
              />

              <input
                type="date"
                onChange={(e) =>
                  setNewTask({
                    ...newTask,
                    due_date: e.target.value
                  })
                }
              />

              <button onClick={createTask}>
                Create Task
              </button>

            </div>
          )}

          <h3>Tasks</h3>

          {tasks.map((task) => (

            <div
              className={`card ${
                task.status === "Completed"
                  ? "task-completed"
                  : "task-pending"
              }`}
              key={task.id}
            >

              <p>
                <b>Title:</b> {task.title}
              </p>

              <p>
                <b>Status:</b>{" "}

                <span
                  className={`status ${
                    task.status === "Completed"
                      ? "completed"
                      : task.status === "Overdue"
                      ? "overdue"
                      : "pending"
                  }`}
                >
                  {task.status}
                </span>
              </p>

              <p>
                <b>Due:</b> {task.due_date}
              </p>

              {task.status !== "Completed" && (

                <button
                  onClick={() =>
                    updateStatus(task.id)
                  }
                >
                  Mark Completed
                </button>

              )}

            </div>

          ))}

          <button
            className="logout-btn"
            onClick={logout}
          >
            Logout
          </button>

        </div>

      )}

    </div>
  );
}

export default App;