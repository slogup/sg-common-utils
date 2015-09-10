var utils = {
    common: require('./lib/common'),
    structure: require('./lib/data-structure'),
    logwriter: require('./lib/logwriter')
};
module.exports.utils = utils;
module.exports.connect = function () {
    return function (req, res, next) {
        req.utils = utils;
        next();
    };
};