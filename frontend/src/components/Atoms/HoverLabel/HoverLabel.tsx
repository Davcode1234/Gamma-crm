import React from 'react';
import ReactDOM from 'react-dom';
import styles from './HoverLabel.module.css';

function HoverLabel({ children, position, root }) {
  if (!position) return null;

  const style: React.CSSProperties = {
    position: 'absolute' as const,
    top: position.top,
    left: position.left,
  };

  return ReactDOM.createPortal(
    <div className={styles.graphicName} style={style}>
      <p>{children}</p>
    </div>,
    document.getElementById(root)
  );
}

export default HoverLabel;
