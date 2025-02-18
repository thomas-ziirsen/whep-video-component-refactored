import { WebRTCPlayer } from "@eyevinn/webrtc-player";

const ComponentAttribute = {
  DYNAMIC: {
    SOURCE: "src",
    AUTOPLAY: "autoplay",
    MUTED: "muted",
  },
};

const isSet = (value) => value === "" || !!value;

export default class WhepVideoComponent extends HTMLElement {
  static get observedAttributes() {
    return Object.values(ComponentAttribute.DYNAMIC);
  }

  constructor() {
    super();
    this.setupDOM();
  }

  setupDOM() {
    console.log(">> setupDOM");
    this.attachShadow({ mode: "open" });
    const { shadowRoot } = this;

    let styleTag = document.createElement("style");
    styleTag.innerHTML =
      "video { width: 100%; height: auto; max-height: 100vh; max-width: 100vw; } div { width: inherit }";
    shadowRoot.appendChild(styleTag);

    const wrapper = document.createElement("div");
    shadowRoot.appendChild(wrapper);
    this.video = document.createElement("video");
    wrapper.appendChild(this.video);

    return this.video;
  }

  async setupPlayer({ src, autoplay, muted }) {
    try {
      this.player = new WebRTCPlayer({
        video: this.video,
        type: "whep",
      });

      await this.player.load(new URL(src));
      this.video.autoplay = autoplay;
      this.video.muted = muted;
    
      this.dispatchEvent(new CustomEvent("onIsStreaming", { detail: { src } }));
    } catch (e) {
      console.warn("Handle issue", e);
    }

    setTimeout(() => {
      this.player.peer.onconnectionstatechange = (event) => {
        // console.log(
        //   ">> X onconnectionstatechange change",
        //   this.player.peer.signalingState
        // );
        // console.log(
        //   ">> X onconnectionstatechange change",
        //   this.player.peer.connectionState
        // );
        // console.log(
        //   ">> X onconnectionstatechange change",
        //   this.player.peer.iceConnectionState
        // );
        // console.log(
        //   ">> X onconnectionstatechange change",
        //   this.player.peer.iceGatheringState
        // );

        // console.log(
        //   ">> 3 reconnectAttemptsLeft",
        //   this.player.reconnectAttemptsLeft
        // );

        this.onStateUpdates({
          source: "onconnectionstatechange",
          signalingState: this.player.peer.signalingState,
          connectionState: this.player.peer.connectionState,
          iceConnectionState: this.player.peer.iceConnectionState,
          iceGatheringState: this.player.peer.iceGatheringState,
        });
      };

      this.player.peer.onsignalingstatechange = (event) => {
        this.onStateUpdates({
          source: "onsignalingstatechange",
          signalingState: this.player.peer.signalingState,
          connectionState: this.player.peer.connectionState,
          iceConnectionState: this.player.peer.iceConnectionState,
          iceGatheringState: this.player.peer.iceGatheringState,
        });
        // console.log(
        //   ">> Y onsignalingstatechange change",
        //   this.player.peer.signalingState
        // );
        // console.log(
        //   ">> Y onsignalingstatechange change",
        //   this.player.peer.connectionState
        // );
        // console.log(
        //   ">> Y onsignalingstatechange change",
        //   this.player.peer.iceConnectionState
        // );
        // console.log(
        //   ">> Y onsignalingstatechange change",
        //   this.player.peer.iceGatheringState
        // );
        // console.log(
        //   ">> 3 reconnectAttemptsLeft",
        //   this.player.reconnectAttemptsLeft
        // );
      };

      // this.player.adapter.localPeer.onconnectionstatechange = (ev) => {
      //   console.log(">> 6 onconnectionstatechange change", ev, this.player.adapter.localPeer.connectionState);
      //   // switch (peerConnection.connectionState) {
      //   //   case "new":
      //   //   case "connecting":
      //   //     setOnlineStatus("Connecting…");
      //   //     break;
      //   //   // …
      //   //   default:
      //   //     setOnlineStatus("Unknown");
      //   //     break;
      //   // }
      // };
      // this.player.peer.addEventListener(
      //   "signalingstatechange",
      //   (ev) => {
      //     console.log(">> 5 onconnectionstatechange change", this.player.peer.signalingState);
      //     console.log(">> 5 onconnectionstatechange change", this.player.peer.connectionState);
      //     console.log(">> 5 onconnectionstatechange change", this.player.peer.iceConnectionState);
      //     console.log(">> 5 onconnectionstatechange change", this.player.peer.iceGatheringState);
      //     // switch (pc.signalingState) {
      //     //   case "stable":
      //     //     updateStatus("ICE negotiation complete");
      //     //     break;
      //     // }
      //   },
      //   false,
      // );
      // this.player.peer.onconnectionstatechange = (event) => {
      //   console.log(">> 1 onconnectionstatechange change", event);
      // }
      // this.player.adapter.localPeer.onsignalingstatechange = (event) => {
      //   console.log(">> 2 onsignalingstatechange change", event);
      // }
    }, 250);
  }

  async attributeChangedCallback(name) {
    const src = this.getAttribute(ComponentAttribute.DYNAMIC.SOURCE);
    const autoplay = this.getAttribute(ComponentAttribute.DYNAMIC.AUTOPLAY);
    const muted = this.getAttribute(ComponentAttribute.DYNAMIC.MUTED);

    console.warn("attributeChangedCallback", name);

    // if (name === ComponentAttribute.DYNAMIC.SOURCE) {
    //   if (isSet(src)) {
    //     await this.player.load(new URL(src));
    //     this.video.autoplay = true;
    //     // if (isSet(autoplay)) {
    //     //   this.video.muted = isSet(muted);
    //     //   this.video.autoplay = true;
    //     // }
    //     this.dispatchEvent(
    //       new CustomEvent("onIsStreaming", { detail: { src } })
    //     );
    //   } else {
    //     console.error("Missing src attribute in <whep-video> element");
    //   }
    // }

    if (name === ComponentAttribute.DYNAMIC.MUTED) {
      this.video.muted = isSet(muted);
    }

    // if (name === ComponentAttribute.DYNAMIC.STOP) {
    //   console.log(">> stop/destroy player");
    //   this.player.stop();
    //   // this.player.destroy();
    //   // this.player.peer.close();
    //   // this.player = null;
    // }

    // if (name === ComponentAttribute.DYNAMIC.RELOAD) {
    //   console.log(">> RELOAD player");
    //   // this.setupPlayer();
    //   this.player.connect();
    // }
  }

  // onInitPlayer() {
  //   console.log(">> setupPlayer");
  //   this.setupPlayer();
  // }

  onStateUpdates(callback) {
    return callback(data);
  }

  onStopPlayer() {
    console.log(">> stop/destroy player");
    this.player.stop();
  }

  onReloadPlayer() {
    console.log(">> RELOAD player");
    // this.setupPlayer();
    this.player.connect();
  }

  disconnectedCallback() {
    console.log(">> destroy player");
    this.player.destroy();
  }
}

customElements.define("whep-video", WhepVideoComponent);
