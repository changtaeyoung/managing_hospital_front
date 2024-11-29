import React, { useState, useEffect } from 'react';
import TopBar from '../components/TopBar';
import './materials.css';
import ButtonLS from '../components/ButtonLS';

const Materials = () => {
  const [materials, setMaterials] = useState([]);
  const [usedMaterials, setUsedMaterials] = useState([]);

  // 자재 현황 조회
  const fetchMaterials = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/materials/findall');
      const data = await response.json();
      console.log('서버에서 가져온 자재 현황:', data); // 서버에서 받은 데이터를 콘솔에 출력
      
      // 구매일자(purchaseDate) 기준으로 오름차순 정렬
      const sortedData = data.sort((a, b) => new Date(a.purchaseDate) - new Date(b.purchaseDate));
      
      setMaterials(sortedData); // 정렬된 데이터로 상태 업데이트
    } catch (error) {
      console.error('자재 현황을 불러오는 데 실패했습니다:', error);
    }
  };
  
  useEffect(() => {
    fetchMaterials(); // 컴포넌트 로드 시 자재 현황 조회
  }, []);
  

  useEffect(() => {
    fetchMaterials(); // 컴포넌트 로드 시 자재 현황 조회
  }, []);

  // 자재 입고 처리
  const handleMaterialArrival = async (name, purchaseDate, stock) => {
    const material = { name, purchaseDate, stock: parseInt(stock) };
    try {
      const response = await fetch(
        "http://localhost:8080/api/materials/add", 
        {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(material),
      });
      if (response.ok) {
        alert('자재 입고가 완료되었습니다.');
        fetchMaterials(); // 자재 목록 갱신
      } else {
        alert('자재 입고에 실패했습니다.');
      }
    } catch (error) {
      console.error('자재 입고 처리 중 오류 발생:', error);
    }
  };

  // 자재 사용 처리
  const handleMaterialUse = async (name, purchaseDate, stock) => {
    const materialUse = { name, purchaseDate, stock: parseInt(stock) };
    console.log(JSON.stringify(materialUse));
    try {
      const response = await fetch('http://localhost:8080/api/materials/use', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(materialUse),
      });
      if (response.ok) {
        alert('자재 사용이 완료되었습니다.');
        fetchMaterials(); // 자재 목록 갱신
      } else {
        alert('자재 사용에 실패했습니다.');
      }
    } catch (error) {
      console.error('자재 사용 처리 중 오류 발생:', error);
    }
  };

  // 자재 리스트 출력
  const renderMaterialList = (list) => {
    return list.map((material, index) => (
      <tr key={index}>
        <td>{material.name}</td>
        <td>{material.purchaseDate.split('T')[0]}</td> {/* 날짜에서 'T' 이후 제거 */}
        <td>{material.stock !== undefined ? material.stock : 0}</td> {/* 수량 확인 */}
      </tr>
    ));
  };

  return (
    <div className="main-container">
      <TopBar />
      <h1>의료 용품 재고 관리</h1>

      {/* 자재 입고 입력 폼 */}
      <div>
        <h3>자재 추가</h3>
        <input type="text" placeholder="자재 이름" id="arrivals-name" />
        <input type="date" placeholder="구매 일자" id="arrivals-date" />
        <input type="number" placeholder="구매 개수" id="arrivals-stock" />
        <button
          onClick={() => {
            const name = document.getElementById('arrivals-name').value;
            const purchaseDate = document.getElementById('arrivals-date').value;
            const stock = document.getElementById('arrivals-stock').value;
            handleMaterialArrival(name, purchaseDate, stock);
          }}
        >
          추가
        </button>
      </div>

      {/* 자재 사용 입력 폼 */}
      <div>
        <h3>자재 사용</h3>
        <input type="text" placeholder="사용 자재 이름" id="use-name" />
        <input type="date" placeholder="구매 일자" id="use-date" />
        <input type="number" placeholder="사용 개수" id="use-stock" />
        <button
          onClick={() => {
            const name = document.getElementById('use-name').value;
            const purchaseDate = document.getElementById('use-date').value;
            const stock = document.getElementById('use-stock').value;
            handleMaterialUse(name, purchaseDate, stock);
          }}
        >
          사용
        </button>
      </div>

      {/* 자재 현황 */}
      <h1>자재 현황</h1>
      <table>
        <thead>
          <tr>
            <th>자재 이름</th>
            <th>구매 일자</th>
            <th>수량</th>
          </tr>
        </thead>
        <tbody>
          {renderMaterialList(materials)}
        </tbody>
      </table>
    </div>
  );
};

export default Materials;
