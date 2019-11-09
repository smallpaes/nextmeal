<p align="center">
  <a href="https://getbootstrap.com/">
    <img src="./client/public/logo.png" alt="Bootstrap logo" width="72" height="72">
  </a>
</p>

<h3 align="center">Nextmeal</h3>

<p align="center">
  Online platform for you to readily access to awesome restaurants nearby and order in advance with reasonable price.
  <br>
  <a href="https://nextmeal.herokuapp.com/#/"><strong>Explore Our Website</strong></a>
  <br>
</p>


## Table of contents

- [App first look](#app-first-look)
- [About Nextmeal project](#about-nextmeal-project)
- [How to use](#how-to-use)
- [API Document](#api-document)
- [Run the server locally](#run-the-server-locally)
- [Run the app locally](#run-the-app-locally)
- [Upcoming features](#upcoming-features)
- [Team members](#team-members)


## App first look

### User Interface

 ![image](https://drive.google.com/uc?export=view&id=1w0LlT38a5qH5QTUiOsHOANXnNcI6EFn2)


### Restaurant Owner Dashboard

 ![image](https://drive.google.com/uc?export=view&id=12wb-8M_XPkJgc8OxtXly1k6yL-Cr3Wi4)


### Admin Dashboard

 ![image](https://drive.google.com/uc?export=view&id=1Rx7hrb2J_qlJAr6hgPlKhsGq47NoBsQh)


## About Nextmeal project

Online platform for you to readily access to awesome restaurants nearby and order in advance with reasonable price.


### Open source kits and API we have used

**Front End**

- Using [Google Maps JavaScript API](https://developers.google.com/maps/documentation/javascript/tutorial) to customize and display maps with markers and info windows on web pages
- Using [Google Maps Geocoding API](https://developers.google.com/maps/documentation/geocoding/start) to convert address into geographic coordinates for back-end
- Using [Vuelidate](https://github.com/vuelidate/vuelidate) for better form validation(Including the use or asynchronous validation feature for email check)
- Using [vue-carousel](https://github.com/SSENSE/vue-carousel) to create customized carousel that are responsive and touch-friendly
- Using [vue2-datepicker](https://github.com/mengxiong10/vue2-datepicker) to customize delicate date picker
- Using [sweetalert2](https://github.com/sweetalert2/sweetalert2) to create customized and responsive popup message box
- Using [Vuex](https://github.com/vuejs/vuex) for state management in Vue.js
- Using [Sass](https://github.com/sass/node-sass), CSS preprocessors, in the project. Making CSS code cleaner and reusable.
- Using [Bootstrap](https://github.com/twbs/bootstrap) CSS framework to help create responsive front-end website
- Using [moment.js](https://github.com/moment/moment/) to parse, validate and display date and time that are consistent with back-end
- Using [Font Awesome](https://github.com/FortAwesome/Font-Awesome) to display beautiful icons on the website


**Back End**

- Using [mocha](https://github.com/mochajs/mocha) / [chai](https://github.com/chaijs/chai) / [sinon](https://github.com/sinonjs/sinon) / [supertest](https://github.com/visionmedia/supertest) for Unit Testing(Model / Request) and [Travis CI](https://travis-ci.org/) for continuous integration
- Using [NewebPay](https://www.newebpay.com/) as the third party payment API for user to pay subscription fee with credit card online
- Using [PostGIS](https://github.com/postgis/postgis) to help calculate geodesic distance
- Using [express-validator](https://github.com/express-validator/express-validator) for data validation
- Using [JSON Web Tokens](https://github.com/auth0/node-jsonwebtoken) to add token based authentication to RESTful API
- Using [nodemailer](https://github.com/nodemailer/nodemailer) to send email with Node.js after user sign up or place an order
- Using [Multer](https://github.com/expressjs/multer) 、[imgur-node-api](https://github.com/jamiees2/imgur-node-api) for file upload feature
- Using [bcryptjs](https://github.com/dcodeIO/bcrypt.js) to hash and check password
- Using [dotenv](https://github.com/motdotla/dotenv) to help load the environment variables saved in .env file
- Using [node-cron](https://github.com/node-cron/node-cron) as the task scheduler to automatically update order and meal data in the database
- Using [moment.js](https://github.com/moment/moment/) to parse date and time that are consistent with front-end and database


## How to use

### Visitor

As a visitor, you may: 
1. Learn more about the platform and how it works
2. Check out all the restaurants currently serving on the platform
3. Check out the detail of all the meal plans available
4. Visit our F.A.Q page for all the questions and response
5. Sign up for a Nextmeal account to start the journey


### Nextmeal Member

As a Nextmeal member, you may:
- Log in to your Nextmeal user account
  - email: user1@example.com
  - password: Nextmeal!
- Subscribe a meal plan--10 meals or 20 meals per month--and pay it online with credit card
  - Credit card number(testing): 4000-2211-1111-1111
  - Credit card expiration date: Any random date
  - Credit card security code: Any random three numbers set
- Choose between two restaurants we provide every day and order the meal in advance
- Update or cancel the order by the end of the day
- Pick up the meal at the time you have chosen without having to wait in line
- Edit your profile info--We always recommend you restaurants based on the address you provided


### Restaurant Owner

As a restaurant owner, you may:
- Log in to your Nextmeal owner account
  - email: user2@example.com
  - password: Nextmeal!
- Edit your restaurant info
- Create and edit your restaurant menu
- See the meal currently serving
- Update the meal and amount you would like to serve next week
- Readily check out all the orders of the day


### Admin

As an admin, you may:
- Log in to your Nextmeal admin account
  - email: root@example.com
  - password: Nextmeal!
- Check out the info of all the restaurants, users, and orders on the platform 
- Edit, cancel, or delete the info of the restaurant, user, and order


## API Document

Nextmeal app is using our own REST APIs. To learn more about the API, please check out our [API Docs](https://documenter.getpostman.com/view/8897576/SW17UbmU?version=latest) for more information.


### What's included

Within the API document you will find the following directories and files:

```text
dist/
├── admin/
│   ├── getRestaurants
│   ├── getRestaurant
│   ├── putRestaurant
│   ├── deleteRestaurant
│   ├── getUsers
│   ├── getUser
│   ├── deleteUser
│   ├── getOrders
│   ├── putCancel
│   ├── putUser
└── owner/
│   ├── getRestaurant
│   ├── postRestaurant
│   ├── putRestaurant
│   ├── getDish
│   ├── deleteDish
│   ├── getMenu
│   ├── putMenu
│   ├── getOrders
│   ├── getRestaurants
│   ├── getRestaurant
│   ├── putRestaurant
│   ├── deleteRestaurant
│   ├── getUsers
│   ├── getUser
│   ├── deleteUser
│   ├── getOrders
│   ├── putCancel
│   ├── putUser
└── user/
│   ├── signup
│   ├── signin
│   ├── emailCheck
│   ├── getSubscription
│   ├── postSubscription
│   ├── getProfile
│   ├── putProfile
│   ├── getTomorrow
│   ├── getOrders
│   ├── getCurrentUser
└── restaurant/
│   ├── getRestaurants
│   ├── getRestaurant
└── order/
    ├── getNew
    ├── postNew
    ├── getOrder
    ├── getOrderEdit
    ├── putOrder
    ├── getComment
    ├── postComment
    └── putCancel
```


## Run the server locally

The following instructions will get you a copy of the project and the setting needed to run the back-end server on your local machine.


### Prerequisites

- [npm](https://www.npmjs.com/get-npm)
- [Node.js v10.16.0](https://nodejs.org/en/download/)
- [MySQL v8.0.16](https://dev.mysql.com/downloads/mysql/)
- [MySQL Workbench v8.0.16](https://dev.mysql.com/downloads/workbench/)

<p>&nbsp;</p>

### Clone

Clone this repository to your local machine

```
$ git clone https://github.com/smallpaes/nextmeal.git
```


### Setup Database

**Create database via MySQL Workbench**

> Run the following code
```
drop database if exists nextmeal;
create database nextmeal;
```


### Setup App

**1. Enter the project folder**

```
$ cd nextmeal
```

**2. Install packages via npm**

```
$ npm install
```

**3. Create .env file**

```
$ touch .env
```

**4. Sign up for an account / Get the secret key**
> [Gmail](https://gmail.com/) / [Imgur](https://imgur.com/signin?redirect=https%3A%2F%2Fapi.imgur.com%2Foauth2%2Faddclient) / [Newebpay](https://cwww.newebpay.com/)


**5. Store API Key in .env file and save**

```
GMAIL_ACCOUNT=
GMAIL_PASSWORD=
JWT_SECRET=
IMGUR_CLIENT_ID=
URL=
MERCHANT_ID=
HASH_KEY=
HASH_IV=
```

**6. Edit password in config.json file**

> /server/config/config.json
```
"development": {
  "username": "root",
  "password": "<YOUR_WORKBENCH_PASSWORD>",
  "database": "nextmeal",
  "host": "127.0.0.1",
  "dialect": "mysql"
}
```

**7. Run migration**

> At "/server" run the following code in the console
```
$ npx sequelize db:migrate
$ NODE_ENV=test npx sequelize db:migrate
```

**8. Add Seeder**

> At "/server" run the following code in the console
```
$ npx sequelize db:seed:all
```

**9. Activate the server**

```
$ npm run dev
```

**10. Find the message for successful activation**

```
> App is listening on port 3000!
```
You may start using the api by accessing: http://localhost:3000/api


## Run the app locally

The following instructions will go through the setting needed to run the front-end app on your local machine.


### Setup App

**1. Enter the project folder**

> Open a new terminal and enter the folder
```
$ cd nextmeal/client
```

**2. Install packages via npm**

```
$ npm install
```

**3. Create a [Google Maps](https://cloud.google.com/maps-platform/#get-started) Project and get the API Key**

> Instruction to create a project and access the API key, kindly check [This website](https://developers.google.com/maps/documentation/javascript/get-api-key)


**4. Create .env.local file**

```
$ touch .env.local
```

**5. Store API Key in .env.local file and save**

```
VUE_APP_GOOGLE=<YOUR_GOOGLE_MAPS_API_KEYS>
```


**7. Compiles and hot-reloads for development**
```
$ npm run serve
```


## Upcoming features

- Data visualization dashboard for admin and restaurant owner
- Coupon feature for user
- Restaurant owner can reply to reviews from users
- Restaurant owner can serve dinner
- User can updates or resets password 


## Team Members 
(*In alphabetical order)

### [DannyWang](https://github.com/windate3411)

- Back-end development
- Build up a robust RESTful CRUD API: User authentication
- Database and model configuration, back-end automation testing and Node.js scheduler integration
- Cooperate with teammates to come up with better user stories, wireframe, ERD model and RESTful API design
- Cooperate with teammates to set up database, create seeders, and deploy the app
- Code review for teammates


### [Mike Huang](https://github.com/smallpaes)

- Entire front-end development--Project setup, features development, and new technologies implementation
- UX and UI design
- Github project creation and branch management
- Cooperate with teammates to come up with better user stories, wireframe, ERD model and RESTful API design
- Cooperate with back-end teammates to connect to third party payment APIs
- Code review for teammates


### [Tao He](https://github.com/cTaohe)

- Back-end development
- Build up a robust RESTful CRUD API: Restaurants, orders, meals, user subscription, and menu 
- Cooperate with teammates to come up with better user stories, wireframe, ERD model and RESTful API design
- Cooperate with teammates to set up database, create seeders, and deploy the app
- Cooperate with teammates to connect to third party payment APIs
- Code review for teammates