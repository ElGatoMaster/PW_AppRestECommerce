import * as ProdServServices from '../services/ProdServ.service';
import boom from '@hapi/boom';

export const getProdServList = async (req, res, next) => {
    try {
        const prodServList = await ProdServServices.getProdServList();
        if (!prodServList) {
            throw boom.notFound('No se encontraron productos/servicios registrados.');
        } else if (prodServList) {
            res.status(200).json(prodServList);
        }

    } catch (error) {
        next(error);
    }
};

export const getProdServItem = async (req, res, next) => {
    try {
        const { id } = req.params;
        
        const keyType = req.query.keyType || 'OK';
        const prodServItem = await ProdServServices.getProdServItem(id, keyType);
        if (!prodServItem) {
            throw boom.notFound('No se encontraron productos/servicios registrados.');
        } else if (prodServItem) {
            res.status(200).json(prodServItem);
        }
    } catch (error) {
        next(error);
    }
};


    

// Controlador para buscar productos por descripción
export const buscarPorDescripcion = async (req, res, next) => {
  try {
    // Obtiene el parámetro de búsqueda desde la consulta
    const query = req.query.q;
    // Llama al servicio para buscar productos
    const productos = await ProdServServices.searchProductsByDescription(query);    
    // Verifica si se encontraron productos
    if (!productos || productos.length === 0) {
      throw boom.notFound(`No se encontraron productos que coincidan con la descripción: "${query}"`);
    }
    // Devuelve los productos encontrados
    res.status(200).json(productos);
  } catch (error) {
    next(error); // Maneja el error con el middleware
  }
};



// Obtener productos activos
export const obtenerActivos = async (req, res, next) => {
  try {
    const productos = await ProdServServices.getActiveProducts();
    
    if (!productos || productos.length === 0) {
      throw boom.notFound('No se encontraron productos activos');
    }

    res.status(200).json(productos);
  } catch (error) {
    next(error);
  }
};


// Obtener productos por estatus
export const obtenerPorEstatus = async (req, res) => {
  try {
    const productos = await ProdServServices.getProductsByStatus(req.params.tipo);
    res.json(productos);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener productos por estatus' });
  }
};

// Obtener productos por negocio
export const obtenerProductosPorNegocio = async (req, res, next) => {
  try {
    const productos = await ProdServServices.getProductsByBusiness(req.params.idNegocio);
    res.status(200).json(productos);
  } catch (error) {
    next(error);
  }
};


// Controlador para obtener productos por descripción de presentación
export const obtenerProductosPorDescripcionPresentacion = async (req, res, next) => {
  try {
    const productos = await ProdServServices.getProductsByPresentationDescription(req.params.desPresenta);
    res.status(200).json(productos);
  } catch (error) {
    next(error);
  }
};


// Controlador para obtener estadísticas de productos
export const obtenerEstadisticasProductos = async (req, res, next) => {
  try {
    const estadisticas = await ProdServServices.getProductStatistics();
    res.status(200).json(estadisticas);
  } catch (error) {
    next(error);
  }
};



//API POST (ADD) Producto.
export const postProdServItem = async (req, res, next) => {
    try {
        const paProdServItem = req.body;
        const newProdServItem = await ProdServServices.postProdServItem(paProdServItem);
        if (!newProdServItem) {
            throw boom.badRequest('No se pudo crear el Producto y/o Servicio.');
        } else if (newProdServItem) {
            res.status(201).json(newProdServItem);
        }
    } catch (error) {
        console.log(error);
        next(error);
    }
};

//API PUT Producto
export const putProdServItem = async (req, res, next) => {
    try {
        const { id } = req.params;
        console.log('controller id -> ', id);
        const paProdServItem = req.body;
        console.log('controller body -> ', paProdServItem);
        const updatedProdServItem = await ProdServServices.putProdServItem(id, paProdServItem);
        if (!updatedProdServItem) {
            throw boom.badRequest('No se pudo actualizar el Producto.');
        } else if (updatedProdServItem) {
            res.status(200).json(updatedProdServItem);
        }
    } catch (error) {
        next(error);
    }
};

