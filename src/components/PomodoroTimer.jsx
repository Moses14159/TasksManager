import React, { useState, useEffect, useRef } from 'react';
import { FaPlay, FaPause, FaUndo } from 'react-icons/fa';
import './PomodoroTimer.css';

function PomodoroTimer({ currentTask, onComplete }) {
  // 番茄钟状态
  const [timeLeft, setTimeLeft] = useState(25 * 60); // 默认25分钟
  const [isActive, setIsActive] = useState(false);
  const [isBreak, setIsBreak] = useState(false);
  const [cycles, setCycles] = useState(0);
  
  // 音频引用
  const alarmSound = useRef(null);
  
  // 当前任务变化时重置计时器
  useEffect(() => {
    resetTimer();
  }, [currentTask]);
  
  // 计时器逻辑
  useEffect(() => {
    let interval = null;
    
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(timeLeft => timeLeft - 1);
      }, 1000);
    } else if (isActive && timeLeft === 0) {
      // 播放提示音
      if (alarmSound.current) {
        alarmSound.current.play();
      }
      
      // 计时结束逻辑
      if (!isBreak) {
        // 工作时间结束，记录番茄钟并开始休息
        if (currentTask) {
          onComplete(currentTask.id, 25); // 记录25分钟的番茄钟
        }
        setIsBreak(true);
        setTimeLeft(5 * 60); // 5分钟休息时间
      } else {
        // 休息时间结束，开始新的工作周期
        setIsBreak(false);
        setTimeLeft(25 * 60);
        setCycles(cycles => cycles + 1);
      }
    }
    
    return () => clearInterval(interval);
  }, [isActive, timeLeft, isBreak, currentTask, onComplete]);
  
  // 开始/暂停计时器
  const toggleTimer = () => {
    if (!currentTask && !isActive) return; // 如果没有选择任务且计时器未启动，则不执行任何操作
    setIsActive(!isActive);
  };
  
  // 重置计时器
  const resetTimer = () => {
    setIsActive(false);
    setIsBreak(false);
    setTimeLeft(25 * 60);
  };
  
  // 格式化时间显示
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };
  
  return (
    <div className={`pomodoro-container ${isBreak ? 'break-mode' : ''}`}>
      <h2>番茄钟</h2>
      
      <div className="timer-display">
        <div className="time">{formatTime(timeLeft)}</div>
        <div className="status">{isBreak ? '休息时间' : '工作时间'}</div>
      </div>
      
      <div className="task-info">
        {currentTask ? (
          <div className="current-task">
            <h3>当前任务:</h3>
            <p>{currentTask.title}</p>
          </div>
        ) : (
          <div className="no-task">请从任务列表中选择一个任务</div>
        )}
      </div>
      
      <div className="timer-controls">
        <button 
          onClick={toggleTimer} 
          className={`control-btn ${isActive ? 'pause' : 'play'}`}
          disabled={!currentTask && !isActive}
        >
          {isActive ? <FaPause /> : <FaPlay />}
          {isActive ? '暂停' : '开始'}
        </button>
        
        <button onClick={resetTimer} className="control-btn reset">
          <FaUndo />
          重置
        </button>
      </div>
      
      <div className="cycle-info">
        <span>已完成周期: {cycles}</span>
      </div>
      
      {/* 音频元素 */}
      <audio ref={alarmSound} preload="auto">
        <source src="https://assets.mixkit.co/sfx/preview/mixkit-alarm-digital-clock-beep-989.mp3" type="audio/mpeg" />
        您的浏览器不支持音频元素
      </audio>
    </div>
  );
}

export default PomodoroTimer;