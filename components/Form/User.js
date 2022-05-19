import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from "next/router";
import { Form, Input, Row, Col, Space, message, DatePicker, Select, Upload } from 'antd';
import Button from 'antd-button-color';
import moment from 'moment';
import { UploadOutlined } from '@ant-design/icons';
import TextArea from 'antd/lib/input/TextArea';
import * as user from 'api/User'

export default function UserForm({ action, userData, userId }) {
    const router = useRouter();
    const [form] = Form.useForm();
    
    const [initialPhoto, setInitialPhoto] = useState({});
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
    }, []);

    useEffect(() => {
        if (action === 'Edit') {
            if (userData !== undefined) {
                if (userData.photo) {
                    setInitialPhoto({
                        uid: userData.username,
                        status: 'done',
                        name: userData.firstName,
                        url: userData.photo,
                    });
                }

                form.setFieldsValue({
                    firstName: userData.firstName,
                    lastName: userData.lastName,
                    username: userData.username,
                    email: userData.email,
                    birthDate: moment(userData.birthDate),
                    phone: userData.phone,
                    gender: userData.gender,
                    address: userData.address,
                });
            }
        }
    }, [userData]);

    const checkUsernameIsExist = async (username) => {
        return user.checkUsernameIsExist(username)
            .then(res => { 
                return res.data; 
            })
            .catch(err => { return err });
    }

    const checkEmailIsExist = async (email) => {
        return user.checkEmailIsExist(email)
            .then(res => { 
                return res.data; 
            })
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
                    // console.log('username', status);
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
                pattern: /^[0-9]{1,15}$/,
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

    const onFinish = (e) => {
        let req = {
            firstName: e.firstName,
            lastName: e.lastName,
            gender: e.gender,
            birthDate: e.birthDate,
            phone: e.phone,
            address: e.address,
        }

        if (action == 'Add') {
            req.username = e.username;
            req.email = e.email;
        }

        if (e.photo !== undefined) {
            req.photo = e.photo.file.thumbUrl;
        } else {
            req.photo = null;
        }

        // console.log('req', e);
        if (action === 'Add' || action === undefined) {
            console.log('create');
            console.log('create');
            user.addUser(req).then(res => {
                console.log(res.data);
                message.success('Success Create User');
            }).catch(err => {
                message.error('Failed:', err.message);
            }).finally(() => {
                form.resetFields();
                router.push('/user');
            });
        } else if (action === 'Edit') {
            console.log('edit');
            user.editUser(userId, req)
            .then(res => {
                    console.log(res.data);
                    message.success('Success Update User');
                }).catch(err => {
                    message.error('Failed:', err.message);
                }).finally(() => {
                    form.resetFields();
                    router.push('/user');
                });
        }
    };

    const onFinishFailed = () => {
        message.error('Submit failed!');
    };

    return (
        <>
            <div className='w-full lg:w-7/12 mx-auto'>
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={onFinish}
                    onFinishFailed={onFinishFailed}
                    autoComplete="off"
                >
                    <Row>
                        <Col span={11}>
                            <Form.Item
                                name="username"
                                label="Username"
                                rules={(action=='Add')?formRule.username:[]}
                                hasFeedback
                            >
                                <Input disabled={(action=='Add')?false:true} placeholder="Username" />
                            </Form.Item>
                        </Col>
                        <Col span={11} className='ml-4'>
                            <Form.Item
                                name="email"
                                label="Email"
                                rules={(action=='Add')?formRule.email:[]}
                                hasFeedback
                            >
                                <Input disabled={(action=='Add')?false:true} placeholder="Email" />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={11}>
                            <Form.Item
                                name="firstName"
                                label="First Name"
                                rules={formRule.firstName}
                                hasFeedback
                            >
                                <Input placeholder="Firstname" />
                            </Form.Item>
                        </Col>
                        <Col span={11} className="ml-4">
                            <Form.Item
                                name="lastName"
                                label="Last Name"
                                rules={formRule.lastName}
                                hasFeedback
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
                        <Col className='w-[170px] md:ml-4 lg:ml-4'>
                            <Form.Item
                                name="phone"
                                label="Phone"
                                rules={formRule.phone}
                            >
                                <Input addonBefore="+62" placeholder="Phone" />
                            </Form.Item>
                        </Col>
                        <Col className='md:ml-4 lg:ml-4'>
                            <Form.Item
                                name="gender"
                                label="Gender"
                                rules={formRule.gender}
                            >
                                <Select placeholder="Select Gender">
                                    <Select.Option value="Male">Male</Select.Option>
                                    <Select.Option value="Female">Female</Select.Option>
                                </Select>
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={16}>
                            <Form.Item rules={formRule.address} name="address" label="Address">
                                <TextArea rows={3} placeholder="Address" />
                            </Form.Item>
                        </Col>

                    </Row>
                    <Row>
                        <Col>
                        {(initialPhoto.uid) ?  
                            <Form.Item
                                name="photo"
                                label="Photo"
                                rules={formRule.photo}
                            >
                                <Upload
                                    key={1}
                                    accept="image/png, image/jpeg"
                                    listType="picture"
                                    maxCount={1}
                                    defaultFileList={(userData.photo)?[initialPhoto]:[]}
                                >
                                    <Button>{<UploadOutlined />}Upload Photo</Button>
                                </Upload>
                            </Form.Item>
                            :
                            <Form.Item
                                name="photo"
                                label="Photo"
                                rules={formRule.photo}
                            >
                                <Upload
                                    key={2}
                                    accept="image/png, image/jpeg"
                                    listType="picture"
                                    maxCount={1}
                                >
                                    <Button>{<UploadOutlined />}Upload Photo</Button>
                                </Upload>
                            </Form.Item>
                            }
                        </Col>
                    </Row>

                    <Form.Item className='mt-2'>
                        <Button className='w-[100px]' style={{ color: 'white', backgroundColor: 'rgb(22 163 74)' }} htmlType="submit">
                            {action}
                        </Button>
                        {(action=='Add')?
                        <Button className='ml-3 mt-3' type='danger' onClick={() => form.resetFields()}>
                            Clear
                        </Button>:
                        <Button className='ml-3 mt-3' onClick={() => router.push("/user")}>
                            Back
                        </Button>
                        }
                        
                    </Form.Item>
                </Form>
            </div>
        </>
    );
}