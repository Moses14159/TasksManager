import React from 'react';
import './Statistics.css';

function Statistics({ tasks }) {
  // 计算总任务数
  const totalTasks = tasks.length;
  
  // 计算已完成任务数
  const completedTasks = tasks.filter(task => task.completed).length;
  
  // 计算完成率
  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
  
  // 计算总番茄钟数
  const totalPomodoros = tasks.reduce((sum, task) => sum + task.pomodoros.length, 0);
  
  // 计算今日番茄钟数
  const today = new Date().toISOString().split('T')[0];
  const todayPomodoros = tasks.reduce((sum, task) => {
    const todayPoms = task.pomodoros.filter(pom => 
      pom.timestamp.split('T')[0] === today
    ).length;
    return sum + todayPoms;
  }, 0);
  
  // 计算本周番茄钟数
  const getWeekStart = (date) => {
    const d = new Date(date);
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1); // 调整为周一为一周的开始
    return new Date(d.setDate(diff)).toISOString().split('T')[0];
  };
  
  const weekStart = getWeekStart(new Date());
  const weekPomodoros = tasks.reduce((sum, task) => {
    const weekPoms = task.pomodoros.filter(pom => {
      const pomDate = pom.timestamp.split('T')[0];
      return pomDate >= weekStart && pomDate <= today;
    }).length;
    return sum + weekPoms;
  }, 0);
  
  return (
    <div className="statistics-container">
      <h2>统计信息</h2>
      
      <div className="stats-grid">
        <div className="stat-card">
          <h3>任务完成率</h3>
          <div className="completion-bar-container">
            <div 
              className="completion-bar" 
              style={{ width: `${completionRate}%` }}
            ></div>
          </div>
          <p className="completion-text">{completionRate}% ({completedTasks}/{totalTasks})</p>
        </div>
        
        <div className="stat-card">
          <h3>番茄钟统计</h3>
          <div className="pomodoro-stats">
            <div className="pomodoro-stat-item">
              <span className="stat-label">今日番茄钟:</span>
              <span className="stat-value">{todayPomodoros}</span>
            </div>
            <div className="pomodoro-stat-item">
              <span className="stat-label">本周番茄钟:</span>
              <span className="stat-value">{weekPomodoros}</span>
            </div>
            <div className="pomodoro-stat-item">
              <span className="stat-label">总番茄钟:</span>
              <span className="stat-value">{totalPomodoros}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Statistics;