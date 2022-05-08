import React, {useState, useEffect} from 'react';

import { Image, Layout, Menu, PageHeader } from 'antd';
import {
    AppstoreOutlined,
    MenuFoldOutlined,
    MenuUnfoldOutlined,
    SettingOutlined,
    MailOutlined,
    PropertySafetyFilled,
} from '@ant-design/icons';
import { Footer } from 'antd/lib/layout/layout';
import SideNavbar from './SideMenu';
import SideMenu from './SideMenu';
// import Image from 'next/image';
import Link from 'next/link';

const { Header, Sider, Content } = Layout;

export default function GeneralLayout(props) {
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

    const logoImg = "https://cdn-icons-png.flaticon.com/512/714/714015.png";

    return (
        <Layout>
            <Sider trigger={null} collapsible collapsed={collapsed} onCollapse={toggle}>
                <SideMenu />
            </Sider>
            <Layout className="site-layout" style={{minHeight:"100vh"}}>
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