//API DELETE Producto HARD DELETE
export const deleteProdServItem = async (req, res, next) => {
    try {
      const { id } = req.params;
      const { keyType="OK" } = req.query;
      console.log('controlador id -> ', id);
      console.log('controlador keyType -> ', keyType);

      const deletedProdServItem = await ProdServServices.deleteProdServItem(id,keyType);
  
      if (!deletedProdServItem) {
        throw boom.badRequest('El producto que deseas eliminar no exite, o ya fue eliminado');
      }else{
        res.status(200).json(deletedProdServItem);
      }
    } catch (error) {
      console.error('Error en el controlador:', error);
      next(error);
    }
};  


//Control para solo actualizar los valores en un delete
//SOFT DELETE
export const deletePutProdServItem = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { keyType='OK' } = req.query;
    console.log('controlador id -> ', id);
    console.log('controlador keyType -> ', keyType);

    const { usuario } = req.query.usuario || 'YVAN ACOSTA';
    console.log('controlador usuario ->', usuario); 

    const deletedProdServItem = await ProdServServices.deletePutProdServ(id,keyType,usuario);

    if (!deletedProdServItem) {
      throw boom.badRequest('El producto que deseas eliminar no exite, o ya fue eliminado');
    }else{
      res.status(200).json(deletedProdServItem);
    }
  } catch (error) {
    console.error('Error en el controlador:', error);
    next(error);
  }
};  


//-----------------------------------------PRESENTACIONES---------------------------------------------------/
export const getProdServPresentations = async (req, res, next) => {
  try {
    const { id } = req.params;
    const keyType = req.query.keyType || 'OK';

    // Llamar al servicio para obtener las presentaciones del producto
    const presentations = await ProdServServices.getProdServPresentations(id, keyType);
    
    if (!presentations) {
      throw boom.notFound('No se encontraron presentaciones para este producto.');
    } else {
      res.status(200).json(presentations); // Retornar solo las presentaciones
    }
  } catch (error) {
    next(error);
  }
};

//POST
export const addProdServPresentation = async (req, res, next) => {
  try {
    const { id } = req.params;
    const keyType = req.query.keyType || 'OK';
    const newPresentation = req.body;  // Obtener la nueva presentación desde el cuerpo de la solicitud

    // Llamar al servicio para agregar la nueva presentación
    const updatedPresentations = await ProdServServices.addProdServPresentation(id, keyType, newPresentation);
    
    res.status(201).json(updatedPresentations); // Retornar las presentaciones actualizadas
  } catch (error) {
    next(error);
  }
};
//PUT
export const updateProdServPresentation = async (req, res, next) => {
 
  try {
    const { id, presentationId } = req.params;
    const keyType = req.query.keyType || 'OK';
    const updatedPresentation = req.body;
    console.log("hola cotnrol",presentationId)
    // Llamar al servicio para actualizar la presentación
    const updatedPresentations = await ProdServServices.updateProdServPresentation(id, keyType, presentationId, updatedPresentation);
    console.log(updatedPresentations,"Control")
    res.status(200).json(updatedPresentations); // Retornar las presentaciones actualizadas
  } catch (error) {
    next(error);
  }
};

// DELETE - Eliminar una presentación
export const deleteProdServPresentation = async (req, res, next) => {
  try {
    const { id, presentationId } = req.params;
    const keyType = req.query.keyType || 'OK';

    // Llamar al servicio para eliminar la presentación
    const updatedPresentations = await ProdServServices.deleteProdServPresentation(id, keyType, presentationId);

    res.status(200).json(updatedPresentations); // Retornar las presentaciones restantes
  } catch (error) {
    next(error);
  }
};




//---------------------------------PRESENTACIONES presentaciones_info_add------------------------------/
//----------------------------------GET


export const getProdServPresentationInfoAdd = async (req, res, next) => {
  try {
    const { id, idPresentacion } = req.params;  // Obtener el id del producto y el id de la presentación
    const keyType = req.query.keyType || 'OK';   // Obtener el tipo de ID (OK o BK), por defecto 'OK'
    // Buscar el producto y la presentación dentro de las presentaciones
    const prodServItem = await ProdServServices.getProdServItem(id, keyType);
    if (!prodServItem) {
      throw boom.notFound('Producto no encontrado.');
    }
    // Buscar la presentación específica dentro de las presentaciones del producto
    const presentacion = prodServItem.presentaciones.find(p => p.IdPresentaOK === idPresentacion || p.IdPresentaBK === idPresentacion);
    if (!presentacion) {
      throw boom.notFound('Presentación no encontrada.');
    }
    // Devolver la información de "presentaciones_info_add"
    res.status(200).json(presentacion.info_ad);
  } catch (error) {
    next(error);
  }
};

