// initial config
const express = require("express");
const app = express();
const NodeCouchdb = require('node-couchdb');
// const Person = require("./models/Person");

app.use(
  express.urlencoded({
    extended: true,
  })
);

app.use(express.json());

// api routes
app.post("/person", async (req, res) => {
  const { id, name, salary, approved } = req.body;

  couch.insert("person", {
    _id: id,
    name: name,
    salary: salary,
    approved: approved
  }).then(({ data, headers, status }) => {
    res.status(200).json({ message: data })
  }, err => {
    res.status(500).json({ err: err })
  });
});

// get person by id
app.get("/person/:id", async (req, res) => {
  const id = req.params.id;

  couch.get("person", id).then(({ data, headers, status }) => {
    res.status(200).json({ message: data })
  }).catch((err) => {
    res.status(500).json({ err: err })
  })
});

// update person
app.patch("/person/:id/:rev", async (req, res) => {
  const id = req.params.id;
  const rev = req.params.rev;

  const { name, salary, approved } = req.body;

  couch.update("person", {
    _id: id,
    _rev: rev,
    name: name,
    salary: salary,
    approved: approved

  }).then(({ data, headers, status }) => {
    res.status(200).json({ message: data })
  }).catch((err) => {
    res.status(500).json({ err: err })
  })
});

// delete person by id
app.delete("/person/:id/:rev", async (req, res) => {
  const id = req.params.id;
  const rev = req.params.rev;

  couch.del("person", id, rev).then(({ data, headers, status }) => {
    res.status(200).json({ message: data })
  }).catch((err) => {
    res.status(500).json({ err: err })
  })
});

const couch = new NodeCouchdb({
  auth: {
    user: 'root',
    password: 'root'
  }
});

// default to list databases
app.get("/", (req, res) => {
  couch.listDatabases().then(function (dbs) {
    res.status(200).json(dbs)
  }).catch((err) => {
    res.status(500).json({ err: err })
  })
});

app.listen(3000, () => {
  console.log('CouchDB conectado')
});
