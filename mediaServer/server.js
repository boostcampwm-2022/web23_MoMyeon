import express from "express";

const app = express();
import http from 'http';
import https from 'https';
import fs from 'fs';
import path from 'path';
const __dirname = path.resolve();
import { Server } from 'socket.io';
import mediasoup, { getSupportedRtpCapabilities } from 'mediasoup'

app.get('/',(req, res) => {
  res.send('hi');
})

const options = {
  key: fs.readFileSync('/home/kabosumy3a/momyeon/private.key', 'utf-8'),
  cert: fs.readFileSync('/home/kabosumy3a/momyeon/certificate.crt', 'utf-8')
};


const httpsServer = https.createServer(options, app);
httpsServer.listen(8443, () => {
  console.log('listening');
});


const io = new Server(httpsServer, {
  cors: {
    origin: 'https://www.momyeon.site'
    //origin: 'http://localhost:3000'
  }}
);

let worker ;
let rooms = {}
let peers = {}
let transports = []
let producers = []
let consumers = []

const createWorker = async () => {
  worker = await mediasoup.createWorker({
    rtcMinPort: 2000,
    rtcMaxPort: 2020,
  });

  console.log(`worker pid ${worker.pid}`);

  worker.on('died', error => {
    console.error('mediasoup worker died ');
    setTimeout(()=> process.exit(1), 2000);
  });
}
await createWorker() ;

const mediaCodecs = [
  {
    kind: 'audio',
    mimeType: 'audio/opus',
    clockRate: 48000,
    channels: 2,
  },
  {
    kind: 'video',
    mimeType: 'video/VP8',
    clockRate: 90000,
    parameters: {
      'x-google-start-bitrate': 1000,
    },
  },
];

