import React, { useEffect, useState } from 'react';
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";

import { Form, Input, Button, Checkbox } from 'antd';
import { UserOutlined, LockOutlined, EyeTwoTone, EyeInvisibleOutlined } from '@ant-design/icons';

import * as authAPI from 'api/Auth';
import * as userAPI from 'api/User';
import { login, login_error } from "redux/slices/auth";
import { setUser } from 'redux/slices/user';
import cookie from "js-cookie";
import HeadPage from '@components/HeadPage';
 
export default function Login() {
    const dispatch = useDispatch();
    const router = useRouter();
    const auth = useSelector(state => state.auth);
    const user = useSelector(state => state.user);

    const [loginError, setLoginError] = useState(auth.error);

    useEffect(() => {
        dispatch(login_error(null));
    }, []);

    useEffect(() => {
        setLoginError(auth.error);
    }, [auth.error]);

    const onFinish = (values) => {
        authAPI.login(values).then(res => {
            if (res.status === 200) {
                const result = res.data.result;
                console.log(result);
                cookie.set('token', result.token);
                cookie.set('id', result.user.id);
                cookie.set('username', result.user.username);
                cookie.set('email', result.user.email);
                if (result.storeIdEmployee) {
                    cookie.set('store_id_employee', result.storeIdEmployee);
                }
                                    
                if (result.storeIdManager) {                                
                    cookie.set('store_id_manager', result.storeIdManager);
                }
                
                const roles = result.user.roles.map(role => role.name.slice(5));
                cookie.set('roles', JSON.stringify(roles));
                // console.log(JSON.parse(cookie.get('roles')));

                dispatch(login());
                dispatch(setUser(result.user));
                
                router.push('/');
            } else {
                dispatch(login_error("Invalid username or password"));
            }
        });
    };

    const onFinishFailed = (errorInfo) => {
        console.log('Failed:', errorInfo);
    };

    return (
        <>
            <HeadPage title="Login" />
            <div className="flex items-center justify-center min-h-screen bg-gray-100">
                <div className="w-[350px] px-12 py-6 mt-4 text-left bg-white shadow-lg">
                    <h3 className="pb-3 text-2xl font-bold text-center">Log In</h3>
                    {loginError && <p className="text-red-500 text-center">{loginError}</p>}
                    <Form
                        name="normal_login"
                        className="login-form"
                        onFinish={onFinish}
                        onFinishFailed={onFinishFailed}
                    >
                        <Form.Item
                            name="username"
                            rules={[
                                {
                                    required: true,
                                    message: 'Please input your Username!',
                                },
                                {
                                    type: 'string',
                                    min: 6,
                                },
                            ]}
                            hasFeedback
                        >
                            <Input prefix={<UserOutlined className="site-form-item-icon" />} placeholder="Username" />
                        </Form.Item>
                        <Form.Item
                            name="password"
                            rules={[
                                {
                                    required: true,
                                    message: 'Please input your Password!',
                                },
                                {
                                    min: 6,
                                }
                            ]}
                            hasFeedback
                        >
                            <Input.Password
                                prefix={<LockOutlined className="site-form-item-icon" />}
                                placeholder="Password"
                                iconRender={visible => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
                            />
                        </Form.Item>
                        {/* <Form.Item>
                    <Form.Item name="remember" valuePropName="checked" noStyle>
                        <Checkbox>Remember me</Checkbox>
                    </Form.Item>

                    <a className="login-form-forgot" href="">
                        Forgot password
                    </a>
                </Form.Item> */}

                        <Form.Item className=''>
                            <Button type="primary" htmlType="submit" className="login-form-button w-full">
                                Log In
                            </Button>
                            {/* Or <a href="">register now!</a> */}
                        </Form.Item>
                    </Form>
                </div>
            </div>
        </>
    )
}