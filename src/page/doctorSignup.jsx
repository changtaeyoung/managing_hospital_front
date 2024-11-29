import React,{useState} from 'react';
import './styles.css';
import TopBar from '../components/TopBar';
import ButtonLS from '../components/ButtonLS';
import { useNavigate } from 'react-router-dom';

export default function DoctorSignup() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [specialty, setSpecialty] = useState("");
    const [signupCheck, setsignupCheck] = useState(false);
    const [fieldError, setFieldError] = useState(false);

    const navigate = useNavigate();

    const handleSignup = async (e) => {
        e.preventDefault();

        if (!name || !email || !password || !specialty) {
            console.log("모든 필드를 입력해주세요.");
            setFieldError(true);
            return;
        }

        const response = await fetch(
        "http://localhost:8080/api/doctor/signup",
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                name: name,
                email: email,
                password: password,
                specialty: specialty,
            }),
        }
        );

        if (!response.ok) {
            if(response.status === 400) {
                console.log("이메일 중복");
                setsignupCheck(true);
            }
            else{
                console.log("회원가입 오류 다시 시도 바람")
                setsignupCheck(true);
            }
        }
        const result = await response.json();
        alert("회원가입 성공!");
        console.log("회원가입 성공");
        sessionStorage.setItem("token", result.token);
        sessionStorage.setItem("email", result.email);
        sessionStorage.setItem("role", result.role);
        setsignupCheck(false);
        navigate('/doctor/login');
        
    }
    return (
        <div className='main-container'>
        <TopBar/>
        <div className='form'>
            <div className='vector-1' />
                <div className='container-2'>
                <span className='login-title'>의사 회원가입</span>
                <span className='login-description'>시스템 사용을 위해 회원가입 해주세요.</span>
            </div>
            <div className='list'>
                <div className='row'> 
                    <div className='input'>
                    <span className='title-3'>이름</span>
                    <div className='text-field-4'>
                        <input 
                        className='text-field-input-5' 
                        placeholder='이름을 입력하세요'
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        />
                    </div>
                    </div>
                </div>
                <div className='row'> 
                    <div className='input'>
                    <span className='title-3'>이메일</span>
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
                    <span className='title-8'>비밀번호</span>
                    <div className='text-field-9'>
                        <input 
                        className='text-field-input-a' 
                        type='password'
                        placeholder='비밀번호를 입력하세요'
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                
                    </div>
                </div>
                <div className='row'> 
                    <div className='input'>
                    <span className='title-3'>전문분야</span>
                    <div className='text-field-4'>
                        <input 
                        className='text-field-input-5' 
                        value={specialty}
                        placeholder='전문분야를 입력하세요'
                        onChange={(e) => setSpecialty(e.target.value)}
                        />
                    </div>
                    {fieldError && (<label style={{color: "red"}}>입력이 완료되지 않았습니다.</label>)}
                    {signupCheck && (<label style={{color: "red"}}>이메일 중복 또는 회원가입을 다시 시도해주세요</label>)}
                    </div>
                </div>
                <ButtonLS onClick={handleSignup}>회원가입</ButtonLS> 
                </div>
                
            </div>
        
        </div>
  );
}
