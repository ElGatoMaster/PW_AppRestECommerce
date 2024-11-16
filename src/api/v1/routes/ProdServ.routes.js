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



//PRESENTACIONES
router.get('/presentacion/:id', prodServController.getProdServPresentations);
router.post('/presentacion/:id', prodServController.addProdServPresentation);
//PRESENTACIONES ESTATUS
router.get('/presentacion/:id/:presentaId/estatus',prodServController.getProdServPresentationStatus);





export default router;