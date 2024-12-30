const express = require('express');
const router = express.Router();
const pool = require('./db'); // Importa la conexión a la base de datos
const db = require('./db'); // Asegúrate de que esta ruta es correcta


// Crear factura
router.post('/facturas', async (req, res) => {
  const {
    nombre_usuario,
    nombre_cultivo,
    kilos_pareja,
    precio_pareja,
    kilos_gruesa,
    precio_gruesa,
    kilos_millo,
    precio_millo,
    fecha_creacion, // Campo de fecha opcional
  } = req.body;

  try {
    // Obtener id_usuario basado en nombre_usuario
    const usuarioQuery = await pool.query('SELECT id_usuario FROM Usuarios WHERE nombre = $1', [nombre_usuario]);
    let id_usuario = usuarioQuery.rows[0]?.id_usuario;

    // Si el usuario no existe, devolver error
    if (!id_usuario) {
      return res.status(400).json({ error: 'Usuario no encontrado' });
    }

    // Obtener id_cultivo basado en nombre_cultivo
    const cultivoQuery = await pool.query('SELECT id_cultivo FROM Cultivos WHERE nombre_cultivo = $1', [nombre_cultivo]);
    let id_cultivo = cultivoQuery.rows[0]?.id_cultivo;

    // Si el cultivo no existe, devolver error
    if (!id_cultivo) {
      return res.status(400).json({ error: 'Cultivo no encontrado' });
    }

    // Crear la factura
    const result = await pool.query(
      `INSERT INTO Facturas (
        id_usuario, id_cultivo, kilos_pareja, precio_pareja, 
        kilos_gruesa, precio_gruesa, kilos_millo, precio_millo, 
        fecha_creacion
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *`,
      [
        id_usuario, id_cultivo, kilos_pareja, precio_pareja,
        kilos_gruesa, precio_gruesa, kilos_millo, precio_millo,
        fecha_creacion || null, // Si no se proporciona, se pasa null
      ]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al crear la factura' });
  }
});



// Obtener facturas por nombre de usuario
router.get('/facturas/:nombreUsuario', async (req, res) => {
    const { nombreUsuario } = req.params;

    try {
        // Obtener el ID del usuario por nombre
        const usuario = await db.query('SELECT id_usuario FROM Usuarios WHERE nombre = $1', [nombreUsuario]);
        if (usuario.rows.length === 0) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }
        const idUsuario = usuario.rows[0].id_usuario;

        // Obtener las facturas del usuario
        const facturas = await db.query(
            `SELECT f.*, c.nombre_cultivo 
            FROM Facturas f
            JOIN Cultivos c ON f.id_cultivo = c.id_cultivo
            WHERE f.id_usuario = $1`,
            [idUsuario]
        );

        res.json(facturas.rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al obtener las facturas' });
    }
});


module.exports = router;
