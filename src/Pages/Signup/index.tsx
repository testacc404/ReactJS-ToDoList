import React, { useState, useContext } from "react";
import * as S from "../Login/styles";
import Logo from "../../Img/Logo.png";
import { Link, useNavigate } from "react-router-dom";
import AuthContext, { AuthType } from "../../Contexts/authContext";

type Account = { name: string; email: string; password: string };

const ACCOUNTS_KEY = "@Project:accounts";

function readAccounts(): Account[] {
    try {
        const parsed = JSON.parse(localStorage.getItem(ACCOUNTS_KEY) ?? "[]");
        return Array.isArray(parsed) ? parsed : [];
    } catch {
        return [];
    }
}

const Signup: React.FC = () => {
    const { setUserData } = useContext(AuthContext) as AuthType;
    const navigate = useNavigate();
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    function handleSignup(event: React.FormEvent) {
        event.preventDefault();
        const cleanEmail = email.trim().toLowerCase();
        if (!name.trim() || !cleanEmail) return setError("Please fill in all fields.");
        if (!/^\S+@\S+\.\S+$/.test(cleanEmail)) return setError("Please enter a valid email.");
        if (password.length < 8) return setError("Password must be at least 8 characters.");
        const accounts = readAccounts();
        if (accounts.some((a) => a.email === cleanEmail)) {
            return setError("An account with that email already exists.");
        }
        // Local stand-in only: there is no server, so this is not a security boundary.
        localStorage.setItem(
            ACCOUNTS_KEY,
            JSON.stringify([...accounts, { name: name.trim(), email: cleanEmail, password }])
        );
        localStorage.setItem("@Project:email", cleanEmail);
        setUserData({ email: cleanEmail });
        navigate("/", { replace: true });
    }

    return (
        <S.Page>
            <S.LeftSide>
                <S.Img src={Logo}></S.Img>
            </S.LeftSide>
            <S.RightSide as="form" onSubmit={handleSignup}>
                <S.Title>Create your account</S.Title>
                <S.Subtitle>Sign up to start organising your tasks.</S.Subtitle>
                <S.FieldName>Name</S.FieldName>
                <S.InputField value={name} onChange={(e) => setName(e.target.value)} placeholder="Insert your name" autoComplete="name" />
                <S.FieldName>Email</S.FieldName>
                <S.InputField value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Insert your email" autoComplete="email" />
                <S.FieldName>Password</S.FieldName>
                <S.InputField value={password} onChange={(e) => setPassword(e.target.value)} placeholder="At least 8 characters" type="password" autoComplete="new-password" />
                {error && <S.Subtitle role="alert" style={{ color: "#d33" }}>{error}</S.Subtitle>}
                <S.SignIn type="submit">Sign Up</S.SignIn>
                <S.Subtitle>Already have an account? <Link to="/login">Sign In</Link></S.Subtitle>
            </S.RightSide>
        </S.Page>
    );
};

export default Signup;
