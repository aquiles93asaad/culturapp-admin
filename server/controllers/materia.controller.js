const Materia = require('../models/materia.model');

async function create(materia) {
    try {
        const createdMateria = await Materia(materia).save();
        return createdMateria;
    } catch(error) {
        console.log(error);
        return error;
    }
}

async function get(filters) {
    try {
        const materias = await Materia.find(
            filters
        );
        return materias;
    } catch(error) {
        console.log(error);
        return error;
    }
}

async function update(materiaData) {
    try {
        const updatedMateria = await Materia.findOneAndUpdate(
            { _id: materiaData._id },
            materiaData,
            { new: true }
        );
        return updatedMateria;
    } catch (error) {
        console.log(error);
        return error;
    }
}

module.exports = {
    create,
    get,
    update,
};
