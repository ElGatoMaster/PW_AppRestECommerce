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



// PUT - Actualizar una presentación existente
export const updateProdServPresentation = async (id, keyType, presentationId, updatedPresentation) => {
  
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
    console.log("hola servicio",presentationId)
    // Buscar la presentación a actualizar
    const presentationIndex = prodServItem.presentaciones.findIndex(p => p.IdPresentaOK === presentationId);
 
    if (presentationIndex === -1) {
      throw boom.notFound('Presentación no encontrada.');
    }

    // Actualizar la presentación
    prodServItem.presentaciones[presentationIndex] = { ...prodServItem.presentaciones[presentationIndex], ...updatedPresentation };

    // Guardar el producto actualizado
    await prodServItem.save();

    return prodServItem.presentaciones;  // Retornar las presentaciones actualizadas
  } catch (error) {
    throw boom.internal(error);
  }
};

// DELETE - Eliminar una presentación existente
export const deleteProdServPresentation = async (id, keyType, presentationId) => {
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

    // Buscar la presentación a eliminar
    const presentationIndex = prodServItem.presentaciones.findIndex(p => p.IdPresentaOK === presentationId);

    if (presentationIndex === -1) {
      throw boom.notFound('Presentación no encontrada.');
    }

    // Eliminar la presentación
    prodServItem.presentaciones.splice(presentationIndex, 1);

    // Guardar el producto actualizado
    await prodServItem.save();

    return prodServItem.presentaciones;  // Retornar las presentaciones restantes
  } catch (error) {
    throw boom.internal(error);
  }
};

//----------------------------Info add Presentaciones
//GET
//------------------------------------------POST
export const addProdServPresentationInfoAdd = async (id, keyType, presentationId, newInfo) => {
  try {
    console.log("neta?",presentationId)
    let prodServItem;

    // Buscar el producto según el tipo de ID
    if (keyType === 'OK') {
      prodServItem = await ProdServ.findOne({ IdProdServOK: id });
    } else if (keyType === 'BK') {
      prodServItem = await ProdServ.findOne({ IdProdServBK: id });
    }

    if (!prodServItem) {
      throw boom.notFound('Producto no encontrado.');
    }

    // Buscar la presentación correspondiente
    const matchesPresentationId = (p, presentationId) => {
      const okMatch = p.IdPresentaOK && p.IdPresentaOK == presentationId;
      console.log(presentationId,id)
      console.log(p.IdPresentaOK)
      const bkMatch = p.IdPresentaBK && p.IdPresentaBK == presentationId;
      console.log(p.IdPresentaBK)
      return okMatch || bkMatch;
    };
    
    const presentation = prodServItem.presentaciones.find(p => matchesPresentationId(p, presentationId));
    

    if (!presentation) {
      throw boom.notFound('Presentación no encontrada.');
    }

    // Agregar la nueva información al subdocumento info_ad
    presentation.info_ad.push(newInfo);

    // Guardar los cambios
    await prodServItem.save();

    return presentation; // Retornar la presentación actualizada con el nuevo info_ad
  } catch (error) {
    throw boom.internal(error);
  }
};
//-----------------------PUT
export const updateProdServPresentationInfoAdd = async (id, keyType, presentationId, infoID, updatedInfo) => {
  try {
    let prodServItem;

    // Buscar el producto según el tipo de ID
    if (keyType === 'OK') {
      prodServItem = await ProdServ.findOne({ IdProdServOK: id });
    } else if (keyType === 'BK') {
      prodServItem = await ProdServ.findOne({ IdProdServBK: id });
    }

    if (!prodServItem) {
      throw boom.notFound('Producto no encontrado.');
    }

    // Buscar la presentación correspondiente
    const matchesPresentationId = (p, presentationId) => {
      const okMatch = p.IdPresentaOK && p.IdPresentaOK == presentationId;
      console.log(presentationId,id,infoID)
      console.log(p.IdPresentaOK)
      const bkMatch = p.IdPresentaBK && p.IdPresentaBK == presentationId;
      console.log(p.IdPresentaBK)
      return okMatch || bkMatch;
    };
    
    const presentation = prodServItem.presentaciones.find(p => matchesPresentationId(p, presentationId));
    

    // Buscar el info_ad a actualizar dentro de la presentación
    const infoIndex = presentation.info_ad.findIndex(info => info.IdEtiquetaOK === infoID);
    if (infoIndex === -1) {
      throw boom.notFound('Información adicional no encontrada.');
    }

    // Actualizar el info_ad
    presentation.info_ad[infoIndex] = { ...presentation.info_ad[infoIndex], ...updatedInfo };

    // Guardar los cambios
    await prodServItem.save();

    return presentation; // Retornar la presentación actualizada con la información modificada
  } catch (error) {
    throw boom.internal(error);
  }
};

//-----------------------------------DELETE
export const deleteProdServPresentationInfoAdd = async (id, keyType, presentationId, infoID) => {
  try {
    let prodServItem;

    // Buscar el producto según el tipo de ID
    if (keyType === 'OK') {
      prodServItem = await ProdServ.findOne({ IdProdServOK: id });
    } else if (keyType === 'BK') {
      prodServItem = await ProdServ.findOne({ IdProdServBK: id });
    }

    if (!prodServItem) {
      throw boom.notFound('Producto no encontrado.');
    }

    // Buscar la presentación correspondiente
    const matchesPresentationId = (p, presentationId) => {
      const okMatch = p.IdPresentaOK && p.IdPresentaOK == presentationId;
      const bkMatch = p.IdPresentaBK && p.IdPresentaBK == presentationId;
      return okMatch || bkMatch;
    };

    const presentation = prodServItem.presentaciones.find(p => matchesPresentationId(p, presentationId));

    if (!presentation) {
      throw boom.notFound('Presentación no encontrada.');
    }

    // Buscar el info_ad a eliminar dentro de la presentación
    const infoIndex = presentation.info_ad.findIndex(info => info.IdEtiquetaOK === infoID);
    if (infoIndex === -1) {
      throw boom.notFound('Información adicional no encontrada.');
    }

    // Eliminar la información adicional
    presentation.info_ad.splice(infoIndex, 1);

    // Guardar los cambios
    await prodServItem.save();

    return presentation; // Retornar la presentación actualizada sin la información eliminada
  } catch (error) {
    throw boom.internal(error);
  }
};

