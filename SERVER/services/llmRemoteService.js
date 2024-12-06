const axios = require('axios');

async function generateSubquestion(question, description) {
    try {
      
        let data = JSON.stringify({
            "question": question,
            "description": description
          });
  
        let config = {
            method: 'post',
            maxBodyLength: Infinity,
            url: 'http://127.0.0.1:8841/com/generateSubquestion',
            headers: { 
                'Content-Type': 'application/json'
            },
            data : data
        };
    
        const response = await axios.request(config);
        
        return response.data;
    } catch (error) {
      
      console.error('Error Response:', error);
      return error.message;
    }
  }
  module.exports = {
    generateSubquestion,
  };