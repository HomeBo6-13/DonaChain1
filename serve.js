const express = require("express");
const bodyParser = require("body-parser");
const { exec } = require("child_process");
const path = require("path");

const app = express();
app.use(bodyParser.json());
app.use(express.static("public")); // Carpeta donde está el HTML

app.post("/enviar-donacion", (req, res) => {
  const { monto, organizacion, fecha } = req.body;

  // Aquí podrías actualizar tu archivo main.ava.js con los datos recibidos
  // Lógica para registrar los datos en tu archivo .js

  console.log(`Donación recibida: Monto - ${monto}, Organización - ${organizacion}, Fecha - ${fecha}`);

  // Ejecutar el comando near deploy
  exec("near deploy contreras.testnet build/hello_near.wasm", (error, stdout, stderr) => {
    if (error) {
      console.error(`Error al ejecutar el comando: ${error.message}`);
      return res.status(500).json({ mensaje: "Error al desplegar el contrato" });
    }
    if (stderr) {
      console.error(`stderr: ${stderr}`);
      return res.status(500).json({ mensaje: "Error en el despliegue" });
    }
    console.log(`stdout: ${stdout}`);
    res.json({ mensaje: "Donación registrada y contrato desplegado correctamente" });
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor escuchando en el puerto ${PORT}`);
});
