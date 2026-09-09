const { ok, created } = require('../utils/apiResponse');
const { ApiError } = require('../middleware/errorHandler');

/**
 * Builds standard CRUD handlers for a simple Mongoose model that has a
 * `visible` (or similar) boolean and an `order` field.
 *
 * @param {mongoose.Model} Model
 * @param {object} opts
 * @param {string} opts.visibleField - field name used to filter public results (default 'visible')
 * @param {string} opts.label - human-readable label for messages, e.g. "Skill"
 */
function buildCrud(Model, { visibleField = 'visible', label = 'Item' } = {}) {
  const getPublic = async (req, res, next) => {
    try {
      const filter = { [visibleField]: true };
      const items = await Model.find(filter).sort({ order: 1, createdAt: 1 });
      return ok(res, `${label}s fetched.`, { items });
    } catch (err) {
      next(err);
    }
  };

  const getAllAdmin = async (req, res, next) => {
    try {
      const items = await Model.find().sort({ order: 1, createdAt: 1 });
      return ok(res, `${label}s fetched.`, { items });
    } catch (err) {
      next(err);
    }
  };

  const createItem = async (req, res, next) => {
    try {
      const item = await Model.create(req.body);
      return created(res, `${label} created.`, { item });
    } catch (err) {
      next(err);
    }
  };

  const updateItem = async (req, res, next) => {
    try {
      const item = await Model.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
      });
      if (!item) throw new ApiError(404, `${label} not found.`);
      return ok(res, `${label} updated.`, { item });
    } catch (err) {
      next(err);
    }
  };

  const deleteItem = async (req, res, next) => {
    try {
      const item = await Model.findByIdAndDelete(req.params.id);
      if (!item) throw new ApiError(404, `${label} not found.`);
      return ok(res, `${label} deleted.`);
    } catch (err) {
      next(err);
    }
  };

  return { getPublic, getAllAdmin, createItem, updateItem, deleteItem };
}

module.exports = buildCrud;
