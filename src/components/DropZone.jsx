import React from 'react';
import './DropZone.css';

const DropZone = ({ onDragOver, onDrop, onDragLeave, isDragging }) => {
  return (
    <div
      className={`dropzone ${isDragging ? 'over' : ''}`}
      onDragOver={onDragOver}
      onDrop={onDrop}
      onDragLeave={onDragLeave}
    >
      Drop combined tables here to divide
    </div>
  );
};

export default DropZone;
