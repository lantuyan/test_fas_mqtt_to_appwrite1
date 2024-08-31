import { Client, Databases, ID } from 'node-appwrite';

// This is your Appwrite function
// It's executed each time we get a request
export default async ({ req, res, log, error }) => {
  // Why not try the Appwrite SDK?
  //
  let client = new Client();
  client.setEndpoint('https://167.179.68.203/v1')
      .setProject("66c2dba00021e2c89583")
      .setKey('7845980fd5b3722f268a44412de0290774776a9037e7cd4cf20890adac680fae6d55ecd9e02f7e2930c67b2d25a248647ce3d95d74cd6269150ac3c8c38628b873dea9fbe6c44835be16b75cc6404a6dd3de40a2628672c05528d73db18234837fc0dfcdaa2a2c3c81868b6299d1bff80f9f2fbfedd17ecdbc8a3ddd0c24fa2e');
  
  const databases = new Databases(client);
  const buildingDatabaseID = '66c2f1480035f5ecec60';
  const logCollectionId = '66d18cd100349aec7523';
  const sensorCollectionID = '66d18c8b00349aec7521';

  // You can log messages to the console
  log('Hello, Logs!');
  error('Hello, Errors!');

  try {
    const logs = await databases.listDocuments(
      buildingDatabaseID,
      logCollectionId
    );
    log(logs);
  } catch (r) {
    log(`list documents ${r}`);
  }

  try {
    await databases.createDocument(
      buildingDatabaseID, 
      logCollectionId, 
      ID.unique(), 
      {
        log: `test log ${new Date().toISOString()}`,
        time: new Date().toISOString(),
        type: "MQTT_AppWrite"
      }
    );
    log('create ooke');
  } catch (r) {
    error(`create not okke ${r}`);
  }

  if (req.method === 'GET') {
    // Send a response with the res object helpers
    // `res.send()` dispatches a string back to the client
    return res.send('Run oke !');
  }
  

  // `res.json()` is a handy helper for sending JSON
  return res.json({
    motto: 'Build like a team of hundreds_',
    learn: 'https://appwrite.io/docs',
    connect: 'https://appwrite.io/discord',
    getInspired: 'https://builtwith.appwrite.io',
  });
};
