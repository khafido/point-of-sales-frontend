import React, { useState, useEffect } from 'react';
import { Form, Input, Row, Col, Space, message, DatePicker, Select } from 'antd';
import Button from 'antd-button-color';
import moment from 'moment';
import axios from 'axios';

export default function UserForm() {
    const [existUsername, setExistUsername] = useState();
    const [existEmail, setExistEmail] = useState();

    useEffect(() => {
        axios.get(process.env.NEXT_PUBLIC_API_URL + 'v1/user/all-username')
            .then(res => {
                setExistUsername(res.data);
            })
            .catch(err => {
                console.log(err);
            })
        
            axios.get(process.env.NEXT_PUBLIC_API_URL + 'v1/user/all-email')
            .then(res => {
                setExistEmail(res.data);
            })
            .catch(err => {
                console.log(err);
            })
    }, []);

    const formRule = {
        firstName: [
            {
                required: true,
                message: 'Please input your first name',
            },
        ],
        lastName: [
            {
                required: true,
                message: 'Please input your last name',
            },
        ],
        username: [
            {
                required: true,
                message: 'Please input your username',
            },
            {
                type: 'string',
                min: 6,
            },
            {
                validator: (rule, value) => {
                    if (existUsername.includes(value)) {
                        return Promise.reject('Username already exist');
                    }
                    return Promise.resolve();
                }
            }
        ],
        email: [
            {
                required: true,
                message: 'Please input your email',
            },
            {
                type: 'email',
                message: 'Please input valid email',
            },
            {
                validator: (rule, value) => {
                    if (existEmail.includes(value)) {
                        return Promise.reject('Email already exist');
                    }
                    return Promise.resolve();
                }
            }
        ],
        password: [
            {
                required: true,
                message: 'Please input your password',
            },
        ],
        birthdate: [
            {
                required: true,
                message: 'Please input your birthdate',
            },
        ],
        phone: [
            {
                required: true,
                message: 'Please input your phone',
            },
            {
                pattern: /^[0-9]{1,12}$/,
                message: 'Please input valid phone',
            }
        ],
        gender: [
            {
                required: true,
                message: 'Please select your gender'
            }
        ]
    };

    const submitForm = async () => {
        try {
            const values = await form.validateFields();
            message.success('Success:', values);
        } catch (errorInfo) {
            message.error('Failed:', errorInfo);
        }
    };

    const [form] = Form.useForm();

    const onFinish = (e) => {
        console.log('Submit success!', e);
    };

    const onFinishFailed = () => {
        message.error('Submit failed!');
    };

    return (
        <div className='w-full lg:w-7/12 mx-auto'>
            <Form
                form={form}
                layout="vertical"
                onFinish={onFinish}
                // onFinishFailed={onFinishFailed}
                autoComplete="off"
            >
                <Row>
                    <Col span={11}>
                        <Form.Item
                            name="username"
                            label="Username"
                            rules={formRule.username}
                        >
                            <Input placeholder="Username" />
                        </Form.Item>
                    </Col>
                    <Col span={11} className='ml-4'>
                        <Form.Item
                            name="email"
                            label="Email"
                            rules={formRule.email}
                        >
                            <Input placeholder="Email" />
                        </Form.Item>
                    </Col>
                </Row>
                <Row>
                    <Col span={11}>
                        <Form.Item
                            name="firstName"
                            label="First Name"
                            rules={formRule.firstName}
                        >
                            <Input placeholder="Firstname" />
                        </Form.Item>
                    </Col>
                    <Col span={11} className="ml-4">
                        <Form.Item
                            name="lastName"
                            label="Last Name"
                            rules={formRule.lastName}
                        >
                            <Input placeholder="Lastname" />
                        </Form.Item>
                    </Col>
                </Row>

                <Row>
                    <Col>
                        <Form.Item
                            name="birthdate"
                            label="Birth Date"
                            rules={formRule.birthdate}
                        >
                            <DatePicker className='' disabledDate={(current) => {
                                let customDate = moment().format("YYYY-MM-DD");
                                return current && current > moment(customDate, "YYYY-MM-DD");
                            }}
                            />
                        </Form.Item>
                    </Col>
                    <Col span={9} className='ml-4'>
                        <Form.Item
                            name="phone"
                            label="Phone"
                            rules={formRule.phone}
                        >
                            <Input addonBefore="+62" placeholder="Phone" />
                        </Form.Item>
                    </Col>
                    <Col span={7} className='md:ml-4 lg:ml-4'>
                        <Form.Item
                            name="gender"
                            label="Gender"
                            rules={formRule.gender}
                        >
                            <Select placeholder="Select Gender">
                                <Select.Option value="male">Male</Select.Option>
                                <Select.Option value="female">Female</Select.Option>
                            </Select>
                        </Form.Item>
                    </Col>
                </Row>

                <Form.Item className='mt-2'>
                    <Button className='w-[100px]' style={{color:'white', backgroundColor:'rgb(22 163 74)'}} htmlType="submit">
                        Submit
                    </Button>

                    <Button className='ml-3 mt-3' type='danger' onClick={() => form.resetFields()}>
                        Clear
                    </Button>
                </Form.Item>
            </Form>
        </div>
    );
}