//---------------------------POST
export const addProdServPresentationInfoAdd = async (req, res, next) => {
  try {
    const { id, presentationId } = req.params;
    // Obtener el id del producto y la presentación
    console.log("aqui si?",presentationId,id)
    const keyType = req.query.keyType || 'OK'; // Obtener el tipo de ID (OK o BK), por defecto 'OK'
    const newInfo = req.body; // Obtener la nueva información a agregar al subdocumento info_ad

    // Llamar al servicio para agregar la nueva información
    const updatedPresentation = await ProdServServices.addProdServPresentationInfoAdd(id, keyType, presentationId, newInfo);

    res.status(201).json(updatedPresentation); // Retornar la presentación con la nueva información
  } catch (error) {
    next(error);
  }
};

//-------------------------PUT
export const updateProdServPresentationInfoAdd = async (req, res, next) => {
  try {
    const { id, presentationId, infoID } = req.params; // Obtener los IDs
    const keyType = req.query.keyType || 'OK'; // Obtener el tipo de ID (OK o BK), por defecto 'OK'
    const updatedInfo = req.body; // Obtener la nueva información a actualizar en info_ad

    // Llamar al servicio para actualizar la información
    const updatedPresentation = await ProdServServices.updateProdServPresentationInfoAdd(id, keyType, presentationId, infoID, updatedInfo);

    res.status(200).json(updatedPresentation); // Retornar la presentación actualizada
  } catch (error) {
    next(error);
  }
};

//------------------------DELETE
export const deleteProdServPresentationInfoAdd = async (req, res, next) => {
  try {
    const { id, idPresentacion, infoAdId } = req.params; // Obtener los IDs
    const keyType = req.query.keyType || 'OK'; // Obtener el tipo de ID (OK o BK), por defecto 'OK'

    // Llamar al servicio para eliminar la información
    const updatedPresentation = await ProdServServices.deleteProdServPresentationInfoAdd(id, keyType, idPresentacion, infoAdId);

    res.status(200).json(updatedPresentation); // Retornar la presentación actualizada sin el info_ad eliminado
  } catch (error) {
    next(error);
  }
};


//---------------------------------PRESENTACIONES presentaciones_paquete------------------------------/
//----------------------------------GET

export const getProdServPresentationPaquete = async (req, res, next) => {
  try {
    const { id, idPresentacion } = req.params;  // Obtener el id del producto y el id de la presentación
    const keyType = req.query.keyType || 'OK';   // Obtener el tipo de ID (OK o BK), por defecto 'OK'
    // Buscar el producto y la presentación dentro de las presentaciones
    const prodServItem = await ProdServServices.getProdServItem(id, keyType);
    if (!prodServItem) {
      throw boom.notFound('Producto no encontrado.');
    }
    // Buscar la presentación específica dentro de las presentaciones del producto
    const presentacion = prodServItem.presentaciones.find(p => p.IdPresentaOK === idPresentacion || p.IdPresentaBK === idPresentacion);
    if (!presentacion) {
      throw boom.notFound('Presentación no encontrada.');
    }
    // Devolver la información de "presentaciones_info_add"
    res.status(200).json(presentacion.paquete);
  } catch (error) {
    next(error);
  }
};

//POST
export const addProdServPaquete = async (req, res, next) => {
  try {
    const { id, presentationId } = req.params;
    const keyType = req.query.keyType || 'OK'; // Obtener el tipo de ID (OK o BK), por defecto 'OK'
    const newPaquete = req.body; // Obtener la nueva información de paquete a agregar

    // Llamar al servicio para agregar la nueva información
    const updatedPresentation = await ProdServServices.addProdServPaquete(id, keyType, presentationId, newPaquete);

    res.status(201).json(updatedPresentation); // Retornar la presentación con el nuevo paquete
  } catch (error) {
    next(error);
  }
};

