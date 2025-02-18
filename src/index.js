import { WebRTCPlayer } from "@eyevinn/webrtc-player";

export default class WhepVideoComponent extends HTMLElement {

  static get observedAttributes() {}

  constructor() {
    super();
    this.setupDOM();
  }

  setupDOM() {
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
      this.video.autoplay = autoplay ?? false;
      this.video.muted = muted ?? true;
    
      this.dispatchEvent(new CustomEvent("onIsStreaming", { detail: { src } }));

      setTimeout(() => {
        this.player.peer.onconnectionstatechange = (event) => {
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
        };
      }, 250);
    } catch (e) {
      console.error("Failed to setup player", e);
    }
  }

  async attributeChangedCallback(name) {
  }

  onStateUpdates(callback) {
    return callback(data);
  }

  onStopPlayer() {
    this.player.stop();
  }

  onReloadPlayer() {
    this.player.connect();
  }

  disconnectedCallback() {
    this.player.destroy();
  }
}

customElements.define("whep-video", WhepVideoComponent);
