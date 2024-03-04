import {
  MythixUIComponent,
} from '@cdn/mythix-ui-core@1'; // you should always specify your versions properly

const ONE_SECOND = 1000; // 1000 milliseconds

class RealTimeClockComponent extends MythixUIComponent {
  static shadow = true; // Now a shadow DOM is more useful

  // This ties us to our HTML template
  static tagName = 'real-time-clock-component';

  getFormattedTime() {
    return `${(new Date()).toGMTString()}`;
  }

  /* We no longer need a method to help us update the time */

  constructor() {
    super();

    // Define our DynamicProperty
    this.defineDynamicProp('currentTime', this.getFormattedTime());
  }

  // This is called when our element enters the DOM structure (i.e. is inserted as a child)
  mounted() {
    // Next, setup an interval to update the display every second
    this.intervalID = setInterval(() => {
      // Update the display time every second
      // Simply updating the dynamic property
      // will cause the component to automatically
      // re-render itself to match.
      this.currentTime = this.getFormattedTime();
    }, ONE_SECOND);
  }

  unmounted() {
    if (this.intervalID) {
      clearInterval(this.intervalID);
      this.intervalID = null;
    }
  }
}

RealTimeClockComponent.register(); // Register our component with the browser
