import { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";

function App() {

  const [data, setData] = useState({
    username: "",
    password: ""
  });

  const [dashboard, setDashboard] = useState(null);

  const login = async () => {

    try {

      const res = await axios.post(
        "http://127.0.0.1:5000/login",
        data
      );

      localStorage.setItem(
        "token",
        res.data.token
      );

      alert("Login Successful");

      getDashboard();

    } catch (error) {

      alert("Login Failed");

    }
  };

  const logout = () => {

    localStorage.removeItem("token");

    setDashboard(null);

  };

  const getDashboard = async () => {

    try {

      const res = await axios.get(
        "http://127.0.0.1:5000/dashboard",
        {
          headers: {
            Authorization:
              `Bearer ${localStorage.getItem("token")}`
          }
        }
      );

      setDashboard(res.data);

    } catch (error) {

      console.log(error);

    }
  };

  useEffect(() => {

    if(localStorage.getItem("token")) {
      getDashboard();
    }

  }, []);

  return (
    <div className="container">

      <h1>Team Task Manager</h1>

      {!dashboard ? (

        <>
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
        </>

      ) : (

        <div>

          <h2>Dashboard</h2>

          <div className="card">
            Total Tasks: {dashboard.total_tasks}
          </div>

          <div className="card">
            Completed: {dashboard.completed}
          </div>

          <div className="card">
            Pending: {dashboard.pending}
          </div>

          <div className="card">
            Overdue: {dashboard.overdue}
          </div>

          <button onClick={logout}>
            Logout
          </button>

        </div>

      )}

    </div>
  );
}

export default App;