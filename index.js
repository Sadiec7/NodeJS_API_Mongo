// Importar dependencias
const connection = require('./database/connection');
const express = require('express');
const cors = require('cors');

// Conexión a la base de datos
connection();

// Crear servidor
const app = express();
const port = 3000;

// Configurar CORS
app.use(cors());

// Convertir los datos del body a objetos
app.use(express.json());
app.use(express.urlencoded({extended: true}));

// Cargar rutas
const projectRoutes = require("./routes/project");
app.use("/api/projects", projectRoutes);

// Crear endpoints principales
app.get("/", (req, res) => {
    console.log("home");
    return res.status(200).send({
        curso: "Backend",
        url: "https://localhost:3000",
        profe: "victor"
    });
});

app.get("/pruebitas", (req, res) => {
    console.log("pruebitas");
    return res.status(200).send({
        curso: "Backend",
        url: "https://localhost:3000",
        profe: "victor"
    });
});

// Servidor escuchando
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
    console.log(`Access: http://localhost:${port}`);
});