//-------------------------PUT
export const updateProdServPaquete = async (req, res, next) => {
  try {
    const { id, presentationId, paqueteId } = req.params; // Obtener los IDs
    const keyType = req.query.keyType || 'OK'; // Obtener el tipo de ID (OK o BK), por defecto 'OK'
    const updatedPaquete = req.body; // Obtener la nueva información de paquete

    // Llamar al servicio para actualizar el paquete
    const updatedPresentation = await ProdServServices.updateProdServPaquete(id, keyType, presentationId, paqueteId, updatedPaquete);

    res.status(200).json(updatedPresentation); // Retornar la presentación actualizada con el paquete modificado
  } catch (error) {
    next(error);
  }
};

//------------------------DELETE
export const deleteProdServPaquete = async (req, res, next) => {
  try {
    const { id, idPresentacion, paqueteId } = req.params; // Obtener los IDs
    const keyType = req.query.keyType || 'OK'; // Obtener el tipo de ID (OK o BK), por defecto 'OK'

    // Llamar al servicio para eliminar el paquete
    const updatedPresentation = await ProdServServices.deleteProdServPaquete(id, keyType, idPresentacion, paqueteId);

    res.status(200).json(updatedPresentation); // Retornar la presentación actualizada sin el paquete eliminado
  } catch (error) {
    next(error);
  }
};











//------------------------------Archivos
//Get
//---------------------------------PRESENTACIONES presentaciones_paquete------------------------------/
//----------------------------------GET
export const getProdServPresentationArchivo = async (req, res, next) => {
  try {
    const { id, idPresentacion } = req.params;  // Obtener el id del producto y el id de la presentación
    const keyType = req.query.keyType || 'OK';   // Obtener el tipo de ID (OK o BK), por defecto 'OK'
    // Buscar el producto y la presentación dentro de las presentaciones
    const prodServItem = await ProdServServices.getProdServItem(id, keyType);
    if (!prodServItem) {
      throw boom.notFound('Producto no encontrado.');
    }
    // Buscar la presentación específica dentro de las presentaciones del producto
    const presentacion = prodServItem.presentaciones.find(p => p.IdPresentaOK === idPresentacion || p.IdPresentaBK === idPresentacion);
    if (!presentacion) {
      throw boom.notFound('Presentación no encontrada.');
    }
    // Devolver la información de "presentaciones_info_add"
    res.status(200).json(presentacion.archivos);
  } catch (error) {
    next(error);
  }
};
//-----------------------POST
export const addProdServArchivo = async (req, res, next) => {
  try {
    const { id, idPresentacion } = req.params;
    const keyType = req.query.keyType || 'OK'; // Obtener el tipo de ID (OK o BK), por defecto 'OK'
    const newArchivo = req.body; // Obtener la nueva información de archivo a agregar

    // Llamar al servicio para agregar la nueva información
    const updatedPresentation = await ProdServServices.addProdServArchivo(id, keyType, idPresentacion, newArchivo);

    res.status(201).json(updatedPresentation); // Retornar la presentación con el nuevo archivo
  } catch (error) {
    next(error);
  }
};

//-------------------------PUT
export const updateProdServArchivo = async (req, res, next) => {
  try {
    const { id, idPresentacion, archivoId } = req.params; // Obtener los IDs
    const keyType = req.query.keyType || 'OK'; // Obtener el tipo de ID (OK o BK), por defecto 'OK'
    const updatedArchivo = req.body; // Obtener la nueva información de archivo

    // Llamar al servicio para actualizar el archivo
    const updatedPresentation = await ProdServServices.updateProdServArchivo(id, keyType, idPresentacion, archivoId, updatedArchivo);

    res.status(200).json(updatedPresentation); // Retornar la presentación actualizada con el archivo modificado
  } catch (error) {
    next(error);
  }
};

//------------------------DELETE
export const deleteProdServArchivo = async (req, res, next) => {
  try {
    const { id, idPresentacion, archivoId } = req.params; // Obtener los IDs
    const keyType = req.query.keyType || 'OK'; // Obtener el tipo de ID (OK o BK), por defecto 'OK'

    // Llamar al servicio para eliminar el archivo
    const updatedPresentation = await ProdServServices.deleteProdServArchivo(id, keyType, idPresentacion, archivoId);

    res.status(200).json(updatedPresentation); // Retornar la presentación actualizada sin el archivo eliminado
  } catch (error) {
    next(error);
  }
};


