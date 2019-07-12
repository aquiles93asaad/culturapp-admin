const Centro = require('../models/centro.model');
const Usuario = require('../models/usuario.model');

async function create(centro) {
    try {
        const createdCentro = await Centro(centro).save();
        return createdCentro;
    } catch(error) {
        console.log(error);
        return error;
    }
}

async function get(filters) {
    try {
        const centros = await Centro.find(
            filters
        ).populate({ path: 'profesores', model: Usuario });
        return centros;
    } catch(error) {
        console.log(error);
        return error;
    }
}

async function update(centroData) {
    try {
        const updatedCentro = await Centro.findOneAndUpdate(
            { _id: centroData._id },
            centroData,
            { new: true }
        );
        return updatedCentro;
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
