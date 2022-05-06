import React, { useState, useEffect, useRef } from 'react';
import { Form, Input, Row, Col, Space, message, DatePicker, Select, Upload } from 'antd';
import Button from 'antd-button-color';
import moment from 'moment';
import axios from 'axios';
import { UploadOutlined } from '@ant-design/icons';
import FormItem from 'antd/lib/form/FormItem';
import TextArea from 'antd/lib/input/TextArea';
export default function UserForm() {

    useEffect(() => {
        
    }, []);

    const checkUsernameIsExist = async (username) => {
        return await axios.get(process.env.NEXT_PUBLIC_API_URL + 'v1/user/check-username/' + username + "/")
            .then(res => { return res.data })
            .catch(err => { return err });
    }

    const checkEmailIsExist = async (email) => {
        return await axios.get(process.env.NEXT_PUBLIC_API_URL + 'v1/user/check-email/' + email + "/")
            .then(res => { return res.data })
            .catch(err => { return err });
    }

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
                validator: async (rule, value) => {
                    let status = await checkUsernameIsExist(value).then(res => {
                        return res;
                    });
                    console.log('username', status);
                    if (status && value.length > 6) {
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
                validator: async (rule, value) => {
                    let status = await checkEmailIsExist(value).then(res => {
                        return res;
                    });
                    console.log('email', status);
                    if (status && value.length > 6) {
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
        ],
        address: [
            {
                required: true,
                message: 'Please input your address'
            }
        ]
    };

    const [form] = Form.useForm();

    const onFinish = (e) => {
        // console.log('Submit success!', e);
        let req = {
            firstName: e.firstName,
            lastName: e.lastName,
            username: e.username,
            email: e.email,
            gender: e.gender,
            password: e.password,
            birthDate: e.birthDate,
            phone: e.phone,
            address: e.address,
            photo: e.photo.file.thumbUrl,
        }
        // console.log(req);
        axios.post(process.env.NEXT_PUBLIC_API_URL + 'v1/user/', req)
            .then(res => {
                console.log(res.data);
                message.success('Success Create User');
            }).catch(err => {
                message.error('Failed:', err.message);
            });
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
                            name="birthDate"
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
                    <Col span={8} className='ml-4'>
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
                <Row>
                    <Col span={12}>
                        <Form.Item rules={formRule.address} name="address" label="Address">
                            <TextArea rows={3} placeholder="Address" />
                        </Form.Item>
                    </Col>

                </Row>
                <Row>
                    <Col>
                        <Form.Item
                            name="photo"
                            label="Photo"
                            rules={formRule.photo}
                        >

                            <Upload
                                accept="image/png, image/jpeg"
                                listType="picture"
                                maxCount={1}
                            >
                                <Button>{<UploadOutlined />}Upload Photo</Button>
                            </Upload>
                        </Form.Item>
                    </Col>
                </Row>

                <Form.Item className='mt-2'>
                    <Button className='w-[100px]' style={{ color: 'white', backgroundColor: 'rgb(22 163 74)' }} htmlType="submit">
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