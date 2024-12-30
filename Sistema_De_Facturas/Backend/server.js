require('dotenv').config(); // Carga las variables de entorno al iniciar el servidor
const express = require('express');
const pool = require('./db'); // Configuración de la base de datos
const facturasRoutes = require('./routes');

const app = express();

const cors = require('cors');
app.use(cors({ origin: '*' }));
app.use(express.json());

app.use('/api', facturasRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
