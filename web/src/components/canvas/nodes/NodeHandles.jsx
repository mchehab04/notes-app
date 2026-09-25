import React from 'react';
import { Handle, Position } from '@xyflow/react';

export default function NodeHandles() {
  return (
    <>
      {/* Top Handle */}
      <Handle
        type="source"
        position={Position.Top}
        id="top"
        isConnectable={true}
        style={{ top: -6 }}
        title="Top connection point"
      />

      {/* Right Handle */}
      <Handle
        type="source"
        position={Position.Right}
        id="right"
        isConnectable={true}
        style={{ right: -6 }}
        title="Right connection point"
      />

      {/* Bottom Handle */}
      <Handle
        type="source"
        position={Position.Bottom}
        id="bottom"
        isConnectable={true}
        style={{ bottom: -6 }}
        title="Bottom connection point"
      />

      {/* Left Handle */}
      <Handle
        type="source"
        position={Position.Left}
        id="left"
        isConnectable={true}
        style={{ left: -6 }}
        title="Left connection point"
      />
    </>
  );
}
