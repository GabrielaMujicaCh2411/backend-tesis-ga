const express = require("express");
const router = express.Router();
const fs = require("fs");
const getConnection = require("../sql/connection");

// Controlador para obtener todos los usuarios
router.get("/", async (req, res) => {
  const pool = await getConnection.getConnection();
  const result = await pool.request().query("SELECT * FROM T_Usuario");
  console.log(result);

  res.json();
});

router.post("/register", async (req, res) => {
  const { dni, nombres, apellidos, celular, correo, password } = req.body;

  try {
    const pool = await getConnection.getConnection();

    // Paso 1: Registrar el cliente en T_Cliente
    const clienteQuery = `
    DECLARE @IDCliente INT;
    INSERT INTO T_Cliente (nombres, apellidos, celular, correo)
    OUTPUT inserted.id_cliente
    VALUES ('${nombres}', '${apellidos}', '${celular}', '${correo}');
    SELECT @IDCliente AS IDCliente;`;
    const result = await pool.request().query(clienteQuery);
    const idCliente = result.recordset[0].id_cliente;
    console.log("ID de creación:", idCliente);

    const registrarUsuarioQuery = `INSERT INTO T_Usuario (dniusuario, contraseña, id_rol, id_cliente) 
    VALUES ('${dni}', '${password}', 1, ${idCliente})`;
    await pool.request().query(registrarUsuarioQuery);

    // Paso 4: Consultar todos los usuarios
    const obtenerUsuariosQuery = "SELECT * FROM T_Usuario";
    const usuariosResult = await pool.request().query(obtenerUsuariosQuery);
    const usuarios = usuariosResult.recordset;

    res.status(200).json({ message: "Registro Exitoso" });
  } catch (error) {
    console.error("Error al registrar el usuario:", error);
    res.status(500).json({ message: "Error al registrar el usuario" });
  }
});

// Ruta para actualizar datos del cliente
router.put("/update", async (req, res) => {
  const { dni, nombres, apellidos, celular, correo, password } = req.body;

  try {
    const pool = await getConnection.getConnection();

    // Paso 1: Actualizar datos del cliente en T_Cliente
    const clienteQuery = `
    UPDATE T_Cliente
    SET nombres = '${nombres}', apellidos = '${apellidos}', celular = '${celular}', correo = '${correo}'
    WHERE dni = '${dni}'`;
    await pool.request().query(clienteQuery);

    // Paso 2: Actualizar contraseña del usuario en T_Usuario
    const actualizarUsuarioQuery = `
    UPDATE T_Usuario
    SET contraseña = '${password}'
    WHERE dniusuario = '${dni}'`;
    await pool.request().query(actualizarUsuarioQuery);

    res.status(200).json({ message: "Datos actualizados correctamente" });
  } catch (error) {
    console.error("Error al actualizar datos:", error);
    res.status(500).json({ message: "Error al actualizar datos del cliente" });
  }
});

router.post("/login", async (req, res) => {
  const { dni, password } = req.body;

  try {
    const pool = await getConnection.getConnection();

    // Consultar el usuario por DNI y contraseña con JOIN en las tablas relacionadas
    const consultaUsuarioQuery = `
      SELECT U.*, C.nombres, C.apellidos, C.celular, C.correo, R.nombreRol, R.descripcionRol
      FROM T_Usuario U
      INNER JOIN T_Cliente C ON U.id_cliente = C.id_cliente
      INNER JOIN T_Rol R ON U.id_rol = R.id_rol
      WHERE U.dniUsuario = '${dni}' AND U.contraseña = '${password}'
    `;
    const usuariosResult = await pool.request().query(consultaUsuarioQuery);
    const usuarios = usuariosResult.recordset;

    // Verificar si se encontró un usuario válido
    if (usuarios.length > 0) {
      const usuario = usuarios[0];

      // Usuario válido, se puede generar un token de autenticación o realizar otras acciones
      res
        .status(200)
        .json({ message: "Credenciales válidas", userData: usuario });
    } else {
      // Usuario no encontrado o credenciales incorrectas
      res.status(401).json({ message: "Credenciales inválidas" });
    }
  } catch (error) {
    console.error("Error al realizar el inicio de sesión:", error);
    res.status(500).send("Error al realizar el inicio de sesión");
  }
});

module.exports = router;