//const peers = io.of('/mediasoup');
io.on('connection', async (socket)=> {

  console.log('socket id: ' + socket.id);
  socket.emit('connection-success', {
    socketId: socket.id,
  });

  const removeItems = (items, socketId, type) => {
    items.forEach(item => {
      if (item.socketId === socket.id) {
        item[type].close()
      }
    })
    items = items.filter(item => item.socketId !== socket.id)

    return items
  }

  socket.on('disconnect', () => {
    // do some cleanup
    console.log('peer disconnected')
    consumers = removeItems(consumers, socket.id, 'consumer')
    producers = removeItems(producers, socket.id, 'producer')
    transports = removeItems(transports, socket.id, 'transport')

    const { roomName } = peers[socket.id]
    delete peers[socket.id]

    // remove socket from room
    rooms[roomName] = {
      router: rooms[roomName].router,
      peers: rooms[roomName].peers.filter(socketId => socketId !== socket.id)
    }
  })

  socket.on('join', async ({ roomName }, callback) => {
    // create Router if it does not exist
    // const router1 = rooms[roomName] && rooms[roomName].get('data').router || await createRoom(roomName, socket.id)

    console.log('isito kay?');

    const router1 = await createRoom(roomName, socket.id)

    peers[socket.id] = {
      socket,
      roomName,           // Name for the Router this Peer joined
      transports: [],
      producers: [],
      consumers: [],
      peerDetails: {
        name: '',
        isAdmin: false,   // Is this Peer the Admin?
      }
    }

    // get Router RTP Capabilities
    const rtpCapabilities = router1.rtpCapabilities

    // call callback from the client and send back the rtpCapabilities
    callback({ rtpCapabilities })
  })

  /*
  socket.on('joinRoom', async({roomName}, callback)=>{
    console.log('sfsfd');
    const router1 = await createRoom(roomName, socket.id);
    console.log(router1);
    peers[socket.id] = {
      socket,
      roomName,
      transports: [],
      producers: [],
      consumers: [],
      peerDetails: {
        name: '',
        isAdmin: false,
      }
    }

    const rtpCapabilities = router1.rtpCapabilities ;
    callback({rtpCapabilities});

  });
  */

  const createRoom = async(roomName, socketId) => {
    //worker.createRouter(options)
    //options = {mediaCodecs, appData }
    //mediaCodecs -> defined above
    //appData -> custom application data
    //none of the tow are required

    let router1 ;
    let peers = [];
    if(rooms[roomName]){
      router1 = rooms[roomName].router ;
      peers = rooms[roomName].peers || [];
    } else {
      router1 = await worker.createRouter({mediaCodecs,});
    }

    console.log(`Router ID:  ${router1.id} ${peers.length}`);
    rooms[roomName] = {
      router: router1,
      peers: [...peers, socketId]
    }

    return router1 ;
  }


  const getRtpCapabilities = (callback) => {
    const rtpCapabilities = router.rtpCapabilities ;
    console.log('rtp Capabilities+++', rtpCapabilities);
    callback({rtpCapabilities});
  }

  socket.on('createWebRtcTransport', async ({consumer}, callback) => {
    const roomName = peers[socket.id].roomName;
    const router = rooms[roomName].router ;

    console.log(roomName, router);

    createWebRtcTransport(router).then(
      transport => {
        callback({
          params: {
            id: transport.id,
            iceParameters: transport.iceParameters,
            iceCandidates: transport.iceCandidates,
            dtlsParameters: transport.dtlsParameters,
          }
        });
        addTransport(transport, roomName, consumer);
      },
      error => {
        console.log(error);
      }
    )
  });

  const addTransport = (transport, roomName, consumer) => {
    transports = [
      ...transports,
      {socketId: socket.id, transport, roomName, consumer,}
    ];

    peers[socket.id] = {
      ...peers[socket.id],
      transports: [
        ...peers[socket.id].transports,
        transport.id,
      ]
    }
  }

  const addProducer = (producer, roomName) => {
    producers = [
      ...producers,
      { socketId: socket.id, producer, roomName}
    ]

    peers[socket.id] = {
      ...peers[socket.id],
      producers: [
        ...peers[socket.id].producers,
        producer.id,
      ]
    }
  }

  const addConsumer = (consumer, roomName) => {
    // add the consumer to the consumers list
    consumers = [
      ...consumers,
      { socketId: socket.id, consumer, roomName, }
    ]

    // add the consumer id to the peers list
    peers[socket.id] = {
      ...peers[socket.id],
      consumers: [
        ...peers[socket.id].consumers,
        consumer.id,
      ]
    }
  }

  const informConsumers = (roomName, socketId, id) => {
    console.log(`just joined, id ${id} ${roomName}, ${socketId}`)
    // A new producer just joined
    // let all consumers to consume this producer
    producers.forEach(producerData => {
      if (producerData.socketId !== socketId && producerData.roomName === roomName) {
        const producerSocket = peers[producerData.socketId].socket
        // use socket to send producer id to producer
        producerSocket.emit('new-producer', { producerId: id })
      }
    })
  }

  const getTransport = (socketId) => {
    //내 껀데 consumer가 아닌 거
    const [producerTransport] = transports.filter(transport => transport.socketId === socketId && !transport.consumer)
    return producerTransport.transport
  }

  socket.on('transport-connect', ({dtlsParameters}) => {
    console.log('DTLS PARAMS....', {dtlsParameters});
    getTransport(socket.id).connect({dtlsParameters});
  });

  socket.on('transport-produce', async({kind, rtpParameters, appData}, callback) => {
    const producer = await getTransport(socket.id).produce({
      kind,
      rtpParameters,
    });

    //add producer => producers.array

    const {roomName} = peers[socket.id];
    addProducer(producer, roomName);

    informConsumers(roomName, socket.id, producer.id);

    console.log('Producer ID: ', producer.id, producer.kind);

    producer.on('transportclose', () => {
      console.log('transport for this producer closed ')
      producer.close()
    })

    // Send back to the client the Producer's id
    callback({
      id: producer.id,
      producerExist: producers.length > 1,

    })
  });

  socket.on('getProducers', callback => {
    //return all producer transports
    const { roomName } = peers[socket.id]

    let producerList = []
    producers.forEach(producerData => {
      if (producerData.socketId !== socket.id && producerData.roomName === roomName) {
        producerList = [...producerList, producerData.producer.id]
      }
    })

    // return the producer list back to the client
    callback(producerList)
  })

  socket.on('transport-recv-connect', async({dtlsParameters, serverConsumerTransportId}) => {
    console.log(`DTLS PARAMS: ${dtlsParameters}`);
    const consumerTransport =  transports.find(transportData => (
      transportData.consumer && transportData.transport.id === serverConsumerTransportId
    ))?.transport;
    await consumerTransport.connect({dtlsParameters});
  });

  socket.on('consume', async ({rtpCapabilities, remoteProducerId, serverConsumerTransportId}, callback)=> {
    try {

      const { roomName } = peers[socket.id];
      const router = rooms[roomName].router ;
      let consumerTransport = transports.find(transportData => (
        transportData.consumer && transportData.transport.id === serverConsumerTransportId
      ))?.transport;

      if(router.canConsume({
        producerId: remoteProducerId,
        rtpCapabilities,
      })) {
        const consumer = await consumerTransport.consume({
          producerId: remoteProducerId,
          rtpCapabilities,
          paused: true, /* recommend */
        });

        consumer.on('transportclose', () => {
          console.log('transport for this consumer closed ');
          consumer.close();
        });

        consumer.on('producerclose', () => {
          console.log('producer of consumer closed');

          socket.emit('producer-closed', { remoteProducerId })

          consumerTransport.close([])
          transports = transports.filter(transportData => transportData.transport.id !== consumerTransport.id)
          consumer.close();
          consumers = consumers.filter(consumerData => consumerData.consumer.id !== consumer.id)
        });

        addConsumer(consumer, roomName);

        const params = {
          id: consumer.id,
          producerId: remoteProducerId,
          kind: consumer.kind,
          rtpParameters: consumer.rtpParameters,
          serverConsumerId: consumer.id,
        }

        console.log(params);

        callback({params});

      } else {
        console.log('cannot consume');
      }
    } catch (error) {
      console.log(error.message);
      callback({
        params: {
          error
        }
      })
    }
  });

  socket.on('consumer-resume', async ({serverConsumerId}) => {
    console.log('consumer resume');
    const { consumer } = consumers.find(consumerData => consumerData.consumer.id === serverConsumerId);
    await consumer.resume();
  });

});

const createWebRtcTransport = async (router) => {
  return new Promise(async (resolve, reject) => {
    try {
      const webRtcTransport_options = {
        listenIps: [
          {
            	ip:'0.0.0.0',
		          announcedIp: '27.96.135.105'
          }
        ],
        enableUdp: true,
        enableTcp: true,
        preferUdp: true,
      }

      let transport = await router.createWebRtcTransport(webRtcTransport_options);
      console.log('transport id: '+ transport.id);

      transport.on('dtlsstatechange', dtlsState => {
        if(dtlsState === 'closed'){
          transport.close();
        }
      });

      transport.on('close', () => {
        console.log('transport closed')
      });

      resolve(transport) ;
  } catch (error) {
      reject(error);
    }
  });
}
