import {Button, Col, DatePicker, Form, Input, message, Modal, Row, Switch} from "antd";
import React, {useEffect, useState} from "react";
import {deleteImg, insetTaskList, updateTaskById} from "../../api/user";
import moment from "moment";


export default function AddTask(props) {


    let [input, setInput] = useState(true);

    const {visible, toggleVisible, editRow} = props;

    let formRef = React.createRef();

    function onFinish(fieldsValue) {

        const rangeValue = fieldsValue['range'];

        const values = {
            ...fieldsValue,
            'timing': fieldsValue['timing'].format('YYYY-MM-DD HH:mm:ss'),
            'range': [rangeValue[0].format('YYYY-MM-DD'), rangeValue[1].format('YYYY-MM-DD')],
            status: input
        }

        console.log('values', values);

        if (!editRow) {
            insetTaskList(values).then(resp => {
                if (resp.status === 200) {
                    formRef.current.resetFields();
                    message.success(resp.msg);
                    toggleVisible(false);
                } else {
                    message.error(resp.msg);
                }
            })
        } else {
            values.task_id = editRow.task_id;
            updateTaskById(values).then(resp => {
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
            editRow.timing = moment(editRow.timing);
            editRow.range = [
                moment(editRow.start_time), moment(editRow.end_time)
            ]
            formRef.current && formRef.current.setFieldsValue(editRow);
        } else {
            formRef.current && formRef.current.resetFields();
        }
    }, [props])

    function close() {
        toggleVisible(false)
        console.log('close - formRef', formRef);
        // formRef.current.resetFields();
        console.log('editRow-colse', editRow)
        // if (!editRow) {
        //     let img_ids = getImgId(fileList);
        //     img_ids.split(',').forEach(item => {
        //         if (item) {
        //             deleteImg({imgId: item}).then(resp => console.log(resp));
        //         }
        //     })
        // }
    }

    // afterClose={() => formRef.current && formRef.current.resetFields()}

    return (
        <Modal
            title="????????????"
            visible={visible}
            maskClosable={false}
            footer={null}
            afterClose={close}
            onCancel={() => toggleVisible(false)}
            width={1000}
        >
            <Form layout="vertical" onFinish={onFinish} ref={formRef}>
                <Row gutter={16}>
                    <Col span={12}>
                        <Form.Item
                            name="name"
                            label="??????"
                            rules={[{required: true, message: '???????????????'}]}
                        >
                            <Input placeholder="???????????????"/>
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            name="timing"
                            label="????????????"
                            rules={[{required: true, message: '???????????????'}]}
                        >
                            <DatePicker picker={'time'} style={{width: '100%'}}/>
                        </Form.Item>
                    </Col>
                </Row>
                <Row gutter={16}>
                    <Col span={2}>
                        <Form.Item
                            name="status"
                            label="??????"

                        >
                            <Switch  onChange={() => {
                                setInput(!input)
                            }} checked={input} checkedChildren="??????" unCheckedChildren="??????"
                                    defaultChecked/>
                        </Form.Item>
                    </Col>
                    <Col span={10}>
                        <Form.Item
                            name="img_url"
                            label="????????????"
                            rules={[{required: true, message: '???????????????'}]}
                        >
                            <Input placeholder="???????????????"/>
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            name="range"
                            label="????????????"
                            rules={[{required: true, message: 'Please choose the type'}]}
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
                            name="remark"
                            label="??????"
                            rules={[
                                {
                                    required: false,
                                    message: '???????????????',
                                },
                            ]}
                        >
                            <Input.TextArea autoSize={{minRows: 4, maxRows: 15}} placeholder="???????????????"/>
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
                                    ??????
                                </Button>
                                <Button type="primary" htmlType="submit" style={{marginLeft: '15px'}}>
                                    ??????
                                </Button>
                            </div>
                        </Form.Item>
                    </Col>
                </Row>

            </Form>
        </Modal>
    )
}
