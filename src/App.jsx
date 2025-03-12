import React, { useState, useEffect } from 'react';
import TaskList from './components/TaskList';
import TaskForm from './components/TaskForm';
import PomodoroTimer from './components/PomodoroTimer';
import Statistics from './components/Statistics';
import './App.css';

function App() {
  // 从本地存储加载任务
  const loadTasks = () => {
    const savedTasks = localStorage.getItem('tasks');
    if (savedTasks) {
      return JSON.parse(savedTasks);
    }
    return [];
  };

  const [tasks, setTasks] = useState(loadTasks());
  const [currentTask, setCurrentTask] = useState(null);
  const [editingTask, setEditingTask] = useState(null);

  // 当任务变化时保存到本地存储
  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks]);

  // 添加新任务
  const addTask = (task) => {
    const newTask = {
      ...task,
      id: Date.now().toString(),
      completed: false,
      pomodoros: [],
      createdAt: new Date().toISOString()
    };
    setTasks([...tasks, newTask]);
  };

  // 更新任务
  const updateTask = (updatedTask) => {
    setTasks(tasks.map(task => 
      task.id === updatedTask.id ? { ...task, ...updatedTask } : task
    ));
    setEditingTask(null);
  };

  // 删除任务
  const deleteTask = (taskId) => {
    setTasks(tasks.filter(task => task.id !== taskId));
    if (currentTask && currentTask.id === taskId) {
      setCurrentTask(null);
    }
    if (editingTask && editingTask.id === taskId) {
      setEditingTask(null);
    }
  };

  // 完成任务
  const toggleTaskCompletion = (taskId) => {
    setTasks(tasks.map(task => 
      task.id === taskId ? { ...task, completed: !task.completed } : task
    ));
  };

  // 选择当前任务进行番茄钟计时
  const selectTaskForPomodoro = (task) => {
    setCurrentTask(task);
  };

  // 记录番茄钟完成
  const recordPomodoro = (taskId, duration) => {
    const now = new Date().toISOString();
    setTasks(tasks.map(task => 
      task.id === taskId ? 
      { 
        ...task, 
        pomodoros: [...task.pomodoros, { timestamp: now, duration }]
      } : task
    ));
  };

  // 编辑任务
  const editTask = (task) => {
    setEditingTask(task);
  };

  return (
    <div className="app-container">
      <header className="app-header">
        <h1>任务管理 + 番茄钟</h1>
      </header>
      
      <main className="app-main">
        <div className="task-management">
          <TaskForm 
            onSubmit={editingTask ? updateTask : addTask} 
            initialTask={editingTask} 
            onCancel={() => setEditingTask(null)}
          />
          <TaskList 
            tasks={tasks} 
            onDelete={deleteTask} 
            onToggleComplete={toggleTaskCompletion}
            onEdit={editTask}
            onSelect={selectTaskForPomodoro}
            currentTaskId={currentTask?.id}
          />
        </div>
        
        <div className="pomodoro-section">
          <PomodoroTimer 
            currentTask={currentTask} 
            onComplete={recordPomodoro} 
          />
          <Statistics tasks={tasks} />
        </div>
      </main>
    </div>
  );
}

export default App;