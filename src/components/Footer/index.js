import './index.less';
import React from 'react';
import packageJSON from '../../../package.json';

export default function Footer() {
  return (
    <>
      <div className="footer">
        <em>Version: {packageJSON.version}</em>
      </div>
    </>
  );
}
