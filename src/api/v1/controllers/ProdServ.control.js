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
    const productos = await ProdServServices.searchProductsByDescription(req.query.q);
    
    if (!productos || productos.length === 0) {
      throw boom.notFound(`No se encontraron productos que coincidan con la descripción: "${req.query.q}"`);
    }

    res.status(200).json(productos);
  } catch (error) {
    next(error);
  }
};

  
  // Obtener productos activos
  export const obtenerActivos = async (req, res) => {
    try {
      const productos = await productoService.getActiveProducts();
      res.json(productos);
    } catch (error) {
      res.status(500).json({ error: 'Error al obtener los productos activos' });
    }
  };
  
  // Obtener productos por estatus
  export const obtenerPorEstatus = async (req, res) => {
    try {
      const productos = await productoService.getProductsByStatus(req.params.tipo);
      res.json(productos);
    } catch (error) {
      res.status(500).json({ error: 'Error al obtener productos por estatus' });
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
