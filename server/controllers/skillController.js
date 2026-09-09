const Skill = require('../models/Skill');
const buildCrud = require('./genericCrud');

module.exports = buildCrud(Skill, { visibleField: 'visible', label: 'Skill' });
