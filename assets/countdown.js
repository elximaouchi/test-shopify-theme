import { Component } from '@theme/component';

/**
 * A custom element that counts down to a target date.
 *
 * @typedef {object} Refs
 * @property {HTMLElement} days
 * @property {HTMLElement} hours
 * @property {HTMLElement} minutes
 * @property {HTMLElement} seconds
 *
 * @extends Component<Refs>
 */
class CountdownComponent extends Component {
  requiredRefs = ['days', 'hours', 'minutes', 'seconds'];

  /** @type {number | undefined} */
  #interval;

  connectedCallback() {
    super.connectedCallback();

    this.#render();
    this.#interval = window.setInterval(this.#render, 1000);
  }

  disconnectedCallback() {
    super.disconnectedCallback();

    window.clearInterval(this.#interval);
  }

  #render = () => {
    const remaining = Math.max(0, Date.parse(this.dataset.target ?? '') - Date.now()) || 0;
    const { days, hours, minutes, seconds } = this.refs;

    days.textContent = String(Math.floor(remaining / 86400000));
    hours.textContent = this.#pad((remaining / 3600000) % 24);
    minutes.textContent = this.#pad((remaining / 60000) % 60);
    seconds.textContent = this.#pad((remaining / 1000) % 60);

    if (remaining === 0) {
      window.clearInterval(this.#interval);
      this.toggleAttribute('data-ended', true);
    }
  };

  /** @param {number} value */
  #pad(value) {
    return String(Math.floor(value)).padStart(2, '0');
  }
}

if (!customElements.get('countdown-component')) {
  customElements.define('countdown-component', CountdownComponent);
}
