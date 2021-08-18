import './addMerchant.scss';
import React, {useEffect, useState} from "react";
import {Button, Col, Row, Drawer, Form, Input, Select, Divider, message} from "antd";
import {addClass, addMerchant, addTag, getClasses, getTags, updateMerchant} from "../../api/user";
import {PlusOutlined} from "@ant-design/icons";

export default function (props) {
    const [tagItem, setTagItem] = useState([]);
    const [classItem, setClassItem] = useState([]);
    const [newClass, setNewClass] = useState('');
    const [newTagName, setNewTagName] = useState('');
    const [title, setTitle] = useState('');

    const {visible, toggleVisible, editRow} = props;

    console.log('editRow', editRow);
    console.log('visible', visible);

    const {Option} = Select;

    let formRef = React.createRef();
    formRef.current && formRef.current.resetFields();

    function onFinish(values) {
        console.log('onFinish', values);

        if (editRow) {
            let newValues = Object.assign(values, {id: editRow.tel_id})
            console.log('newValues', newValues);
            updateMerchant(newValues).then(resp => {
                if (resp.status === 200) {
                    formRef.current.resetFields();
                    message.success(resp.msg);
                    toggleVisible(false);
                }

            })
        } else {
            addMerchant(values).then(resp => {
                if (resp.status === 200) {
                    message.success(resp.msg);
                    formRef.current.resetFields();
                    toggleVisible(false);
                }

            })
        }


    }

    function getTagItem() {
        getTags().then(resp => {
            if (resp.status === 200) {
                setTagItem(resp.data);
            }
        })
    }

    function getClassItem() {
        getClasses().then(resp => {
            if (resp.status === 200) {
                setClassItem(resp.data);

            }
        })
    }


    function addClassItem() {
        if (!newClass) {
            message.warn('不允许为空')
            return;
        }

        addClass({className: newClass, classDescription: newClass}).then(resp => {
            if (resp.status === 200) {
                getClassItem();
                message.success(resp.msg).then(() => {
                    setNewClass('');
                })
            }
        })
    }


    function addTagItem() {
        if (!newTagName) {
            message.warn('不允许为空')
            return;
        }
        addTag({tagName: newTagName, tagDescription: newTagName}).then(resp => {
            if (resp.status === 200) {
                getTagItem();
                message.success(resp.msg).then(() => {
                    setNewTagName('');
                })
            }
        })
    }

    function onTagChange(event) {
        setNewTagName(event.target.value)
    }

    function onNameChange(event) {
        setNewClass(event.target.value)
    }

    useEffect(() => {
        getClassItem();
        getTagItem();
        console.log('editRow2', editRow);
    }, []);


    useEffect(() => {
        setTitle(editRow ? 'Edit a item' : 'Create a new item');
        console.log('editRow2', editRow, title);
        if (editRow) {
            console.log('formRef', formRef)
            if (typeof (editRow.tag_ids) === "string") {

                editRow.tag_ids = editRow.tag_ids.split(',');
            }
            formRef.current.setFieldsValue(editRow);

        } else {
            formRef.current && formRef.current.resetFields();
        }
    })

    function close() {
        toggleVisible(false)
        formRef.current.resetFields();
    }

    return (
        <Drawer
            title={title}
            width={720}
            visible={visible}
            bodyStyle={{paddingBottom: 80}}
            onClose={close}

        >
            <Form layout="vertical" onFinish={onFinish} ref={formRef}>
                <Row gutter={16}>
                    <Col span={12}>
                        <Form.Item
                            name="name"
                            label="Name"
                            rules={[{required: true, message: 'Please enter user name'}]}
                        >
                            <Input placeholder="Please enter user name"/>
                        </Form.Item>shia
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            name="merchant_id"
                            label="telegram"
                            rules={[{required: true, message: 'Please enter user merchantId'}]}
                        >
                            <Input placeholder="Please enter user merchantId"/>
                        </Form.Item>
                    </Col>
                </Row>
                <Row gutter={16}>
                    <Col span={12}>
                        <Form.Item
                            name="tag_ids"
                            label="tagIds"
                            rules={[{required: false, message: 'Please select an tagIds'}]}
                        >
                            <Select placeholder="Please select an tagIds"
                                    mode="multiple"
                                    allowClear
                                    dropdownRender={menu => (
                                        <div>
                                            {menu}
                                            <Divider style={{margin: '4px 0'}}/>
                                            <div style={{display: 'flex', flexWrap: 'nowrap', padding: 8}}>
                                                <Input style={{flex: 'auto'}} value={newTagName}
                                                       onChange={onTagChange}/>
                                                <a
                                                    style={{
                                                        flex: 'none',
                                                        padding: '8px',
                                                        display: 'block',
                                                        cursor: 'pointer'
                                                    }}
                                                    onClick={addTagItem}
                                                >
                                                    <PlusOutlined/> Add item
                                                </a>
                                            </div>
                                        </div>
                                    )}
                            >
                                {tagItem.map(item => (
                                    <Option key={item.tag_id}>{item.tag_name}</Option>
                                ))}
                            </Select>
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            name="class_ids"
                            label="classIds"
                            rules={[{required: false, message: 'Please choose the classIds'}]}

                        >
                            <Select placeholder="Please choose the classIds"
                                    dropdownRender={menu => (
                                        <div>
                                            {menu}
                                            <Divider style={{margin: '4px 0'}}/>
                                            <div style={{display: 'flex', flexWrap: 'nowrap', padding: 8}}>
                                                <Input style={{flex: 'auto'}} value={newClass} onChange={onNameChange}/>
                                                <a
                                                    style={{
                                                        flex: 'none',
                                                        padding: '8px',
                                                        display: 'block',
                                                        cursor: 'pointer'
                                                    }}
                                                    onClick={addClassItem}
                                                >
                                                    <PlusOutlined/> Add item
                                                </a>
                                            </div>
                                        </div>
                                    )}>
                                {classItem.map(item => (
                                    <Option key={item.class_id}>{item.class_name}</Option>
                                ))
                                }
                            </Select>
                        </Form.Item>
                    </Col>

                </Row>

                <Row gutter={16}>
                    <Col span={24}>
                        <Form.Item
                            name="describe"
                            label="Description"
                            rules={[
                                {
                                    required: false,
                                    message: 'please enter url description',
                                },
                            ]}
                        >
                            <Input.TextArea rows={4} placeholder="please enter url description"/>
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
                                <Button onClick={close} style={{marginRight: 8}}>
                                    Cancel
                                </Button>
                                <Button type="primary" htmlType="submit" style={{marginLeft: '15px'}}>
                                    Submit
                                </Button>
                            </div>

                        </Form.Item>
                    </Col>
                </Row>
            </Form>
        </Drawer>
    )

}

