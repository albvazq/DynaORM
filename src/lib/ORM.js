import Pluralize from "pluralize";

function tableName(_object, instance) {
    let tableName = null;

    if (instance) {
        if (_object.tableName != null) {
            return _object.tableName;
        }
    } else {
        if (_object.prototype.tableName != null) {
            return _object.prototype.tableName;
        }
    }

    if (instance != undefined) {
        let funcNameRegex = /function (.{1,})\(/;
        let results = (funcNameRegex).exec(_object.constructor.toString());
        tableName = (results && results.length > 1) ? results[1] : "";
    } else {
        tableName = _object.name;
    }
    return Pluralize(tableName.toLowerCase());
}

export default class ORM {
    constructor(_client) {
        this._client = _client;
    }

    querySingle(model, query, values, attributes, last) {
        var _self = this;
        var params = {
            TableName: tableName(model),
            FilterExpression: query,
            ExpressionAttributeValues: values,
            ExpressionAttributeNames: attributes
        };
        if (last != undefined && last != null) {
            params["ExclusiveStartKey"] = last;
        }
        return new Promise(function(resolve, reject) {
            _self.client.scan(params, function(err, data) {
                if (err) {
                    reject(err);
                } else {
                    let item = null;
                    if (data.Items.length > 0) {
                        item = data.Items[0];
                    }
                    let modelItem = new model(item);
                    resolve(modelItem);
                }
            });
        });
    }

    query(model, query, values, attributes, last) {
        var _self = this;
        var params = {
            TableName: tableName(model),
            FilterExpression: query,
            ExpressionAttributeValues: values,
            ExpressionAttributeNames: attributes
        };
        if (last != undefined && last != null) {
            params["ExclusiveStartKey"] = last;
        }

        return new Promise(function(resolve, reject) {
            _self.client.scan(params, function(err, data) {
                if (err) {
                    reject(err);
                } else {
                    let modelItemsList = [];
                    if (data.Items.length > 0) {
                        let itemsList = data.Items;
                        for (let i in itemsList) {
                            modelItemsList.push(new model(itemsList[i]))
                        }
                    }
                    resolve(modelItemsList);
                }
            });
        });
    }

    select(_object) {
        let _self = this;
        let params = {
            'TableName': tableName(_object),
            FilterExpression: '',
            ExpressionAttributeValues: {}
        };

        _self.client.scan(params, function(err, data) {
            if (err) console.log(err);
            else console.log(data);
        });
    }

    insert(_object) {
        let _self = this;
        if (_object.hasPrimaryKey()) {
            return new Promise(function(resolve, reject) {
                var params = {
                    'TableName': tableName(_object, true),
                    'Item': _object
                };
                _self.client.put(params, function(err, data) {
                    if (err) {
                        console.log(err);
                        reject(err);
                    } else {
                        resolve(data);
                    }
                });
            });
        } else {
            return null;
        }
    }

    delete(_object) {
        let _self = this;
        let params = {
            TableName: tableName(_object, true),
            Key: {}
        };

        if (_object.hasPrimaryKey()) {
            params.Key[_object.primaryKey] = _object.primaryKeyValue();
            if (_object.hasPartitionKey()) {
                params.Key[_object.partitionKey] = _object.partitionKeyValue();
            }
            return new Promise(function(resolve, reject) {
                _self.client.delete(params, function(err, data) {
                    if (err) {
                        console.error("Unable to delete item. Error JSON:", JSON.stringify(err, null, 2));
                        reject(err);
                    } else {
                        resolve(data);
                    }
                });
            });
        } else {
            return null;
        }


    }

    get client() {
        return this._client;
    }
}