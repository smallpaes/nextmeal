# Nextmeal: Front-End
Nextmeal is an online platform for you to readily access to awesome food nearby with reasonable price. The app is built with Vue and Vuex using our own [Nextmael API](https://github.com/smallpaes/nextmeal)

<p>&nbsp;</p>

## Project on Heroku
Try out our neaxmeal app on [Twitter API](https://nextmeal.herokuapp.com/#/)

<p>&nbsp;</p>

## Project setup
The following instructions will get you a copy of the project and the setting needed to run the front-end app on your local machine.


### Clone

Clone this repository to your local machine

```
$ git clone https://github.com/smallpaes/nextmeal.git
```

<p>&nbsp;</p>

### Setup App
**1. Enter the project folder**

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

<p>&nbsp;</p>

### Compiles and minifies for production
```
$ npm run build
```

___

## FAQ
- **Can I try this app online?**
    - Yes, kindly visit [https://github.com/smallpaes/nextmeal](https://github.com/smallpaes/nextmeal)
    
- **Can I use use testing account to log in?**
    - Yes, for admin user, kindly use the following testing account:
      - email: root@example.com
      - password: Nextmeal!
    - For restaurant owner, kindly use the following testing account:
      - email: user2@example.com
      - password: Nextmeal!
    - For regular user, kindly use the following testing account:
      - email: user1@example.com
      - password: Nextmeal!

- **Can I have a testing credit card number to try out the subscription process?**
    - Yes, please find below the credit card info for testing use:
      - Card number: 4000-2211-1111-1111
      - Expiration date: Any random date
      - Security code: Any random three numbers set

___


## Authors
- [DannyWang](https://github.com/windate3411)
- [Mike Huang](https://github.com/smallpaes)
- [Tao He](https://github.com/cTaohe)