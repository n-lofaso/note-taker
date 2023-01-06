const fs = require('fs')

const { v4: uuid } = require('uuid');
const express = require('express');
const path = require('path');
const PORT = process.env.PORT || 3002;
const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'));