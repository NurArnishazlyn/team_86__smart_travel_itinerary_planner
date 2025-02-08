##  Coursework Template ##
### CM2040 Database Networks and the Web ###

#### Installation requirements ####

* NodeJS
    - follow the install instructions at https://nodejs.org/en/
    - we recommend using the latest LTS version
* Sqlite3
    - follow the instructions at https://www.tutorialspoint.com/sqlite/sqlite_installation.htm 
    - Note that the latest versions of the Mac OS and Linux come with SQLite pre-installed

#### Using this deployable Event Manager ####

This template sets you off in the right direction for your coursework. To get started:

* Run ```npm install``` from the project directory to install all the node packages.

* Run ```npm run build-db``` to create the database on Mac or Linux 
or run ```npm run build-db-win``` to create the database on Windows

* Run ```npm run start``` to start serving the web app (Access via http://localhost:3000)

Test the app by browsing to the following routes:

* Organiser Home Page: http://localhost:3000/organiser/home

    * Create New Event Page: http://localhost:3000/organiser/event/new?
    * Organiser Edit Event Page: http://localhost:3000/organiser/event/6/edit
    * Share Event Page: http://localhost:3000/attendee/home (Redirect to Attendee Home Page)
    * Site Settings Page: http://localhost:3000/organiser/settings

* Attendee Home Page: http://localhost:3000/attendee/home

    * Attendee Event Page (Book Tickets): http://localhost:3000/attendee/event/3

* Main Home Page: http://localhost:3000/

You can also run: 
```npm run clean-db``` to delete the database on Mac or Linux before rebuilding it for a fresh start
```npm run clean-db-win``` to delete the database on Windows before rebuilding it for a fresh start

Please also read the document ```Working with this Template.pdf``` for further guidance.

##### Creating database tables #####

* All database tables should created by modifying the db_schema.sql 
* This allows us to review and recreate your database simply by running ```npm run build-db```
* Do NOT create or alter database tables through other means


#### Preparing for submission ####

Make a copy of your project folder.
In your copy, delete the following files and folders:
* node_modules
* .git (the hidden folder with your git repository)
* database.db (your database)

Make sure that your ``package.json`` file includes all of the dependencies for your project. NB. you need to use the ```--save``` tag each time you use npm to install a dependency

Edit this README.md to explain any specific instructions for setting up or using your application that you want to bring to our attention:

* remove the existing contents that we have provided
* include any settings that should be adjusted in configuration files
* include a list of the additional libraries you are using
* anything else we need to know in order to successfully run your app


NB. we will ONLY run ```npm install```, ```npm run build-db```, and ```npm run start``` . We will NOT install additional packages to run your code and will NOT run additional build scripts. Be careful with any additional node dependencies that you use.

