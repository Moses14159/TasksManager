import React, { useState, useEffect } from 'react';
import './TaskForm.css';

function TaskForm({ onSubmit, initialTask, onCancel }) {
  const [task, setTask] = useState({
    title: '',
    description: '',
    priority: 'medium',
    estimatedPomodoros: 1
  });

  // 当initialTask变化时更新表单
  useEffect(() => {
    if (initialTask) {
      setTask({
        title: initialTask.title || '',
        description: initialTask.description || '',
        priority: initialTask.priority || 'medium',
        estimatedPomodoros: initialTask.estimatedPomodoros || 1,
        id: initialTask.id
      });
    } else {
      setTask({
        title: '',
        description: '',
        priority: 'medium',
        estimatedPomodoros: 1
      });
    }
  }, [initialTask]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTask(prev => ({
      ...prev,
      [name]: name === 'estimatedPomodoros' ? parseInt(value, 10) || 1 : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!task.title.trim()) return;
    
    onSubmit(task);
    
    // 如果不是编辑模式，则重置表单
    if (!initialTask) {
      setTask({
        title: '',
        description: '',
        priority: 'medium',
        estimatedPomodoros: 1
      });
    }
  };

  return (
    <div className="task-form-container">
      <h2>{initialTask ? '编辑任务' : '添加新任务'}</h2>
      <form onSubmit={handleSubmit} className="task-form">
        <div className="form-group">
          <label htmlFor="title">任务名称</label>
          <input
            type="text"
            id="title"
            name="title"
            value={task.title}
            onChange={handleChange}
            placeholder="输入任务名称"
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="description">任务描述</label>
          <textarea
            id="description"
            name="description"
            value={task.description}
            onChange={handleChange}
            placeholder="输入任务描述（可选）"
            rows="3"
          />
        </div>
        
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="priority">优先级</label>
            <select
              id="priority"
              name="priority"
              value={task.priority}
              onChange={handleChange}
            >
              <option value="high">高</option>
              <option value="medium">中</option>
              <option value="low">低</option>
            </select>
          </div>
          
          <div className="form-group">
            <label htmlFor="estimatedPomodoros">预计番茄数</label>
            <input
              type="number"
              id="estimatedPomodoros"
              name="estimatedPomodoros"
              value={task.estimatedPomodoros}
              onChange={handleChange}
              min="1"
              max="10"
            />
          </div>
        </div>
        
        <div className="form-actions">
          {initialTask && (
            <button type="button" onClick={onCancel} className="cancel-btn">
              取消
            </button>
          )}
          <button type="submit" className="submit-btn">
            {initialTask ? '更新' : '添加'}
          </button>
        </div>
      </form>
    </div>
  );
}

export default TaskForm;