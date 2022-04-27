import React, {useState} from 'react';

import { Layout, Menu } from 'antd';
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

const { Header, Sider, Content } = Layout;

export default function GeneralLayout(props) {
    const [collapsed, setCollapsed] = useState(false);

    const toggle = () => {
        setCollapsed(!collapsed);
    };

    return (
        <Layout>
            <Sider trigger={null} collapsible collapsed={collapsed} onCollapse={toggle}>
                <div className="logo" />
                <SideMenu />
            </Sider>
            <Layout className="site-layout" style={{height:"100vh"}}>
                <Header className="site-layout-background" style={{ padding: 0 }}>
                    {React.createElement(collapsed ? MenuUnfoldOutlined : MenuFoldOutlined, {
                        className: 'trigger',
                        onClick: toggle,
                    })}
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
