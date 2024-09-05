import { Client, Databases, ID } from 'node-appwrite';
import mqtt from "mqtt"
// This is your Appwrite function
// It's executed each time we get a request
export default async ({ req, res, log, error }) => {
  // Why not try the Appwrite SDK?
  //
  let client = new Client();
  client.setEndpoint('http://167.179.68.203/v1')
      .setProject("66c2dba00021e2c89583")
      .setKey('7845980fd5b3722f268a44412de0290774776a9037e7cd4cf20890adac680fae6d55ecd9e02f7e2930c67b2d25a248647ce3d95d74cd6269150ac3c8c38628b873dea9fbe6c44835be16b75cc6404a6dd3de40a2628672c05528d73db18234837fc0dfcdaa2a2c3c81868b6299d1bff80f9f2fbfedd17ecdbc8a3ddd0c24fa2e');

  const databases = new Databases(client);
  const buildingDatabaseID = '66c2f1480035f5ecec60';
  const sensorCollectionID = '66c2f151003d3f0842e9';
  const logCollectionId = '66d18cd100349aec7523';
  const applicationChirpStackID = '90';

  var client_mqtt = mqtt.connect(mqtt_url)
    // let topicName = `application/90/device/+/event/up`
    const topicName = `application/${applicationChirpStackID}/device/+/event/up`;

    client_mqtt.on("connect", function () {
      log("client connect successfully")
      client_mqtt.subscribe(topicName, (err, granted) => {
          if (err) {
              log(err, 'err');
              // logAppwrite("err")
          }
          log(granted, 'granted')
          // logAppwrite("granted")
      })
  })

  client_mqtt.on('message', async (topic, message, packet) => {
      try {
          const temp = JSON.parse(message);
          log('Received message:', temp);

          await databases.updateDocument(
            buildingDatabaseID,
            sensorCollectionID,
            temp.devEUI,
            {
              name: temp.deviceName.split('_')[0],
              // time real get from nodejs server
              time: new Date().toISOString,
              timeTurnOn: "",
              battery: temp.object.battery,
              type : temp.deviceProfileName,
              value: temp.object.temperature ?? 2,
              status: "on"
            }
          );
          log('Document updated successfully');
          logAppwrite(`Document updated successfully: ${temp.devEUI}`);
        } catch (error) {
          log('Error processing message:', error);
        }
  })

  client_mqtt.on("packetsend", (packet) => {
      
  })

  client_mqtt.on("error", function (error) {
      log('err: ', error)
      // logAppwrite(`rr: ${error}`)
  })

  client_mqtt.on("close", function () {
      log("closed")
      // logAppwrite("closed")
  })
  if (req.method === 'GET') {
    return res.send('Run oke !');
  }
  
  return res.json({
    motto: 'Build like a team of hundreds_',
    learn: 'https://appwrite.io/docs',
    connect: 'https://appwrite.io/discord',
    getInspired: 'https://builtwith.appwrite.io',
  });
};

async function logAppwrite(log) {
  try {
    await databases.createDocument(buildingDatabaseID, logCollectionId, ID.unique(), {
      log: log,
      time: new Date().toISOString(),
      type: "MQTT_AppWrite"
    });
  } catch (error) {
    console.log('Error logging:', error);
  }
}
