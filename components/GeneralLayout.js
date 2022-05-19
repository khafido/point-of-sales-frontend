import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { logout } from 'redux/slices/auth';
import { Button, Dropdown, Image, Layout, Menu, PageHeader } from 'antd';
import {
    MenuFoldOutlined,
    MenuUnfoldOutlined,
    UserOutlined,
} from '@ant-design/icons';
import SideMenu from './SideMenu';
// import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { removeUser } from 'redux/slices/user';

const { Header, Sider, Content } = Layout;

export default function GeneralLayout(props) {
    const dispatch = useDispatch();
    const router = useRouter();

    const [collapsed, setCollapsed] = useState(true);
    // const [windowDimensions, setWindowDimensions] = useState(getWindowDimensions());

    // useEffect(() => {
    //     function handleResize() {
    //         setWindowDimensions(getWindowDimensions());
    //     }
    //     if(windowDimensions.width < 400){
    //         setCollapsed(true);
    //     }
    // }, [windowDimensions]);


    // function getWindowDimensions() {
    //     if (typeof window !== 'undefined') {
    //         return {
    //             width: window.innerWidth,
    //             height: window.innerHeight,
    //         };
    //     }
    //     const { innerWidth: width, innerHeight: height } = window;
    //     return {
    //         width,
    //         height
    //     };
    // }

    const toggle = () => {
        setCollapsed(!collapsed);
    };

    const logoImg = "/logo.png";

    const doLogout = () => {
        dispatch(logout());
        dispatch(removeUser());
        router.push('/login');
    }

    const userMenu = (
        <Menu style={{ width:'150px' }}>
            <Menu.Item key="1">Profile</Menu.Item>
            <Menu.Item key="2">Change Password</Menu.Item>
            <Menu.Divider />
            <Menu.Item key="3" onClick={() => doLogout()}>Logout</Menu.Item>
        </Menu>
    );

    return (
        <Layout>
            <Sider trigger={null} collapsible collapsed={collapsed} onCollapse={toggle}>
                <SideMenu />
            </Sider>
            <Layout className="site-layout" style={{ minHeight: "100vh" }}>
                <Header className="site-layout-background" style={{ padding: 0 }}>
                    {React.createElement(collapsed ? MenuUnfoldOutlined : MenuFoldOutlined, {
                        className: 'trigger',
                        onClick: toggle,
                    })}
                    <Link href="/dashboard">
                        <a className='text-[#001529] ml-[35%]'>
                            <Image className='lg:visible md:visible invisible absolute -mt-7' preview={false} width={33} src={logoImg} />
                            <label className='lg:visible md:visible invisible hover:cursor-pointer hover:text-[#001529] ml-5 text-center text-[24px] font-bold text-[#00152]'>HIPPOS</label>
                        </a>
                    </Link>
                    <Dropdown.Button
                        style={{ float: 'right', marginRight: '12px', marginTop: '17px' }}
                        className="dropdown-btn"
                        overlay={userMenu}
                        icon={
                            <UserOutlined
                                style={{
                                    fontSize: '28px',
                                    borderRadius: '50%',
                                }}
                            />
                        }
                    ></Dropdown.Button>
                </Header>
                <Layout>
                    <Content id='content-wrapper' className="site-layout-background">
                        <PageHeader
                            // onBack={() => null}
                            title={props.title}
                            subTitle={props.subTitle}
                        />
                        {props.content}
                    </Content>
                </Layout>
            </Layout>
        </Layout>
    )
}
