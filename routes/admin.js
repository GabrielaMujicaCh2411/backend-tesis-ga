const express = require("express");
const router = express.Router();
const getConnection = require("../sql/connection");

// Ruta para obtener todos los datos de T_Trabajador
router.get("/trabajadores", async (req, res) => {
  try {
    // Obtener la conexión a la base de datos
    const pool = await getConnection.getConnection();

    // Consultar todos los datos de T_Trabajador con JOIN en las tablas relacionadas
    const query = `
      SELECT TT.id_tipotrabajador, TT.nombretipotrabajador, ET.nombreestadotrabajador AS estado_trabajador, T.*
      FROM T_Trabajador T
      INNER JOIN T_TipoTrabajador TT ON T.id_tipotrabajador = TT.id_tipotrabajador
      INNER JOIN T_EstadoTrabajador ET ON T.id_estadotrabajador = ET.id_estadotrabajador
    `;
    const result = await pool.request().query(query);

    // Enviar los datos como respuesta en formato JSON
    res.status(200).json(result.recordset);
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ error: "Error al obtener los datos de T_Trabajador" });
  }
});

// Ruta para obtener un trabajador por ID
router.get("/trabajador/:id", async (req, res) => {
  try {
    const idTrabajador = req.params.id;

    // Obtener la conexión a la base de datos
    const pool = await getConnection.getConnection();

    // Consultar el trabajador por ID en la tabla T_Trabajador con JOIN en las tablas relacionadas
    const query = `
      SELECT TT.nombretipotrabajador, ET.nombreestadotrabajador AS estado_trabajador, T.*
      FROM T_Trabajador T
      INNER JOIN T_TipoTrabajador TT ON T.id_tipotrabajador = TT.id_tipotrabajador
      INNER JOIN T_EstadoTrabajador ET ON T.id_estadotrabajador = ET.id_estadotrabajador
      WHERE T.id_trabajador = ${idTrabajador}
    `;
    const result = await pool.request().query(query);

    // Verificar si se encontró un trabajador con el ID especificado
    if (result.recordset.length === 0) {
      res.status(404).json({ message: "Trabajador no encontrado" });
    } else {
      // Enviar los datos del trabajador como respuesta en formato JSON
      const trabajador = result.recordset[0];
      res.status(200).json(trabajador);
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Error al obtener el trabajador" });
  }
});

// Ruta para crear un nuevo trabajador
router.post("/registrar-trabajador", async (req, res) => {
  try {
    const {
      dni,
      nombres,
      apellidos,
      celular,
      id_tipotrabajador,
      id_estadotrabajador,
    } = req.body;

    // Obtener la conexión a la base de datos
    const pool = await getConnection.getConnection();

    // Insertar el nuevo trabajador en la tabla T_Trabajador
    const registrarTrabajadorQuery = `INSERT INTO T_Trabajador (dni, nombres, apellidos, celular, id_tipotrabajador, id_estadotrabajador) 
        VALUES ('${dni}', '${nombres}', '${apellidos}', ${celular}, ${id_tipotrabajador}, ${id_estadotrabajador})`;
    await pool.request().query(registrarTrabajadorQuery);

    res.status(201).json({ message: "Trabajador creado exitosamente" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Error al crear el trabajador" });
  }
});

// Ruta para editar un trabajador por ID
router.put("/editar-trabajador/:id", async (req, res) => {
  try {
    const idTrabajador = req.params.id;
    const {
      dni,
      nombres,
      apellidos,
      celular,
      id_tipotrabajador,
      id_estadotrabajador,
    } = req.body;

    // Obtener la conexión a la base de datos
    const pool = await getConnection.getConnection();

    // Actualizar los datos del trabajador en la tabla T_Trabajador
    const editarTrabajadorQuery = `
      UPDATE T_Trabajador
      SET dni = '${dni}',
          nombres = '${nombres}',
          apellidos = '${apellidos}',
          celular = '${celular}',
          id_tipotrabajador = ${id_tipotrabajador},
          id_estadotrabajador = ${id_estadotrabajador}
      WHERE id_trabajador = ${idTrabajador}`;
    await pool.request().query(editarTrabajadorQuery);

    res.status(200).json({ message: "Trabajador actualizado exitosamente" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Error al actualizar el trabajador" });
  }
});

router.get("/roles", async (req, res) => {
  try {
    // Obtener la conexión a la base de datos
    const pool = await getConnection.getConnection();

    // Consultar los roles en la tabla T_Rol
    const obtenerRolesQuery = "SELECT * FROM T_Rol";
    const result = await pool.request().query(obtenerRolesQuery);

    // Enviar los datos de los roles como respuesta en formato JSON
    const roles = result.recordset;
    res.status(200).json(roles);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Error al obtener los roles" });
  }
});

router.get("/tipo-trabajador", async (req, res) => {
  try {
    // Obtener la conexión a la base de datos
    const pool = await getConnection.getConnection();

    // Consultar los roles en la tabla T_Rol
    const obtenerRolesQuery = "SELECT * FROM T_TipoTrabajador";
    const result = await pool.request().query(obtenerRolesQuery);

    // Enviar los datos de los roles como respuesta en formato JSON
    const roles = result.recordset;
    res.status(200).json(roles);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Error al obtener los roles" });
  }
});

router.get("/estados-trabajador", async (req, res) => {
  try {
    // Obtener la conexión a la base de datos
    const pool = await getConnection.getConnection();

    // Consultar los estados de trabajador en la tabla T_EstadoTrabajador
    const obtenerEstadosTrabajadorQuery = "SELECT * FROM T_EstadoTrabajador";
    const result = await pool.request().query(obtenerEstadosTrabajadorQuery);

    // Enviar los datos de los estados de trabajador como respuesta en formato JSON
    const estadosTrabajador = result.recordset;
    res.status(200).json(estadosTrabajador);
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ error: "Error al obtener los estados de trabajador" });
  }
});

// Ruta para obtener todos los datos
router.get("/unidades", async (req, res) => {
  try {
    // Obtener la conexión a la base de datos
    const pool = await getConnection.getConnection();

    // Consultar todos los datos de T_Unidad con JOIN en las tablas relacionadas
    const query = `
      SELECT TU.nombretipounidad, EU.nombrestadounidad, U.*
      FROM T_Unidad U
      INNER JOIN T_TipoUnidad TU ON U.id_tipounidad = TU.id_tipounidad
      INNER JOIN T_EstadoUnidad EU ON U.id_estadounidad = EU.id_estadounidad
    `;
    const result = await pool.request().query(query);

    // Enviar los datos como respuesta en formato JSON
    res.status(200).json(result.recordset);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Error al obtener los datos de T_Unidades" });
  }
});

router.post("/registrar-unidad", async (req, res) => {
  try {
    const {
      serie,
      nombres,
      modelo,
      marca,
      cantidad,
      descripcion,
      caracteristica1,
      caracteristica2,
      caracteristica3,
      id_tipounidad,
      id_estadounidad,
      imagenes,
      precio,
    } = req.body;

    // Obtener la conexión a la base de datos
    const pool = await getConnection.getConnection();

    // Insertar la nueva unidad en la tabla T_Unidad
    const registrarUnidadQuery = `INSERT INTO T_Unidad (serie, nombres, modelo, marca, cantidad, descripcion, caracteristicas1, caracteristicas2, caracteristicas3, id_tipounidad, id_estadounidad, imagenes, precio) 
        VALUES ('${serie}', '${nombres}', '${modelo}', '${marca}', ${cantidad}, '${descripcion}', '${caracteristica1}', '${caracteristica2}', '${caracteristica3}', ${id_tipounidad}, ${id_estadounidad}, '${imagenes}', ${precio})`;
    await pool.request().query(registrarUnidadQuery);

    res.status(201).json({ message: "Unidad registrada exitosamente" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Error al registrar la unidad" });
  }
});

router.put("/actualizar-unidad/:id", async (req, res) => {
  try {
    const unidadId = req.params.id;
    const {
      serie,
      nombres,
      modelo,
      marca,
      cantidad,
      descripcion,
      caracteristica1,
      caracteristica2,
      caracteristica3,
      id_tipounidad,
      id_estadounidad,
      imagenes,
    } = req.body;

    // Obtener la conexión a la base de datos
    const pool = await getConnection.getConnection();

    // Actualizar los datos de la unidad en la tabla T_Unidad
    const actualizarUnidadQuery = `
      UPDATE T_Unidad
      SET serie = '${serie}',
          nombres = '${nombres}',
          modelo = '${modelo}',
          marca = '${marca}',
          cantidad = ${cantidad},
          descripcion = '${descripcion}',
          caracteristicas1 = '${caracteristica1}',
          caracteristicas2 = '${caracteristica2}',
          caracteristicas3 = '${caracteristica3}',
          id_tipounidad = ${id_tipounidad},
          id_estadounidad = ${id_estadounidad},
          imagenes = '${imagenes}'
      WHERE id_unidad = ${unidadId}`;
    await pool.request().query(actualizarUnidadQuery);

    res
      .status(200)
      .json({ message: "Datos de la unidad actualizados exitosamente" });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ error: "Error al actualizar los datos de la unidad" });
  }
});

router.get("/unidad/:id", async (req, res) => {
  try {
    const unidadId = req.params.id;

    // Obtener la conexión a la base de datos
    const pool = await getConnection.getConnection();

    // Consultar los datos de la unidad en la tabla T_Unidad con JOIN en las tablas relacionadas
    const obtenerUnidadQuery = `
      SELECT TU.nombretipounidad, EU.nombrestadounidad, U.*
      FROM T_Unidad U
      INNER JOIN T_TipoUnidad TU ON U.id_tipounidad = TU.id_tipounidad
      INNER JOIN T_EstadoUnidad EU ON U.id_estadounidad = EU.id_estadounidad
      WHERE U.id_unidad = ${unidadId}
    `;
    const result = await pool.request().query(obtenerUnidadQuery);

    // Verificar si se encontró la unidad
    if (result.recordset.length === 0) {
      return res.status(404).json({ error: "La unidad no fue encontrada" });
    }

    // Enviar los datos de la unidad como respuesta en formato JSON
    const unidad = result.recordset[0];
    res.status(200).json(unidad);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Error al obtener los datos de la unidad" });
  }
});

router.get("/estados-unidades", async (req, res) => {
  try {
    // Obtener la conexión a la base de datos
    const pool = await getConnection.getConnection();

    // Consultar los estados de las unidades en la tabla T_EstadoUnidad
    const obtenerEstadosUnidadesQuery = "SELECT * FROM T_EstadoUnidad";
    const result = await pool.request().query(obtenerEstadosUnidadesQuery);

    // Enviar los datos de los estados de las unidades como respuesta en formato JSON
    const estadosUnidades = result.recordset;
    res.status(200).json(estadosUnidades);
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ error: "Error al obtener los estados de las unidades" });
  }
});

router.get("/tipos-unidades", async (req, res) => {
  try {
    // Obtener la conexión a la base de datos
    const pool = await getConnection.getConnection();

    // Consultar los tipos de unidades en la tabla T_TipoUnidad
    const obtenerTiposUnidadesQuery = "SELECT * FROM T_TipoUnidad";
    const result = await pool.request().query(obtenerTiposUnidadesQuery);

    // Enviar los datos de los tipos de unidades como respuesta en formato JSON
    const tiposUnidades = result.recordset;
    res.status(200).json(tiposUnidades);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Error al obtener los tipos de unidades" });
  }
});

// Ruta para registrar una partida
router.post("/registrar-partida", async (req, res) => {
  try {
    const {
      descripcion,
      metrado,
      cantidadUnidad,
      precioUnidad,
      idTipoPartida,
    } = req.body;

    // Obtener la conexión a la base de datos
    const pool = await getConnection.getConnection();

    // Insertar la nueva partida en la tabla T_Partida
    const registrarPartidaQuery = `INSERT INTO T_Partida (descripcion, metrado, cantidadUnidad, precioUnidad, id_tipopartida) 
      VALUES ('${descripcion}', ${metrado}, ${cantidadUnidad}, ${precioUnidad}, ${idTipoPartida})`;
    await pool.request().query(registrarPartidaQuery);

    res.status(201).json({ message: "Partida registrada exitosamente" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Error al registrar la partida" });
  }
});

// Ruta para obtener las partidas por ID del tipo de partida
router.get("/get-partidas/:idTipoPartida", async (req, res) => {
  try {
    const idTipoPartida = req.params.idTipoPartida;

    // Obtener la conexión a la base de datos
    const pool = await getConnection.getConnection();

    // Consultar las partidas según el ID del tipo de partida con JOIN en la tabla relacionada
    const obtenerPartidasQuery = `
      SELECT TP.nombretipopartida, P.*
      FROM T_Partida P
      INNER JOIN T_TipoPartida TP ON P.id_tipopartida = TP.id_tipopartida
      WHERE P.id_tipopartida = ${idTipoPartida}
    `;
    const result = await pool.request().query(obtenerPartidasQuery);

    res.status(200).json(result.recordset);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Error al obtener las partidas" });
  }
});

// Ruta para editar una partida específica
router.put("/edit-partidas/:idPartida", async (req, res) => {
  try {
    const idPartida = req.params.idPartida;
    const {
      descripcion,
      metrado,
      cantidadUnidad,
      precioUnidad,
      idTipoPartida,
    } = req.body;

    // Obtener la conexión a la base de datos
    const pool = await getConnection.getConnection();

    // Actualizar la partida en la tabla T_Partida
    const editarPartidaQuery = `UPDATE T_Partida SET descripcion = '${descripcion}', metrado = ${metrado}, cantidadUnidad = ${cantidadUnidad}, precioUnidad = ${precioUnidad}, id_tipopartida = ${idTipoPartida} WHERE id_partida = ${idPartida}`;
    await pool.request().query(editarPartidaQuery);

    res.status(200).json({ message: "Partida actualizada exitosamente" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Error al actualizar la partida" });
  }
});

// Ruta para obtener los datos de una partida específica
router.get("/partidas/:idPartida", async (req, res) => {
  try {
    const idPartida = req.params.idPartida;

    // Obtener la conexión a la base de datos
    const pool = await getConnection.getConnection();

    // Consultar los datos de la partida en la tabla T_Partida con JOIN en la tabla relacionada
    const obtenerPartidaQuery = `
      SELECT TP.nombretipopartida, P.*
      FROM T_Partida P
      INNER JOIN T_TipoPartida TP ON P.id_tipopartida = TP.id_tipopartida
      WHERE P.id_partida = ${idPartida}
    `;
    const result = await pool.request().query(obtenerPartidaQuery);

    // Verificar si se encontraron datos
    if (result.recordset.length > 0) {
      // Partida encontrada, enviar los datos como respuesta en formato JSON
      const partida = result.recordset[0];
      res.status(200).json(partida);
    } else {
      // Partida no encontrada
      res.status(404).json({ message: "Partida no encontrada" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Error al obtener los datos de la partida" });
  }
});

// Ruta para obtener todos los tipos de partidas
router.get("/tipos-partidas", async (req, res) => {
  try {
    // Obtener la conexión a la base de datos
    const pool = await getConnection.getConnection();

    // Consultar todos los tipos de partidas en la tabla T_TipoPartida
    const obtenerTiposPartidasQuery = "SELECT * FROM T_TipoPartida";
    const result = await pool.request().query(obtenerTiposPartidasQuery);

    // Verificar si se encontraron datos
    if (result.recordset.length > 0) {
      // Tipos de partidas encontrados, enviar los datos como respuesta en formato JSON
      const tiposPartidas = result.recordset;
      res.status(200).json(tiposPartidas);
    } else {
      // No se encontraron tipos de partidas
      res.status(404).json({ message: "No se encontraron tipos de partidas" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Error al obtener los tipos de partidas" });
  }
});

// Ruta para eliminar una partida
router.delete("/partidas/:idPartida", async (req, res) => {
  try {
    const idPartida = req.params.idPartida;

    // Obtener la conexión a la base de datos
    const pool = await getConnection.getConnection();

    // Verificar si la partida existe antes de eliminarla
    const verificarPartidaQuery = `SELECT * FROM T_Partida WHERE id_partida = ${idPartida}`;
    const verificarPartidaResult = await pool
      .request()
      .query(verificarPartidaQuery);

    if (verificarPartidaResult.recordset.length === 0) {
      // La partida no existe, devolver un error
      res.status(404).json({ message: "La partida no existe" });
      return;
    }

    // Eliminar la partida de la tabla T_Partida
    const eliminarPartidaQuery = `DELETE FROM T_Partida WHERE id_partida = ${idPartida}`;
    await pool.request().query(eliminarPartidaQuery);

    res.status(200).json({ message: "Partida eliminada correctamente" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Error al eliminar la partida" });
  }
});

// Ruta para obtener todas las obras
router.get("/obras", async (req, res) => {
  try {
    // Obtener la conexión a la base de datos
    const pool = await getConnection.getConnection();

    // Consultar todas las obras de la tabla T_Obra con JOIN en la tabla relacionada
    const query = `
      SELECT EO.nombreestadoobra, O.*
      FROM T_Obra O
      INNER JOIN T_EstadoObra EO ON O.id_estadoobra = EO.id_estadoobra
    `;
    const result = await pool.request().query(query);

    // Enviar los datos como respuesta en formato JSON
    res.status(200).json(result.recordset);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Error al obtener las obras" });
  }
});

// RUTA PARA OBTENER OSLO 1 OBRA
router.get("/obra/:id", async (req, res) => {
  try {
    const idObra = req.params.id;

    // Obtener la conexión a la base de datos
    const pool = await getConnection.getConnection();

    // Consultar los datos de la obra por ID en la tabla T_Obra con JOIN en la tabla relacionada
    const query = `
      SELECT EO.nombreestadoobra, O.*
      FROM T_Obra O
      INNER JOIN T_EstadoObra EO ON O.id_estadoobra = EO.id_estadoobra
      WHERE O.id_obra = ${idObra}
    `;
    const result = await pool.request().query(query);

    // Verificar si se encontraron datos
    if (result.recordset.length > 0) {
      // Obra encontrada, enviar los datos como respuesta en formato JSON
      const obra = result.recordset[0];
      res.status(200).json(obra);
    } else {
      // Obra no encontrada
      res.status(404).json({ message: "Obra no encontrada" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Error al obtener los datos de la obra" });
  }
});

// Ruta para insertar un nuevo pedido
router.post("/insertar-pedido", async (req, res) => {
  try {
    const {
      fechaInicio,
      obra,
      empresa,
      ubicacion,
      fechaEntrega,
      precioPedido,
      id_estadopedido,
      id_trabajador,
      id_usuario,
      canthoras,
    } = req.body;

    // Obtener la conexión a la base de datos
    const pool = await getConnection.getConnection();

    // Insertar el nuevo pedido en la tabla T_Pedido
    const query = `INSERT INTO T_Pedido (fechaInicio, obra, empresa, ubicacion, fechaEntrega, precioPedido, id_estadopedido, id_trabajador, id_usuario, canthoras)
                   VALUES ('${fechaInicio}', '${obra}', '${empresa}', '${ubicacion}', '${fechaEntrega}', ${precioPedido}, ${id_estadopedido}, ${id_trabajador}, ${id_usuario}, ${canthoras})`;
    await pool.request().query(query);

    res.status(201).json({ message: "Pedido creado exitosamente" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Error al crear el pedido" });
  }
});

module.exports = router;