//--------------------Estatus--------------------
//POST
export const addEstatus = async (req, res) => {
  const { productId } = req.params; // Obtiene el ID del producto desde los parámetros de la ruta
  const { IdTipoEstatusOK, Actual, Observacion } = req.body; // Obtiene los datos del estatus desde el cuerpo de la solicitud
  if (!IdTipoEstatusOK || !Actual || !Observacion) {
      return res.status(400).json({ message: 'Faltan parámetros obligatorios' });
  }
  try {
      // Datos del nuevo estatus
      const estatusData = {
          IdTipoEstatusOK,
          Actual,
          Observacion,
          detail_row: {
              Activo: 'S',
              Borrado: 'N',
              detail_row_reg: [
                  {
                      FechaReg: new Date(),
                      UsuarioReg: 'SYSTEM',
                  },
              ],
          },
      };
      // Llama al servicio para agregar el estatus
      const updatedProduct = await ProdServServices.addEstatusToProduct(productId, estatusData);
      // Responde con el producto actualizado
      return res.status(200).json(updatedProduct);
  } catch (error) {
      return res.status(500).json({ message: error.message });
  }
};

//put
export const updateEstatus = async (req, res) => {
  const { productId } = req.params; // Obtenemos el ID del producto desde los parámetros de la ruta
  const { IdTipoEstatusOK, Actual, Observacion } = req.body; // Obtenemos los datos del estatus desde el cuerpo de la solicitud
  console.log("Producto id: ",productId);
  console.log(IdTipoEstatusOK,"  ",Actual,"  ",Observacion);
  // Validamos los campos obligatorios
  if (!IdTipoEstatusOK || !Actual) {
    return res.status(400).json({ message: 'Faltan parámetros obligatorios: IdTipoEstatusOK y Actual' });
  }
  try {
    // Preparamos los datos de estatus a actualizar
    const estatusData = { IdTipoEstatusOK, Actual, Observacion };
    // Llamamos al servicio para actualizar el estatus del producto
    const updatedProduct = await ProdServServices.updateEstatus(productId, estatusData);
    // Si no se encontró o se pudo actualizar el producto, enviamos un mensaje adecuado
    if (!updatedProduct) {
      return res.status(404).json({ message: 'Producto no encontrado o estatus no actualizado' });
    }
    // Respondemos con el producto actualizado
    return res.status(200).json(updatedProduct);
  } catch (error) {
    // Capturamos cualquier error y respondemos con un mensaje más claro
    console.error(error); // Para depuración en consola
    return res.status(500).json({ message: `Error al actualizar el estatus: ${error.message}` });
  }
};

//Delete
export const DeleteEstatus = async (req, res) => {
  const { productId, tipo } = req.params;  // Acceder a los parámetros desde la URL

  console.log("Id Producto:", productId);  // Debería ser el ID del producto, como '9001-000000000001'
  console.log("Tipo de estatus:", tipo);  // El tipo de estatus a eliminar, como '1'

  try {
    // Llamamos al servicio para eliminar el estatus
    const updatedProduct = await ProdServServices.deleteEstatus(productId, tipo);

    // Si la eliminación fue exitosa, devolvemos el producto actualizado
    return res.status(200).json(updatedProduct);

  } catch (error) {
    console.error("Error al eliminar estatus:", error.message);
    // Si ocurre un error, respondemos con el mensaje de error
    return res.status(500).json({ message: `Error al eliminar estatus: ${error.message}` });
  }
};

//----------------Detalles Estatus
export const DetallesEstatus = async (req, res) => {
  const { prodServId, estatusId } = req.params;
  const { Activo, Borrado, UsuarioReg } = req.body;

  try {
    const updatedProdServ = await ProdServServices.DetallesEstatus(prodServId, estatusId, {
      Activo,
      Borrado,
      UsuarioReg,
    });

    res.status(200).json({
      message: 'Estatus actualizado correctamente',
      updatedProdServ,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};