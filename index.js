const jest = require("jest");
const babel = require("babel-core")
const fs = require('fs');
const rimraf=require('rimraf');

const rootDir = '/tmp/project';
module.exports.handler = function(event, context, callback) {


  if (event.httpMethod == "GET"){

    // Read in text for index.html.
    let html = fs.readFileSync(__dirname + '/index.html', 'utf8');
    //console.log(html); 

    let result = {
      "isBase64Encoded": false,
      "statusCode": 200,
      "headers": {"content-type": "text/html"},
      "body": html}

    callback(null, result);

  } else {
    // Get files to update from the event object. 
    // Update the contents of the files. 
    // Execute jest programatically
    // Return jest results.

    // Look for locally passed files.
    // remove old files
    const hasExist=fs.existsSync(rootDir);
    if(hasExist){
      rimraf.sync(rootDir);
    }
    fs.mkdirSync(rootDir);
    let body = JSON.parse(event.body);
    const babelConfig = {
      "presets": [
        "env",
        "stage-3",
        "es2015",
        "vue",
        "react"
      ],
      "plugins": [
        ["module-resolver", {
          "cwd": [__dirname],
          "root": rootDir,
          resolvePath(source, file, opts) {
            console.log(source[0] === '.' ? source : `${__dirname}/node_modules/${source}`);
            return source[0] === '.' ? source : `${__dirname}/node_modules/${source}`;
          }
        }
        ]
      ]
    }
    //console.log(body.files);
    const existPath ={};
    // Save file to the tmp directory
    function saveFile(filePath,code){
      const paths = filePath.split('/');
      const folders = paths.length>1 ? paths.slice(0,-1) : [];
      if(folders.length>0){
        let path='';
        for(let folder of folders){
          path +=folder;
          if(!existPath[path]){
            fs.mkdirSync(`${rootDir}/${path}`);
            existPath[path]=true;
          }
          path+='/';
        }
      }
      let compiledCode = {};
      if (/\.(js|vue)?$/.test(filePath)) {
        compiledCode = babel.transform(code, babelConfig);
        console.log(compiledCode);
      } else{
        compiledCode.code = code;
      }
      fs.writeFileSync(`${rootDir}/${filePath}`,compiledCode.code);
    }
    for (file in body.files){
      console.log(file);
      if(file != "data1.txt"){
        saveFile(file,body.files[file]);
      } else {
        console.log("Not handling zip files encoded in data1.txt yet.")
      }
    }

    console.log('Running index.handler');
    console.log('==================================');
    console.log('event', event);
    console.log('==================================');

    const options = {
      projects: [__dirname],
      silent: true,
    };

    jest
      .runCLI(options, options.projects)
      .then((success) => {
        console.log("***********");
        console.log(success.results.numFailedTests);
        console.log('Stopping index.handler');

        let result = {
          "isBase64Encoded": false,
          "statusCode": 200,
          "headers": {"content-type": "application/json"},
          "body": JSON.stringify(success)
        }

        callback(null, result);

      })
      .catch((failure) => {
        console.log("****** In the error handler code. *******")
        console.error(failure);
        let result = {
          "isBase64Encoded": false,
          "statusCode": 200,
          "headers": {"content-type": "text/html"},//"application/json"},
          "body": JSON.stringify(failure)
        }
        callback(null, result);
      });


    let result = {
      "isBase64Encoded": false,
      "statusCode": 200,
      "headers": {"content-type": "text/html"},//"application/json"},
      "body": "Not waiting to return"
    }
    setTimeout(function() {
      callback(null, result);

    }, 15000);


    // in POST

  }



  // or
  // callback( 'some error type' );
};
