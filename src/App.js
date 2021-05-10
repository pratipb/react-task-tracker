import { useState, useEffect } from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";
import About from "./components/About";
import AddTask from "./components/AddTask";
import Footer from "./components/Footer";
import Header from "./components/Header";
import Tasks from "./components/Tasks";

function App() {
  const [showAddTask, setShowAddTask] = useState(false);
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    const fetchTasks = async () => {
      const tasksFromServer = await getTasks();
      setTasks(tasksFromServer);
    }
    fetchTasks();
  }, [])

  // Get tasks
  const getTasks = async () => {
    const res = await fetch('http://localhost:5000/tasks');
    const data = await res.json();
    return data;
  }

  // Get single task
  const getTask = async (id) => {
    const res = await fetch(`http://localhost:5000/tasks/${id}`);
    const data = await res.json();
    return data;
  }

  // Add task
  const addTask = async (task) => {
    const res = await fetch('http://localhost:5000/tasks', {
      method: 'POST',
      headers: {
        'Content-type': 'application/json'
      },
      body: JSON.stringify(task)
    });

    const data = await res.json();

    setTasks([...tasks, data]);

    // const id = Math.floor(Math.random() * 10000) + 1;

    // const newTask = { id, ...task };
    // setTasks([...tasks, newTask]);
  }

  // Delete task
  const deleteTask = async (id) => {
    await fetch(`http://localhost:5000/tasks/${id}`, {
      method: 'DELETE'
    });

    setTasks(tasks.filter((task) => task.id !== id));
  }

  //Toggle Reminder
  const toggleReminder = async (id) => {
    const taskToToggle = await getTask(id);
    const updatedTask = { ...taskToToggle, reminder: !taskToToggle.reminder };

    const res = await fetch(`http://localhost:5000/tasks/${id}`, {
      method: 'PUT',
      headers: {
        'Content-type': 'application/json',
      },
      body: JSON.stringify(updatedTask)
    });

    const data = await res.json();

    setTasks(tasks.map(task => task.id === id ? { ...task, reminder: data.reminder } : task));
  }

  //Toggle showtask
  const toggleShowTask = () => { setShowAddTask(!showAddTask); }

  return (
    <Router>
      <div className="container">
        <Header title="Task Tracker" onToggleShowTask={toggleShowTask} shouldShow={showAddTask} />

        <Route path="/" exact render={(props) => (
          <>
            {showAddTask ? <AddTask onAdd={addTask} /> : ''}
            {tasks.length ? <Tasks tasks={tasks} onDelete={deleteTask} onToggle={toggleReminder} /> : 'No Tasks To Show'}
          </>
        )} />
        <Route path="/about" component={About} />
        <Footer />
      </div>
    </Router>
  );
}

export default App;
