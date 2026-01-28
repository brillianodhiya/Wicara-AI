import React, { useState, useEffect } from 'react';
import { Outlet, NavLink, useLocation } from 'react-router-dom';
import { Dropdown, Avatar } from 'antd';
import {
    HomeOutlined,
    AudioOutlined,
    HistoryOutlined,
    SettingOutlined,
    UserOutlined,
    LogoutOutlined,
    MenuOutlined
} from '@ant-design/icons';
import { useAuth } from '../contexts/AuthContext';
import '../styles/layout.css';

interface NavItem {
    key: string;
    path: string;
    icon: React.ReactNode;
    label: string;
}

const navItems: NavItem[] = [
    { key: 'home', path: '/', icon: <HomeOutlined />, label: 'Home' },
    { key: 'record', path: '/record', icon: <AudioOutlined />, label: 'Record' },
    { key: 'history', path: '/history', icon: <HistoryOutlined />, label: 'History' },
    { key: 'settings', path: '/settings', icon: <SettingOutlined />, label: 'Settings' },
];

export const MainLayout: React.FC = () => {
    const { user, signOut } = useAuth();
    const location = useLocation();
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth < 768);
            if (window.innerWidth >= 1024) {
                setSidebarOpen(false);
            }
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const getPageTitle = () => {
        const currentItem = navItems.find(item => item.path === location.pathname);
        return currentItem?.label || 'Wicara AI';
    };

    const userMenuItems = [
        {
            key: 'email',
            label: user?.email,
            disabled: true,
        },
        { type: 'divider' as const },
        {
            key: 'settings',
            icon: <SettingOutlined />,
            label: 'Settings',
        },
        {
            key: 'logout',
            icon: <LogoutOutlined />,
            label: 'Logout',
            onClick: signOut,
        },
    ];

    return (
        <div className="main-layout">
            {/* Sidebar Overlay (Tablet) */}
            {sidebarOpen && (
                <div
                    className={`sidebar-overlay ${sidebarOpen ? 'open' : ''}`}
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Sidebar - Desktop & Tablet */}
            {!isMobile && (
                <aside className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
                    <div className="sidebar-header">
                        <div className="sidebar-logo">
                            🎙️ Wicara AI
                        </div>
                    </div>

                    <nav className="sidebar-nav">
                        <div className="nav-section">
                            {navItems.map(item => (
                                <NavLink
                                    key={item.key}
                                    to={item.path}
                                    className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
                                    onClick={() => setSidebarOpen(false)}
                                >
                                    <span className="nav-item-icon">{item.icon}</span>
                                    {item.label}
                                </NavLink>
                            ))}
                        </div>
                    </nav>

                    <div className="sidebar-footer">
                        <Dropdown menu={{ items: userMenuItems }} placement="topLeft" trigger={['click']}>
                            <div className="user-avatar">
                                <Avatar size="small" icon={<UserOutlined />} />
                                <span style={{ fontSize: 14, color: '#666' }}>{user?.email?.split('@')[0]}</span>
                            </div>
                        </Dropdown>
                    </div>
                </aside>
            )}

            {/* Main Content */}
            <main className="main-content">
                <header className="content-header">
                    {!isMobile && window.innerWidth < 1024 && (
                        <button
                            className="menu-toggle"
                            onClick={() => setSidebarOpen(!sidebarOpen)}
                            style={{ background: 'none', border: 'none', fontSize: 20, cursor: 'pointer' }}
                        >
                            <MenuOutlined />
                        </button>
                    )}
                    <div className="content-header-title">{getPageTitle()}</div>

                    <Dropdown menu={{ items: userMenuItems }} placement="bottomRight" trigger={['click']}>
                        <div className="user-avatar">
                            <Avatar size="small" icon={<UserOutlined />} />
                        </div>
                    </Dropdown>
                </header>

                <div className="content-body">
                    <Outlet />
                </div>
            </main>

            {/* Bottom Navigation - Mobile Only */}
            {isMobile && (
                <nav className="bottom-nav">
                    <div className="bottom-nav-inner">
                        {navItems.map(item => (
                            <NavLink
                                key={item.key}
                                to={item.path}
                                className={({ isActive }) => `bottom-nav-item ${isActive ? 'active' : ''}`}
                            >
                                <span className="bottom-nav-item-icon">{item.icon}</span>
                                {item.label}
                            </NavLink>
                        ))}
                    </div>
                </nav>
            )}
        </div>
    );
};
