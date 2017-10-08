import DB from "./DB";

export default class Model {

    /* Instance methods */
    constructor(properties) {
        for (let p in properties) {
            this[p] = properties[p];
        }
    }

    save() {
        DB.ORM.insert(this);
    }

    delete() {
        DB.ORM.delete(this);
    }

    show() {
        console.log(this);
    }

    /***********************************************************************************/

    hasPrimaryKey() {
        if (this[this.primaryKey] != undefined && this[this.primaryKey] != null) {
            return true;
        }
        return false;
    }

    primaryKeyValue() {
        if (this.hasPrimaryKey()) {
            return this[this.primaryKey];
        }
        return null;
    }

    hasPartitionKey() {
        if (this[this.partitionKey] != undefined && this[this.partitionKey] != null) {
            return true;
        }
        return false;
    }

    partitionKeyValue() {
        if (this.hasPrimaryKey()) {
            return this[this.partitionKey];
        }
        return null;
    }

    /***********************************************************************************/

    /* Static methods availables directly form the class without any instance */

    static all() {
        DB.ORM.select(this);
    }

    static find(primaryKeyValue) {
        let _self = this;
        if (primaryKeyValue != undefined && primaryKeyValue != null) {
            let filter = _self.filter();
            filter["executeSingle"] = function(last) {
                return DB.ORM.querySingle(this._model, this._query, this._values, this._attributes);
            };
            return filter.where(_self.prototype.primaryKey, "=", primaryKeyValue).executeSingle();
        }
        return null;
    }

    static filter() {
        return {
            "_model": this,
            "_query": "",
            "_values": {},
            "_attributes": {},
            "where": function(prop, comp, value) {
                var _prop = prop.split(".");
                var _attr = "";
                for (var i in _prop) {
                    if (i == 0) {
                        _attr += "#";
                    }
                    if (i > 0) {
                        _attr += ".";
                    }
                    _attr += _prop[i];
                }
                let _val = ":" + prop.replace(".", "_");
                this._query += _attr + " " + comp + " " + _val;
                this._values[_val] = value;
                this._attributes["#" + _prop[0]] = _prop[0];
                return this;
            },
            "and": function(prop, comp, value) {
                this._query += " AND ";
                this.where(prop, comp, value);
                return this;
            },
            "or": function(prop, comp, value) {
                this._query += " OR ";
                this.where(prop, comp, value);
                return this;
            },
            "execute": function(last) {
                return DB.ORM.query(this._model, this._query, this._values, this._attributes);
            }
        };
    }

    static truncate() {
        console.log(this.primaryKey);
    }

}

Model.prototype["tableName"] = null;
Model.prototype["primaryKey"] = "id";
Model.prototype["partitionKey"] = null;