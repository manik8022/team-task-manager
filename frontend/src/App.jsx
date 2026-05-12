import React, { useState } from "react";
import {
  LayoutDashboard,
  ClipboardList,
  User,
  LogOut,
  Search,
  Moon,
  Sun,
  CheckCircle2,
  Clock3,
  AlertTriangle,
  ListTodo
} from "lucide-react";

export default function App() {

  const [darkMode, setDarkMode] = useState(false);

  const tasks = [
    {
      id: 1,
      title: "Design Homepage",
      assigned: "John Doe",
      status: "Completed",
      due: "20 May 2024"
    },
    {
      id: 2,
      title: "Build API Endpoints",
      assigned: "Jane Smith",
      status: "Pending",
      due: "25 May 2024"
    },
    {
      id: 3,
      title: "Fix UI Bugs",
      assigned: "Mike Johnson",
      status: "Overdue",
      due: "15 May 2024"
    },
    {
      id: 4,
      title: "Write Documentation",
      assigned: "Emily Davis",
      status: "Pending",
      due: "30 May 2024"
    }
  ];

  const getStatusClass = (status) => {

    if(status === "Completed")
      return "status completed";

    if(status === "Pending")
      return "status pending";

    return "status overdue";
  };

  return (

    <div className={darkMode ? "app dark" : "app"}>

      {/* SIDEBAR */}

      <aside className="sidebar">

        <div>

          <div className="logo">

            <div className="logo-icon">
              ✓
            </div>

            <h2>Team Task Manager</h2>

          </div>

          <nav className="menu">

            <div className="menu-item active">
              <LayoutDashboard size={20}/>
              Dashboard
            </div>

            <div className="menu-item">
              <ClipboardList size={20}/>
              Tasks
            </div>

            <div className="menu-item">
              <User size={20}/>
              Profile
            </div>

          </nav>

        </div>

        <div className="logout">
          <LogOut size={20}/>
          Logout
        </div>

      </aside>

      {/* MAIN */}

      <main className="main">

        {/* HEADER */}

        <div className="header">

          <div>

            <h1>
              Welcome back, Admin! 👋
            </h1>

            <p>
              Here's what's happening with your tasks today.
            </p>

          </div>

          <div className="header-right">

            <button
              className="theme-btn"
              onClick={() =>
                setDarkMode(!darkMode)
              }
            >

              {darkMode
                ? <Sun size={18}/>
                : <Moon size={18}/>
              }

              {darkMode
                ? "Light Mode"
                : "Dark Mode"}

            </button>

            <div className="profile">

              <div className="avatar">
                A
              </div>

              <span>Admin</span>

            </div>

          </div>

        </div>

        {/* STATS */}

        <div className="stats-grid">

          <div className="stat-card">

            <div className="icon blue">
              <ListTodo/>
            </div>

            <div>

              <h3>Total Tasks</h3>

              <h2>12</h2>

              <p>All assigned tasks</p>

            </div>

          </div>

          <div className="stat-card">

            <div className="icon green">
              <CheckCircle2/>
            </div>

            <div>

              <h3>Completed</h3>

              <h2>5</h2>

              <p>Tasks completed</p>

            </div>

          </div>

          <div className="stat-card">

            <div className="icon yellow">
              <Clock3/>
            </div>

            <div>

              <h3>Pending</h3>

              <h2>4</h2>

              <p>Tasks in progress</p>

            </div>

          </div>

          <div className="stat-card">

            <div className="icon red">
              <AlertTriangle/>
            </div>

            <div>

              <h3>Overdue</h3>

              <h2>3</h2>

              <p>Tasks past due date</p>

            </div>

          </div>

        </div>

        {/* CONTENT */}

        <div className="content-grid">

          {/* CREATE TASK */}

          <div className="card">

            <h2>Create Task</h2>

            <div className="form-group">

              <label>Task Title</label>

              <input
                type="text"
                placeholder="Enter task title"
              />

            </div>

            <div className="form-group">

              <label>Due Date</label>

              <input type="date"/>

            </div>

            <div className="form-group">

              <label>Assign To</label>

              <select>

                <option>
                  Select member
                </option>

                <option>
                  John Doe
                </option>

                <option>
                  Jane Smith
                </option>

              </select>

            </div>

            <button className="create-btn">
              Create Task
            </button>

          </div>

          {/* TABLE */}

          <div className="card">

            <div className="table-top">

              <h2>Tasks</h2>

              <div className="search">

                <Search size={18}/>

                <input
                  type="text"
                  placeholder="Search tasks..."
                />

              </div>

            </div>

            <div className="table-wrapper">

              <table>

                <thead>

                  <tr>
                    <th>Title</th>
                    <th>Assigned To</th>
                    <th>Status</th>
                    <th>Due Date</th>
                    <th>Action</th>
                  </tr>

                </thead>

                <tbody>

                  {tasks.map((task) => (

                    <tr key={task.id}>

                      <td>{task.title}</td>

                      <td>{task.assigned}</td>

                      <td>

                        <span
                          className={
                            getStatusClass(
                              task.status
                            )
                          }
                        >
                          {task.status}
                        </span>

                      </td>

                      <td>{task.due}</td>

                      <td>

                        {task.status !==
                          "Completed" && (

                          <button
                            className="complete-btn"
                          >
                            Complete
                          </button>

                        )}

                      </td>

                    </tr>

                  ))}

                </tbody>

              </table>

            </div>

          </div>

        </div>

      </main>

    </div>
  );
}