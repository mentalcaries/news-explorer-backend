# 🌍 News Explorer Backend

---

Here lies the repo for the backend portion of News Explorer: A Practicum Project by Devin Jaggernauth
---

## Technologies Used:
- ExpressJS
- MongoDB
- Node
- NginX



This NodeJS based server features CRUD functionality via HTTP methods and authentication using Javascript Web Tokens(JWT).

MongoDB was used to create the database which maintains the users and saved articles. Inbound data is validated by Joi/Celebration before being passed to controllers. Passwords are hashed using bcrypt. 

The backend was deployed on Google Cloud and uses Nginx for reverse proxy.

Code is formatted using the AirBNB style.

---
### Deployment can be accessed here:

https://api.newsxp.students.nomoreparties.sbs

---
