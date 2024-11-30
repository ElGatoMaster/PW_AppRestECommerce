import { Router } from 'express';
import * as prodServController from '../controllers/ProdServ.control';
const router = Router();
//API GET
router.get('/', prodServController.getProdServList);
router.get('/producto/:id', prodServController.getProdServItem);
router.get('/search', prodServController.buscarPorDescripcion);
router.get('/activos', prodServController.obtenerActivos);
router.get('/estatus/:tipo', prodServController.obtenerPorEstatus);
router.get('/negocio/:idNegocio', prodServController.obtenerProductosPorNegocio);
router.get('/presentacion/descripcion/:desPresenta', prodServController.obtenerProductosPorDescripcionPresentacion);
router.get('/estadisticas', prodServController.obtenerEstadisticasProductos);
//Ruta API POST
router.post('/', prodServController.postProdServItem);

//ruta para API PUT
router.put('/:id', prodServController.putProdServItem);

//API DELETE fisicamente
router.delete('/hard/:id', prodServController.deleteProdServItem);
//API DELETE solo cambiando el estado del producto
router.delete('/soft/:id',prodServController.deletePutProdServItem);


//+++++++++AGREGADO POR YVAN
//API PATCH productos principal
router.patch('/productosPrincipal/:id', prodServController.updatePrincipalProduct);

//RUTAS PARA EL DE NEGOCIOS
router.patch('/negocios/add/:id',prodServController.patchAddNegocio);
router.patch('/negocios/update/:id',prodServController.patchUpdateNegocio);
router.patch('/negocios/delete/:id/:idNegocio',prodServController.patchDeleteNegocio);
//+++++++AGREGADO POR YVAN

//+++++++++++++++++JOVAN PRESENTACIONES
//PRESENTACIONES--------------------------------------------------------------------------------------------------
router.get('/presentacion/:id', prodServController.getProdServPresentations);
router.post('/presentacion/:id', prodServController.addProdServPresentation);
router.put('/presentacion/:id/:presentationId', prodServController.updateProdServPresentation);
router.delete('/presentacion/:id/:presentationId', prodServController.deleteProdServPresentation);
//----------------------------------------------------------------------------------------------
//PRESENTACIONES presentaciones_info_add
router.get('/presentacion/:id/info/:idPresentacion', prodServController.getProdServPresentationInfoAdd);
router.post('/presentacion/:id/info/:presentationId', prodServController.addProdServPresentationInfoAdd);
router.put('/presentacion/:id/info/:presentationId/:infoID', prodServController.updateProdServPresentationInfoAdd);
router.delete('/presentacion/:id/info/:idPresentacion/:infoAdId', prodServController.deleteProdServPresentationInfoAdd);

//------------------------------------------------------------------------------------------------------
//PRESENTACIONES PAQUETE
router.get('/presentacion/:id/paquete/:idPresentacion', prodServController.getProdServPresentationPaquete);
router.post('/paquete/:id/presentacion/:presentationId', prodServController.addProdServPaquete);
router.put('/paquete/:id/presentacion/:presentationId/:paqueteId', prodServController.updateProdServPaquete);
router.delete('/paquete/:id/presentacion/:idPresentacion/:paqueteId', prodServController.deleteProdServPaquete);
//---------------------------------------------------------------------------------------------
//PRESENTACIONES ARCHIVOS
router.get('/presentacion/:id/archivos/:idPresentacion', prodServController.getProdServPresentationArchivo);
router.post('/presentacion/:id/archivos/:idPresentacion', prodServController.addProdServArchivo);
router.put('/presentacion/:id/archivos/:idPresentacion/:archivoId', prodServController.updateProdServArchivo);
router.delete('/presentacion/:id/archivos/:idPresentacion/:archivoId', prodServController.deleteProdServArchivo);

//RUTAS PARA ESTATUS
//Put Estatus
router.put('/producto/:productId/estatus', prodServController.updateEstatus);
//POST Estatus
router.post('/producto/:productId/estatus', prodServController.addEstatus);
//Delete Estatus
router.delete('/producto/:productId/:tipo', prodServController.DeleteEstatus);
//detalles 
router.patch('/:prodServId/estatus/:estatusId', prodServController.DetallesEstatus);

//++++++++++++++++++ PAU INFO ADICIONAL
//GET INFO ADD
router.get('/producto/:id/info_ad', prodServController.getInfoAddi);
//POST INFO ADD
router.post('/producto/:id/info_ad',prodServController.addInfoAdi);
//PUT INFO ADD
router.put('/producto/:id/info_ad',prodServController.updateInfoAdi);
//DELETE INFO ADD
router.delete('/producto/:id/info_ad/:idEti', prodServController.deleteInfoAdi);

export default router;