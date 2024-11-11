# Team-Quaternary_APDS7311_POE

Welcome to the repository! This repo contains all of the solutions to Team Quaternary's APDS7311 POE.

Team Members:

- ST10019838 - Damian Dare
- ST10019972 - Guillaume Swanevelder
- ST10091991 - Christiaan Versfeld
- ST10158660 - Ruan Zwarts

</br>
NOTE:

- The devops pipeline was set up on our main repository (the link can be found under the Links.txt file) and image proof can be found in the documentation folder.

- Check out the "How to Run" section and for the scripts to properly run the application

- If the following error occurs when attempting to log in, restart the api:

```
Error [ERR_HTTP_HEADERS_SENT]: Cannot set headers after they are sent to the client
```

(I tried finding this bug, but everything looks correct and it pops up randomly which makes it difficult to catch)

- Don't forget to add your custom environment variables if you aren't able to connect to the online mongo Altas we have set up. Then don't forget to add an admin user by looking at the User-Mongoose.js file to see how to insert an Admin that can register other users! (Contact Damian or Christiaan to add IP address to Atlas if need be)

</br>

## Credentials (if using our Atlas)

**_Admin Account:_**
- Username: Admin
- Account Number: 100000000
- Password: P1

</br>

**_Employee Account:_**
- Username: Employee
- Account Number: 100000001
- Password: P1

</br>

 **_User Account:_**
- Username: User
- Account Number: 100000002
- Password: P1

</br>

## Components of this repository

- application - a folder containing source code for the project
- documentation - a folder containing all documentation for the project (**PRIMARILY THE RESEARCH**)
- tutorials - a folder containing all video tutorials for the project

## Table of Contents

- [How to Use](#how-to-use)
- [Project Set Up](#project-set-up)
  - [Prequisites](#prequisites)
  - [Installation](#installation)
  - [How to Run](#how-to-run)

</br>
</br>

# How To Use

The following tutorials can found be under the Tutorials folder:

**_Part 2:_**

- Team_Quaternary_APDS7311_Part2_Tutorial

</br>

**_Part 3:_**

- Team_Quaternary_APDS7311_POE_Tutorial

</br>
</br>

# Project Set-Up

## Prequisites

Below are the following items/tools that need to be installed
before using the application:

- Visual Studio Code (The latest version)
- Node (The latest version)

</br>

## Installation

Under the Tutorials folder, refer to:

- ST10019838_PROG7312_Installation_Tutorial

</br>

_or_

1. Clone the repository **(NB: clone to a local drive)**:

```bash
 git clone https://github.com/ST10019838/Team-Quaternary_APDS7311_POE.git
```

2. Open the repository folder under in VSCode

3. Navigate to the "application" folder

4. Install dependencies:

```
 npm install
```

</br>

## How to Run

1. Navigate to the "application" folder

2. Open a terminal in the project location

3. Start the backend by running the following command in the terminal:

```
 npm run dev-server
```

4. Open another terminal.

5. Start the frontend by running the following command in the terminal:

```
 npm run dev-https
```


6. Navigate to "https://localhost:3000" to view the front end of the application

7. Enjoy!
