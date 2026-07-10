import express from "express";
import {
    getErga,
    getErgaById,
    createErga,
    updateErga,
    deleteErga,
} from "../controllers/Erga.js"
import { verifyUser,adminOnly } from "../middleware/AuthUser.js";
import { upload } from "../middleware/multer-config.js";  // Import multer config
import { bulkGenerateCodes } from "../controllers/Erga.js";


const router = express.Router();

router.get('/erga',verifyUser, getErga);
router.get('/erga/:id',verifyUser,getErgaById);

//logo image uploade
router.post('/erga',upload.single('logoImage'),verifyUser,adminOnly,createErga);
router.patch('/erga/:id',verifyUser,upload.single('logoImage'),updateErga);
router.delete('/erga/:id',verifyUser,adminOnly,deleteErga);

router.get('/generate-codes', verifyUser, adminOnly, bulkGenerateCodes);

export default router;
