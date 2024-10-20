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

//API DELETE Producto
export const deleteProdServItem = async (req, res, next) => {
    try {
      const { id } = req.params;
      const { keyType } = req.query;
      console.log('controller id -> ', id);
      console.log('controller keyType -> ', keyType);
  
      const deletedProdServItem = await ProdServServices.deleteProdServItem(id, keyType);
  
      if (!deletedProdServItem) {
        throw boom.badRequest('No se pudo eliminar el Producto.');
      }
  
      res.status(200).json(deletedProdServItem);
    } catch (error) {
      console.error('Error en el controlador:', error);
      next(error);
    }
};  

