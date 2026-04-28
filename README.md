#***Machine Test for MERN Stack developer***

The objective of this basic application is the uploading and distribution of the lists in the CSV/xlsx file to the agents present in the database in the pattern of division of 5.

##**The features included are**:
- *User or admin can login*.The login is authenticated by JWT Token.
- The required *agent can be added* by the user after login.
- *Upload the CSV/xlsx file* and the list will be divided in sequential manner.

##The Tech Stack used to build this application are:
- **Frontend**: React,CSS
- **Backend**: Node.js,Express.js, MongoDB Compass.

##The steps to be followed to execute the application are:

###Initially backend setup
- **Clone the repository.**
  - code: *git clone <repo_url>*

- **Change to Backend folder and install the required dependencies.**
  - *cd backend*
  - *npm i express mongoose jsonwebtoken nodemon bcryptjs cors path multer csv-parser dotenv fs xlsx.*

- **Replace ur mongodb_url and required data in .env file.**

- **Run the seed.js file using node seed.js once.It is recommended to save the data in the database.**

- Run the backend using **nodemon index.js command** in the terminal.
- *This should display server is running and mongodb successfully connected.*

###***Forntend setup***
- **Move to frontend folder**
  - code: *cd frontend/frontend-proj*

- **Install the dependencies.**
  - code: *npm install*

- **Run the frontend.**
  - code: *npm run dev*

go the the link in the terminal and login using seeded information.

Note: *1.Upload only CSV/xslx file with is having firstname phone number and notes as their columns.*
  

  
  
  
        
  

  
