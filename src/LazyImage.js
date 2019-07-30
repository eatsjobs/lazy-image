import { html, css, LitElement } from 'lit-element';
import { intersectionObserverSupport, isIntersecting, imageTransparent } from './constants.js';

export class LazyImage extends LitElement {
  static get observerOptions() {
    return {
      root: null,
      threshold: 0.3
    }
  }

  static get is() {
    return 'lazy-image';
  }

  static get styles() {
    return css`
      :host {
        position: relative;
        display: inline-flex;
        width: 100%;
        height: auto;
        overflow: hidden;
        background: transparent;
        align-items: center;
        justify-content: center;
      }
      
      :host img {
        position: absolute;
        display: block;
        width: 100%;
        opacity: 0;
        left: 0;
        right: 0;
        top: 0;
        bottom: 0;
        margin: auto;
        border: 0 none;
        will-change: opacity;
        transition: opacity 180ms ease-in-out;
      }
      :host img.loaded {
        opacity: 1;
      }
    `;
  }

  static get containerName() {
    return 'img-container';
  }

  static get properties() {
    return {
      src: { type: String },
      srcset: { type: String },
      loaded: { type: Boolean },
      intersecting: { type: Boolean },
      alt: { 
        type: String, 
        reflect: true 
      },
      naturalWidth: { type: Number },
      naturalHeight: { type: Number },
    };
  }

  constructor() {
    super();    
    this.intersecting = false;
    this.alt = ''
    this.observer = null;
    this.loaded = false;
    this.onLoad = this.onLoad.bind(this);
    this.onError = this.onError.bind(this);
    this._observerCallback = this._observerCallback.bind(this);
    this.naturalHeight = 1;
    this.naturalWidth = 1;
  }

  onLoad() {
    this.loaded = true;
  }

  onError() {

  }

  firstUpdated(changedProperties) {
    this.$container = this.shadowRoot.querySelector(`div`);
    this.$img = this.shadowRoot.querySelector(`div img`);
    this.$img.addEventListener('load', this.onLoad);
    if (!intersectionObserverSupport) {
      console.warn('IntersectionObserver not supported. Polyfill them');
      this.intersecting = true;
    }
    this.observer = new IntersectionObserver(this._observerCallback, LazyImage.observerOptions);
    this.observer.observe(this.$container);
  }

  _observerCallback(entries) {
    entries.forEach(entry => {
      if (isIntersecting(entry)) {
        this.intersecting = true;
        this.dispatchEvent(
          new CustomEvent('loaded-changed', {
            bubbles: true,
            composed: true,
            detail: {
              visible: this.intersecting,
            },
          })
        );
        this.observer.unobserve(this.$container);
      }
    });
  }
  
  disconnectedCallback() {
    if (this.observer) {
      this.observer.disconnect();
      this.observer = null;
      delete this.observer;
    }
    this.$img.removeEventListener('load', this.onLoad);
  }

  render() {
    const result = ((this.naturalHeight / this.naturalWidth) * 100);
    return html`<div
      style="padding-top: ${result}%;"
    >
        <img
          class="${this.loaded ? 'loaded' : ''}"
          src="${this.intersecting ? this.src : undefined}"
          alt="${this.alt}"
          @load="${this.onLoad}"
          @error="${this.onError}"
        />
      </div>`;
  }
}
