import { Router } from 'express';
import * as prodServController from '../controllers/ProdServ.control';
const router = Router();
//API GET
router.get('/', prodServController.getProdServList);
//API Get
router.get('/:id', prodServController.getProdServItem);
router.get('/search', prodServController.buscarPorDescripcion);
router.get('/activos', prodServController.obtenerActivos);
router.get('/estatus/:tipo', prodServController.obtenerPorEstatus);
//Ruta API POST
router.post('/', prodServController.postProdServItem);

//ruta para API PUT
router.put('/:id', prodServController.putProdServItem);

//API DELETE fisicamente
router.delete('/hard/:id', prodServController.deleteProdServItem);
//API DELETE solo cambiando el estado del producto
router.delete('/soft/:id',prodServController.deletePutProdServItem);

export default router;