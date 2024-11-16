import ProdServ from '../models/ProdServ';
import boom from '@hapi/boom';


// ------------------- GET -----------------------------
// GET todos los productos
export const getProdServList = async () => {
  let prodServList;
  try {
    prodServList = await ProdServ.find();
    return (prodServList);
  } catch (error) {
    throw boom.internal(error);
  }
};

// GET productos por ID
export const getProdServItem = async (id, keyType) => {
  let prodServItem;

  try {
    if (keyType === 'OK') {
      prodServItem = await ProdServ.findOne({
        IdProdServOK: id,
      });
    } else if (keyType === 'BK') {
      prodServItem = await ProdServ.findOne({
        IdProdServBK: id,
      });
    }
    return (prodServItem);
  } catch (error) {
    throw boom.internal(error);
  }
};




// Buscar productos por descripción
export const searchProductsByDescription = async (q) => {
  let products;
  // Validar entrada
  if (typeof q !== 'string') {
      throw boom.badRequest('La consulta debe ser una cadena de texto');
  }

  try {
      products  = await ProdServ.find({
        DesProdServ: { $regex: q, $options: 'i' }
      })
      return products;
  } catch (error) {
      throw boom.internal(error);
  }
};


// Obtener productos activos
export const getActiveProducts = async () => {
  try {
    return await ProdServ.find({ 'detail_row.Activo': 'S' });
  } catch (error) {
    throw boom.internal(error);
  }
};

// Obtener productos por estatus
export const getProductsByStatus = async (tipo) => {
  try {
    return await ProdServ.find({ 'cat_prod_serv_estatus.TipoEstatus': tipo }).exec();
  } catch (error) {
    throw boom.internal(error);
  }
};


// Servicio para obtener productos por negocio
export const getProductsByBusiness = async (idNegocio) => {
  try {
    return await ProdServ.find({ 'negocios.IdNegocioOK': idNegocio }).exec();
  } catch (error) {
    throw boom.internal(error);
  }
};


// Servicio para obtener productos por descripción de presentación
export const getProductsByPresentationDescription = async (desPresenta) => {
  try {
    return await ProdServ.find({ 'presentaciones.DesPresenta': { $regex: desPresenta, $options: 'i' } }).exec();
  } catch (error) {
    throw boom.internal(error);
  }
};




// Servicio para obtener estadísticas de productos
export const getProductStatistics = async () => {
  try {
    const totalProductos = await ProdServ.countDocuments().exec();
    const totalActivos = await ProdServ.countDocuments({ 'detail_row.Activo': 'S' }).exec();
    const totalInactivos = totalProductos - totalActivos;

    return {
      total: totalProductos,
      activos: totalActivos,
      inactivos: totalInactivos,
    };
  } catch (error) {
    throw boom.internal(error);
  }
};

// ------------------- POST -----------------------------

//Metodo para POST
export const postProdServItem = async (paProdServItem) => {
  try {
    const newProdServItem = new ProdServ(paProdServItem);
    return await newProdServItem.save();
  } catch (error) {
    throw error;
  }
};

// Metodo PUT
export const putProdServItem = async (id, paProdServItem) => {
  try {
    //console.log("FIC: PUT API INSTITUTO", id);
    return await ProdServ.findOneAndUpdate({ IdProdServOK: id }, paProdServItem, {
      new: true,
    });
  } catch (error) {
    throw boom.badImplementation(error);
  }
};

//METODO PARA DELETE
//DELETE HARD
export const deleteProdServItem = async (id, keyType) => {
  let prodServItem
  try {
    if (keyType === 'OK') {
      prodServItem = await ProdServ.findOneAndDelete({ IdProdServOK: id });
    } else if (keyType === 'BK') {
      prodServItem = await ProdServ.findOneAndDelete({ IdProdServBK: id });
    }
    return (prodServItem);
  } catch (error) {
    throw boom.internal(error);
  }
};

//Metodo que actualiza el estado en lugar de eliminar
export const deletePutProdServ = async (id, keyType, usuario) => {
  try {
    let update = {
      "detail_row.Activo":"N",
      "detail_row.Borrado": 'S',
      "detail_row.FechaUltMod": new Date(),
      "detail_row.UsuarioMod": usuario
    };

    let prodServItem;
    if (keyType === 'OK') {
      prodServItem = await ProdServ.findOneAndUpdate({ IdProdServOK: id }, update, { new: true });
    } else if (keyType === 'BK') {
      prodServItem = await ProdServ.findOneAndUpdate({ IdProdServBK: id }, update, { new: true });
    }

    return prodServItem;
  } catch (error) {
    throw boom.internal(error);
  }
};







//------------------------------PRESENTACIONES------------------------------------------------//
// Servicio para obtener las presentaciones de un producto
export const getProdServPresentations = async (id, keyType) => {
  let prodServItem;
  
  try {
    if (keyType === 'OK') {
      // Buscar el producto por IdProdServOK y devolver solo las presentaciones
      prodServItem = await ProdServ.findOne({ IdProdServOK: id }).select('presentaciones');
    } else if (keyType === 'BK') {
      // Buscar el producto por IdProdServBK y devolver solo las presentaciones
      prodServItem = await ProdServ.findOne({ IdProdServBK: id }).select('presentaciones');
    }

    if (!prodServItem) {
      throw boom.notFound('Producto no encontrado.');
    }
    return prodServItem.presentaciones;  // Retornamos solo las presentaciones
  } catch (error) {
    throw boom.internal(error);
  }
};


//POST
// Servicio para agregar una nueva presentación a un producto
export const addProdServPresentation = async (id, keyType, newPresentation) => {
  try {
    let prodServItem;

    if (keyType === 'OK') {
      prodServItem = await ProdServ.findOne({ IdProdServOK: id });
    } else if (keyType === 'BK') {
      prodServItem = await ProdServ.findOne({ IdProdServBK: id });
    }

    if (!prodServItem) {
      throw boom.notFound('Producto no encontrado.');
    }

    // Agregar la nueva presentación al arreglo de presentaciones
    prodServItem.presentaciones.push(newPresentation);

    // Guardar el producto actualizado
    await prodServItem.save();

    return prodServItem.presentaciones;  // Retornamos las presentaciones actualizadas
  } catch (error) {
    throw boom.internal(error);
  }
};


//----------------------------ESTATUS DE PRESENTACIONES
//GET
export const getProdServPresentationsS = async (id, keyType, presentaId) => {
  let prodServItem;
  
  try {
    // Buscar el producto por IdProdServOK o IdProdServBK y devolver solo las presentaciones
    if (keyType === 'OK') {
      prodServItem = await ProdServ.findOne({ IdProdServOK: id }).select('presentaciones');
    } else if (keyType === 'BK') {
      prodServItem = await ProdServ.findOne({ IdProdServBK: id }).select('presentaciones');
    }

    if (!prodServItem) {
      throw boom.notFound('Producto no encontrado.');
    }

    // Buscar la presentación por su ID (IdPresentaOK)
    const presentation = prodServItem.presentaciones.find(p => p.IdPresentaOK === presentaId);

    if (!presentation) {
      throw boom.notFound('Presentación no encontrada.');
    }

    // Retornamos solo los estatus de la presentación
    return presentation.estatus;  // Solo los estatus

  } catch (error) {
    throw boom.internal(error);
  }
};


