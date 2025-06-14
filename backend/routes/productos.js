const express = require('express');
const router = express.Router();
const db = require('../db');

// Ruta GET para obtener todos los productos
router.get('/', (req, res) => {
  const query = 'SELECT * FROM productos';

  db.query(query, (err, results) => {
    if (err) {
      console.error('Error al obtener productos:', err);
      return res.status(500).json({ error: 'Error al obtener productos' });
    }
    res.json(results);
  });
});

// Ruta POST para insertar o actualizar un producto
router.post('/', (req, res) => {
  const { nombre, precio } = req.body;

  const sql = `
    INSERT INTO productos (nombre, precio,cantidad)
    VALUES (?, ?, ?)
    ON DUPLICATE KEY UPDATE precio = VALUES(precio)
    cantidad = VALUES(cantidad)
  `;

  db.query(sql, [nombre, precio, cantidad], (err) => {
    if (err) {
      console.error('Error al guardar producto:', err);
      return res.status(500).json({ message: 'Error al guardar el producto' });
    }
    res.json({ message: 'Producto guardado correctamente' });
  });
});

module.exports = router;
