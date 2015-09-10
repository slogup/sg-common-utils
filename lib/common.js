var domain = require('domain');

var functions = {
    makeBirthString: function(y, m, d) {
        if (Number(m) < 10) m = '0' + m;
        if (Number(d) < 10) d = '0' + d;
        return y + "-" + m + "-" + d;
    },
    toArray: function (obj, field) {
        var arr = obj[field];
        if (!arr || arr.length == 0) obj[field] = [];
        obj[field] = arr.split(",");
    },
    refineTags: function (obj, field) {
        var newArr = [];
        var arr = obj[field];
        if (!arr || arr.length == 0) obj[field] = [];
        arr = obj[field] = arr.split(",");
        var map = {};
        for (var i = 0; i < arr.length; ++i) {
            var tag = arr[i].replace(new RegExp(" ", "g"), "");
            if (!map[tag]) {
                map[tag] = true;
                newArr.push(tag);
            }
        }
        obj[field] = newArr;
    },
    getKmFromLatLng: function (Lat1, Lon1, Lat2, Lon2) {
        var pi80 = Math.PI / 180;
        Lat1 *= pi80;
        Lon1 *= pi80;
        Lat2 *= pi80;
        Lon2 *= pi80;

        var r = 6372.797; // mean radius of Earth in km
        var dlat = Lat2 - Lat1;
        var dlng = Lon2 - Lon1;

        var a = Math.sin(dlat / 2) * Math.sin(dlat / 2) + Math.cos(Lat1) * Math.cos(Lat2) * Math.sin(dlng / 2) * Math.sin(dlng / 2);
        var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        var km = r * c;

        return km;
    },
    refineError: function (body, key, code) {
        if (body) {
            for (var i = 0; i < body.length; ++i) {
                if (body[i].param == key) {
                    body[i].code = code;
                    break;
                }
            }
        }
        return body;
    },
    getDegreeFromKm: function (km) {
        return Number(km) / 111.12;
    },
    checkError: function (req, res, next) {
        var d = domain.create();
        d.on('error', function (err) {
            res.hjson(req, next, err.status, err.body);
        });
        d.run(function () {
            var errors = req.validationErrors();
            if (errors) {

                for (var i = 0; i < errors.length; ++i) {
                    if (errors[i].msg) {
                        errors[i].code = errors[i].msg;
                        delete errors[i].msg;
                    }
                }
                var responseError = {
                    status: 400,
                    body: errors
                };

                if (req.removeFiles) {
                    req.removeFiles(function (err) {
                        throw responseError;
                    });
                } else {
                    throw responseError;
                }
            }
        });
    },
    getRefinedPhone: function (req, aCode, aPhone) {
        var phone = (aPhone + "").replace(new RegExp("-", "g"), "");
        if (phone.substr(0, 1).toString() == '0') {
            phone = phone.substr(1, phone.length - 1);
        }
        return aCode + phone;
    },
    callInnerAPI: function (req, res, next, method, data, success, fail) {

        var query = req.query;
        var body = req.body;
        var params = req.params;
        var callback = req.callback;

        if (data) {
            if (method.toLowerCase() == 'gets' || method.toLowerCase() == 'get') {
                req.query = data;
                req.body = {};
                req.params = {};
            }
            else if (method.toLowerCase() == 'param') {
                req.query = {};
                req.body = {};
                req.params = data;
            }
            else {
                req.body = data;
                req.query = {};
                req.params = {};
            }
        } else {
            req.params = req.body = req.query = {};
        }

        req.callback = function (code, bodyData) {
            req.callback = callback;
            req.query = query;
            req.params = params;
            req.body = body;

            if (code >= 200 && code < 400) {
                success(code, bodyData);
            } else {
                if (fail) {
                    fail(code, bodyData);
                } else {
                    res.hjson(req, next, code);
                }
            }
        }
    }
};

module.exports = functions;