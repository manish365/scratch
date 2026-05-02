import React, { PureComponent } from "react";
import Styles from "./snackbar.module.css";

class SnackBarAlert extends PureComponent {
  public message: string = "";
  public state = {
    isActive: false,
  };
  static instance: any | SnackBarAlert;
  private timeoutId: NodeJS.Timeout | undefined;

  componentDidMount() {
    SnackBarAlert.instance = this;
  }

  showSnackBar(message: string) {
    this.message = message;

    this.setState({ isActive: true }, () => {
      // Clear the previous timeout
      console.log("this.timeoutId===>>>", this.timeoutId);
      if (this.timeoutId) {
        clearTimeout(this.timeoutId);
      }

      this.timeoutId = setTimeout(() => {
        this.setState({ isActive: false });
        this.timeoutId = undefined;
      }, 7000);
    });
  }
  closeSnackBar = () => {
    this.setState({ isActive: false });

    // Clear the timeout when manually closing
    console.log("this.timeoutId===>>>", this.timeoutId);
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
      this.timeoutId = undefined; // Reset the timeoutId after closing
    }
  };

  render() {
    const { isActive } = this.state;

    return (
      <div
        className={
          isActive ? [Styles.snackbar, Styles.show].join(" ") : Styles.snackbar
        }
      >
        {this.message}
        <button
          type="button"
          className={Styles.closeBtn}
          onClick={this.closeSnackBar}
          aria-label="Close"
        >
          <span>Close</span>
        </button>
      </div>
    );
  }
}

export default SnackBarAlert;
