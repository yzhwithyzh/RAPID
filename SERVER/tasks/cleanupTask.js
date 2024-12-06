const fs = require('fs').promises;
const path = require('path');
const cron = require('node-cron');

const directoryPath = path.join(__dirname, '../uploads/files');

// 检查文件是否超过5天
const isFileOlderThan = (filePath, days) => {
  const fileAgeInMs = days * 24 * 60 * 60 * 1000;
  return fs.stat(filePath).then(stats => {
    const now = Date.now();
    const fileAge = now - stats.mtimeMs;
    return fileAge > fileAgeInMs;
  });
};

const cleanUpDirectory = async () => {
  try {
    const files = await fs.readdir(directoryPath);
    const deletePromises = files.map(async (file) => {
      const filePath = path.join(directoryPath, file);
      const isOlder = await isFileOlderThan(filePath, 5);
      if (isOlder) {
        try {
          await fs.unlink(filePath);
          console.log(`Deleted file: ${filePath}`);
        } catch (err) {
          console.error(`Error deleting file ${filePath}: ${err}`);
        }
      }
    });
    await Promise.all(deletePromises);
  } catch (err) {
    console.error(`Unable to scan directory: ${err}`);
  }
};

// 设置定时任务，每天凌晨1点执行一次
cron.schedule('0 1 * * *', () => {
  console.log('Running cleanup task...');
  cleanUpDirectory();
});

module.exports = cleanUpDirectory;
