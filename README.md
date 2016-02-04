# truckerline_challenge

## Welcome!

To use this script first clone this repository to you local machine and then navigate to the new directory.

There are several ways to execute this script with different command line arguments

Just running the app without an arugment will use sample development inputs:

`node app.js`

This will run the script for both transforming a string into an object as well as transforming an object into a string.


If you wish to transform a string of your choice into an object you can pass the string as the first argument:

`node app.js Prop0:Patrick Fowler,Prop1:123 Fake St,Prop3:Fakeville,Prop4:California,Prop5:45678,Prop32:7`


The script can also read `json` files. In order to do this the first argument must be `--file` and the second argument would be the file path:

`node app.js --file ./sampleObject.json`

This is currently the only method for processing objects. Note: A string can also be read from a file:

`node app.js --file ./sampleString.json`


Output is logged to the terminal window. Enjoy!
