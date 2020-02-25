const http = require("http");

const port = process.env.PORT || 8000;

const app = require("./src/app");

const server = http.createServer(app);

const URLs = [
  { method: "POST", url: "http://localhost:8000/api/users/register" },
  { method: "POST", url: "http://localhost:8000/api/users/login" },
  { method: "GET", url: "http://localhost:8000/api/users" },
  { method: "GET", url: "http://localhost:8000/api/users/:id" },
  { method: "GET", url: "http://localhost:8000/api/users/posts/:id" },
  { method: "PUT", url: "http://localhost:8000/api/users/:id" },
  { method: "DELETE", url: "http://localhost:8000/api/users/:id" },
  { method: "POST", url: "http://localhost:8000/api/posts" },
  { method: "GET", url: "http://localhost:8000/api/posts" },
  { method: "GET", url: "http://localhost:8000/api/posts/:id" },
  { method: "PUT", url: "http://localhost:8000/api/posts/:id" },
  { method: "DELETE", url: "http://localhost:8000/api/posts/:id" }
];

server.listen(port, () => {
  console.log(`Server is listening on http://localhost:${port}`);
  console.log(URLs);
});
