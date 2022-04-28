import { Menu } from 'antd';
import React, { useState, useEffect } from 'react';

import {
    ShopOutlined,
    EditOutlined,
    HomeOutlined,
    SnippetsOutlined,
    UserOutlined,
    ApiOutlined,
    CreditCardOutlined,
    ApartmentOutlined,
    ImportOutlined,
    TagOutlined,
    ControlOutlined,
    UsergroupDeleteOutlined,
} from '@ant-design/icons';
import { useRouter } from 'next/router';

const SideMenu = () => {
    const router = useRouter();
    const [current, setCurrent] = useState(router.pathname);

    useEffect(() => {
        if (router) {
            if (current == router.pathname) {                
                setCurrent(router.pathname);  
            }
        }
    }, [current]);

    function getItem(label, key, path, icon, children, type) {
        return {
            label,
            key,
            path,
            icon,
            children,
            type,
        };
    }

    const items = [
        getItem('Dashboard', 'dashboard', '/dashboard', <HomeOutlined />, null),
        getItem('Category', 'category', '/category', <EditOutlined />, null),
        getItem('Store', 'store', '/store', <ShopOutlined />, null),
        getItem('Item', 'item', '/item', <SnippetsOutlined />, null),
        getItem('User', 'user', '/user', <UserOutlined />, null),
        getItem('Supplier', 'supplier', '/supplier', <ApiOutlined />, null),
        getItem('Voucer', 'voucher', '/voucher', <CreditCardOutlined />, null),
        getItem('Store Item', 'store-item', '/store-item', <ApartmentOutlined />, null),
        getItem('Incoming Item', 'incoming-item', '/incoming-item', <ImportOutlined />, null),
        getItem('Price Rule', 'price-rule', '/price-rule', <TagOutlined />, null),
        getItem('Parameter', 'parameter', '/parameter', <ControlOutlined />, null),
        getItem('Customer', 'customer', '/customer', <UsergroupDeleteOutlined />, null),
    ];

    function sleep(time) {
        return new Promise((resolve) => setTimeout(resolve, time));
    }

    let handleClick = (e) => {
        router.push(e.key);
    }

    return (
        <>
        <Menu
            onClick={handleClick}
            theme="dark"
            mode="inline"
            defaultSelectedKeys={current.replace('/', '')}
            items={items}
            />
            </>
    )
}

export default SideMenu