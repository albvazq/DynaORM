* <a href="#introduction">Introduction</a>
* <a href="#initialization">Initialization</a>
* <a href="#creating-a-model">Creating a model</a>
* <a href="#creating-saving-and-deleting-objects">Creating, saving and deleting objects</a>
	* <a href="#create">Create</a>
	* <a href="#save">Save</a>
	* <a href="#delete">Delete</a>
* <a href="#getting-objects-from-the-database">Getting objects from the database</a>
	* <a href="#request-a-specific-object-using-its-primary-key">By primary key</a>
	* <a href="#filter-items-from-your-database">By filters</a>
* <a href="#accesing-to-awsdynamodocumentclient-instance">AWS DynamoDB instance</a>
* <a href="#donate">Donate</a>

## Introduction

This library was witten to work as an ES6 library. But if you need to use it with a prev version of JavaScript you can transpile your code using the command (after run npm install):

```
npm run build && npm run test
```

## Initialization

You can initialize your database with:

```javascript
DB.init({
	"driver": "dynamo",
	"config": {
		"accessKeyId": YOUR_ACCESS_KEY_ID,
		"secretAccessKey": YOUR_SECRET_ACCESS_KEY,
		"region": YOUR_REGION //i.e. "us-east-1"
	}
});
```

## Creating a model

Inside the *Models* folder you can add new files that represents the entities in your database, for example if you have a table named **items** the model for this table would be:

```javascript
import Model from "./Model";

export default class Item extends Model {

}
```

Look that there is a convention that link a model with its respective table the model so the model **Item** will look for a table named with the name of the model in lower case and in plural.

You can change this convention adding the propertie *tableName* to the class prototype:

```javascript
Item.prototype["tableName"] = "itemsTable";
```

Another convention that can be changed are:

```javascript
Item.prototype["primaryKey"] = "customPrimaryKey"; //id by default
```

## Creating, saving and deleting objects

### Create
To create a new object (instance of a model) you can use:

```javascript
let item = new Item();
```

If you want to create a new model and initialize it with some data you can use:
```javascript
let item = new Item({
	"prop": "value"
});
```

You have to set a value for your primary key on each instance, other way the ORM will give an error because the key wont be created by the Dynamo class.

To assign the value of a propertie once you have created a model instance you can do:
```javascript
let item = new Item({
	"prop": "value"
});
item.newProp = 1234;
```

This can be done even if it is a new propertie and does not exist on the schema yet.


### Save
Once you have created a valid object or requested one to the database you can edit its properties and then save the changes to the database, an example of this could be:

```javascript
var item = new Item({"prop1": "value"});

item.save();
```

### Delete
If the object has been saved previously you can perform a **delete** action on the object, for example:

```javascript
item.delete();
```

## Getting objects from the database

### Request a specific object using its primary key
To request a specific object from the database you have to use the **find** method that is in the model class. You have to specify the key of the object you want to get from the database, an example of this functionality is:

```javascript
Item.find("00001").then(function(item) {
   item.delete();
});
```

### Filter items from your database

If you want to filter your records according to conditions you can use:

```javascript
Item
	.filter()
	.where("prop1", "=", "something")
	.and("prop2", ">", 1000)
	.execute()
	.then(function(itemsArray) {
		
	});
```

## Accesing to *AWS.Dynamo.DocumentClient()* instance
<p id="awsdynamoinstance"></p>

You can access directly to this instance if you want to perform some actions directly with te API of this class, to do this the code would be:

```javascript
let awsDynamo = DB.DynamoClient;
```

## Donate

[![paypal](https://www.paypalobjects.com/en_US/i/btn/btn_donateCC_LG.gif)](https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=BTJPCXNPH43YC)
