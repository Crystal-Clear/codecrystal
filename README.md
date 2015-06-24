# Codecrystal
A tool to create a visualisation of the file structure of your Javscript GitHub repo and display it as an image in your READme

##Why

* Provide a visual representation of the links between files in your repo
* Enable members of your team and users of your project/module to understand how it works more easily
* Help with code reviewing

##What

* [ ] Log in with GitHub
* [ ] Retrieve user's repos
* [ ] Select repos for code crystal map
* [ ] Retrieve contents of files in selected repos
* [ ] Parse files
* Map internal and external dependancies for  
  * [ ] JavaScript files
  * [ ] HTML files
* Display file structure on a map with arrows show the direction of dependency
  * [ ] Back end map
  * [ ] Front end map
* [ ] Allow users to link to the image on their READme
* [ ] Dynamically update the file structure every time a commit is made to master

####Stretch goals

* [ ] Colour code nodes in the file map to show the different types of files

##How

* Hapi.js
    * Server


* GitHub Api:
    * enable users to log in and find their repos
    * read all the files from the latest commit to the master branch
    * extract the contents of the file


* D3.js
   * visualization of file links 

* Heroku


## How to run the project

You'll need to have NodeJs installed on your computer before you start.

* Clone the repo

    `git clone xxxxxxxxxxxx`

* Install the dependancies

  `npm install`

* Create a Github Application with the entry point set to `http://localhost:8000` and the redirectUri to `http://localhost:8000/login`. Add the client_ID and client_SECRET to your environment variables using

  `exports client_ID="...your..clientID..."`
  `exports client_SECRET="...your..clientsecret..."`

* Run the server

  `node server.js`

* Point your browser to `http://localhost:8000`
