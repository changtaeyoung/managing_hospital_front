import React from "react";
import { useNavigate } from "react-router-dom"; // React Router를 사용하는 경우
import "./MainPage.css"; // 스타일을 위한 CSS 파일
import TopBar from "./TopBar";

const MainPage = () => {
  const navigate = useNavigate(); // 페이지 이동을 위한 hook

  const handleDoctorClick = () => {
    navigate("/doctor/login"); // 의사 로그인 페이지로 이동
  };

  const handleNurseClick = () => {
    navigate("/nurse/login"); // 간호사 로그인 페이지로 이동
  };

  return (
    <div className="main-container">
        <TopBar/>
        <div className="mainpage-container">
        <h2 className="title">사용자 구분</h2>
        <p className="subtitle">
            사용자의 역할이 무엇인가요?
        </p>
        <div className="role-buttons">
            <div className="role-box" onClick={handleDoctorClick}>
                <h3 className="role-title">의사</h3>
                <p className="role-description">의사로 로그인</p>
            </div>
            <div className="role-box" onClick={handleNurseClick}>
                <h3 className="role-title">간호사</h3>
            <p className="role-description">간호사로 로그인</p>
            </div>
        </div>
        </div>
    </div>
  );
};

export default MainPage;
