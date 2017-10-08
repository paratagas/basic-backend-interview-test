/**
 * Main controller
 */

var request = require('request');
var appSettings = require('../../settings');
var mongoose = require('mongoose');
var NeoModel = mongoose.model('Neo');

/**
 * Home page handler
 *
 * @param {object} req
 * @param {object} res
 */
module.exports.home = function(req, res) {
    res.json({"hello": "world!"});
};

/**
 * Hazardous page handler
 *
 * @param {object} req
 * @param {object} res
 */
module.exports.hazardous = function(req, res) {
    var today = new Date();
    var startDate = today.toISOString().substring(0, 10);
    var endDateMs = today.setDate(today.getDate() - 2);
    var endDate = new Date(endDateMs).toISOString().substring(0, 10);

    // Url example:
    // https://api.nasa.gov/neo/rest/v1/feed?start_date=2015-09-07&end_date=2015-09-08&api_key=N7LkblDsc5aen05FJqBQ8wU4qSdmsftwJagVK7UD

    var requestOptions = {
        url : appSettings.baseNasaUrl + "feed",
        method : "GET",
        json : {},
        qs : {
            start_date: startDate,
            end_date: endDate,
            api_key : appSettings.apiNasaKey
        }
    };

    var elementsCount = 0;
    var neos = {};

    request(
        requestOptions,
        function(err, response, body) {
            var data = body;
            if (response.statusCode === 200 && data.element_count > 0) {
                elementsCount = data.element_count;
                neos = data.near_earth_objects;
                _parseNeos(res, neos, elementsCount);
            }
        }
    );
};

/**
 * Fastest page handler
 *
 * @param {object} req
 * @param {object} res
 */
module.exports.fastest = function(req, res) {
    var hazardousValue = false; // default: false

    if (req.query.hazardous !== undefined && req.query.hazardous !== "") {
        hazardousValue = req.query.hazardous;
        console.log("hazardousValue: " + hazardousValue);
    }

    var parsedNeos = [];
    _parseAllNeosData(res, parsedNeos, hazardousValue, _calculateFastestNeo);
};

/**
 * Best year page handler
 *
 * @param {object} req
 * @param {object} res
 */
module.exports.bestYear = function(req, res) {
    var hazardousValue = false; // default: false

    if (req.query.hazardous !== undefined && req.query.hazardous !== "") {
        hazardousValue = req.query.hazardous;
        console.log("hazardousValue: " + hazardousValue);
    }

    var parsedNeos = [];
    _parseAllNeosData(res, parsedNeos, hazardousValue, _calculateBestYear);
};

/**
 * Best month page handler
 *
 * @param {object} req
 * @param {object} res
 */
module.exports.bestMonth = function(req, res) {
    var hazardousValue = false; // default: false

    if (req.query.hazardous !== undefined && req.query.hazardous !== "") {
        hazardousValue = req.query.hazardous;
        console.log("hazardousValue: " + hazardousValue);
    }

    var parsedNeos = [];
    _parseAllNeosData(res, parsedNeos, hazardousValue, _calculateBestMonth);
};

/**
 * Get neos by hazardous criteria
 *
 * @param {array} parsedNeos
 * @param {boolean} hazardousValue
 */
function _selectNeosByHazardousValue(parsedNeos, hazardousValue) {
    var selectedNeos = [];

    parsedNeos.forEach(function(item, i, arr) {
        if (item.isHazardous.toString() === hazardousValue) {
            selectedNeos.push(item);
        }
    });

    return selectedNeos;
}

/**
 * Get fastest neo
 *
 * @param {object} res
 * @param {array} parsedNeos
 * @param {boolean} hazardousValue
 */
function _calculateFastestNeo(res, parsedNeos, hazardousValue) {
    var selectedNeos = _selectNeosByHazardousValue(parsedNeos, hazardousValue);
    var currentMaxSpeed = 0;
    var currentFastest = {};

    selectedNeos.forEach(function(item, i, arr) {
        if (item.speed > currentMaxSpeed) {
            currentMaxSpeed = item.speed;
            currentFastest = item;
        }
    });

    res.send(currentFastest);
}

/**
 * Create best year data
 *
 * @param {object} res
 * @param {array} parsedNeos
 * @param {boolean} hazardousValue
 */
function _calculateBestYear(res, parsedNeos, hazardousValue) {
    var allYears = {};
    var selectedNeos = _selectNeosByHazardousValue(parsedNeos, hazardousValue);

    selectedNeos.forEach(function(item, i, arr) {
        var currentYear = new Date(item.date).getFullYear();

        if (!allYears[currentYear]) {
            allYears[currentYear] = 1;
        } else {
            allYears[currentYear] += 1;
        }
    });

    var currentMaxNeos = 0;
    for (var year in allYears) {
        if (allYears[year] > currentMaxNeos) {
            currentMaxNeos = allYears[year];
            var bestYear = {};
            bestYear[year] = allYears[year];
        }
    }

    res.send(bestYear);
}

/**
 * Create best month data
 *
 * @param {object} res
 * @param {array} parsedNeos
 * @param {boolean} hazardousValue
 */
