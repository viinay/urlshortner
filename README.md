##modules

1. express - framework for api server
2. cors - CORS handling
3. helmet - handles headers to secure our express application
4. monk - library to communicate with MongoDB
5. yup - schema validation library
6. morgan - logger
7 nanoid - to generate short random ids
8. nodemon - dev dependency which automatically run nodejs based applications when files are modified

## get started
```
cd urlshortner
npm install
npm run dev --> nodemon app.js (check package.json) for development
npm run start --> node app.js (check package.json) for production
```

## APIs
```
POST /url
body {
  slug?
  url
}
response {
  slug
  url,
  _id
}
```

```
GET /:slug
response redirects to mapped url
```
