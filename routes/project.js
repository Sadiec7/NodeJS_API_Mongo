const express = require('express');
const router = express.Router();

//run controllers
const ProjectController = require('../controllers/project');

//configurar multer
const multer = require('multer');

const storage = multer.diskStorage({
    destination: function(req, file, cb) {//donde se van a gaurdar los archivos 
        cb(null, './uploads/images');
    },
    filename: function(req, file, cb) { // nombre de los archivos 
        cb(null, "proejct" + Date.now() + "-" + file.originalname);
    }
});
const upload = multer({ storage: storage });//mideleware

// deine routes
router.post('/save', ProjectController.save);
router.get('/list', ProjectController.projects);
router.get('/item/:id', ProjectController.item);
router.delete('/delete/:id', ProjectController.deleteProject);
router.put('/update', ProjectController.update);
//multer es para el envio de arhciovos a traves de node
router.put('/upload/:id', upload.single('file0'), ProjectController.upload);//single es solo para enviar una rchivo especifico, se ejecuta antes del mismo ontolador por ser un mideleware
router.get('/image/:file', ProjectController.getImage);

module.exports = router;