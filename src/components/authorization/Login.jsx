import React, {useState} from 'react';
import './authorization.css'
import Input from "../../utils/input/Input";
import {registration} from "../../actions/user";


const Login = () => {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")

    return (
        <div className='login'>
            <div className="login__header">Вход</div>
            <Input value={email} setValue={setEmail} type="text" placeholder="Введите email..."/>
            <Input value={password} setValue={setPassword} type="password" placeholder="Введите пароль..."/>
            <button className="login__btn">Войти</button>
        </div>
    );
};

export default Login