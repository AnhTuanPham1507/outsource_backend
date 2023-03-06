const brandRepo = require("../repositories/BrandRepo");

function getAll() {
  return brandRepo.getAll();
}

function getByName(name) {
  return brandRepo.getByName(name);
}

function getById(id) {
  return brandRepo.getById(id);
}

function create(brandDTO,session) {
  return brandRepo.create(brandDTO,session);
}

function update(brandDTO) {
  return brandRepo.updateOne(brandDTO);
}

function deleteOne(id,session) {
  return brandRepo.deleteOne(id,session);
}


module.exports = { getAll, create, getById, getByName, update, deleteOne };
