const http = require('http') 
const {port,host,root} = require('./config/index.js')
const chalk = require('chalk')
const path = require('path')
const routers = require('./service/index')

const server = http.createServer((req,res)=>{
    let filepath = path.join(root,req.url)
    routers(req,res,filepath)
})

server.listen(port,host,()=>{
    console.info('server start:'+chalk.green(`http://${host}:${port}`));
})