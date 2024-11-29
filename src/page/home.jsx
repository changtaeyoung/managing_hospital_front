import React from "react";
import { useNavigate } from "react-router-dom"; // React Router를 사용하는 경우
import "./home.css"; // 스타일을 위한 CSS 파일
import TopBar from "../components/TopBar";
import ProfileBar from "../components/ProfileBar";

const home = () => {
  const navigate = useNavigate(); // 페이지 이동을 위한 hook

  const handleMedicalRecordsClick = () => {
    navigate("/manage-medicalrecords"); // 환자 진료 기록 관리
  };

  const handleMaterialsClick = () => {
    navigate("/manage-materials"); // 재고 관리
  };

  return (
    <div className="main-container">
        <TopBar/>
        <div className="mainpage-container">
        <h2 className="title">Home</h2>
        <p className="subtitle">
            원하시는 작업을 선택하세요.
        </p>
        <div className="role-buttons">
            <div className="role-box" onClick={handleMedicalRecordsClick}>
                <h3 className="role-title">진료기록 관리</h3>
                <p className="role-description">의사만 이용 가능</p>
            </div>
            <div className="role-box" onClick={handleMaterialsClick}>
                <h3 className="role-title">재고 관리</h3>
            <p className="role-description">의사, 간호사 모두 이용 가능</p>
            </div>
        </div>
        </div>
    </div>
  );
};

export default home;
