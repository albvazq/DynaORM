import AWS from "aws-sdk";
import ORM from "./ORM";

class DBLayer {
    constructor() {
        this.client = undefined;
        this.ormLayer = undefined;
    }
    init(params) {
        if (this.ormLayer == undefined) {
            AWS.config.update(params.config);
            this.client = new AWS.DynamoDB.DocumentClient();
            this.ormLayer = new ORM(this.client);
        }
    }
    get DynamoClient() {
        return this.client;
    }
    get ORM() {
        return this.ormLayer;
    }
}

let singleton = new DBLayer();

export default singleton;