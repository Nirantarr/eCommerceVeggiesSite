// Install fs module to read the json data.
const fs = require("fs");
// Here we have install http module for server
const http = require("http"); 
// here we install url module 
const url = require("url");
// const slugify = require("slugify");
// const { dirname } = require("path");
// g is a global which allows variable to change in all places at once.
const replaceTemplate = (temp, product)=>{
  let info = temp.replace(/{%PRODUCTNAME%}/g, product.productName);
  info = info.replace(/{%IMAGE%}/g, product.image);
  info = info.replace(/{%FROM%}/g, product.from);
  info = info.replace(/{%ID%}/g, product.id);
  info = info.replace(/{%DESCRIPTION%}/g, product.description);
  info = info.replace(/{%NUTRITION%}/g, product.nutrients);
  info = info.replace(/{%PRICE%}/g, product.price);
  info = info.replace(/{%QUANTITY%}/g, product.quantity);
  if(!product.organic) info=info.replace(/{%NOT_ORGANIC%}/g, "not-organic");
  return info;
};

const indexTemp = fs.readFileSync(`${__dirname}/template/index.html`, "utf-8");
const cardTemp = fs.readFileSync(`${__dirname}/template/tempCard.html`,"utf-8");
const pageTemp = fs.readFileSync(`${__dirname}/template/page.html`,"utf-8");
// There are two type of readFile and readFileSync. In readFile it will not block execution of code so use it in large projects. and readFilesync it block the execution of code so we can use it in small project, apps.
// We have read the data and converted it to javascrit obj to show it .
const data = fs.readFileSync(`${__dirname}/data/data.json`,"utf-8");
const dataObj = JSON.parse(data);

// here we have created the server and also have listen to the server 
const port=3000;
const server= http.createServer((req,res)=>{
const {query , pathname} = url.parse(req.url, true);
if(pathname==="/" || pathname==="/overview"){
  res.writeHead(200,{
    "Content-type": "text/html",
  });
  const cardhtml = dataObj.map((el)=>replaceTemplate(cardTemp,el)).join("");
  const outPut = indexTemp.replace("{%DESCRIPTION%}",cardhtml);
  res.end(outPut);
}else if (pathname === "/product") {
  res.writeHead(200, {
    "Content-type": "text/html",
  });

  const product = dataObj[query.id];
  const outPut = replaceTemplate(pageTemp, product);
  res.end(outPut);}
});
server.listen(port, "127.0.0.1", ()=>{
  console.log(`App running on port ${port}`)
});



