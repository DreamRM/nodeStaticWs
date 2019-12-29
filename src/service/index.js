const fs = require('fs')
const {promisify} = require('util')
const path = require('path')
const stat = promisify(fs.stat)
const readdir = promisify(fs.readdir) 
const handlebars = require('handlebars')
const config = require('../config/index')
const tplpath = path.join(__dirname,'../template/index.tpl')
const source = fs.readFileSync(tplpath,'utf-8')
const template = handlebars.compile(source)

const routers = async function (req,res,filepath){
        let stats = await stat(filepath)
        try{
            if(stats.isFile()){
                res.statusCode = 200
                res.setHeader('Content-Type','text/plain')
                fs.createReadStream(filepath).pipe(res)
            }else if(stats.isDirectory()){
                    let files = await readdir(filepath)
                    res.statusCode = 200
                    res.setHeader('Content-Type','text/html')
                    const dir = path.relative(config.root,filepath)
                    const data = {
                        files,
                        title:path.basename(filepath),
                        path:dir?`/${dir}`:''
                    }
                    res.end(template(data))
            }
        }catch(err){
            res.statusCode = 404
            res.setHeader('Content-Type','text/plain')
            res.end('no find directory or file')
        }
}

module.exports = routers