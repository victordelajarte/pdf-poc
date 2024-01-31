# This a simple POC on how to use pdf-lib to fill a pdf form

The pdf will be filled according to the config object, and a new file will be created with all the fields set as readonly text.

To start:
- run `npm install`
- add a pdf file with a form in the root directory (change the file name if necessary, I used `input.pdf`)
- all the code is in the `index.js` file, the `config` variable can be changed to setup the text you want to write in each field
- run `npm start` to launch the program, it will create the new file and output the name of each field to help creating the config object