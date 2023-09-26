import weaviate, { WeaviateClient, ApiKey } from 'weaviate-ts-client';
import * as dotenv from 'dotenv';

dotenv.config();


// Set up the Weaviate client
const client: WeaviateClient = weaviate.client({
    scheme: 'https',
    host: 'naked-and-afraid-k451sreg.weaviate.network',
    apiKey: new ApiKey('WEAVIATE_APIKEY'), 
});

async function fetchAllThings() {
    try {
        // Replace this with the actual Weaviate API call you'd like to make
        // For this example, I'm assuming there's a method named `getAllThings`
        const things = await client.getAllThings();

        console.log(things);
    } catch (error) {
        console.error('Error fetching things:', error);
    }
}

fetchAllThings();
