const {uploadsModel} = require('@models/v1'); // 根据实际路径调整
const fs = require('fs').promises;
const path = require('path');
const axios = require('axios');
const FormData = require('form-data');
const fsParent = require('fs');


async function uploadFile(filePath, promptId, taskId) {
  try {
    let data = new FormData();
    console.log(filePath);
    data.append('file', fsParent.createReadStream(filePath));
    data.append('promptId', promptId);
    data.append('taskId', taskId);

    let config = {
      method: 'post',
      maxBodyLength: Infinity,
      url: 'http://127.0.0.1:8841/com/generateAnswer',
      headers: { 
        ...data.getHeaders()
      },
      data : data
    };

    const response = await axios.request(config);
    console.log(JSON.stringify(response.data));
    return response.data;
  } catch (error) {
    console.error('Error Response:', error.response.data);
    return error.response.data;
  }
}


//读取本地文件，并通过llm获取解析的结果。
const processFile = async (filePath) => {
  try {
    
    const fileContent = await fs.readFile(filePath, 'utf8');
    // 模拟文件处理逻辑
    const result = fileContent.toUpperCase();
    return result;
  } catch (err) {
    console.error(`Error processing file ${filePath}:`, err);
    throw err;
  }
};

const updateTaskResult = async (taskId, status, parsed_content, html_content, token, remark) => {
  try {
    console.log(taskId);
    if(status == 2){
      await uploadsModel.update({ status, parsed_content,html_content,token }, { where: { id: taskId } });
    }else{
      await uploadsModel.update({ status, remark }, { where: { id: taskId } });
    }
  } catch (err) {
    console.error(`Error updating task ${taskId}:`, err);
    //throw err;
  }
};

const processTask = async (task) => {
  //const result = await processFile(task.filepath);
  console.log(task);
  const result = await uploadFile(task.filepath, task.promptId, task.id);
  console.log(result.code)
  if(result.code==200){
    await updateTaskResult(task.id, 2, JSON.stringify(result.data.parsed_content),result.data.html_content, result.total_tokens,null);
  }else{
    await updateTaskResult(task.id, 3, null, null, result.msg);
  }
};

const processPendingTasks = async () => {
  const tasks = await uploadsModel.findAll({ where: { status: '1' }, order: [['createdAt', 'ASC']],limit: 10 });
  const pLimit = (await import('p-limit')).default; // 动态导入 p-limit
  const limit = pLimit(10); // 最大并发数为10

  const promises = tasks.map((task) =>
    limit(() => processTask(task))
  );

  await Promise.all(promises);
};

module.exports = {
  processPendingTasks,
};
