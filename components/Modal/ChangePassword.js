import { EyeInvisibleOutlined, EyeTwoTone, LockOutlined } from "@ant-design/icons";
import { Form, Input, message, Modal } from "antd";
import { useEffect, useState } from "react";
import * as authAPI from "api/Auth";
import { useDispatch } from "react-redux";
import { logout } from "redux/slices/auth";

export default function ChangePasswordModal(prop) {
    const [form] = Form.useForm();
    const dispatch = useDispatch();

    const [visible, setVisible] = useState(false);
    const [confirmLoading, setConfirmLoading] = useState(false);

    useEffect(() => {
        setVisible(prop.visible);
    }, [prop.visible]);

    const onFinish = values => {
        // console.log("Received values of form: ", values);
        authAPI.changePassword(values).then(res => {
            if (res.status === 200) {
                message.success(res.data.message);
                setVisible(false);
                form.resetFields();
                // dispatch(logout());
            } else {
                message.error(res.data.message);
            }
        });
    };

    const handleOk = () => {
        form.submit();
    }

    return (
        <Modal
            title="Change Password"
            visible={visible}
            onOk={handleOk}
            okText="Change"
            onCancel={() => {
                prop.onCancel();
                form.resetFields()
            }}
        >
            <Form 
                layout='vertical' 
                autoComplete='off'
                onFinish={onFinish}
                form={form}
            >
                <Form.Item label='Current Password' name='old' hasFeedback required 
                    rules={[
                            {
                                required: true,
                                message: 'Please input your current password!'
                            },
                            {
                                min: 6,
                                message: 'Password must be at least 6 characters long!'
                            }
                    ]} 
                >
                    <Input.Password
                        prefix={<LockOutlined className="site-form-item-icon" />}
                        placeholder="Password"
                        iconRender={visible => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
                    />
                </Form.Item>
                <Form.Item label='New Password' name='new' hasFeedback required 
                    rules={[
                            {
                                required: true,
                                message: 'Please input your new password!'
                            },
                            {
                                min: 6,
                                message: 'New password must be at least 6 characters long!'
                            }
                    ]} 
                >
                    <Input.Password
                        prefix={<LockOutlined className="site-form-item-icon" />}
                        placeholder="Password"
                        iconRender={visible => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
                    />
                </Form.Item>
                <Form.Item label='Confirmation Password' name='confirmation' hasFeedback required 
                    dependencies={['new']}
                    rules={[
                            {
                                required: true,
                                message: 'Please input your confirmation password!'
                            },
                            {
                                min: 6,
                                message: 'Confirmation password must be at least 6 characters long!'
                            },
                            ({ getFieldValue }) => ({
                                validator(_, value) {
                                  if (!value || getFieldValue('new') === value) {
                                    return Promise.resolve();
                                  }
                                  return Promise.reject(new Error('Passwords does not match!'));
                                },
                              }),
                    ]} 
                >
                    <Input.Password
                        prefix={<LockOutlined className="site-form-item-icon" />}
                        placeholder="Password"
                        iconRender={visible => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
                    />
                </Form.Item>
            </Form>
        </Modal>
    )
}