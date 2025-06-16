const express = require('express');
const mysql = require('mysql');
const nodemailer = require('nodemailer');
const cors = require('cors');
const path = require('path');
const basicAuth = require('express-basic-auth');
const dotenv = require('dotenv').config();

const app = express();
const port = process.env.PORT || 3002;

// Middleware
app.use(cors());
app.use(express.json());

// Autenticación básica para /admin
app.use('/admin', basicAuth({
  users: { 'admin': 'juan1038' },
  challenge: true
}));

// Servir archivos estáticos desde la raíz del proyecto (fuera de backend)
app.use(express.static(path.join(__dirname, '..')));

// Mostrar la página admin.html protegida

app.use(express.static(path.join(__dirname, '..')));
app.get('/admin', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'admin.html'));
});

// Conexión a MySQL
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'root',
  database: 'tienda'
});

db.connect(err => {
  if (err) throw err;
  console.log('Conectado a MySQL');
});
// Rutas
const productosRoutes = require('./routes/productos');
app.use('/api/productos', productosRoutes);
// Registrar una compra
app.post('/api/comprar', (req, res) => {
  const { nombre, correo, telefono, productos, total } = req.body;

  db.query('INSERT INTO clientes (nombre, correo, telefono) VALUES (?, ?, ?)', [nombre, correo, telefono], (err, result) => {
    if (err) return res.status(500).send(err);
    
    const clienteId = result.insertId;

    db.query('INSERT INTO facturas (cliente_id, productos, total) VALUES (?, ?, ?)', [clienteId, productos, total], (err2) => {
      if (err2) return res.status(500).send(err2);

  

      const mailOptions = {
        from: '',
        to: correo,
        subject: 'Factura de Compra - Aserrío Donde Chinky',
        text: `Gracias por tu compra, ${nombre}.\n\nProductos: ${productos}\nTotal: $${total}`
      };

      transporter.sendMail(mailOptions, (err3, info) => {
        if (err3) {
          console.log('Error al enviar correo:', err3);
        } else {
          console.log('Correo enviado:', info.response);
        }
      });

      res.send({ mensaje: 'Compra registrada y factura enviada' });
    });
  });
});

// API para productos
app.get('/api/productos', (req, res) => {
  db.query('SELECT * FROM productos', (err, resultados) => {
    if (err) return res.status(500).send(err);
    res.send(resultados);
  });
});

app.post('/admin/productos', (req, res) => {
  const { nombre, precio,cantidad } = req.body;
  db.query('INSERT INTO productos (nombre, precio,cantidad) VALUES (?, ?, ?)', [nombre, precio,cantidad], (err) => {
    if (err) return res.status(500).send(err);
    res.send({ mensaje: 'Producto agregado' });
  });
});

app.put('/admin/productos/:id', (req, res) => {
  const id = req.params.id;
  const { nombre, precio,cantidad } = req.body;
  db.query('UPDATE productos SET nombre = ?, precio = ?,cantidad = ? WHERE id = ?', [nombre, precio,cantidad, id], (err) => {
    if (err) return res.status(500).send(err);
    res.send({ mensaje: 'Producto actualizado' });
  });
});

app.delete('/admin/productos/:id', (req, res) => {
  const id = req.params.id;
  db.query('DELETE FROM productos WHERE id = ?', [id], (err) => {
    if (err) return res.status(500).send(err);
    res.send({ mensaje: 'Producto eliminado' });
  });
});

// Iniciar el servidor
app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});
