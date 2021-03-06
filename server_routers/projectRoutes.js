const express = require('express');
const db = require('../data/helpers/projectsDB');
const router = express.Router();

function sendError(code, message, error) {
    return {
        code,
        message,
        error
    }
}

router.get('/', async (req, res, next) => {
    try {
        const response = await db.getProjects();
        res.status(200).json(response);
    } catch (error) {
        next(sendError(500, 'Failed to retrieve projects information.', error.message))
    }
})

router.get('/:id', async (req, res, next) => {
    const id = Number(req.params.id);

    try {
        const response = await db.findProjectById(id);
        if (!response) {
            return next(sendError(404, 'Failed to retrieve project information.', 'The project for this specific id does not exist.'))
        } 
        res.status(200).json(response);
    } catch (error) {
        next(sendError(500, 'Failed to retrieve project information.', error.message))
    }
})

router.post('/', async (req, res, next) => {
    if (!(req.body.name && req.body.description)) {
        return next(sendError(400, "Failed to save project to database.", "Please provide both name and description of project."))
    }

    try {
        const response = await db.addProject(req.body);
        const newProject = {
            id: response[0],
            ...req.body,
            completed: false
        }
        res.status(200).json(newProject);
    } catch (error) {
        next(sendError(500, "Failed to save project to database.", error.message))
    }
})

//endpoint for DELETE
router.delete('/:id', async (req, res, next) => {
    const id = Number(req.params.id);

    try {
        const response = await db.deleteProject(id);
        if (response[1] === 0){
            return next(sendError(404, 'Failed to delete project.', 'The project for this specific id does not exist.'))
        }
        const project = response[0][0]
        project.competed = project.completed ? true: false;
        res.status(200).json(project);
    } catch (error) {
        next(sendError(500, "Failed to delete project.", error.message))
    }
})

router.put('/:id', async (req, res, next) => {
    const id = Number(req.params.id);
    if ((!req.body.name && !req.body.description)) {
        return next(sendError(400, "Failed to update project.", "Please provide information of project to be updated."))
    } 

    try {
        const response = await db.updateProject(id, req.body);
        if (!response){
            return next(sendError(404, 'Failed to update project.', 'The project for this specific id does not exist.'))
        }
        const newProj = {
            id,
            ...req.body
        }
        res.status(200).json(newProj);
    } catch (error) {
        next(sendError(500, "Failed to update project.", error.message))
    }
})


module.exports = router;