import styles from "styles/room.module.scss";
import { useState, useRef, useEffect } from "react";
import { Device } from "mediasoup-client";
import io from "socket.io-client";

const MediasoupVideo = ({ roomName }: { roomName: string }) => {
  const socketRef = useRef<any>(null);
  const paramsRef = useRef<any>(null);
  const localMediaRef = useRef<any>(null);
  const remoteVideoRef = useRef<any>([]);

  const deviceRef = useRef<any>(null);
  const rtpCapabilitiesRef = useRef<any>(null);
  const producerTransportRef = useRef<any>(null);
  const consumerTransportRef = useRef<any>([]);

  const producerRef = useRef<any>(null);
  const consumerRef = useRef<any>(null);

  const remoteAudioRef = useRef<any>([]);
  const audioProducerRef = useRef<any>(null);
  const audioParamsRef = useRef<any>(null);
  const consumingTransportsRef = useRef<any>([]);

  useEffect(() => {
    let to = "http://localhost:8443";
    if (process.env.NEXT_PUBLIC_IS_DEPLOYMENT === "true") {
      to = "https://www.momyeon.site:8443";
    }
    socketRef.current = io(to);

    socketRef.current.on("connection-success", ({ socketId }: any) => {
      console.log(socketId);
      getLocalStream();
    });

    socketRef.current.on("new-producer", ({ producerId }: any) => {
      signalNewConsumerTransport(producerId);
    });

    socketRef.current.on("producer-closed", ({ remoteProducerId }: any) => {
      const producerToClose = consumerTransportRef.current.find(
        (transportData: any) => transportData.producerId === remoteProducerId
      );
      producerToClose.consumerTransport.close();
      producerToClose.consumer.close();
      consumerTransportRef.current = consumerRef.current.filter(
        (transporData: any) => transporData.producerId !== remoteProducerId
      );

      delete remoteVideoRef.current.remoteProducerId;
    });
  }, []);

  //Producer 시작 코드
  const getLocalStream = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: {
          width: {
            min: 640,
            max: 1920,
          },
          height: {
            min: 400,
            max: 1080,
          },
        },
      });

      // https://mediasoup.org/documentation/v3/mediasoup-client/api/#ProducerOptions
      // https://mediasoup.org/documentation/v3/mediasoup-client/api/#transport-produce
      paramsRef.current = {
        encodings: [
          {
            rid: "r0",
            maxBitrate: 100000,
            scalabilityMode: "S1T3",
          },
          {
            rid: "r1",
            maxBitrate: 300000,
            scalabilityMode: "S1T3",
          },
          {
            rid: "r2",
            maxBitrate: 900000,
            scalabilityMode: "S1T3",
          },
        ],
        // https://mediasoup.org/documentation/v3/mediasoup-client/api/#ProducerCodecOptions
        codecOptions: {
          videoGoogleStartBitrate: 1000,
        },
      };

      localMediaRef.current.srcObject = stream;

      audioParamsRef.current = {
        track: stream.getAudioTracks()[0],
        ...audioParamsRef.current,
      }

      paramsRef.current = {
        track: stream.getVideoTracks()[0],
        ...paramsRef.current,
      };

      joinRoom();
    } catch (e) {
      alert(e);
    }
  };

  const joinRoom = () => {
    console.log(socketRef.current, roomName);
    socketRef.current.emit("join", { roomName }, (data: any) => {
      console.log(`Router RTP Capabilities: ${data.rtpCapabilities}`);
      rtpCapabilitiesRef.current = data.rtpCapabilities;
      createDevice();
    });
  };

  const createDevice = async () => {
    try {
      deviceRef.current = new Device();
      await deviceRef.current.load({
        routerRtpCapabilities: rtpCapabilitiesRef.current,
      });

      console.log(deviceRef.current.rtpCapabilities);
      createSendTransport();
    } catch (error) {
      console.log(`디바이스 만들 때 에러: ${error}`);
      if (error instanceof Error && error.name === "UnsupportedError") {
        console.warn("browser not supported");
      }
    }
  };

  const getProducers = () => {
    console.log("here?");
    socketRef.current.emit("getProducers", (producerIds: any[]) => {
      console.log("producer ids");
      producerIds.forEach(signalNewConsumerTransport);
    });
  };

  const createSendTransport = () => {
    socketRef.current.emit(
      "createWebRtcTransport",
      { consumer: false },
      ({ params }: any) => {
        if (params.error) {
          console.log(params.error);
          return;
        }
        console.log(params);
        producerTransportRef.current =
          deviceRef.current.createSendTransport(params);

        producerTransportRef.current.on(
          "connect",
          async ({ dtlsParameters }: any, callback: any, errorback: any) => {
            console.log("dtlsParameters: ", dtlsParameters);
            try {
              await socketRef.current.emit("transport-connect", {
                dtlsParameters: dtlsParameters,
              });

              callback();
            } catch (error) {
              errorback(error);
            }
          }
        );

        /*
        producerTransportRef.current.updateIceServers({
          iceServers: [
            {
              urls: ["turn:turn-test.ml:3478?transport=tcp"],
              username: "hello",
              credential: "world",
            },
          ],
        });
        */

        producerTransportRef.current.on(
          "produce",
          async (parameters: any, callback: any, errorback: any) => {
            console.log("produce parameters: ", parameters);
            try {
              await socketRef.current.emit(
                "transport-produce",
                {
                  kind: parameters.kind,
                  rtpParameters: parameters.rtpParameters,
                  appData: parameters.appData,
                },
                ({ id, producersExist }: any) => {
                  console.log("here", producersExist);

                  callback(id);

                  if (producersExist) {
                    //join room
                    getProducers();
                  }
                }
              );
            } catch (error) {
              errorback(error);
            }
          }
        );

        connectSendTransport();
      }
    );
  };

  const connectSendTransport = async () => {
    audioProducerRef.current = await producerTransportRef.current.produce(
      audioParamsRef.current
    );
    producerRef.current = await producerTransportRef.current.produce(
      paramsRef.current
    );
    audioProducerRef.current.on('trackended', () => {
      console.log("audio track ended");
    })

    producerRef.current.on("trackended", () => {
      console.log("tranck ended");
    });

    audioProducerRef.current.on('transportclose', () => {
      console.log("audio transport ended");
    })

    producerRef.current.on("transportclose", () => {
      console.log("transport ended");
    });
  };

  const signalNewConsumerTransport = async (remoteProducerId: any) => {
    if (consumingTransportsRef.current.includes(remoteProducerId)){
      return ;
    }
    consumingTransportsRef.current.push(remoteProducerId);

    await socketRef.current.emit(
      "createWebRtcTransport",
      { consumer: true },
      ({ params }: any) => {
        if (params.error) {
          console.log(params.error);
          return;
        }
        console.log(params);

        let consumerTransport = deviceRef.current.createRecvTransport(params);

        /*
        consumerTransport.updateIceServers({
          iceServers: [
            {
              urls: ["turn:turn-test.ml:3478?transport=tcp"],
              username: "hello",
              credential: "world",
            },
          ],
        });*/

        consumerTransport.on(
          "connect",
          async ({ dtlsParameters }: any, callback: any, errorback: any) => {
            try {
              await socketRef.current.emit("transport-recv-connect", {
                serverConsumerTransportId: params.id,
                dtlsParameters,
              });
              callback();
            } catch (error) {
              errorback(error);
            }
          }
        );

        console.log(consumerTransport, remoteProducerId, params.id);

        connectRecvTransport(consumerTransport, remoteProducerId, params.id);
      }
    );
  };

  const connectRecvTransport = async (
    consumerTransport: any,
    remoteProducerId: any,
    serverConsumerTransportId: any
  ) => {
    await socketRef.current.emit(
      "consume",
      {
        rtpCapabilities: deviceRef.current.rtpCapabilities,
        remoteProducerId,
        serverConsumerTransportId,
      },
      async ({ params }: any) => {
        if (params.error) {
          console.log("Cannot consume");
          return;
        }

        console.log("paramprapm", params);

        const consumer = await consumerTransport.consume({
          id: params.id,
          producerId: params.producerId,
          kind: params.kind,
          rtpParameters: params.rtpParameters,
        });

        //다시 체크
        consumerTransportRef.current = [
          ...consumerTransportRef.current,
          {
            consumerTransport: consumerTransport,
            serverConsumerTransportId: params.id,
            producerId: remoteProducerId,
            consumer,
          },
        ];

        //setRemoteVideoList((prev: any[]) => [...prev, remoteProducerId]);
        //console.log(remoteProducerId);
        const { track } = consumer;

        if(params.kind === 'audio'){
          remoteAudioRef.current.filter(
            (elem: any) => elem.srcObject === null
          )[0].srcObject = new MediaStream([track]);
        } else {
          remoteVideoRef.current.filter(
            (elem: any) => elem.srcObject === null
          )[0].srcObject = new MediaStream([track]);
        }

        socketRef.current.emit("consumer-resume", {
          serverConsumerId: params.serverConsumerId,
        });
      }
    );
  };

  const handleClickRemoteAudioMuteBtn = (remote : number) => {
    remoteAudioRef.current[remote].muted = !remoteAudioRef.current[remote].muted;
  }

  const handleClickLocalAudioMuteBtn = () => {
    const audioTrack = localMediaRef.current.srcObject.getTracks().find((track: MediaStreamTrack)=> track.kind === 'audio') ;
    audioTrack.enabled = !audioTrack.enabled ;
  }

  const handleClickLocalVideoMuteBtn = () => {
    const videoTrack = localMediaRef.current.srcObject.getTracks().find((track: MediaStreamTrack)=> track.kind === 'video') ;
    videoTrack.enabled = !videoTrack.enabled ;
  }

  return (
    <div className={styles.videoContainer}>
      <div>
        <video ref={localMediaRef} muted autoPlay className={styles.videos} />
        <button onClick={handleClickLocalVideoMuteBtn}> 화면 </button>
        <span><button onClick={handleClickLocalAudioMuteBtn}> 음소거 </button></span>
      </div>
      {[0, 1, 2, 3, 4].map((remote) => {
        return (
          <div key={remote}>
            <audio ref={(elem) => (remoteAudioRef.current[remote] = elem)} autoPlay key={remote}/>
            <video
              ref={(elem) => (remoteVideoRef.current[remote] = elem)}
              autoPlay
              className={styles.videos}
              key={remote}
            />
            <button key={remote} onClick={() => handleClickRemoteAudioMuteBtn(remote)}> 음소거 </button>
          </div>
        );
      })}
    </div>
  );
};

export { MediasoupVideo };
