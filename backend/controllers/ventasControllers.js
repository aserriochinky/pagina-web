const db = require('../db');
const nodemailer = require('nodemailer');

exports.registrarVenta = (req, res) => {
  const { nombre, correo, telefono, producto, cantidad, total } = req.body;

  // Insertar cliente
  db.query('INSERT INTO clientes (nombre, correo, telefono) VALUES (?, ?, ?)', [nombre, correo, telefono], (err, result) => {
    if (err) return res.status(500).send(err);
    const cliente_id = result.insertId;

    // Insertar venta
    db.query('INSERT INTO ventas (cliente_id, producto, cantidad, total) VALUES (?, ?, ?, ?)', [cliente_id, producto, cantidad, total], (err2) => {
      if (err2) return res.status(500).send(err2);

      // Enviar correo
      require('dotenv').config();
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }

      });

      const mailOptions = {
        from: 'tucorreo@gmail.com',
        to: correo,
        subject: 'Factura de compra',
        html: `<h1>Gracias por tu compra</h1><p>Producto: ${producto}<br>Cantidad: ${cantidad}<br>Total: $${total}</p>`
      };

      transporter.sendMail(mailOptions, (error, info) => {
        if (error) console.error(error);
        res.status(200).send('Venta registrada y correo enviado');
      });
    });
  });
};
