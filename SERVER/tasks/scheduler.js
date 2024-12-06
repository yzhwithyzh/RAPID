const taskService = require('@services/taskService');

const startScheduler = async () => {
  const scheduler = async () => {
    console.log('Running task scheduler...');
    try {
      await taskService.processPendingTasks();
    } catch (err) {
      console.error('Error running task scheduler:', err);
    }
    setTimeout(scheduler, 20000); // 每隔一分钟再运行一次
  };

  scheduler(); // 启动调度器
};

module.exports = startScheduler;
