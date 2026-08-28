const http=require('node:http');const {createDecisionApi}=require('../api/decision');
function startServer(port=3000){const api=createDecisionApi();const server=http.createServer((req,res)=>{res.setHeader('Content-Type','application/json');if(req.url==='/health')return res.end(JSON.stringify({ok:true,service:'SAT'}));if(req.url==='/api/policy')return res.end(JSON.stringify(api.executionPolicy));res.statusCode=404;res.end(JSON.stringify({error:'NOT_FOUND'}));});server.listen(port);return server;}
module.exports={startServer};
