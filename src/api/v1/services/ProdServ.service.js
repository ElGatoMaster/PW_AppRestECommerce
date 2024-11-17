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

//SERVICIO

// Servicio para actualizar los datos principales de un producto
export const updatePrincipalProductService = async (id, updateData) => {
  try {
      // Filtro de propiedades permitidas para la actualización
      const allowedUpdates = [
          'IdInstitutoOK',
          'IdProdServBK',
          'CodigoBarras',
          'DesProdServ',
          'Indice'
      ];

      // Filtra las propiedades de updateData
      const filteredUpdateData = {};
      allowedUpdates.forEach((field) => {
          if (updateData[field] !== undefined) {
              filteredUpdateData[field] = updateData[field];
          }
      });

      // Si no hay datos válidos para actualizar, se lanza un error
      if (Object.keys(filteredUpdateData).length === 0) {
          throw boom.badRequest('No hay datos válidos para actualizar');
      }

      // Se realiza la actualización del producto con el ID correspondiente
      const updatedProduct = await ProdServ.findOneAndUpdate(
          { IdProdServOK: id },  // Asegúrate de que 'IdProdServOK' es el campo correcto para buscar el producto
          filteredUpdateData,    // Los datos filtrados para actualizar
          { new: true, runValidators: true }  // Opciones: 'new' para obtener el documento actualizado
      );

      // Si no se encuentra el producto, retorna un error
      if (!updatedProduct) {
          throw boom.notFound('Producto no encontrado');
      }

      // Retorna el producto actualizado
      return updatedProduct;
  } catch (error) {
      console.error('Error al actualizar el producto:', error);
      throw boom.badImplementation(error); // En caso de error, usamos boom para gestionar el error
  }
};//-----SERVICIO PATCH PRINCIPAL PRODUCTO

//METODO PATCH add negocio
export const patchAddNegocio = async (id,keyType,body) =>{
  try{
    let prodServItem = await getProdServItem(id,keyType);
    console.log('contenido original',prodServItem.negocios);
    let negocios = {
      "negocios":[
        ...prodServItem.negocios,
        body
      ]
    }
    console.log('CAMBIO ->',negocios);

    if(keyType==='OK'){
      prodServItem = await ProdServ.findOneAndUpdate({IdProdServOK:id},negocios,{new:true});
    }else if(keyType==='BK'){
      prodServItem = await ProdServ.findOneAndUpdate({IdProdServBK:id},negocios,{new:true});
    }
    return prodServItem;
  }catch(error){
    throw boom.internal(error);
  }

};
//--------------------PATCH ADD NEGOCIO

//METODO PATCH UPDATE NEGOCIO
export const patchUpdateNegocio = async (id,body)=>{
  try {
    let prodServItem = await getProdServItem(id,'OK');
    console.log('Contenido de negocios ->',prodServItem.negocios);
    let idNegocio = body.IdNegocioOK;
    console.log('ID que se desea actualizar ->',idNegocio);

    let indexOfNego = -1;
    for (let i = 0; i < prodServItem.negocios.length; i++) { 
      if (prodServItem.negocios[i].IdNegocioOK === idNegocio) {
       console.log('Encontrado el negocio'); 
       indexOfNego = i; break; 
      } 
    }
    
    //Si no encontró una coincidencia, se arroja un error
    if(indexOfNego !==-1){
      prodServItem.negocios[indexOfNego] = {
        ...prodServItem.negocios[indexOfNego],
        body
      }
      return await prodServItem.save();
    }else{
      //console.log('Encontrado en el indice: ',indexOfNego);
      throw boom.badRequest('No existe el negocio buscado');
    }

    //return;
  } catch (error) {
    throw boom.internal(error)
  }
};
//--------------------PATCH UPDATE NEGOCIO

//METODO PATCH UPDATE NEGOCIO
export const patchDeleteNegocio = async (id,idNegocio)=>{
  try {
    let prodServItem = await getProdServItem(id,'OK');
    console.log('Contenido de negocios ->',prodServItem.negocios);

    console.log('ID que se desea Eliminar ->',idNegocio);

    let indexOfNego = -1;
    for (let i = 0; i < prodServItem.negocios.length; i++) { 
      if (prodServItem.negocios[i].IdNegocioOK === idNegocio) {
       console.log('Encontrado el negocio'); 
       indexOfNego = i; break; 
      } 
    }
    
    //Si no encontró una coincidencia, se arroja un error
    if(indexOfNego !==-1){
      prodServItem.negocios.splice(indexOfNego,1);
      return await prodServItem.save();
    }else{
      //console.log('Encontrado en el indice: ',indexOfNego);
      throw boom.badRequest('No existe el negocio buscado');
    }

    //return;
  } catch (error) {
    throw boom.internal(error)
  }
};
//--------------------PATCH Delete NEGOCIO