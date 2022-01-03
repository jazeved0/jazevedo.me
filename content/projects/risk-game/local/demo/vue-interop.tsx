import React from "react";
import { VueWrapper } from "vuera";

import { log } from "./index";

let GameCanvas: unknown;

export type VueInteropProps = {
  preload: () => void;
  passthroughProps: Record<string, unknown>;
};

type VueInteropState = {
  mount: boolean;
};

/**
 * Lazily loads the game canvas at runtime into the React application
 */
class VueInterop extends React.Component<VueInteropProps, VueInteropState> {
  constructor(props: VueInteropProps) {
    super(props);
    // The state is "unused" in that it is only used to force a re-render:
    // eslint-disable-next-line react/no-unused-state
    this.state = { mount: false };
  }

  componentDidMount(): void {
    const { preload } = this.props;
    if (preload != null) preload();

    // eslint-disable-next-line max-len
    // eslint-disable-next-line global-require,@typescript-eslint/no-var-requires
    GameCanvas = (require("./vue/GameCanvas.vue") as { default: unknown })
      .default;

    // The state is "unused" in that it is only used to force a re-render:
    // eslint-disable-next-line react/no-unused-state
    this.setState({ mount: true });
    log("Loading Vue component, forcing re-render");
  }

  render(): React.ReactElement | null {
    const { passthroughProps } = this.props;
    if (GameCanvas == null) return <div />;
    // eslint-disable-next-line react/jsx-props-no-spreading
    return <VueWrapper component={GameCanvas} {...passthroughProps} />;
  }
}

export default VueInterop;
