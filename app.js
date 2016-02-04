var translate = require("./CodingExerciseStub");
var fs = require('fs');

var firstArg = process.argv[2];
var secondArg = process.argv[3];

if (!firstArg || firstArg === '--dev') {
  translate.translateStringToObject('dev');
  translate.translateObjectToString('dev');
} else {

  if (firstArg === '--file') {
    fs.readFile(secondArg, function(err, data) {
      startTranslate(JSON.parse(data));
    });
  } else {
    startTranslate(firstArg) ;
  }

  var startTranslate = function(data) {
    if (data) {
      if (typeof data === 'string') {
        translate.translateStringToObject(data);
      } else if (typeof data === 'object') {
        translate.translateObjectToString(data);
      } else if (typeof JSON.parse(data) === 'object') {
        translate.translateObjectToString(JSON.parse(data));
      } else {
        console.log("Error! Invalid argument. Please pass only a string or an object");
      }
    }
  };
}

