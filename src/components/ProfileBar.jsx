import React from 'react';
import "./ProfileBar.css";
import ButtonLS from './ButtonLS';

export default function ProfileBar({userEmail, onLogout}){
    return (
        <div className="profileBar-container">
            <div className="profileBar-content">
                <span className="user-name">{userName}</span>
                <span className="user-email">{userEmail}</span>
                <ButtonLS onClick={onLogout}>로그아웃</ButtonLS>
            </div>
        </div>
    )
}