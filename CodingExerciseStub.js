module.exports.translateStringToObject = translateStringToObject;
module.exports.translateObjectToString = translateObjectToString;

/**** Sample Configuration and Objects ************************************* */

var configuration = [
    { propKey: 'Prop0', objectType: 'User', objectKey: 'name' },
    { propKey: 'Prop1', objectType: 'User', objectKey: 'address.streetAddresses[0]' },
    { propKey: 'Prop2', objectType: 'User', objectKey: 'address.streetAddresses[1]' },

    { propKey: 'Prop3', objectType: 'User', objectKey: 'address.city' },
    { propKey: 'Prop4', objectType: 'User', objectKey: 'address.state', toObject: 'toShortState', toProp: 'toLongState' },
    { propKey: 'Prop5', objectType: 'User', objectKey: 'address.zipCode' },
    { propKey: 'Prop32', objectType: 'User', objectKey: 'yearsExperience', toObject: Number }
];

var sampleUser = {
    name: 'Patrick Fowler',
    address: {
        streetAddresses: ['123 Fake St.', ''],
        city: 'Fakeville',
        state: 'CA',
        zipCode: '45678'
    },yearsExperience: 7};

var sampleUserString = 'Prop0:Patrick Fowler,Prop1:123 Fake St,Prop3:Fakeville,Prop4:California,Prop5:45678,Prop32:7';

/**** Implementation START ************************************************* */

/**
 * translateObjecToString
 * @param {String} inputString An arbitrary string to be translated
 * @returns {Object} A object representation of the input object
 */
function translateStringToObject(inputString) {
    var finalObject = {};
    var properties = [];
    var string = '';

    if (inputString === 'dev') {
        string = sampleUserString;
    } else {
        string = inputString;
    }

    console.log('\nString:\n', string, '\nBeing transformed into an object...');

    properties = string.split(',');

    properties.forEach(function(property) {
        var prop = property.split(':');

        for (var i = 0; i < configuration.length; i++) {
            if (configuration[i].propKey === prop[0]) {
                var transform = configuration[i].toObject ? configuration[i].toObject : null;

                if (typeof transform === 'string') {
                    transform = utils[transform];
                }

                if (configuration[i].objectKey.indexOf('.') > -1 || configuration[i].objectKey.indexOf('[') > -1) {    
                    utils.createSub(finalObject, configuration[i].objectKey, prop[1], transform);
                } else {
                    finalObject[configuration[i].objectKey] = transform ? transform(prop[1]) : prop[1];    
                }

                break;
            }
        }
    });

    console.log('\nString:\n', string, '\ntransformed into Object:\n', finalObject, '\n');

    return finalObject;
}

/**
 * translateObjecToString
 * @param {Object} inputObject An arbitrary object to be translated
 * @returns {String} A string representation of the input object
 */
function translateObjectToString(inputObject) {
    var finalString = '';
    var midObj = {};
    var object = {};
    var properties = [];



    if (inputObject === 'dev') {
        object = sampleUser;
    } else {
        object = inputObject;    
    }

    console.log('\nObject:\n', object, '\n\nBeing transformed into an string...\n');

    finalString = utils.processObj(object, '');

    console.log('Object:\n', object, '\n\ntransormed into String:\n\n', finalString);

    return finalString;
}


/**** Implementation END ************************************************* */

/**
 * Utlities Module:
 * Assume that any required translations will be available here and will return
 * the expected value.
 */

var utils = (function () {

    return {
        toShortState: toShortState,
        toLongState: toLongState,
        createSub: createSub,
        createSubObj: createSubObj,
        createSubArray: createSubArray,
        processObj: processObj
    };
    
    // Assume that all States will be properly translated
    function toShortState(state) {
        switch (state.toLowerCase()) {
            case 'california': return 'CA';
            default: return state;
        }
    }

    function toLongState(state) {
        switch (state.toUpperCase()) {
            case 'CA': return 'California';
            default: return state;
        }
    }

    function processObj(obj, keyString) {
        var tempString = '';
        var tempArr = [];
        if (Array.isArray(obj)) {
            obj.forEach(function(item, index) {
                tempString = '';
                if (keyString) {
                    tempString += keyString;
                }

                tempString += '[' + index + ']';
                tempArr.push(utils.processObj(item, tempString));
            });
            return tempArr.join(',');
        } else if (typeof obj === 'object'){
            for (var key in obj) {
                tempString = '';
                if (keyString) {
                    tempString += keyString + '.' + key;
                } else {
                    tempString += key;
                }
                tempArr.push(utils.processObj(obj[key], tempString));
            }
            return tempArr.join(',');
        } else {
            if (keyString) {
                tempString += keyString + '.';
            } else {
                tempString += keyString;
            }
            for (var i = 0; i < configuration.length; i++) {
                if (configuration[i].objectKey === keyString) {
                    var config = configuration[i];
                    var transformedObj = obj;

                    if (config.toProp && typeof config.toProp === 'string') {
                        transformedObj = utils[config.toProp](obj);
                    } else if (typeof config.toProp === 'object') {
                        transformedObj = config.toProp(obj);
                    }

                    return configuration[i].propKey + ':' + transformedObj;
                }
            }
        }
    }

    function createSub(object, keyString, value, transform) {
        if (keyString.indexOf('.') > -1 && keyString.indexOf('[') > -1) {
            
            if (keyString.indexOf('.') < keyString.indexOf('[')) {
                utils.createSubObj(object, keyString, value, transform);
            } else {
                utils.createSubArray(object, keyString, value, transform);
            }

        } else if (keyString.indexOf('.') > -1) {
            utils.createSubObj(object, keyString, value, transform);
        } else if (keyString.indexOf('[') > -1) {
            utils.createSubArray(object, keyString, value, transform);
        } else {
            object[keyString] = transform ? transform(value) : value;
        }
    }

    function createSubObj(object, string, value, transform) {
        var keySplit = string.split('.');
        
        if (!object[keySplit[0]]) {
            object[keySplit[0]] = {};
        }

        createSub(object[keySplit[0]], keySplit[1], value, transform);
    }

    function createSubArray(object, string, value, transform) {
        var indexSplit = string.split('[');
        var index = parseInt(indexSplit[1].split(']')[0]);

        if (!object[indexSplit[0]]) {
            object[indexSplit[0]] = [];
        }

        if (object[indexSplit[1]]) {
            createSub(object[indexSplit[0]][index], object[indexSplit[1]], value, transform);
        } else {
            object[indexSplit[0]][index] = value;
        }
    }

})();
