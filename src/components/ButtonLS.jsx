import React from 'react';
import './ButtonLS.css';

export default function Button({ children, onClick }) {
  return (
    <button className="button" onClick={onClick}>
      <div className="primary">
        <span className="button-title">{children}</span>
      </div>
    </button>
  );
}
