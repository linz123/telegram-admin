import './login.scss';
import {Form, Input, Button, Checkbox} from 'antd';
import logo from '../../logo.svg';
import {login} from "../../api/user";
import {observer} from "mobx-react";
import {setItem} from "../../utils/storage";
import {useHistory} from 'react-router-dom';


export default observer(({store}) => {

        const history = useHistory();
        console.log('store', store);
        const onFinish = values => {
            console.log('values', values)
            login(values).then(resp => {
                if (resp.status === 200) {
                    store.user = resp.data;
                    setItem('user', resp.data);
                    console.log('store', store);
                    history.push('/merchant');
                }
            })
        }

        return (
            <div className="login-wrap">
                <div className="login-box">
                    <div className="login-logo">
                        <img src={logo} alt="123"/>
                        <span>Bot Admin</span>
                    </div>
                    <Form className="normal-login" onFinish={onFinish}>
                        <Form.Item
                            name="username"
                            className="form-item"
                            rules={[{required: true, message: 'Please input your Username!'}]}
                        >
                            <Input placeholder="Username"/>
                        </Form.Item>
                        <Form.Item
                            name="password"
                            className="form-item"
                            rules={[{required: true, message: 'Please input your Password!'}]}
                        >
                            <Input placeholder="Password"/>
                        </Form.Item>
                        <Form.Item className="form-item">
                            <Form.Item name="remember" valuePropName="checked" noStyle>
                                <Checkbox>Remember me</Checkbox>
                            </Form.Item>
                        </Form.Item>
                        <Form.Item className="form-item">
                            <Button type="primary" htmlType="submit" className="login-form-button">
                                登录
                            </Button>
                        </Form.Item>
                    </Form>
                </div>
            </div>
        )
    }
)

