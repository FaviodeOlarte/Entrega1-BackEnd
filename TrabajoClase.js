const express = require("express");

const app = express();

const port = 8080;

// utilizo middle que interpreta JSon

app.use(express.json());

//array para las tareas
let tasks = [];
let idOcurrente = 1; //defino inicio de id a tareas

//ruta de get
app.get("/tasks", (req, res) => {
  res.status(200).json(tasks);
});

// ruta post => nuevas tareas

app.post("/tasks", (req, res) => {
  console.log(req.body);
  const { title, description } = req.body;
  if (!title || !description) {
    return res.status(400).json({ error: "Titilo y descripcion obligatorias" });
  }

  const nuevaTarea = {
    id: idOcurrente++,
    title,
    description,
  };

  tasks.push(nuevaTarea);
  res.status(201).json(nuevaTarea); //estado 201 avisa que se creo una tarea
});

app.delete("tasks/:id", (req, res) => {
  const listaID = parseInt(req.params.id, 10);
  //buscar por indice de tarea
  const tareasIndex = tasks.findIndex((task) => task.id === listaID);

  //validar si existe la tarea
  if (tareasIndex === -1) {
    return res.status(404).json({ error: "No existe tarea" });
  }
  const eliminarTarea = task.splice(tareasIndex, 1);

  res.status(200).json(eliminarTarea);
});

app.listen(port, () => {
  console.log(`servidor escuchando en http://localhost:${port}`);
});
