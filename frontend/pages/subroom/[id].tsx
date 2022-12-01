import styles from "../../styles/Webrtc.module.scss";
import { useEffect, useRef, useState } from "react";
import io, { Socket } from "socket.io-client";
import { Device, types } from "mediasoup-client";
import { GetServerSideProps } from "next";

let audioParams: any;
let videoParams: any = {
  // mediasoup params
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

interface RTCVideoProps {
  videotrack: MediaStream | undefined;
  audiotrack: MediaStream | undefined;
}

const RTCVideo = ({ videotrack, audiotrack }: RTCVideoProps) => {
  const viewRef = useRef<HTMLVideoElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  console.log("mediatrack", videotrack, audiotrack);
  useEffect(() => {
    if (!viewRef.current) return;
    viewRef.current.srcObject = videotrack ? videotrack : null;
  }, [videotrack]);
  useEffect(() => {
    if (!audioRef.current) return;
    audioRef.current.srcObject = audiotrack ? audiotrack : null;
  }, [audiotrack]);

  return (
    <>
      <video ref={viewRef} muted autoPlay></video>
      <audio ref={audioRef} muted autoPlay></audio>
    </>
  );
};

export default function Home({ roomId }: any) {
  const localvideoRef = useRef<null | HTMLVideoElement>(null);
  const deviceRef = useRef<null | types.Device>(null);
  const rtpCapRef = useRef<null | any>(null);
  const producerTransportRef = useRef<null | any>(null);
  const [consumers, setConsumers] = useState<any[]>([]);

  const consumerTransportRef = useRef<any[]>([]);
  const consumer = useRef<null | any>(null);
  const consumingTransports = useRef<any[]>([]);
  const socketRef = useRef<null | Socket>(null);

  useEffect(() => {
    if (socketRef.current === null) {
      if (!process.env.NEXT_PUBLIC_SOCKET_ACCESS) {
        console.log("Env 파일 확인해주세요");
        return;
      }

      const socket = io(process.env.NEXT_PUBLIC_SOCKET_ACCESS);
      socketRef.current = socket;
      socketRef.current.on("connection-success", ({ socketId }) => {
        console.log(socketId);
      });
      socketRef.current.on("new-producer", ({ producerId }: any) =>
        signalNewConsumerTransport(producerId)
      );

      socketRef.current.on("producer-closed", ({ remoteProducerId }) => {
        const producerToClose = consumerTransportRef.current?.find(
          (transportData: any) => transportData.producerId === remoteProducerId
        );

        setConsumers((prev) => {
          return prev.filter((item) => {
            return item.id !== remoteProducerId;
          });
        });
        producerToClose.consumerTransport.close();
        producerToClose.consumer.close();
        consumerTransportRef.current = consumerTransportRef.current?.filter(
          (transportData: any) => transportData.producerId !== remoteProducerId
        );
      });
    }
  });

  const getLocalCamera = async () => {
    const localStream = await navigator.mediaDevices.getUserMedia({
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
    if (localvideoRef.current) {
      localvideoRef.current.srcObject = localStream;
      streamSuccess(localStream);
    }
  };

  const streamSuccess = async (stream: MediaStream) => {
    audioParams = { track: stream.getAudioTracks()[0], ...audioParams };
    videoParams = { track: stream.getVideoTracks()[0], ...videoParams };

    joinRoom();
  };

  const createDevice = async () => {
    try {
      deviceRef.current = new Device();
      console.log("aaa");
      // console.log(rtpCapRef.current, deviceRef.current);
      await deviceRef.current.load({
        routerRtpCapabilities: rtpCapRef.current,
      });
      console.log("RTP Capabilites", deviceRef.current.rtpCapabilities);
      createSendTransport();
    } catch (error: any) {
      console.log("error zone");
      console.log(error.name);
      console.log(error);
    }
  };

  const joinRoom = () => {
    socketRef.current?.emit("join", { roomName: roomId }, (data: any) => {
      rtpCapRef.current = data.rtpCapabilities;
      console.log(rtpCapRef.current);
      createDevice();
    });
  };

  const createSendTransport = () => {
    socketRef.current?.emit(
      "createWebRtcTransport",
      { consumer: false },
      ({ params }: any) => {
        if (params.error) {
          console.log(params.error);
          return;
        }

        producerTransportRef.current =
          deviceRef.current?.createSendTransport(params);
        console.log(
          "producerTransportRef.current",
          producerTransportRef.current,
          params
        );

        producerTransportRef.current.on(
          "connect",
          async ({ dtlsParameters }: any, callback: any, errback: any) => {
            try {
              console.log("producerTransPort Connected");
              await socketRef.current?.emit("transport-connect", {
                dtlsParameters,
              });
              callback();
            } catch (error) {
              errback(error);
            }
          }
        );

        producerTransportRef.current?.on(
          "produce",
          async (parameters: any, callback: any, errback: any) => {
            console.log("producerTransPort produced");
            try {
              await socketRef.current?.emit(
                "transport-produce",
                {
                  kind: parameters.kind,
                  rtpParameters: parameters.rtpParameters,
                  appData: parameters.appData,
                },
                ({ id, producerExist }: any) => {
                  console.log(producerExist);
                  callback({ id });
                  if (producerExist) getProducers();
                }
              );
            } catch (error) {
              errback(error);
            }
          }
        );
        connectSendTransport();
      }
    );
  };

  const getProducers = () => {
    socketRef.current?.emit("getProducers", (producerIds: any) => {
      producerIds.forEach(signalNewConsumerTransport);
    });
  };

  const connectSendTransport = async () => {
    console.log("videon produce start", videoParams);
    const videoProducer = await producerTransportRef.current.produce(
      videoParams
    );
    console.log("videon produce end");

    const audioProducer = await producerTransportRef.current.produce(
      audioParams
    );
    audioProducer.on("trackended", () => {
      console.log("audio track ended");
    });
    audioProducer.on("transportclose", () => {
      console.log("audio transport ended");
    });

    videoProducer.on("trackended", () => {
      console.log("video track ended");
    });
    videoProducer.on("transportclose", () => {
      console.log("video transport ended");
    });
  };

  const signalNewConsumerTransport = (remoteProducerId: any) => {
    if (consumingTransports.current?.includes(remoteProducerId)) return;
    consumingTransports.current = [
      ...consumingTransports.current,
      remoteProducerId,
    ];

    socketRef.current?.emit(
      "createWebRtcTransport",
      { consumer: true },
      ({ params }: any) => {
        if (params.error) {
          console.log(params.error);
          return;
        }
        console.log(params);
        let consumerTransport: any;
        try {
          consumerTransport = deviceRef.current?.createRecvTransport(params);
        } catch (error) {
          console.log(error);
          return;
        }

        consumerTransport?.on(
          "connect",
          ({ dtlsParameters }: any, callback: any, errback: any) => {
            try {
              socketRef.current?.emit("transport-recv-connect", {
                dtlsParameters,
                serverConsumerTransportId: params.id,
              });
              callback();
              connectRecvTransport(
                consumerTransport,
                remoteProducerId,
                params.id
              );
            } catch (error) {
              errback(error);
            }
          }
        );
      }
    );
  };

  const connectRecvTransport = (
    consumerTransport: any,
    remoteProducerId: any,
    serverConsumerTransportId: any
  ) => {
    socketRef.current?.emit(
      "consume",
      {
        rtpCapabilities: deviceRef.current?.rtpCapabilities,
        remoteProducerId,
        serverConsumerTransportId,
      },
      async ({ params }: any) => {
        if (params.error) {
          console.log("Cannot Consume");
          return;
        }
        console.log(params);

        consumer.current = await consumerTransport.consume({
          id: params.id,
          producerId: params.producerId,
          kind: params.kind,
          rtpParameters: params.rtpParameters,
        });

        consumerTransportRef.current = [
          ...consumerTransportRef.current,
          {
            consumerTransport,
            serverConsumerTransportId: params.id,
            producerId: remoteProducerId,
            consumer: consumer.current,
          },
        ];

        const { track }: any = consumer.current;
        setConsumers((prev) => {
          let idx = -1;
          prev.forEach((item: any, index: number) => {
            if (item.id === remoteProducerId) {
              idx = index;
            }
          });

          if (idx === -1) {
            if (params.kind === "audio")
              return [
                ...prev,
                { id: remoteProducerId, audiotrack: new MediaStream([track]) },
              ];
            return [
              ...prev,
              { id: remoteProducerId, videotrack: new MediaStream([track]) },
            ];
          }
          let temp = [...prev];
          if (params.kind === "audio")
            temp[idx] = { ...temp[idx], audiotrack: new MediaStream([track]) };
          else
            temp[idx] = { ...temp[idx], videotrack: new MediaStream([track]) };
          return temp;
        });

        socketRef.current?.emit("consumer-resume", {
          serverConsumerId: params.serverConsumerId,
        });
      }
    );
  };

  useEffect(() => {
    console.log(socketRef.current);
  }, [socketRef.current]);

  useEffect(() => {
    const event = () => {
      localvideoRef.current?.play();
    };
    if (localvideoRef.current)
      localvideoRef.current.onloadedmetadata = () => {
        event();
      };

    return () => {
      // eslint-disable-next-line react-hooks/exhaustive-deps
      localvideoRef.current?.removeEventListener("onLoadedMetadata", event);
    };
  }, []);

  return (
    <div className={styles.container}>
      <div className={styles.buttonContainer}>
        <video className={styles.localVideo} ref={localvideoRef} muted />
        {consumers.map((item: any) => {
          const { id, videotrack, audiotrack } = item;
          return (
            <RTCVideo
              key={id}
              videotrack={videotrack}
              audiotrack={audiotrack}
            />
          );
        })}
      </div>

      <div className={styles.buttonContainer}>
        <button onClick={getLocalCamera}>Produce</button>
      </div>
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  //API request
  const roomId = context.query.id;
  return {
    props: {
      roomId,
    },
  };
};
