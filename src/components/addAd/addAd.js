import {Button, Col, DatePicker, Form, Input, message, Modal, Row, Select, Switch} from "antd";
import React, {useEffect, useState} from "react";
import {insertAd, updateAdById} from "../../api/user";
import moment from "moment";


const {Option} = Select

export default function AddRank(props) {


    let [input, setInput] = useState(true);


    const {visible, toggleVisible, editRow} = props;

    let formRef = React.createRef();

    function onFinish(fieldsValue) {

        const rangeValue = fieldsValue['range'];

        const values = {
            ...fieldsValue,
            'range': [rangeValue[0].format('YYYY-MM-DD'), rangeValue[1].format('YYYY-MM-DD')],
            status: input
        }

        console.log('values', values);

        if (!editRow) {
            insertAd(values).then(resp => {
                if (resp.status === 200) {
                    formRef.current.resetFields();
                    message.success(resp.msg);
                    toggleVisible(false);
                } else {
                    message.error(resp.msg);
                }
            })
        } else {
            values.ad_id = editRow.ad_id;
            updateAdById(values).then(resp => {
                if (resp.status === 200) {
                    formRef.current.resetFields();
                    message.success(resp.msg);
                    toggleVisible(false);
                } else {
                    message.error(resp.msg);
                }
            })
        }

    }

    useEffect(() => {
        // setUpload(prevState => ({
        //     ...prevState, fileList: []
        // }))
        if (editRow) {
            // updateImages(editRow.tel_id);
            // delete editRow.timing;
            editRow.range = [
                moment(editRow.start_time), moment(editRow.end_time)
            ]
            setInput(editRow.status);
            formRef.current && formRef.current.setFieldsValue(editRow);
        } else {
            formRef.current && formRef.current.resetFields();
        }
    }, [props])

    function close() {
        toggleVisible(false)
    }

    // afterClose={() => formRef.current && formRef.current.resetFields()}

    return (
        <Modal
            title="添加广告"
            visible={visible}
            maskClosable={false}
            footer={null}
            afterClose={close}
            onCancel={() => toggleVisible(false)}
            width={1000}
        >
            <Form layout="vertical" onFinish={onFinish} ref={formRef}>
                <Row gutter={16}>
                    <Col span={24}>
                        <Form.Item
                            name="ad_title"
                            label="标题"
                            rules={[{required: true, message: '请填写标题'}]}
                        >
                            <Input.TextArea autoSize={{minRows: 1, maxRows: 2}} placeholder="请填写标题"/>
                        </Form.Item>
                    </Col>
                </Row>
                <Row gutter={16}>
                    <Col span={6}>
                        <Form.Item
                            name="status"
                            label="状态"

                        >
                            <Switch onChange={() => {
                                setInput(!input)
                            }} checked={input} checkedChildren="开启" unCheckedChildren="禁用"
                                    defaultChecked/>
                        </Form.Item>
                    </Col>
                    <Col span={18}>
                        <Form.Item
                            name="range"
                            label="有效期限"
                            rules={[{required: true, message: 'Please choose the Date'}]}
                        >
                            <DatePicker.RangePicker
                                style={{width: '100%'}}
                                getPopupContainer={trigger => trigger.parentElement}
                            />
                        </Form.Item>
                    </Col>
                </Row>

                <Row gutter={16}>
                    <Col span={24}>
                        <Form.Item
                            name="content"
                            label="内容"
                            rules={[{required: true, message: '请填写内容'}]}
                        >
                            <Input.TextArea autoSize={{minRows: 4, maxRows: 8}} placeholder="请填写内容"/>
                        </Form.Item>
                    </Col>
                </Row>

                <Row gutter={16}>
                    <Col span={24}>
                        <Form.Item style={{display: 'flex', flexDirection: 'row-reverse'}}>
                            <div
                                style={{
                                    textAlign: 'right',
                                    paddingTop: '20px'
                                }}
                            >
                                <Button onClick={() => toggleVisible(false)} style={{marginRight: 8}}>
                                    取消
                                </Button>
                                <Button type="primary" htmlType="submit" style={{marginLeft: '15px'}}>
                                    确定
                                </Button>
                            </div>
                        </Form.Item>
                    </Col>
                </Row>

            </Form>
        </Modal>
    )
}
