import { FullscreenExitOutlined, FullscreenOutlined } from "@ant-design/icons";
import cls from "classnames";
import * as React from "react";
import { useToggle } from "react-use";
import "./index.less";

interface FullscreenContainerProps {
  style: React.CSSProperties;
  children: React.ReactChildren;
}

export default function FullscreenContainer(props: FullscreenContainerProps) {
  const [fullscreen, toggleFullscreen] = useToggle(false);

  return (
    <div className="fullscreen-container" style={props.style}>
      <div className={cls("container", { fullscreen })}>
        {props.children}
        {!fullscreen ? (
          <FullscreenOutlined onClick={toggleFullscreen} className="resize" />
        ) : (
          <FullscreenExitOutlined onClick={toggleFullscreen} className="resize" />
        )}
      </div>
    </div>
  );
}
