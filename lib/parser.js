function parse_item(item) {
    const obj = {}

    obj.id = item.id;
    obj.type = item.type ? item.type : 'string';

    if(item.default) {
        obj.default = item.default;
    }

    return obj;
}

function parse_env(env) {
    const obj = {}

    if (Array.isArray(env)) {
        obj2 = {}
        for (let item of env) {
            const key = item.split('/').slice(-1)[0]; // TODO: implement key transformer
            obj2[key] = parse_item({id: item});
        }

        obj[''] = obj2;
    } else if (typeof env === 'object') {
        for (let key in env) {
            const obj2 = {}
            for (let itemKey in env[key]) {
                const item = env[key][itemKey];
                if (typeof item === 'string') {
                    obj2[itemKey] = parse_item({id: item});
                } else {
                    obj2[itemKey] = parse_item(item)
                }
            }
            obj[key] = obj2;
        }
    } else {
        throw Error('env must be list or object');
    }

    return obj;
}

function parse(infile) {
    const fs = require('fs');

    const obj = {}

    try {
        obj.source = infile.source ? infile.source : 'gcp';
        obj.env = parse_env(infile.env);
    } catch (err) {
        throw Error(`ParseError: ${err.message}`);
    }

    return obj;
}

exports.parse = parse;