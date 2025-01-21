Overview
This is an Express-based application using MongoDB for user and admin authentication and management. The project provides API endpoints for user and admin registration, login, logout, and managing user details. It uses JWT (JSON Web Token) for session management and cookie-based authentication.

Features
User Registration: Allows users to register by providing username, email, phonenumber, and password. Passwords are hashed using bcrypt before storing in the database.
User Login: Users can log in with username and password. A token is returned and stored in a cookie for authenticated requests.
User Logout: Users can log out, which will clear their authentication token.
Get User Details: Authenticated users can view their profile details.
Update User Details: Users can update their username, email, phonenumber, and password.
Delete User: Users can delete their account and associated data.
Admin Registration and Login: Admins can register and log in, which provides access to managing users.
Get All Users (Admin): Admins can view all registered users.
Admin Logout: Admins can log out and clear their session.
Installation
Clone the Repository:

bash
Copy
git clone https://github.com/your-username/your-repository.git
cd your-repository
Install Dependencies: Make sure you have Node.js and npm installed. Then, run the following command to install all dependencies:

bash
Copy
npm install
Set up Environment Variables: Create a .env file in the root directory and add the following:

bash
Copy
MONGO_URI=your-mongodb-connection-uri
SECRET=your-jwt-secret-key
ADMIN_SECRET=your-admin-jwt-secret-key
Run the Server: To start the server, use the following command:

bash
Copy
npm start
The server will be available at http://localhost:3002.

Endpoints
User Routes
POST /userregister:

Register a new user.
Request Body:
json
Copy
{
  "username": "user1",
  "email": "user1@example.com",
  "phonenumber": 1234567890,
  "password": "password123"
}
Response:
json
Copy
{
  "_id": "user_id",
  "username": "user1",
  "email": "user1@example.com",
  "phonenumber": 1234567890
}
POST /userlogin:

Log in an existing user.
Request Body:
json
Copy
{
  "username": "user1",
  "password": "password123"
}
Response:
json
Copy
{
  "token": "jwt_token"
}
GET /userlogout:

Log out the user by clearing the authentication cookie.
Response:
json
Copy
"user logged out successfully"
GET /userdetails:

Fetch the details of the logged-in user.
Response:
json
Copy
{
  "_id": "user_id",
  "username": "user1",
  "email": "user1@example.com",
  "phonenumber": 1234567890
}
PUT /updateuserdetails:

Update user details such as username, email, phonenumber, and password.
Request Body:
json
Copy
{
  "username": "newUserName",
  "email": "newemail@example.com",
  "phonenumber": 9876543210,
  "password": "newpassword123"
}
Response:
json
Copy
{
  "_id": "user_id",
  "username": "newUserName",
  "email": "newemail@example.com",
  "phonenumber": 9876543210
}
DELETE /deleteuserdetails:

Delete the logged-in user's account.
Response:
json
Copy
"document deleted successfully"
Admin Routes
POST /adminregister:

Register a new admin.
Request Body:
json
Copy
{
  "username": "admin1",
  "password": "adminpassword123"
}
Response:
json
Copy
{
  "_id": "admin_id",
  "username": "admin1"
}
POST /adminlogin:

Log in an existing admin.
Request Body:
json
Copy
{
  "username": "admin1",
  "password": "adminpassword123"
}
Response:
json
Copy
{
  "token": "admin_jwt_token",
  "id": "admin_id"
}
GET /adminlogout:

Log out the admin by clearing the authentication cookie.
Response:
json
Copy
"admin logged out successfully"
GET /adminDetails:

Fetch the details of the logged-in admin.
Response:
json
Copy
{
  "token": "admin_jwt_token",
  "id": "admin_id",
  "username": "admin1"
}
GET /admingetusers:

Fetch all users. Only accessible by an admin.
Response:
json
Copy
[
  {
    "_id": "user_id",
    "username": "user1",
    "email": "user1@example.com",
    "phonenumber": 1234567890
  },
  {
    "_id": "user_id_2",
    "username": "user2",
    "email": "user2@example.com",
    "phonenumber": 1234567891
  }
]
Testing the API with Postman
User Registration:

Use the POST /userregister endpoint to register a user by sending the required JSON payload in the request body.
User Login:

After registration, use the POST /userlogin endpoint with valid credentials to obtain a JWT token.
The response will contain a token which you can store in Postman Cookies for subsequent requests.
Admin Routes:

Follow the same steps to test admin registration and login using the POST /adminregister and POST /adminlogin endpoints.
Use the obtained admin token to access admin endpoints.
