import React from 'react';
import { Form, Input, Button, Checkbox } from 'antd';
import { UserOutlined, LockOutlined, EyeTwoTone, EyeInvisibleOutlined } from '@ant-design/icons';
import Head from 'next/head';

export default function Login() {
    const onFinish = (values) => {
        console.log('Received values of form: ', values);
    };

    return (
        <>
            <Head>
                <title>Login - HIPPOS</title>
                <meta name="description" content="HIPPOS - CDC Team 3" />
                <link rel="icon" href="/favicon.ico" />
                <link href="https://unpkg.com/tailwindcss@^2/dist/tailwind.min.css" rel="stylesheet" />
            </Head>
            <div className="flex items-center justify-center min-h-screen bg-gray-100">
                <div className="w-[200px] px-12 py-6 mt-4 text-left bg-white shadow-lg">
                    <h3 className="pb-3 text-2xl font-bold text-center">Log In</h3>
                    <Form
                        name="normal_login"
                        className="login-form"
                        initialValues={{
                            remember: true,
                        }}
                        onFinish={onFinish}
                    >
                        <Form.Item
                            name="username"
                            rules={[
                                {
                                    required: true,
                                    message: 'Please input your Username!',
                                },
                            ]}
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
                            ]}
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