import styles from "styles/room.module.scss";
import { useRef, useEffect } from "react";
import { Device } from "mediasoup-client";
import io from "socket.io-client";
import { MuteButton } from "components/button/muteButton.component";
import { feedbackStartedState } from "states/feedbackStarted";

const MediasoupVideo = ({
  roomName,
  isLeft,
  isHost,
}: {
  roomName: string;
  isLeft: boolean;
  isHost: boolean;
}) => {
  const socketRef = useRef<any>(null);
  const paramsRef = useRef<any>(null);
  const localMediaRef = useRef<any>(null);
  const remoteVideoRef = useRef<any>([]);

  const deviceRef = useRef<any>(null);
  const rtpCapabilitiesRef = useRef<any>(null);
  const producerTransportRef = useRef<any>(null);
  const consumerTransportRef = useRef<any>([]);

  const producerRef = useRef<any>(null);

  const remoteAudioRef = useRef<any>([]);
  const audioProducerRef = useRef<any>(null);
  const audioParamsRef = useRef<any>(null);
  const consumingTransportsRef = useRef<any>([]);

  const producerIdRef = useRef<any>(null);
  const producerIdToAudioIdxRef = useRef<any>({});
  const producerIdToVideoIdxRef = useRef<any>({});

  const [isFeedbackStarted, setIsFeedbackStarted] = feedbackStartedState();

  useEffect(() => {
    let to = "http://localhost:8443";
    if (process.env.NEXT_PUBLIC_IS_DEPLOYMENT === "true") {
      to = "https://www.momyeon.site:8443";
    }
    socketRef.current = io(to);

    socketRef.current.on("connection-success", ({ socketId }: any) => {
      //console.log(socketId);
      getLocalStream();
    });

    socketRef.current.on("new-producer", ({ producerId }: any) => {
      producerIdRef.current = producerId;
      signalNewConsumerTransport(producerId);
    });

    socketRef.current.on("producer-closed", ({ remoteProducerId }: any) => {
      const producerToClose = consumerTransportRef.current.find(
        (transportData: any) => transportData.producerId === remoteProducerId
      );
      producerToClose.consumerTransport.close();
      producerToClose.consumer.close();

      consumerTransportRef.current = consumerTransportRef.current.filter(
        (transportData: any) => transportData.producerId !== remoteProducerId
      );

      //remoteVideoRef 원래대로 되돌리기
      //console.log(`리모트, ${remoteProducerId}`);
      //console.log(producerIdToAudioIdxRef.current);
      //console.log(producerIdToVideoIdxRef.current);

      const audioIdx = producerIdToAudioIdxRef.current[`${remoteProducerId}`];
      if (audioIdx !== undefined) {
        remoteAudioRef.current[audioIdx].srcObject = null;
        delete producerIdToAudioIdxRef.current[`${remoteProducerId}`];
      }

      const videoIdx = producerIdToVideoIdxRef.current[`${remoteProducerId}`];
      if (videoIdx !== undefined) {
        remoteVideoRef.current[videoIdx].srcObject = null;
        delete producerIdToVideoIdxRef.current[`${remoteProducerId}`];
      }

      //console.log(producerIdToAudioIdxRef.current);
      //console.log(producerIdToVideoIdxRef.current);
      //console.log(audioIdx, videoIdx);
    });

    socketRef.current.on("feedbackStarted", () => {
      setIsFeedbackStarted(true);
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
      };

      paramsRef.current = {
        interviewRole: "interviewer",
        track: stream.getVideoTracks()[0],
        ...paramsRef.current,
      };

      //console.log("Params ref: ", paramsRef);

      joinRoom();
    } catch (e) {
      alert("오디오와 비디오 권한을 확인해 주세요.");
      console.log(e);
    }
  };

  const joinRoom = () => {
    //console.log(socketRef.current, roomName);
    socketRef.current.emit("join", { roomName }, (data: any) => {
      //console.log(`Router RTP Capabilities: ${data.rtpCapabilities}`);
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

      //console.log(deviceRef.current.rtpCapabilities);
      createSendTransport();
    } catch (error) {
      console.log(`디바이스 만들 때 에러: ${error}`);
      if (error instanceof Error && error.name === "UnsupportedError") {
        console.warn("browser not supported");
      }
    }
  };

  const getProducers = () => {
    //console.log("here?");
    socketRef.current.emit("getProducers", (producerIds: any[]) => {
      //console.log("producer ids");
      producerIds.forEach(signalNewConsumerTransport);
    });
  };

  const createSendTransport = () => {
    socketRef.current.emit(
      "createWebRtcTransport",
      { consumer: false },
      ({ params }: any) => {
        if (params.error) {
          //console.log(params.error);
          return;
        }
        //console.log(params);
        producerTransportRef.current =
          deviceRef.current.createSendTransport(params);

        producerTransportRef.current.on(
          "connect",
          async ({ dtlsParameters }: any, callback: any, errorback: any) => {
            //console.log("dtlsParameters: ", dtlsParameters);
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
            //console.log("produce parameters: ", parameters);
            try {
              await socketRef.current.emit(
                "transport-produce",
                {
                  kind: parameters.kind,
                  rtpParameters: parameters.rtpParameters,
                  appData: parameters.appData,
                },
                ({ id, producersExist }: any) => {
                  //console.log("here", producersExist);

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
    audioProducerRef.current.on("trackended", () => {
      console.log("audio track ended");
    });

    producerRef.current.on("trackended", () => {
      console.log("tranck ended");
    });

    audioProducerRef.current.on("transportclose", () => {
      console.log("audio transport ended");
    });

    producerRef.current.on("transportclose", () => {
      console.log("transport ended");
    });
  };

  const signalNewConsumerTransport = async (remoteProducerId: any) => {
    if (consumingTransportsRef.current.includes(remoteProducerId)) {
      return;
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
        //console.log(params);

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

        //console.log(consumerTransport, remoteProducerId, params.id);

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

        const { track } = consumer;

        if (params.kind === "audio") {
          const emptyAudioRefIndexes = remoteAudioRef.current
            .map((elem: any, index: number) => {
              if (elem.srcObject === null) {
                return index;
              }
            })
            .filter((idx: number) => idx !== undefined);

          if (emptyAudioRefIndexes.length === 0) {
            console.log("오디오 빈 공간이 없습니다.\n");
          } else {
            remoteAudioRef.current[emptyAudioRefIndexes[0]].srcObject =
              new MediaStream([track]);
            producerIdToAudioIdxRef.current[`${remoteProducerId}`] =
              emptyAudioRefIndexes[0];

            //console.log("오디오", producerIdToAudioIdxRef.current);
          }
        }

        if (params.kind === "video") {
          const emptyVideoRefIndexes = remoteVideoRef.current
            .map((elem: any, index: number) => {
              if (elem.srcObject === null) {
                return index;
              }
            })
            .filter((idx: number) => idx !== undefined);

          if (emptyVideoRefIndexes.length === 0) {
            console.log("비디오 빈 공간이 없습니디.\n");
          } else {
            remoteVideoRef.current[emptyVideoRefIndexes[0]].srcObject =
              new MediaStream([track]);
            producerIdToVideoIdxRef.current[`${remoteProducerId}`] =
              emptyVideoRefIndexes[0];
            //console.log("비디오", producerIdToAudioIdxRef.current);
          }
        }

        socketRef.current.emit("consumer-resume", {
          serverConsumerId: params.serverConsumerId,
        });
      }
    );
  };

  const handleClickRemoteAudioMuteBtn = (remote: number) => {
    remoteAudioRef.current[remote].muted =
      !remoteAudioRef.current[remote].muted;
  };

  const handleClickLocalAudioMuteBtn = () => {
    const audioTrack = localMediaRef.current.srcObject
      .getTracks()
      .find((track: MediaStreamTrack) => track.kind === "audio");
    audioTrack.enabled = !audioTrack.enabled;
  };

  const handleClickLocalVideoMuteBtn = () => {
    const videoTrack = localMediaRef.current.srcObject
      .getTracks()
      .find((track: MediaStreamTrack) => track.kind === "video");
    videoTrack.enabled = !videoTrack.enabled;
  };

  useEffect(() => {
    if (isFeedbackStarted && isHost) {
      socketRef.current.emit("feedbackStarted");
    }
  }, [isFeedbackStarted]);

  //나가기 버튼을 누른 경우
  useEffect(() => {
    if (isLeft) {
      localMediaRef.current.srcObject
        .getTracks()
        .map((track: MediaStreamTrack) => track.stop());
      socketRef.current.close();
      setIsFeedbackStarted(false);
    }
  }, [isLeft]);

  return (
    <div className={styles.videoContainer}>
      <div>
        <video ref={localMediaRef} muted autoPlay className={styles.videos} />
        <div className={styles.muteButtonContainer}>
          <MuteButton
            onClickBtn={handleClickLocalVideoMuteBtn}
            name={"화면 끄기"}
          />
          <MuteButton
            onClickBtn={handleClickLocalAudioMuteBtn}
            name={"음소거"}
          />
        </div>
      </div>
      {[0, 1, 2, 3, 4].map((remote) => {
        return (
          <div key={remote}>
            <audio
              ref={(elem) => (remoteAudioRef.current[remote] = elem)}
              autoPlay
              key={remote}
            />
            <video
              ref={(elem) => (remoteVideoRef.current[remote] = elem)}
              autoPlay
              className={styles.videos}
              key={remote}
            />
            <MuteButton
              key={remote}
              onClickBtn={() => handleClickRemoteAudioMuteBtn(remote)}
              name={"음소거"}
            />
          </div>
        );
      })}
    </div>
  );
};

export { MediasoupVideo };
