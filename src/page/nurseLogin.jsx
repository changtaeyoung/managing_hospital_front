import React,{useState} from 'react';
import './styles.css';
import TopBar from '../components/TopBar';
import ButtonLS from '../components/ButtonLS';
import { useNavigate } from 'react-router-dom';

export default function NurseLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginCheck, setLoginCheck] = useState(false);

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    const response = await fetch(
      "http://localhost:8080/api/nurse/login",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email,
          password: password,
        }),
      }
    );

    if(!response.ok){
      console.log("로그인 실패");
      setLoginCheck(true);
    }
    const result = await response.json();

    setLoginCheck(false);
    sessionStorage.setItem("token", result.token);
    sessionStorage.setItem("email", result.email);
    sessionStorage.setItem("role", result.role);
    console.log("로그인 성공, 이메일 주소: " + result.email);
    navigate('/home');
    
  }
  return (
    <div className='main-container'>
      <TopBar/>
      <div className='form'>
        <div className='vector-1' />
        <div className='container-2'>
          <span className='login-title'>간호사 로그인</span>
          <span className='login-description'>시스템 사용을 위해 로그인해주세요.</span>
        </div>
        <div className='list'>
          <div className='row'> 
            <div className='input'>
              <span className='title-3'>Email</span>
              <div className='text-field-4'>
                <input 
                  className='text-field-input-5' 
                  value={email}
                  placeholder='이메일을 입력하세요'
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>
          </div>
          <div className='row-6'>
            <div className='input-7'>
              <span className='title-8'>Password</span>
              <div className='text-field-9'>
                <input 
                  className='text-field-input-a' 
                  type='password'
                  value={password}
                  placeholder='비밀번호를 입력하세요'
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              {loginCheck && (<label style={{color: "red"}}>이메일 또는 비밀번호를 다시 확인해주세요.</label>)}
            </div>
          </div>
          <ButtonLS onClick={handleLogin}>로그인</ButtonLS>
          <div className='title-8'>아직 회원이 아니신가요? <a href="http://localhost:5175/nurse/signup"><span className='title-signup'>회원가입</span></a>
              </div> 
        </div>
      </div>
      
    </div>
  );
}
