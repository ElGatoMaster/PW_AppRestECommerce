import ProdServ from '../models/ProdServ';
import boom from '@hapi/boom';

// GET PRODUCTS AND SERVICES LIST
export const getProdServList = async () => {
    let prodServList;
    try {
          prodServList = await ProdServ.find();
          return(prodServList);
    } catch (error) {
      throw boom.internal(error);
    }
  };

  // GET PRODUCT OR SERVICE BY ID
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
      return(prodServItem);
    } catch (error) {
      throw boom.internal(error);
    }
  };

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
export const deleteProdServItem = async (id,keyType) => {
  let prodServItem
  try {
    if (keyType === 'OK') {
      prodServItem = await ProdServ.findOneAndDelete({IdProdServOK: id});
    } else if (keyType === 'BK') {
      prodServItem = await ProdServ.findOneAndDelete({IdProdServBK: id});
    }
    return(prodServItem);
  } catch (error) {
    throw boom.internal(error);
  }
};