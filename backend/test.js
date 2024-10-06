require('dotenv').config();  // Load .env file

const express = require('express');
console.log('ES Module test');

const uri = process.env.ATLAS_URI;
console.log('ATLAS_URI:', uri);