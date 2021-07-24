const { MongoClient, ObjectId } = require('mongodb');

const connectionURL = 'mongodb://127.0.0.1:27017';
const databaseName = 'task-manager';

MongoClient.connect(
   connectionURL,
   { useNewUrlParser: true },
   async (error, client) => {
      if (error) {
         return console.log('An error occurred');
      }

      const db = client.db(databaseName);

      const result = await db.collection('tasks').updateMany(
         { completed: true },
         {
            $set: {
               completed: false,
            },
         }
      );

      console.log(result);
   }
);
