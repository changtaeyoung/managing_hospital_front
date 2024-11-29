import React, { useState, useEffect } from 'react';
import './medicalRecords.css';
import TopBar from '../components/TopBar';
import ButtonLS from '../components/ButtonLS'; // Button 컴포넌트 import

export default function MedicalRecords() {
  const [patients, setPatients] = useState([]); // 환자 목록 상태
  const [searchQuery, setSearchQuery] = useState(''); // 검색어 상태
  const [isModalOpen, setIsModalOpen] = useState(false); // 모달 열림 여부 상태
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false); // 생성 모달 상태
  const [selectedPatient, setSelectedPatient] = useState(null); // 선택된 환자 정보
  const [isFirstSearch, setIsFirstSearch] = useState(true); // 첫 번째 검색 여부 상태

  const allPatients = [
    { id: 1, name: 'John Doe', phone: '123-456-7890', email: 'john@example.com', records: ['2023-01-01: Flu', '2023-02-15: Checkup'] },
    { id: 2, name: 'Jane Smith', phone: '987-654-3210', email: 'jane@example.com', records: ['2023-03-10: Fever', '2023-04-20: Routine'] },
    { id: 3, name: 'Alice Johnson', phone: '555-555-5555', email: 'alice@example.com', records: ['2023-06-05: Cough', '2023-08-22: Allergy'] },
  ];

  // 페이지 로드 시 초기 patients 설정
  useEffect(() => {
    setPatients(allPatients);
  }, []);

  const handleSearch = () => {
    const filteredPatients = allPatients.filter(patient =>
      patient.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setIsFirstSearch(false);
    setPatients(filteredPatients);
  };

  const handlePatientClick = (patient) => {
    setSelectedPatient(patient);  // 선택한 환자 정보 설정
    setIsModalOpen(true);         // 모달 열기
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedPatient(null); // 모달 닫을 때 선택된 환자 정보 초기화
  };

  const handleSave = () => {
    // 저장 로직 구현 (수정 후 저장)
    alert('진료 기록이 저장되었습니다.');
    setIsModalOpen(false);
  };

  const handleDelete = () => {
    // 삭제 로직 구현
    alert('환자의 진료 기록이 삭제되었습니다.');
    setIsModalOpen(false);
  };

  const handleCreateRecord = () => {
    setIsCreateModalOpen(true); // 새로운 진료 기록 생성 모달 열기
  };

  const handleCloseCreateModal = () => {
    setIsCreateModalOpen(false); // 생성 모달 닫기
  };

  return (
    <div className='main-container'>
      <TopBar />
      <div className='container'>
        <h1>환자 진료기록 관리 시스템</h1>
        <p>환자 정보 및 진료 기록을 관리하는 용도입니다.</p>
        <div className='input'>
          <input
            className='input-1'
            placeholder='환자 이름 검색'
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className='button'>
          <ButtonLS onClick={handleSearch}>검색</ButtonLS>
          <ButtonLS onClick={handleCreateRecord}>생성</ButtonLS>
        </div>

        {/* 환자 목록을 리스트로 출력 */}
        <div className='patient-list'>
          {patients.length > 0 ? (
            patients.map(patient => (
              <div
                key={patient.id}
                className='patient-item'
                onClick={() => handlePatientClick(patient)} // 환자 클릭 시 모달 열기
              >
                <span>{patient.name}</span>
                <span>{patient.phone}</span>
                <span>{patient.email}</span>
              </div>
            ))
          ) : !isFirstSearch && (
            <span>해당하는 환자가 없습니다.</span>
          )}
        </div>
      </div>

      {/* 환자 진료 기록 모달 UI */}
      {isModalOpen && selectedPatient && (
        <div className='modal'>
          <div className='modal-content'>
            <span className='close' onClick={handleCloseModal}>&times;</span>
            <h2>{selectedPatient.name}의 진료 기록</h2>
            
            {/* 환자의 진료 기록 표시 */}
            <div className='form-group'>
              <label>이름</label>
              <input type='text' value={selectedPatient.name} disabled />
            </div>
            <div className='form-group'>
              <label>진료 기록</label>
              <textarea value={selectedPatient.records.join('\n')} disabled></textarea>
            </div>
            
            <div className='button-group'>
              <ButtonLS onClick={handleCloseModal}>취소</ButtonLS>
              <ButtonLS onClick={handleSave}>수정</ButtonLS>
              <ButtonLS onClick={handleDelete}>삭제</ButtonLS>
            </div>
          </div>
        </div>
      )}

      {/* 진료 기록 생성 모달 UI */}
      {isCreateModalOpen && (
        <div className='modal'>
          <div className='modal-content'>
            <span className='close' onClick={handleCloseCreateModal}>&times;</span>
            <h2>진료 기록 생성</h2>
            <div className='form-group'>
              <label>이름</label>
              <input type='text' placeholder='환자 이름 입력' />
            </div>
            <div className='form-group'>
              <label>증상</label>
              <textarea placeholder='증상 및 진료 기록 작성'></textarea>
            </div>
            <div className='button-group'>
              <ButtonLS onClick={handleCloseCreateModal}>취소</ButtonLS>
              <ButtonLS onClick={() => {}}>저장</ButtonLS> {/* save 클릭 시 처리할 함수 */}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
