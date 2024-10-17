import dotenv from 'dotenv';
dotenv.config();


import http from "http";
import fs from "fs/promises";
import url from "url";
import path from "path";

const PORT = process.env.PORT;

const __filename = url.fileURLToPath(import .meta.url);
const __dirname = path.dirname(__filename);

const mimeTypes = {
    '.html': 'text/html',
    '.css': 'text/css',
    '.js': 'application/javascript',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.gif': 'image/gif'
};

async function servestatic(req, res){
    let filePath;
   
    if (req.url === "/" || req.url.endsWith(".html")) {
        filePath = path.join(__dirname, 'view', req.url === "/" ? "index.html" : req.url);
    } 
    else if (req.url.startsWith("/public")){
        filePath = path.join(__dirname, req.url );
    }
    else {
        filePath = path.join(__dirname, 'view', '404.html');
    }
  
    const extname = path.extname(filePath);
    const contentType = mimeTypes[extname]|| 'application/octet-stream'; ;

    try {
        const data = await fs.readFile(filePath);  
            res.writeHead(200, { 'Content-Type': contentType });  
            res.end(data);  
    } catch (error) {
        if (error.code === 'ENOENT') {
            const notFoundPage = path.join(__dirname, 'view', '404.html');
            const data = await fs.readFile(notFoundPage);
            res.writeHead(404, { 'Content-Type': 'text/html' });
            res.end(data);
        } else {
            res.writeHead(500, { 'Content-Type': 'text/html' });
            res.end("<h1>500 - Internal Server Error</h1>");
        }
    }


}

const server = http.createServer(async(req, res) =>{
    if(req.method === "GET"){
        await servestatic (req, res);
    }else {
        res.writeHead(405, { 'Content-Type': 'text/plain' });
        res.end('405: Method Not Allowed');
    }
});
    


server.listen(PORT, ()=> {
    console.log(`Server is listening on ${PORT}`)
});