import weaviate, { WeaviateClient, ApiKey, ObjectsBatcher } from 'weaviate-ts-client';
import * as dotenv from 'dotenv';
import fs from 'fs';

dotenv.config();


// Set up the Weaviate client
const client: WeaviateClient = weaviate.client({
  scheme: 'https',
  host: 'testing-r21ugq0e.weaviate.network',
  apiKey: new ApiKey('WEAVIATE-API-KEY'),
});

async function populateData(example: string) {
    // Get the data from the data.json file and read the class that is used in the schema
    const schemaObj = JSON.parse(fs.readFileSync('/Users/erinstaples/Library/CloudStorage/Dropbox/70-79 Technology/71 - GitHub/nakedandafraid/weaviate-ts-app/examples/naked-and-afraid/data.json' + example + '/Users/erinstaples/Library/CloudStorage/Dropbox/70-79 Technology/71 - GitHub/nakedandafraid/weaviate-ts-app/examples/naked-and-afraid/schema.json', 'utf8'));
    const className = schemaObj.class;
  
    // Get the data from the data.json file
    const { data } = JSON.parse(fs.readFileSync('/Users/erinstaples/Library/CloudStorage/Dropbox/70-79 Technology/71 - GitHub/nakedandafraid/weaviate-ts-app/examples/naked-and-afraid/data.json' + example + '/Users/erinstaples/Library/CloudStorage/Dropbox/70-79 Technology/71 - GitHub/nakedandafraid/weaviate-ts-app/examples/naked-and-afraid/schema.json', 'utf8'));
  
    // Prepare a batcher
    let batcher: ObjectsBatcher = client.batch.objectsBatcher();
    let counter: number = 0;
    let batchSize: number = 100;
    let batchNumber = 1;
  
    // Loop through the data
    for (const dataPoint of data) {
  
      // Create object properties from schema (make sure the property names match the schema)
      const properties: any = {};
      schemaObj.properties.forEach((property: any) => {
        properties[property.name] = dataPoint[property.name];
      });
  
      // Create an object
      const obj = {
        class: className,
        properties: properties,
      }
  
      // Add the object to the batch queue
      batcher = batcher.withObject(obj);
  
      // When the batch counter reaches batchSize, push the objects to Weaviate
      if (counter++ == batchSize) {
  
        // Flush the batch queue
        await batcher
        .do()
        .catch((err: Error) => {
          console.error(err)
        });
  
        console.log('Batch ' + batchNumber + '/' + Math.ceil(data.length / batchSize) + ' done. (' + data.length + ' objects in total)');
        batchNumber++
  
        // Restart the batch queue
        counter = 0;
        batcher = client.batch.objectsBatcher();
      }
    }
  
    // Flush the remaining objects
    batcher
    .do()
    .then((res: any) => {
      //console.log(res)
    })
    .catch((err: Error) => {
      console.error(err)
    });
  }
  
  async function createTsvFiles(example: string) {
    const { data } = JSON.parse(fs.readFileSync('./examples/' + example + '/data.json', 'utf8'));
    const schema = JSON.parse(fs.readFileSync('./examples/' + example + '/schema.json', 'utf8'));
    const className = schema.class;
  
    // create a string of all schema properties seperated by a space
    const schemaProperties = schema.properties.map((property: any) => {
      return property.name
    }).join(' ');
  
    const allVectors = await getAllVectors(className, schemaProperties, data.length)
  
    // remove newlines from the data
    allVectors.forEach((dataPoint: any) => {
      Object.keys(dataPoint).forEach((key: string) => {
        if (typeof dataPoint[key] === 'string') {
          dataPoint[key] = dataPoint[key].replace(/(\r\n|\n|\r)/gm, ' ');
        }
      });
    });
    
    const mappedVectors = allVectors.map((vector: any) => {
      return vector._additional.vector
    })
  }
  
  async function getAllVectors(className: string, properties: string, limit: number) {
    const response = await client.graphql
    .get()
    .withClassName(className)
    .withFields( properties + ' _additional {vector}' )
    .withLimit(limit)
    .do()
    .catch((err: Error) => {
      console.error(err)
    });
  
    if ( response ) {
      return response.data.Get[className]
    }
  }
  
  function main() {
    if ( process.argv[2] == 'populate') {
      populateData(process.argv[3]);
    } else if ( process.argv[2] == 'tsv') {
      createTsvFiles(process.argv[3]);
    }
  }
  
  main();