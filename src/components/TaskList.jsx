import React from 'react';
import { FaTrash, FaEdit, FaCheck, FaClock } from 'react-icons/fa';
import './TaskList.css';

function TaskList({ tasks, onDelete, onToggleComplete, onEdit, onSelect, currentTaskId }) {
  // 按优先级和完成状态排序任务
  const sortedTasks = [...tasks].sort((a, b) => {
    // 首先按完成状态排序
    if (a.completed !== b.completed) {
      return a.completed ? 1 : -1;
    }
    
    // 然后按优先级排序
    const priorityOrder = { high: 1, medium: 2, low: 3 };
    return priorityOrder[a.priority] - priorityOrder[b.priority];
  });

  // 获取优先级对应的类名
  const getPriorityClass = (priority) => {
    switch (priority) {
      case 'high': return 'priority-high';
      case 'medium': return 'priority-medium';
      case 'low': return 'priority-low';
      default: return '';
    }
  };

  // 获取优先级对应的中文名称
  const getPriorityName = (priority) => {
    switch (priority) {
      case 'high': return '高';
      case 'medium': return '中';
      case 'low': return '低';
      default: return '';
    }
  };

  return (
    <div className="task-list-container">
      <h2>任务列表</h2>
      
      {sortedTasks.length === 0 ? (
        <div className="empty-list">暂无任务，请添加新任务</div>
      ) : (
        <ul className="task-list">
          {sortedTasks.map(task => (
            <li 
              key={task.id} 
              className={`task-item ${task.completed ? 'completed' : ''} ${currentTaskId === task.id ? 'current' : ''}`}
            >
              <div className="task-header">
                <div className="task-title-container">
                  <span 
                    className={`priority-indicator ${getPriorityClass(task.priority)}`} 
                    title={`优先级: ${getPriorityName(task.priority)}`}
                  ></span>
                  <h3 className="task-title">{task.title}</h3>
                </div>
                
                <div className="task-actions">
                  <button 
                    onClick={() => onToggleComplete(task.id)} 
                    className="action-btn complete-btn"
                    title={task.completed ? "标记为未完成" : "标记为已完成"}
                  >
                    <FaCheck />
                  </button>
                  
                  <button 
                    onClick={() => onEdit(task)} 
                    className="action-btn edit-btn"
                    title="编辑任务"
                  >
                    <FaEdit />
                  </button>
                  
                  <button 
                    onClick={() => onDelete(task.id)} 
                    className="action-btn delete-btn"
                    title="删除任务"
                  >
                    <FaTrash />
                  </button>
                </div>
              </div>
              
              {task.description && (
                <p className="task-description">{task.description}</p>
              )}
              
              <div className="task-footer">
                <div className="task-stats">
                  <span className="pomodoro-count">
                    已完成番茄: {task.pomodoros.length} / {task.estimatedPomodoros}
                  </span>
                </div>
                
                {!task.completed && (
                  <button 
                    onClick={() => onSelect(task)} 
                    className={`select-task-btn ${currentTaskId === task.id ? 'selected' : ''}`}
                    disabled={currentTaskId === task.id}
                  >
                    <FaClock /> {currentTaskId === task.id ? '当前进行中' : '开始番茄钟'}
                  </button>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default TaskList;