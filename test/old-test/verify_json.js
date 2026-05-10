const fs = require('fs');
const path = require('path');

// 读取debug.log文件
const filePath = path.join(__dirname, 'debug.log');
fs.readFile(filePath, 'utf8', (err, data) => {
  if (err) {
    console.error('读取文件失败:', err);
    return;
  }
  
  try {
    // 解析JSON
    const jsonData = JSON.parse(data);
    
    // 验证modelXml字段
    if (jsonData.modelXml) {
      console.log('JSON解析成功！');
      console.log('modelXml长度:', jsonData.modelXml.length);
      console.log('modelXml内容:');
      console.log(jsonData.modelXml);
    } else {
      console.error('modelXml字段不存在');
    }
  } catch (parseErr) {
    console.error('JSON解析失败:', parseErr);
    console.log('文件内容:');
    console.log(data);
  }
});