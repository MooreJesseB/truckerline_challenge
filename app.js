var translate = require("./CodingExerciseStub");
var firstArg = process.argv[2];

if (!firstArg || firstArg === '--dev') {
  // translate.translateStringToObject('dev');
  translate.translateObjectToString('dev');
} else {
  
  if (firstArg) {
    if (typeof firstArg === 'string') {
      translate.translateStringToObject(firstArg);
    } else if (typeof firstArg === 'object') {
      translate.translateObjectToString(firstArg);
    } else if (typeof JSON.parse(firstArg) === 'object') {
      translate.translateObjectToString(JSON.parse(firstArg));
    } else {
      console.log("Error! Invalid argument. Please pass only a string or an object");
    }
  }
}

