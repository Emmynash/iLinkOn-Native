# iLinkOn Native
iLinkOn Native is a social networking application tailored specifically for colleges in West Africa. This React Native app, combined with a Node.js backend, aims to bring together students from various institutions, fostering a community where they can connect, collaborate, and share ideas.


## Table of Contents

- Features
- Tech Stack
- Installation
- Running the App
- Folder Structure
- Contributing
- License
- Contact


## Features

- **User Profiles** - Create and manage personal profiles.
- **News Feed** -  View and interact with posts from friends and other students.
- **Messaging** -  Send direct messages to other users.
- **Groups** -  Join or create groups based on interests or classes.
- **Events** -  Create and RSVP to campus events.
- **Notifications** -  Stay updated with real-time notifications.

## Tech Stack

### Frontend :

- **React Native** - Core framework for building the app.
- **Redux** -  State management.
- **React Navigation** -  Handling navigation within the app.
- **Axios** -  For making HTTP requests.
- **Expo** -  Managed workflow for building and deploying the app.

### Backend :

- **Node.js** - JavaScript runtime for the backend.
- **Express.js** -  Web framework for Node.js.
- **MongoDB** -  NoSQL database for data storage.
- **JWT** -  For secure user authentication.

## Installation

iLinkOn Native requires [Node.js](https://nodejs.org/) v10+ to run.
To get started with iLinkOn Native, clone the repository and install the necessary dependencies.

Install the dependencies and devDependencies and start the server.

```sh
git clone https://github.com/Emmynash/iLinkOn-Native.git
cd iLinkOn-Native
npm install
```

## Running the App

To run the app on your local machine:

```sh
npm start
```

This will start the Expo development server. You can then use the Expo Go app on your device or an emulator to run the application.

For Android:

```sh
npm run android
```

For iOS:

```sh
npm run ios
```
## MongoDB Setup
1. Ensure you have MongoDB installed and running on your local machine, or use a cloud-based MongoDB service like MongoDB Atlas.

2. Create a `.env` file in the root of the backend directory and add the following:

```
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
PORT=5000
```

## Folder Structure

The project's folder structure is organized as follows:

| Plugin | README |
| ------ | ------ |
| ├── assets/  | static assets like images, fonts, etc.|
| ├── components/  | Reusable UI components|
| ├── navigation/  | React Navigation setup|
| ├── redux/   | Redux setup (actions, reducers, store) |
| ├── screens/    | Application screens |
| ├── services/   | API services and utility functions | 
| ├── App.js      | Entry point of the app|
|└── package.json   | [Project metadata and dependencies|

## Contributing
We welcome contributions to iLinkOn Native! To contribute:

Fork the repository.
1. Create a new branch (`git checkout -b feature/YourFeature`).
2. Commit your changes (`git commit -m 'Add some feature'`).
3. Push to the branch (`git push origin feature/YourFeature`).
4. Open a Pull Request.

Please make sure to update tests as appropriate.
Second Tab:



## License
This project is licensed under the MIT License - see the LICENSE file for details.

Contact
If you have any questions or need further assistance, feel free to reach out to the project maintainer:

Emmanuel Akita

[GitHub ](https://github.com/Emmynash)


