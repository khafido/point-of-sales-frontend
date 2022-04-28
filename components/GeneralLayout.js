import React, {useState} from 'react';

import { Image, Layout, Menu } from 'antd';
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
    const [collapsed, setCollapsed] = useState(false);

    const toggle = () => {
        setCollapsed(!collapsed);
    };

    const logoImg = "https://cdn-icons-png.flaticon.com/512/714/714015.png";

    return (
        <Layout>
            <Sider trigger={null} collapsible collapsed={collapsed} onCollapse={toggle}>
                <SideMenu />
            </Sider>
            <Layout className="site-layout" style={{height:"100vh"}}>
                <Header className="site-layout-background" style={{ padding: 0 }}>
                    {React.createElement(collapsed ? MenuUnfoldOutlined : MenuFoldOutlined, {
                        className: 'trigger',
                        onClick: toggle,
                    })}
                    <Link href="/dashboard">                        
                        <a className='text-[#001529] ml-[30%]'>                                                   
                            <Image className='lg:visible md:visible invisible absolute -mt-7' preview={false} width={33} src={logoImg} />
                            <label className='lg:visible md:visible invisible hover:cursor-pointer hover:text-[#001529] ml-5 text-center text-[24px] font-bold text-[#00152]'>HIPPOS</label>                    
                        </a>
                    </Link>
                </Header>
                <Layout>
                    <Content id='content-wrapper' className="site-layout-background">
                        {props.content}
                    </Content>
                </Layout>                
            </Layout>
        </Layout>
    )
}
