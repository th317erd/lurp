import {
  MythixUIComponent,
} from '@cdn/mythix-ui-core@1'; // you should always specify your versions properly

const ONE_SECOND = 1000; // 1000 milliseconds

class RealTimeClock extends MythixUIComponent {
  static shadow = false; // Inform our underlying component that we do not want a shadow DOM

  static tagName = 'real-time-clock'; // The name of our element, i.e. `<real-time-clock></real-time-clock>`
  // FYI: Web Component standards REQUIRE a `/^\w-/` (word-) prefix for custom element names

  getFormattedTime() {
    return `${(new Date()).toGMTString()}`;
  }

  // Create a method to update our display time that is rendered
  // to the screen. We will do this simply by setting `textContent`
  // on our custom element. We will get more complicated in our
  // next example. For now, we will just keep it basic.
  updateDisplayTime() {
    this.textContent = this.getFormattedTime();
  }

  // This is called when our element enters the DOM structure (i.e. is inserted as a child)
  mounted() {
    // First, let's ensure to render our `textContent` right when we are inserted
    this.updateDisplayTime();

    // Next, setup an interval to update the display every second
    this.intervalID = setInterval(() => {
      // Update the display time every second
      this.updateDisplayTime();
    }, ONE_SECOND);
  }

  unmounted() {
    if (this.intervalID) {
      clearInterval(this.intervalID);
      this.intervalID = null;
    }
  }
}

RealTimeClock.register(); // Register our component with the browser
