import { Router } from 'express';
import * as prodServController from '../controllers/ProdServ.control';
const router = Router();
//API GET
router.get('/', prodServController.getProdServList);
//API Get
router.get('/:id', prodServController.getProdServItem);
router.get('/search', productosController.buscarPorDescripcion);
router.get('/activos', productosController.obtenerActivos);
router.get('/estatus/:tipo', productosController.obtenerPorEstatus);
//Ruta API POST
router.post('/', prodServController.postProdServItem);

//ruta para API PUT
router.put('/:id', prodServController.putProdServItem);

//API DELETE
//API DELETE
router.delete('/:id', prodServController.deleteProdServItem);

export default router;