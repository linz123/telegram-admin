import {Button, Col, DatePicker, Form, Input, message, Modal, Row, Select, Switch} from "antd";
import React, {useEffect, useState} from "react";
import {insertRank, insetTaskList, updateRankById, updateTaskById} from "../../api/user";
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
            insertRank(values).then(resp => {
                if (resp.status === 200) {
                    formRef.current.resetFields();
                    message.success(resp.msg);
                    toggleVisible(false);
                } else {
                    message.error(resp.msg);
                }
            })
        } else {
            values.rank_id = editRow.rank_id;
            values.key_type = (values.key_type === '分类' || values.key_type === '0') ? 0 : 1;
            updateRankById(values).then(resp => {
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
            editRow.key_type = editRow.key_type === 0 ? '分类' : '标签';
            setInput(editRow.status);
            formRef.current && formRef.current.setFieldsValue(editRow);
            // setSelect('分类');
            // setSelect(editRow.key_type === 0 ? '分类' : '标签');
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
            title="添加排名"
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
                            name="merchant_id"
                            label="商家ID"
                            rules={[{required: true, message: '请填写商家ID'}]}
                        >
                            <Input placeholder="请填写商家ID"/>
                        </Form.Item>
                    </Col>
                    <Col span={6}>
                        <Form.Item
                            name="key_type"
                            label="关键词类型"
                            rules={[{required: true, message: '分类或者标签'}]}
                        >
                            <Select>
                                <Option value="0">分类</Option>
                                <Option value="1">标签</Option>
                            </Select>
                        </Form.Item>
                    </Col>
                    <Col span={6}>
                        <Form.Item
                            name="rank_number"
                            label="排名"
                            rules={[{required: true, message: '请填写要设置的排名'}]}
                        >
                            <Input placeholder="请填写要设置的排名"/>
                        </Form.Item>
                    </Col>
                </Row>
                <Row gutter={16}>
                    <Col span={2}>
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
                    <Col span={10}>
                        <Form.Item
                            name="key_id"
                            label="关键词ID"
                            rules={[{required: true, message: '分类或者标签ID'}]}
                        >
                            <Input placeholder="分类或者标签ID"/>
                        </Form.Item>
                    </Col>
                    <Col span={12}>
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
                            name="rmk"
                            label="备注"
                            rules={[
                                {
                                    required: false,
                                    message: '请填写备注',
                                },
                            ]}
                        >
                            <Input.TextArea autoSize={{minRows: 4, maxRows: 15}} placeholder="请填写备注"/>
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
