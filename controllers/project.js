const { error } = require('console');
const Project = require('../models/project');
const fs = require('fs');
const path = require('path');// manejo dearchivos

const save = async (req, res) => {
    try {
        // Recibir datos
        let body = req.body;

        // Validar datos 
        if (!body.name || !body.description || !body.state) {
            return res.status(400).send({
                status: "error",
                message: "Incomplete data",
            });
        }

        // Crear objeto
        let proyectoToSave = new Project(body);

        // Guardar objeto en la base de datos
        const proyecto = await proyectoToSave.save();
        
        return res.status(200).send({
            status: "success",
            message: "Project saved successfully",
            proyecto
        });

    } catch (err) {
        return res.status(500).send({
            status: "error",
            message: "Error saving project",
            error: err.message
        });
    }
}


const projects = (req, res) => {
    Project.find().then(projects => {
        if(!projects){
            return res.status(404).send({
                status: "error",
                message: "Projects not found"
            });
        }
        return res.status(200).send({
            status: "success",
            projects
        });
    }).catch(err => {
        return res.status(500).send({
            status: "error",
            message: "Error getting projects",
            error: err.message
        });
    });
}

const item = (req, res) => {
    let id = req.params.id;

    Project.findById(id).then(project => {
        if(!project){
            return res.status(404).send({
                status: "error",
                message: "Project not found"
            });
        }
        return res.status(200).send({
            status: "success",
            project
        });
    }).catch(err => {
        return res.status(500).send({
            status: "error",
            message: "Error getting project",
            error: err.message
        });
    });
}

const deleteProject = (req, res) => {
    let id = req.params.id;

    Project.findById(id).deleteOne().then(project => {
        if(!project){
            return res.status(404).send({
                status: "error",
                message: "Project not found"
            });
        }
        return res.status(200).send({
            status: "success",
            project
        });
    }).catch(err => {
        return res.status(500).send({
            status: "error",
            message: "Error getting project",
            error: err.message
        });
    });
}


const update = (req, res) => {
    let body = req.body;
    
    if(!body || !body.id){
        return res.status(404).send({
            status: "error",
            message: "Project not found body"
        });
    }

    Project.findByIdAndUpdate(body.id, body, {new: true}).then(projectUpdated => {
        if(!projectUpdated){
            console.log(projectUpdated);
            return res.status(404).send({
                status: "error",
                message: "Project not found"
                
            });
        }
        return res.status(200).send({
            status: "success",
            projectUpdated
        });
    }).catch(err => {
        return res.status(500).send({
            status: "error",
            message: "Error getting project",
            error: err.message
        });
    });
}


const upload = async (req, res) => {
    try {
        const id = req.params.id;

        if (!req.file) {
            // Si no hay archivo, eliminar la imagen existente si se quiere permitir
            return res.status(400).send({
                status: "error",
                message: "No file was uploaded"
            });
        }

        const filePath = req.file.path;
        const originalName = req.file.originalname;
        const fileSize = req.file.size;
        const maxSize = 5 * 1024 * 1024; // 5MB

        // Validar tamaño del archivo
        if (fileSize > maxSize) {
            // Eliminar el archivo subido que excede el tamaño
            fs.unlinkSync(filePath);
            return res.status(400).send({
                status: "error",
                message: "File size exceeds the 5MB limit"
            });
        }

        // Validar extensión del archivo
        const validExtensions = ["jpg", "jpeg", "png", "gif"];
        const extension = path.extname(originalName).toLowerCase().substring(1);

        if (!validExtensions.includes(extension)) {
            // Eliminar el archivo con extensión no válida
            fs.unlinkSync(filePath);
            return res.status(400).send({
                status: "error",
                message: "Invalid file extension. Only jpg, jpeg, png, gif are allowed"
            });
        }

        // Buscar proyecto existente para eliminar su imagen anterior si existe
        const existingProject = await Project.findById(id);
        if (existingProject && existingProject.image) {
            const oldImagePath = existingProject.image;
            if (fs.existsSync(oldImagePath)) {
                fs.unlinkSync(oldImagePath);
            }
        }

        // Actualizar el proyecto con la nueva imagen
        const projectUpdated = await Project.findByIdAndUpdate(
            id,
            { image: filePath },
            { new: true }
        );

        if (!projectUpdated) {
            // Si no se encuentra el proyecto, eliminar el archivo subido
            fs.unlinkSync(filePath);
            return res.status(404).send({
                status: "error",
                message: "Project not found"
            });
        }

        return res.status(200).send({
            status: "success",
            message: "File uploaded successfully",
            project: projectUpdated,
            file: {
                name: originalName,
                size: fileSize,
                path: filePath,
                extension: extension
            }
        });

    } catch (err) {
        // En caso de error, eliminar el archivo si fue subido
        if (req.file && req.file.path && fs.existsSync(req.file.path)) {
            fs.unlinkSync(req.file.path);
        }
        
        return res.status(500).send({
            status: "error",
            message: "Error uploading file",
            error: err.message
        });
    }
};

const getImage = (req, res) => {
    // Obtener el nombre del archivo
    let file = req.params.file;

    // Construir ruta del fichero de forma segura
    let filePath = path.join(__dirname, '../uploads/images', file);

    // Comprobar que el fichero existe
    fs.access(filePath, fs.constants.F_OK, (err) => {
        if (err) {
            return res.status(404).send({
                status: "error",
                message: "Image not found",
                error: err.message
            });
        }

        // Si existe, enviar el archivo
        res.sendFile(filePath, (err) => {
            if (err) {
                return res.status(500).send({
                    status: "error",
                    message: "Error sending image",
                    error: err.message
                });
            }
        });
    });
};

module.exports = {
    save,
    projects,
    item,
    deleteProject,
    update,
    upload,
    getImage
};