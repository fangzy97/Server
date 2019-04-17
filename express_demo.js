'use strict'
var express = require('express');
var mysql = require('mysql');
var bodyParser = require('body-parser');
var crypto = require('crypto');

var app = express();

app.use(bodyParser.json());
app.use(express.static('public'));

app.all('*', function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    res.header('Access-Control-Allow-Methods', '*');
    res.header('Content-Type', 'application/json;charset=utf-8');
    next();
});

var mysql_config = {
    host: '127.0.0.1',
    user: 'root',
    password: '123',
    database: 'inject'
};

app.post('/query', (req, res) => {
    let connection = mysql.createConnection(mysql_config);
    connection.connect();

    let city = req.body.city;
    console.log(city);
    try {
        let sql;
        if (city != 'all') {
            sql = 'select * from info where city=\'' + city + '\';';
        } else {
            sql = 'select * from info;';
        }
        console.log(sql);

        connection.query(sql, (err, result) => {
            if (err) {
                res.send([]);
            } else {
                res.send(result);
            }
        })
    } catch (err) {
        console.log(err);
    } finally {
        connection.end();
    }
});

app.post('/login', (req, res) => {
    let connection = mysql.createConnection(mysql_config);
    connection.connect();

    let md5 = crypto.createHash('md5');
    let password = md5.update(req.body.password).digest('hex');

    try {
        let sql = 'select * from client where username=\'' + req.body.username + '\' and password=\'' + password + '\';';
        console.log(sql);
        connection.query(sql, (err, result) => {
            if (err) {
                console.log(err);
                res.send(false);
            } else if (result.length > 0) {
                console.log(result);
                res.send(true);
            } else {
                res.send(false);
            }
        });
    } catch(err) {
        console.log(err);
    } finally {
        connection.end();
    }
});

app.listen(8088, function () {
    console.log('服务器已连接...');
})