function _calculateBestMonth(res, parsedNeos, hazardousValue) {
    var allMonths = {};
    var selectedNeos = _selectNeosByHazardousValue(parsedNeos, hazardousValue);

    var monthNames = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December"
    ];

    selectedNeos.forEach(function(item, i, arr) {
        var currentMonthNum = new Date(item.date).getMonth();
        var currentMonth = monthNames[currentMonthNum];

        if (!allMonths[currentMonth]) {
            allMonths[currentMonth] = 1;
        } else {
            allMonths[currentMonth] += 1;
        }
    });

    var currentMaxNeos = 0;
    for (var month in allMonths) {
        if (allMonths[month] > currentMaxNeos) {
            currentMaxNeos = allMonths[month];
            var bestMonth = {};
            bestMonth[month] = allMonths[month];
        }
    }

    res.send(bestMonth);
}

/**
 * Main logic to get and parse all neos information
 *
 * @param {object} res
 * @param {array} parsedNeos
 * @param {boolean} hazardousValue
 * @param {callback} processNeos
 */
function _parseAllNeosData(res, parsedNeos, hazardousValue, processNeos) {
    // Url example of getting all the data:
    // https://api.nasa.gov/neo/rest/v1/neo/browse?api_key=N7LkblDsc5aen05FJqBQ8wU4qSdmsftwJagVK7UD
    // Url example of getting all the data by pages:
    // https://api.nasa.gov/neo/rest/v1/neo/browse?page=0&size=20&api_key=N7LkblDsc5aen05FJqBQ8wU4qSdmsftwJagVK7UD

    var neos = {};
    var elementsCount = 0;

    /**
     * We will use smaller defined pages count (e.g. 25) because NASA
     * has limit of 1000 queries per hour with given key
     * and the total pages count (we need one request per page) is more than 850.
     * Instead we'll not be able to run more than 1 full-set fetching
     * query per hour.
     */
    var definedPagesCount = 25;
    var totalPagesCount = 0;
    var pageSize = 20; // max neos per page


    for (var i = 0; i <= definedPagesCount; i++) {
        var requestOptions = {
            url : appSettings.baseNasaUrl + "neo/browse",
            method : "GET",
            json : {},
            qs : {
                page : i,
                size : pageSize,
                api_key : appSettings.apiNasaKey
            }
        };

        request(
            requestOptions,
            function(err, response, body) {
                var data = body;
                if (response.statusCode === 200 && data.page.total_elements > 0) {
                    elementsCount = data.page.total_elements;
                    totalPagesCount = data.page.total_pages;
                    neos = data.near_earth_objects;

                    neos.forEach(function(item, i, arr) {
                        if (item.close_approach_data[0]) {
                            var neo = {};
                            neo.date = item.close_approach_data[0].close_approach_date;
                            neo.speed = Math.round(item.close_approach_data[0].relative_velocity.kilometers_per_hour);
                            neo.reference = item.neo_reference_id;
                            neo.name = item.name;
                            neo.isHazardous = item.is_potentially_hazardous_asteroid;
                            parsedNeos.push(neo);
                        }

                        if (parsedNeos.length === (pageSize * definedPagesCount)) {
                            console.log("elementsCount: " + elementsCount);
                            console.log("totalPagesCount: " + totalPagesCount);
                            processNeos(res, parsedNeos, hazardousValue);
                        }
                    });
                }
            }
        );
    }
}

/**
 * Main logic to get and parse neos information for 3 days info
 *
 * @param {object} res
 * @param {array} neos
 * @param {number} elementsCount
 */
function _parseNeos(res, neos, elementsCount) {
    var parsedNeos = [];
    for (var date in neos) {
        if (neos.hasOwnProperty(date)) {
            neos[date].forEach(function(item, i, arr) {
                var neo = {};
                neo.date = date;
                neo.reference = item.neo_reference_id;
                neo.name = item.name;
                neo.speed = Math.round(item.close_approach_data[0].relative_velocity.kilometers_per_hour);
                neo.isHazardous = item.is_potentially_hazardous_asteroid;
                parsedNeos.push(neo);
            });
        }
    }

    _storeNeosToDB(res, parsedNeos, elementsCount);
}

/**
 * Store data in DB
 *
 * @param {object} res
 * @param {array} parsedNeos
 * @param {number} elementsCount
 */
function _storeNeosToDB(res, parsedNeos, elementsCount) {
    NeoModel.remove({}, function() { // to avoid duplicate entries
        var elementsCounter = 0;
        parsedNeos.forEach(function(item, i, arr) {
            new NeoModel({
                date: item.date,
                reference: item.reference,
                name: item.name,
                speed: item.speed,
                isHazardous: item.isHazardous
            }).save(function () {
                elementsCounter += 1;
                // to avoid sending multiple headers:
                if (elementsCounter === elementsCount) {
                    _findPotentiallyHazardous(res);
                }
            });
        });
    });
}

/**
 * Get potentially hazardous neos
 *
 * @param {object} res
 */
function _findPotentiallyHazardous(res) {
    var query = NeoModel.find({})
        .select({
            "_id": 0,
            "date": 1,
            "reference": 1,
            "name": 1,
            "speed": 1,
            "isHazardous": 1
        })
        .where('isHazardous').equals(true)
    ;

    query.exec(function(err, neos) {
        if (!neos) {
            return res.send({
                "message": "neos not found"
            });
        } else if (err) {
            console.log(err);
            return res.send({
                "application": "error"
            });
        }

        res.send(neos);
    });
}
