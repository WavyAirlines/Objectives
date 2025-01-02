// public/config/fatsecretConfig.js
const axios = require('axios');

const client = axios.create({
  baseURL: 'https://oauth.fatsecret.com/connect/token',
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded',
  },
});

module.exports = client;
