# MM - Monetary Management

## Project Setup

### Env Variables

Create file `.env` and add the following

```
NODE_ENV = development
PORT = 5001
MONGO_URI = your local mongodb uri
JWT_SECRET = 'some complex secret you like'
REGISTER_SECRET = 'something to share with the users to get registered'
```

### Install Dependencies

Backend package.json lies in the root directory

```
npm install
```

Frontend package.json lies in the frontend directory

```
cd frontend
npm install
```

### Run frontend (:3000) & backend (:5001)

```
npm run app
```

### Run backend only

```
npm run server
```

### Run frontend only

```
npm run client
```

## Create frontend prod build

```
cd frontend
npm run build
```
