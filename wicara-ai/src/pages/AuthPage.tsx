import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, Form, Input, Button, Typography, Tabs, message } from 'antd';
import { UserOutlined, LockOutlined, MailOutlined } from '@ant-design/icons';
import { useAuth } from '../contexts/AuthContext';

const { Title, Text } = Typography;

export const AuthPage: React.FC = () => {
    const [loading, setLoading] = useState(false);
    const { signIn, signUp, user } = useAuth(); // Added user
    const navigate = useNavigate();

    // Auto-redirect if already logged in
    useEffect(() => {
        if (user) {
            navigate('/');
        }
    }, [user, navigate]);

    const handleLogin = async (values: { email: string; password: string }) => {
        setLoading(true);
        const { error } = await signIn(values.email, values.password);
        setLoading(false);

        if (error) {
            message.error(error.message);
        } else {
            message.success('Login berhasil!');
            navigate('/'); // Explicit redirect
        }
    };

    const handleRegister = async (values: { email: string; password: string; fullName: string }) => {
        setLoading(true);
        const { error } = await signUp(values.email, values.password, values.fullName);
        setLoading(false);

        if (error) {
            message.error(error.message);
        } else {
            message.success('Registrasi berhasil! Silakan cek email untuk verifikasi.');
            // Usually register doesn't log you in immediately depending on Supabase config (confirm email), 
            // but if it does, the useEffect will handle it.
        }
    };

    const loginForm = (
        <Form name="login" onFinish={handleLogin} layout="vertical">
            <Form.Item
                name="email"
                rules={[{ required: true, message: 'Masukkan email!' }, { type: 'email', message: 'Email tidak valid' }]}
            >
                <Input prefix={<MailOutlined />} placeholder="Email" size="large" />
            </Form.Item>
            <Form.Item
                name="password"
                rules={[{ required: true, message: 'Masukkan password!' }]}
            >
                <Input.Password prefix={<LockOutlined />} placeholder="Password" size="large" />
            </Form.Item>
            <Form.Item>
                <Button type="primary" htmlType="submit" loading={loading} block size="large">
                    Login
                </Button>
            </Form.Item>
        </Form>
    );

    const registerForm = (
        <Form name="register" onFinish={handleRegister} layout="vertical">
            <Form.Item
                name="fullName"
                rules={[{ required: true, message: 'Masukkan nama lengkap!' }]}
            >
                <Input prefix={<UserOutlined />} placeholder="Nama Lengkap" size="large" />
            </Form.Item>
            <Form.Item
                name="email"
                rules={[{ required: true, message: 'Masukkan email!' }, { type: 'email', message: 'Email tidak valid' }]}
            >
                <Input prefix={<MailOutlined />} placeholder="Email" size="large" />
            </Form.Item>
            <Form.Item
                name="password"
                rules={[{ required: true, message: 'Masukkan password!' }, { min: 6, message: 'Password minimal 6 karakter' }]}
            >
                <Input.Password prefix={<LockOutlined />} placeholder="Password" size="large" />
            </Form.Item>
            <Form.Item>
                <Button type="primary" htmlType="submit" loading={loading} block size="large">
                    Daftar
                </Button>
            </Form.Item>
        </Form>
    );

    const items = [
        { key: 'login', label: 'Login', children: loginForm },
        { key: 'register', label: 'Daftar', children: registerForm },
    ];

    return (
        <div style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
        }}>
            <Card style={{ width: 400, boxShadow: '0 8px 24px rgba(0,0,0,0.15)' }}>
                <div style={{ width: '100%', textAlign: 'center', marginBottom: 24, display: 'flex', flexDirection: 'column', gap: 8 }}>
                    <Title level={2} style={{ margin: 0 }}>🎙️ Wicara AI</Title>
                    <Text type="secondary">Privacy-First Meeting Assistant</Text>
                </div>
                <Tabs defaultActiveKey="login" items={items} centered />
            </Card>
        </div>
    );
};
