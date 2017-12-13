#!/usr/bin/env node

var util = require('util'),
exec = require('child_process').exec,
execute,
date = new Date();
var ProgressBar = require('progress');
var program = require('commander');
var p = __dirname;
function backupS3(val) {
  return val;
}
 
program
  .version('0.1.0')
  .option('-b, --bucket <n>', 'Bucket name', backupS3)
  .option('-p, --path [n]', 'Path to folder', backupS3)
  .parse(process.argv);
 
console.log('downloading bucket %j', program.bucket);//code.app.shelfmint.com
if(program.path){
  console.log('to %j ', program.path);//code.app.shelfmint.com
}
fetchBucket(program.bucket);
function fetchBucket(bucket){
  // var bar = new ProgressBar(' downloading [:bar] :percent ', {
  //   total: 77
  // });
  // var timer = setInterval(function () {
  //   bar.tick();
  //   if (bar.complete) {
  //     console.log('\ncomplete\n');
  //     clearInterval(timer);
  //   }
  // }, 1000);
  if(!bucket){
    console.log('bucket name is missing please use -b <name>')
    process.exit(1);
    return null;
  }
  var formatedDate = date.getDate() + "-" + (date.getMonth() + 1) + "-" + date.getFullYear();
  if(!program.path){
    try {
      exec(`mkdir "${p}\\${bucket} ${formatedDate}"`, // command line argument directly in string
        function (error, stdout, stderr) { // one easy function to capture data/errors
          if (stdout)
           // console.log('stdout: ' + stdout);
          if (stderr && error === null)
            console.log('stderr: ' + stderr);
          if (error !== null) {
            console.log(error);
          }
        });
    } catch (e) {
      //console.log(e);
    }
  }else{
    p = program.path;
  }
 
  try{
    execute = exec(`aws s3 sync s3://${bucket} "${p}\\${bucket} ${formatedDate}"`, {
      maxBuffer: 1024 * 500
    }, function (error, stdout, stderr) { // one easy function to capture data/errors
      // bar.complete = true;
      if (stdout){
        console.log('download complete, cd ' + `"${p}\\${bucket} ${formatedDate}"`);
       // console.log(stdout);
      } 
      if (stderr){
        console.log('stderr:');
       // console.log(stdout);
      }
      if (error !== null) {
        console.log('exec error: ' + error);
      }
    });
  }catch(e){
   // console.log(e);
    process.exit(1);
  }

}
