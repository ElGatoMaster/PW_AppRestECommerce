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
      }).limit(50).exec(); // Limitar a 50 resultados
      return products;
  } catch (error) {
      throw boom.internal(error);
  }
};



// Obtener productos activos
export const getActiveProducts = async () => {
  try {
    return await Producto.find({ 'detail_row.Activo': 'S' }).exec();
  } catch (error) {
    throw boom.internal(error);
  }
};

// Obtener productos por estatus
export const getProductsByStatus = async (tipo) => {
  try {
    return await Producto.find({ 'cat_prod_serv_estatus.TipoEstatus': tipo }).exec();
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