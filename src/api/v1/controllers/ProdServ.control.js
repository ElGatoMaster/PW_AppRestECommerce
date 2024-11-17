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

//cONTROLADOR 
export const updatePrincipalProduct = async (req, res, next) => {
  try {
      const { id } = req.params;  // El id del producto está siendo recibido como parámetro
      const updateData = req.body; // Los datos de actualización se reciben en el cuerpo de la solicitud

      // Llamamos al servicio para actualizar el producto
      const updatedProduct = await ProdServServices.updatePrincipalProductService (id, updateData);

      // Si no se encontró el producto, retornamos un error 404
      if (!updatedProduct) {
          return res.status(404).json({ message: 'Producto no encontrado' });
      }

      // Si se actualiza correctamente, retornamos el producto actualizado
      res.status(200).json(updatedProduct);
  } catch (error) {
      console.error('Error actualizando el producto:', error);
      next(error);  // Se pasa el error al middleware global
  }
};
//---------------Controlador Patch PRINCIPAL PRODUCTOS

//Control para patch Add en un NEGOCIOS.
export const patchAddNegocio = async (req,res,next) => {
  try{
    const { id } = req.params;
    const { keyType='OK' } = req.query;
    console.log('controlador id -> ', id);
    console.log('controlador keyType -> ', keyType);

    const body = req.body;
    console.log('Body to update ->', body);

    const prodServPatched = await ProdServServices.patchAddNegocio(id,keyType,body);

    if(!prodServPatched){
      throw boom.badRequest('No se pudo realizar la accion');
    }else{
      res.status(200).json(prodServPatched);
    }

  }catch(error){
    console.error('error en el controlador');
    next(error);
  }
};
//--------------PATCH ADD NEGOCIOS

//----------------------PATCH Update NEGOCIOS
export const patchUpdateNegocio = async (req,res,next) => {
  try{
    const { id } = req.params;
    console.log('Controlador id -> ', id);

    const body = req.body;
    console.log('Body to update ->', body);

    const prodServPatched = await ProdServServices.patchUpdateNegocio(id,body);

    if(!prodServPatched){
      throw boom.badRequest('No se pudo realizar la accion');
    }else{
      res.status(200).json(prodServPatched);
    }

  }catch(error){
    console.error('error en el controlador');
    next(error);
  }
};
//----------------------PATCH Update NEGOCIOS

//----------------------PATCH Delete NEGOCIOS
export const patchDeleteNegocio = async (req,res,next) => {
  try{
    const { id } = req.params;
    console.log('controlador id -> ', id);

    const {idNegocio} = req.params;
    console.log('ID to delete ->', idNegocio);

    const prodServPatched = await ProdServServices.patchDeleteNegocio(id,idNegocio);

    if(!prodServPatched){
      throw boom.badRequest('No se pudo realizar la accion');
    }else{
      res.status(200).json(prodServPatched);
    }

  }catch(error){
    console.error('error en el controlador');
    next(error);
  }
};
//----------------------PATCH Delete NEGOCIOS
