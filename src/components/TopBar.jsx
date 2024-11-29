import React from 'react';
import './TopBar.css'

export default function TopBar() {
  return (
    <div className="top-bar">
      <div className="rectangle" />
      <span className="title">병원 관리 시스템</span>
      <div className="navigation">
        <span className="home-tab">Home</span>
        <span className="patients-tab">진료 기록 관리</span>
        <span className="materials-tab">자재 관리</span>
      </div>
    </div>
  );
}


