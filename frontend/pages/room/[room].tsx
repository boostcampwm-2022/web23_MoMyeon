import styles from 'styles/video.module.scss';
import {useState, useRef, useEffect} from "react";
import { Device } from 'mediasoup-client' ;
import io from 'socket.io-client';
import { GetServerSideProps } from "next";

export default function Room({ roomName }: any){

  const socketRef = useRef<any>(null);

  const paramsRef = useRef<any>(null);
  const localVideoRef = useRef<any>(null);
  const remoteVideoRef = useRef<any>({});

  const deviceRef = useRef<any>(null);
  const rtpCapabilitiesRef = useRef<any>(null);
  const producerTransportRef = useRef<any>(null);
  const consumerTransportRef = useRef<any>([]);

  const producerRef = useRef<any>(null);
  const consumerRef = useRef<any>(null);

  const [remoteVideoList, setRemoteVideoList] = useState<any[]>(['1']);

  useEffect(()=> {
    //const to = 'https://localhost:8000';
    const to = 'https://www.momyeon.site:8443';

    socketRef.current = io(to);

    socketRef.current.on('connection-success', ({socketId}: any) => {
      console.log(socketId);
      getLocalStream();
    });

    socketRef.current.on('new-producer', ({producerId}: any) => {
      signalNewConsumerTransport(producerId);
    });

    socketRef.current.on('producer-closed', ({remoteProducerId} : any)=> {
      const producerToClose = consumerTransportRef.current.find((transportData : any) => transportData.producerId === remoteProducerId)
      producerToClose.consumerTransport.close();
      producerToClose.consumer.close();
      consumerTransportRef.current = consumerRef.current.filter((transporData : any) => transporData.producerId !== remoteProducerId);
      setRemoteVideoList(prev => prev.filter((producerId : any) => producerId !== remoteProducerId));
      delete remoteVideoRef.current.remoteProducerId ;
    })

  },[]);

  //Producer 시작 코드
  const getLocalStream = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true ,
        video: {
          width: {
            min: 640,
            max: 1920,
          },
          height: {
            min: 400,
            max: 1080,
          }
        }
      });

      // https://mediasoup.org/documentation/v3/mediasoup-client/api/#ProducerOptions
      // https://mediasoup.org/documentation/v3/mediasoup-client/api/#transport-produce
      paramsRef.current = {
        encodings: [
          {
            rid: 'r0',
            maxBitrate: 100000,
            scalabilityMode: 'S1T3',
          },
          {
            rid: 'r1',
            maxBitrate: 300000,
            scalabilityMode: 'S1T3',
          },
          {
            rid: 'r2',
            maxBitrate: 900000,
            scalabilityMode: 'S1T3',
          },
        ],
        // https://mediasoup.org/documentation/v3/mediasoup-client/api/#ProducerCodecOptions
        codecOptions: {
          videoGoogleStartBitrate: 1000
        }
      }

      localVideoRef.current.srcObject = stream ;
      const track = stream.getVideoTracks()[0];
      paramsRef.current = {
        track,
        ...paramsRef.current
      }
      console.log(paramsRef.current);
      joinRoom();

    } catch (e) {
      alert('웹캠 가져오기 실패');
    }
  }

  const joinRoom = () => {
    console.log(socketRef.current, roomName);
    socketRef.current.emit('join', {roomName}, (data : any) => {
      console.log(`Router RTP Capabilities: ${data.rtpCapabilities}`);
      rtpCapabilitiesRef.current = data.rtpCapabilities ;
      createDevice();
    });
  }

  const createDevice = async () => {
    try {
      deviceRef.current = new Device();
      await deviceRef.current.load({
        routerRtpCapabilities: rtpCapabilitiesRef.current
      });

      console.log(deviceRef.current.rtpCapabilities);
      createSendTransport();

    } catch(error){
      console.log(`디바이스 만들 때 에러: ${error}`);
      if(error instanceof Error && error.name === 'UnsupportedError' ){
        console.warn('browser not supported');
      }
    }
  }

  const getProducers = () => {
    socketRef.current.emit('getProducers', (producerIds: any[])  => {
      console.log('producer ids');
      producerIds.forEach(signalNewConsumerTransport)
    });
  }

  const createSendTransport = () => {
    socketRef.current.emit('createWebRtcTransport', {consumer: false}, ({params} : any) => {
      if(params.error){
        console.log(params.error);
        return;
      }
      console.log(params);
      producerTransportRef.current = deviceRef.current.createSendTransport(params);

      producerTransportRef.current.on('connect', async ({dtlsParameters} : any, callback : any, errorback : any)=> {
        console.log("dtlsParameters: ", dtlsParameters);
        try{

          await socketRef.current.emit('transport-connect', {
            dtlsParameters: dtlsParameters,
          });

          callback();

        } catch(error){
          errorback(error);
        }
      });

      producerTransportRef.current.updateIceServers({iceServers: [
    		{
      			urls: ['turn:turn-test.ml:3478?transport=tcp'],
      			username: 'hello',
      			credential: 'world',
    		},
  	],});

      producerTransportRef.current.on('produce', async (parameters : any ,callback : any, errorback : any) => {
        console.log('produce parameters: ', parameters);
        try {
          await socketRef.current.emit('transport-produce', {
            kind: parameters.kind,
            rtpParameters: parameters.rtpParameters,
            appData: parameters.appData
          }, ({id, producersExist} : any)=> {
            callback(id);

            if(producersExist){
              //join room
              getProducers();
            }
          });

        } catch (error){
          errorback(error);
        }
      });

      connectSendTransport();
    });
  }

  const connectSendTransport = async () => {
    producerRef.current = await producerTransportRef.current.produce(paramsRef.current);
    producerRef.current.on('trackended', () => {
      console.log('tranck ended');
    });
    producerRef.current.on('transportclose', () => {
      console.log('transport ended');
    });
  }

  const signalNewConsumerTransport = async (remoteProducerId : any) => {
    await socketRef.current.emit('createWebRtcTransport', {consumer: true}, ({params} : any ) =>{
      if(params.error){
        console.log(params.error);
        return ;
      }
      console.log(params);

      let consumerTransport = deviceRef.current.createRecvTransport(params);

 	   consumerTransport.updateIceServers({iceServers: [
    		{
      			urls: ['turn:turn-test.ml:3478?transport=tcp'],
      			username: 'hello',
      			credential: 'world',
    		},
  	],});

      consumerTransport.on('connect', async({dtlsParameters} : any, callback : any , errorback : any) => {
        try {
          await socketRef.current.emit('transport-recv-connect', {
            serverConsumerTransportId: params.id,
            dtlsParameters,
          });
          callback();
        } catch(error){
          errorback(error);
        }
      });

      console.log(consumerTransport, remoteProducerId, params.id);

      connectRecvTransport(consumerTransport, remoteProducerId, params.id);

    });
  }

  const connectRecvTransport = async (consumerTransport : any, remoteProducerId : any, serverConsumerTransportId : any)  => {
    await socketRef.current.emit('consume', {
      rtpCapabilities: deviceRef.current.rtpCapabilities,
      remoteProducerId,
      serverConsumerTransportId,
    }, async ({params} : any) => {
      if(params.error){
        console.log('Cannot consume');
        return ;
      }

      console.log(params);

      const consumer = await consumerTransport.consume({
        id: params.id,
        producerId: params.producerId,
        kind: params.kind,
        rtpParameters: params.rtpParameters
      });

      //다시 체크
      consumerTransportRef.current = [
        ...consumerTransportRef.current,
        {
          consumerTransport: consumerTransport,
          serverConsumerTransportId: params.id,
          producerId: remoteProducerId,
          consumer,
        }
      ]

      setRemoteVideoList((prev: any[]) => [...prev, remoteProducerId]);
      console.log(remoteProducerId);
      const { track } = consumer;
      remoteVideoRef.current.remoteProducerId.srcObject = new MediaStream([track]);
      socketRef.current.emit('consumer-resume',{serverConsumerId: params.serverConsumerId });
    });
  }


  return (
    <div className={styles.layout}>
      <table className={styles.mainTable}>
        <tbody>
        <tr>
          <td className={styles.localColumn}>
            <video ref={localVideoRef} muted autoPlay className={styles.localVideo}/>
          </td>
          <td className={styles.remoteColumn}>
            <div className={styles.videoContainer}>
              {remoteVideoList?.map((remoteProducerId) => {
                return (
                  <video key={remoteProducerId} autoPlay
                         ref={(element) => remoteVideoRef.current.remoteProducerId = element}
                  />
                );
              })}
            </div>
          </td>
        </tr>
        </tbody>
      </table>
      <table>
        <tbody>
        <tr>
          <td>
          </td>
        </tr>
        </tbody>
      </table>
    </div>
  ) ;
}


export const getServerSideProps: GetServerSideProps = async (context) => {
  //API request
  const roomName = context.query.room;

  return {
    props: {
      roomName,
    },
  };
};

