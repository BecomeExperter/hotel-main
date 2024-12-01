import  express from 'express';
const router = express.Router();
import { getService, getServiceById, getServiceByUserId,createService,deleteService } from "../controllers/ServiceController";
router.get('/all',getService);
router.get('/:id',getServiceById);
router.get('/user/:id',getServiceByUserId);
router.post('/create',createService);
router.delete('/:id/delete',deleteService);
export default router;