import React, { useState, useEffect } from "react";
import "./medicalRecords.css";
import TopBar from "../components/TopBar";
import ButtonLS from "../components/ButtonLS"; // Button 컴포넌트 import

export default function MedicalRecords() {
  const [doctorEmail, setDoctorEmail] = useState("");
  const [patients, setPatients] = useState([]); // 환자 목록 상태
  const [searchQuery, setSearchQuery] = useState(""); // 검색어 상태
  const [isPatientModalOpen, setIsPatientModalOpen] = useState(false); // 환자 정보 모달 상태
  const [isRecordModalOpen, setIsRecordModalOpen] = useState(false); // 진료 기록 상세 모달 상태
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false); // 생성 모달 상태
  const [selectedPatient, setSelectedPatient] = useState(null); // 선택된 환자 정보
  const [selectedRecord, setSelectedRecord] = useState(null); // 진료 기록 상세
  const [isFirstSearch, setIsFirstSearch] = useState(true); // 첫 번째 검색 여부 상태

  // ---------------------------------------------------------------------------------------------------------------
  // 환자 성별
  const Gender = {
    Male: "Male",
    Female: "Female",
  };

  // 방문일이 "YYYY-MM-DD" 형식인지 확인하는 함수
  const isValidDateFormat = (date) => {
    const regex = /^\d{4}-\d{2}-\d{2}$/;
    return regex.test(date);
  };

  // 오늘 날짜를 "YYYY-MM-DD" 형식으로 반환하는 함수
  const getTodayDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0"); // 월은 0부터 시작하므로 1을 더함
    const day = String(today.getDate()).padStart(2, "0"); // 날짜를 2자리로 맞추기

    return `${year}-${month}-${day}`;
  };
  // ---------------------------------------------------------------------------------------------------------------

  // 서버로 부터 모든 환자 정보를 가져온다
  // 페이지 렌더링 시에 호출된다.
  // 검색창에 아무 것도 입력하지 않았을 때도 호출된다.
  const fetchPatients = async () => {
    try {
      const response = await fetch(
        "http://localhost:8080/api/medical-records/allpatients"
      ); // 서버 API 호출
      if (!response.ok) {
        throw new Error("환자 목록을 가져오는 데 실패했습니다.");
      }
      const patients = await response.json(); // 받은 JSON 데이터를 파싱

      // 백엔드에서 받은 데이터를 프론트에서 사용 가능한 형태로 변환
      const formattedPatients = patients.map((patient) => ({
        name: patient.patientName,
        phone: patient.patientPhoneNumber,
        birthday: patient.patientBirthday,
        gender: patient.patientGender === "Male" ? Gender.Male : Gender.Female, // Enum 처리
      }));

      setPatients(formattedPatients); // 환자 목록 상태에 저장
    } catch (error) {
      console.error(error);
    }
  };

  // 전화번호로 특정된 환자의 정보를 요청한다.
  const fetchMedicalRecords = async (phoneNumber) => {
    try {
      const response = await fetch(
        `http://localhost:8080/api/medical-records/search-medicalRecords?phoneNumber=${phoneNumber}`,
        {
          method: "GET",
          headers: { Accept: "application/json" },
        }
      );
      if (!response.ok)
        throw new Error("의료 기록을 가져오는 데 실패했습니다.");

      const records = await response.json();

      if (records.length === 0) {
        setSelectedPatient((prevState) => ({
          ...prevState,
          records: [], // 진료 기록이 없을 경우 빈 배열로 설정
        }));
        return;
      }

      // 환자 정보는 첫 번째 기록에서 가져오고, 진료 기록 리스트는 전체 기록을 설정
      const patientInfo = {
        name: records[0].patientName,
        phone: records[0].phoneNumber,
        birthday: records[0].birthday,
        gender: records[0].gender === "Male" ? "Male" : "Female",
      };

      const formattedRecords = records.map((record) => ({
        visitDate: record.visitDate,
        diagnosis: record.diagnosis,
        prescription: record.prescription,
      }));

      setSelectedPatient({
        ...patientInfo,
        records: formattedRecords,
      });
    } catch (error) {
      console.error("의료 기록 요청 실패:", error);
    }
  };

  // 페이지 렌더링 시 디폴트
  useEffect(() => {
    console.log("모든 환자 리스트 button clicked"); // 클릭 버튼이 잘 동작하는지 확인하기 위한 로그 터미널에 출력
    fetchPatients();
  }, []);

  // 검색창에 이름을 입력했을 때 동명이인 환자 리스트를 출력한다.
  const handleSearch = async () => {
    const query = searchQuery.trim();
    if (!query) {
      fetchPatients();
      return; // 검색어가 없으면 fetchPatients로 반환
    }

    setPatients([]); // 기존 환자 목록 초기화

    try {
      const response = await fetch(
        `http://localhost:8080/api/medical-records/search-patients?name=${query}`,
        {
          method: "GET",
          headers: {
            Accept: "application/json",
          },
        }
      );

      if (!response.ok) {
        console.error("환자 정보가 존재하지 않습니다");
        return;
      }

      const data = await response.json(); // 검색 결과 데이터
      const formattedPatients = data.map((patient) => ({
        // 올바른 배열(data) 사용
        name: patient.patientName,
        phone: patient.patientPhoneNumber,
        birthday: patient.patientBirthday,
        gender: patient.patientGender === "Male" ? Gender.Male : Gender.Female,
      }));

      setIsFirstSearch(false);
      setPatients(formattedPatients); // 변환된 데이터를 상태로 설정
    } catch (error) {
      console.error("검색 중 오류 발생:", error);
    }
  };

  // 특정 환자를 클릭하면 환자 정보를 모달로 보여준다.
  const handlePatientClick = async (patient) => {
    console.log("환자 클릭됨:", selectedPatient); // 환자 정보 로그
    setSelectedPatient(patient); // 선택한 환자 정보 설정
    setIsPatientModalOpen(true); // 모달 열기

    await fetchMedicalRecords(patient.phone);
  };

  const handleClosePatientModal = () => {
    setIsPatientModalOpen(false);
    setSelectedPatient(null); // 모달 닫을 때 선택된 환자 정보 초기화
  };

  // 진료 기록 생성 모달 닫기
  const handleCloseCreateModal = () => {
    setIsCreateModalOpen(false);
  };

  // 진료 기록 생성 시 데이터 처리
  const handleRecordForm = (e, field) => {
    if (!selectedRecord) return; // 초기화된 상태에서 보호
    setSelectedRecord({
      ...selectedRecord,
      [field]: e.target.value,
    });
  };

  // 진료 기록 상세 모달 열기
  const handleRecordClick = (record) => {
    console.log("진료 기록 클릭됨, 선택된 기록 ->", record);
    setIsRecordModalOpen(true);
    setSelectedRecord(record); // 클릭한 진료 기록 선택
    console.log(
      "isRecordModalOpen:",
      isRecordModalOpen,
      "selectedRecord:",
      selectedRecord
    );
  };

  // 진료 기록 상세 모달 닫기
  const handleCloseRecordModal = () => {
    console.log("진료 기록 상세 모달이 닫힌다");
    setIsRecordModalOpen(false); // 모달 닫기
    setSelectedRecord(null); // 선택된 기록 초기화
  };

  // 진료 기록 생성하는
  const handleRecordFormClick = () => {
    console.log("진료 기록 형식 모달이 렌더링된다.");
    setIsCreateModalOpen(true);

    // selectedRecord 상태 초기화
    setSelectedRecord({
      visitDate: getTodayDate(), // 방문일 초기화
      diagnosis: "", // 진단 초기화
      prescription: "", // 처방 초기화
    });
  };

  const handleCreateRecord = async () => {
    if (!selectedPatient || !selectedRecord) return;

    // 방문일 형식 검증
    if (!isValidDateFormat(selectedRecord.visitDate)) {
      alert("방문일은 'YYYY-MM-DD' 형식이어야 합니다.");
      return; // 형식이 잘못되었으면 함수 종료
    }

    // 방문일 중복 검사
    const existingRecord = selectedPatient.records.find(
      (record) => record.visitDate === selectedRecord.visitDate
    );

    if (existingRecord) {
      alert("이미 해당 방문일에 진료 기록이 존재합니다.");
      return; // 중복된 방문일이 있으면 저장하지 않음
    }

    // 새로운 진료 기록을 selectedPatient.records에 추가
    const updatedRecords = [...selectedPatient.records, selectedRecord];

    try {
      // 서버로 진료 기록을 보내는 API 요청
      const response = await fetch(
        "http://localhost:8080/api/medical-records/create", // 진료 기록 생성 API
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            doctorEmail: "doc12@gmail.com", //doctor 고정 해제 해야함
            patientPhoneNumber: selectedPatient.phone,
            visitDate: selectedRecord.visitDate,
            diagnosis: selectedRecord.diagnosis,
            prescription: selectedRecord.prescription,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("진료 기록 저장에 실패했습니다.");
      }

      // 서버에 성공적으로 저장된 후 상태 업데이트
      alert("진료 기록이 저장되었습니다.");
      setIsCreateModalOpen(false);
      setSelectedPatient({
        ...selectedPatient,
        records: updatedRecords, // 진료 기록에 새로 추가된 내용 반영
      });
    } catch (error) {
      console.error("진료 기록 저장 실패:", error);
    }
  };

  // 진료 기록 생성 후 서버에 데이터 보내기
  const handleCloseCreateRecordModal = () => {
    console.log("진료 기록이 생성되었다.");
    setIsRecordModalOpen(false);
  };

  // 진료 기록 생성 및 수정 후 상태 업데이트
  const handleSaveRecord = async () => {
    if (!selectedPatient || !selectedRecord) return;

    // 방문일 형식 검증
    if (!isValidDateFormat(selectedRecord.visitDate)) {
      alert("방문일은 'YYYY-MM-DD' 형식이어야 합니다.");
      return; // 형식이 잘못되었으면 함수 종료
    }

    // 새로운 진료 기록을 selectedPatient.records에 추가
    const updatedRecords = selectedPatient.records.map((record) => {
      if (record.visitDate === selectedRecord.visitDate) {
        // 해당 방문일의 기록을 수정
        return {
          ...record,
          diagnosis: selectedRecord.diagnosis,
          prescription: selectedRecord.prescription,
        };
      }
      return record; // 수정하지 않은 기록은 그대로 반환
    });

    try {
      // 서버로 진료 기록을 보내는 API 요청
      const response = await fetch(
        "http://localhost:8080/api/medical-records/update",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            doctorEmail: sessionStorage.getItem("email"),
            patientPhoneNumber: selectedPatient.phone, // 환자 전화번호로 식별
            visitDate: selectedRecord.visitDate,
            diagnosis: selectedRecord.diagnosis,
            prescription: selectedRecord.prescription,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("진료 기록 저장에 실패했습니다.");
      }

      // 성공적으로 저장되면, 모달 닫기 및 UI 업데이트
      alert("진료 기록이 저장되었습니다.");
      setIsRecordModalOpen(false);
    } catch (error) {
      console.error("진료 기록 저장 실패:", error);
    }
  };

  // 진료 기록 삭제
  const handleDeleteRercord = async () => {
    if (!selectedPatient || !selectedRecord) return;

    // 선택된 기록 삭제
    const updatedRecords = selectedPatient.records.filter(
      (record) => record.visitDate !== selectedRecord.visitDate
    );

    setSelectedPatient({
      ...selectedPatient,
      records: updatedRecords, // 삭제된 후의 진료 기록 상태로 업데이트
    });

    try {
      // 서버로 삭제 요청
      const response = await fetch(
        "http://localhost:8080/api/medical-records/delete", // DELETE 요청을 보낼 API 엔드포인트
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            doctorEmail: "lllyyyjjj0420@naver.com", // 의사 이메일
            patientPhoneNumber: selectedPatient.phone, // 환자 전화번호
            visitDate: selectedRecord.visitDate, // 방문일로 진료 기록 식별
            diagnosis: selectedRecord.diagnosis,
            prescription: selectedRecord.prescription,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("진료 기록 삭제에 실패했습니다.");
      }

      // 성공적으로 삭제되었으면, 모달 닫기 및 UI 업데이트
      alert("진료 기록이 삭제되었습니다.");
      console.log("진료 기록이 삭제되었습니다.");
      setIsRecordModalOpen(false); // 삭제 후 모달 닫기
    } catch (error) {
      console.error("진료 기록 삭제 실패:", error);
    }
  };

  return (
    <div className="main-container">
      <TopBar />
      <div className="container">
        <h1>환자 진료기록 관리 시스템</h1>
        <p>환자 정보 및 진료 기록을 관리하는 용도입니다.</p>
        <div className="input">
          <input
            className="input-1"
            placeholder="환자 이름 검색"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="button">
          <ButtonLS onClick={handleSearch}>검색</ButtonLS>
          {/*<ButtonLS onClick={handleCreateRecord}>생성</ButtonLS>*/}
        </div>

        {/* 동명이인 환자 목록을 리스트로 출력 */}
        <div className="patient-list">
          {patients.length > 0
            ? patients.map((patient) => (
                <div
                  key={patient.phone}
                  className="patient-item"
                  onClick={() => handlePatientClick(patient)} // 환자 클릭 시 모달 열기
                >
                  <span>{patient.name}</span>
                  <span>{patient.phone}</span>
                  <span>{patient.birthday}</span>
                  <span>{patient.gender}</span>
                </div>
              ))
            : !isFirstSearch && <span>해당하는 환자가 없습니다.</span>}
        </div>
      </div>

      {/* 환자 인적사항 및 진료 기록 리스트 모달 */}
      {isPatientModalOpen && selectedPatient && (
        <div className="modal">
          <div className="modal-content">
            <span className="close" onClick={handleClosePatientModal}>
              &times;
            </span>
            <h2>{selectedPatient.name}</h2>

            {/* 환자의 인적사항 */}
            <div className="form-group">
              <label>이름</label>
              <input type="text" value={selectedPatient.name} disabled />
            </div>
            <div className="form-group">
              <label>전화번호</label>
              <input type="text" value={selectedPatient.phone} disabled />
            </div>
            <div className="form-group">
              <label>생년월일</label>
              <input type="text" value={selectedPatient.birthday} disabled />
            </div>
            <div className="form-group">
              <label>성별</label>
              <input type="text" value={selectedPatient.gender} disabled />
            </div>

            {/* 진료 기록 목록 출력 */}
            <div className="form-group">
              <label>진료 기록</label>
              {selectedPatient.records && selectedPatient.records.length > 0 ? (
                <div className="record-list">
                  {selectedPatient.records
                    .sort(
                      (a, b) => new Date(a.visitDate) - new Date(b.visitDate)
                    )
                    .map((record, index) => (
                      <div
                        className="record-box"
                        key={record.visitDate}
                        onClick={() => handleRecordClick(record)}
                      >
                        <div className="form-group">
                          <label>방문일</label>
                          <input
                            type="text"
                            value={record.visitDate}
                            disabled
                          />
                        </div>
                        <div className="form-group">
                          <label>진단</label>
                          <input
                            type="text"
                            value={record.diagnosis}
                            disabled
                          />
                        </div>
                        <div className="form-group">
                          <label>처방</label>
                          <input
                            type="text"
                            value={record.prescription}
                            disabled
                          />
                        </div>
                      </div>
                    ))}
                </div>
              ) : (
                <p>진료 기록이 없습니다.</p>
              )}
            </div>

            <div className="button-group">
              <ButtonLS onClick={handleRecordFormClick}>생성</ButtonLS>
              <ButtonLS onClick={handleClosePatientModal}>닫기</ButtonLS>
              {/*<ButtonLS onClick={handleSave}>수정</ButtonLS>*/}
              {/*<ButtonLS onClick={handleDeleteRercord}>삭제</ButtonLS>*/}
            </div>
          </div>
        </div>
      )}

      {/* 진료 기록 생성 모달 */}
      {isCreateModalOpen && selectedRecord && (
        <div className="modal">
          <div className="modal-content">
            <span className="close" onClick={handleCloseCreateModal}>
              &times;
            </span>
            <h2>진료 기록</h2>

            <div className="form-group">
              <label>방문일</label>
              <textarea
                type="text"
                value={selectedRecord.visitDate}
                onChange={(e) => handleRecordForm(e, "visitDate")}
                placeholder="yyyy-mm-dd"
              />
            </div>
            <div className="form-group">
              <label>증상</label>
              <textarea
                type="text"
                value={selectedRecord.diagnosis}
                onChange={(e) => handleRecordForm(e, "diagnosis")}
              />
            </div>
            <div className="form-group">
              <label>처방</label>
              <textarea
                type="text"
                value={selectedRecord.prescription}
                onChange={(e) => handleRecordForm(e, "prescription")}
              />
            </div>
            <div className="button-group">
              <ButtonLS onClick={handleCreateRecord}>저장</ButtonLS>
              <ButtonLS onClick={handleCloseCreateModal}>닫기</ButtonLS>
            </div>
          </div>{" "}
          {/* 모달 내용 끝 */}
        </div>
      )}

      {/* 진료 기록 수정 모달 */}
      {isRecordModalOpen && selectedRecord && (
        <div className="modal">
          <div className="modal-content">
            <span className="close" onClick={handleCloseRecordModal}>
              &times;
            </span>
            <h2>진료 기록 상세</h2>

            <div className="form-group">
              <label>방문일</label>
              <textarea
                type="text"
                value={selectedRecord.visitDate}
                onChange={(e) => handleRecordForm(e, "visitDate")}
                placeholder="yyyy-mm-dd"
              />
            </div>
            <div className="form-group">
              <label>증상</label>
              <textarea
                type="text"
                value={selectedRecord.diagnosis}
                onChange={(e) => handleRecordForm(e, "diagnosis")}
              />
            </div>
            <div className="form-group">
              <label>처방</label>
              <textarea
                type="text"
                value={selectedRecord.prescription}
                onChange={(e) => handleRecordForm(e, "prescription")}
              />
            </div>

            <div className="button-group">
              <ButtonLS onClick={handleSaveRecord}>수정</ButtonLS>
              <ButtonLS onClick={handleDeleteRercord}>삭제</ButtonLS>
              <ButtonLS onClick={handleCloseRecordModal}>닫기</ButtonLS>
            </div>
          </div>
        </div>
      )}

      {/*
      <div className="button-group">
        <ButtonLS onClick={handleCloseCreateModal}>취소</ButtonLS>
        <ButtonLS onClick={() => {}}>저장</ButtonLS>{" "}
      </div>*/}
    </div>
  );
}
