import './addMerchant.scss';
import React, {useEffect, useState} from "react";
import {Button, Col, Row, Drawer, Form, Input, Select, Divider, message, InputNumber, Upload, Modal} from "antd";
import {addClass, addMerchant, addTag, deleteImg, getClasses, getImages, getTags, updateMerchant} from "../../api/user";
import {ExclamationCircleOutlined, PlusOutlined} from "@ant-design/icons";

import {getBase64} from "../../utils/upload";

export default function (props) {
    const [tagItem, setTagItem] = useState([]);
    const [classItem, setClassItem] = useState([]);
    const [newClass, setNewClass] = useState('');
    const [newTagName, setNewTagName] = useState('');
    const [title, setTitle] = useState('');

    const [upload, setUpload] = useState({
        previewVisible: false,
        previewImage: '',
        previewTitle: '',
        fileList: [
            // {
            //     uid: "-1",
            //     name: "image.png",
            //     status: "done",
            //     url:
            //         "https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png"
            // },
            // {
            //     uid: "-2",
            //     name: "image.png",
            //     status: "done",
            //     url:
            //         "https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png"
            // },
            // {
            //     uid: "-3",
            //     name: "image.png",
            //     status: "done",
            //     url:
            //         "https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png"
            // },
            // {
            //     uid: "-4",
            //     name: "image.png",
            //     status: "done",
            //     url:
            //         "https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png"
            // },
            // {
            //     uid: "-xxx",
            //     percent: 50,
            //     name: "image.png",
            //     status: "uploading",
            //     url:
            //         "https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png"
            // },
            // {
            //     uid: "-5",
            //     name: "image.png",
            //     status: "error"
            // }

        ]
    })


    const {visible, toggleVisible, editRow} = props;

    /**
     * 下载
     */
    const {previewVisible, previewImage, fileList, previewTitle} = upload;

    const uploadButton = (
        <div>
            <PlusOutlined/>
            <div style={{marginTop: 8}}>Upload</div>
        </div>
    );

    const {Option} = Select;

    let formRef = React.createRef();
    formRef.current && formRef.current.resetFields();

    function getImgId(filelist) {
        let str = '';
        for (let i = 0; i < filelist.length; i++) {
            const file = filelist[i];
            if (file.response && file.status === 'done') {
                str += file.response.data.img_id + ',';
            }
        }
        return str;
    }


    function onFinish(values) {
        let img_ids = getImgId(fileList);

        if (editRow) {
            let newValues = Object.assign(values, {id: editRow.tel_id, img_ids})
            updateMerchant(newValues).then(resp => {
                if (resp.status === 200) {
                    formRef.current.resetFields();
                    message.success(resp.msg);
                    toggleVisible(false);
                }
            })
        } else {
            addMerchant(Object.assign(values, {img_ids})).then(resp => {
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

    /**
     * 当移除图片时
     * @returns {Promise<unknown>}
     */
    function onRemove(file) {
        return new Promise((resolve, reject) => {
            Modal.confirm({
                title: 'Confirm',
                icon: <ExclamationCircleOutlined/>,
                content: '确定要删除吗？',
                okText: '确认',
                cancelText: '取消',
                onCancel: () => reject(false),
                onOk: () => {
                    resolve(true);
                    const imgId = file?.response?.data?.img_id || file.uid;
                    let telId;
                    if (editRow) telId = editRow.tel_id;
                    deleteImg({imgId, telId}).then(resp => console.log(resp));
                }
            })
        })
    }

    function updateImages(telId) {
        getImages({telId}).then(resp => {
            const {data} = resp;
            const newList = data.map(item => {
                return {
                    response: {
                        data: {
                            img_id: item.img_id
                        }
                    },
                    status: 'done',
                    uid: item.img_id,
                    url: 'http://45.32.120.67:7001' + item.img_relative_url
                }
            })
            setUpload(prevState => ({
                ...prevState, fileList: newList
            }))
        })
    }


    useEffect(() => {
        setTitle(editRow ? 'Edit a item' : 'Create a new item');
        setUpload(prevState => ({
            ...prevState, fileList: []
        }))
        if (editRow) {
            console.log('formRef', formRef)
            console.log('editRow', editRow);
            if (typeof (editRow.tag_ids) === "string") {

                editRow.tag_ids = editRow.tag_ids.split(',');
            }
            updateImages(editRow.tel_id);
            formRef.current.setFieldsValue(editRow);

        } else {
            // formRef.current && formRef.current.resetFields();
        }
    }, [props])

    useEffect(() => {
        getClassItem();
        getTagItem();
        console.log('editRow2', editRow);


    }, []);

    function close() {
        toggleVisible(false)
        formRef.current.resetFields();
        console.log('editRow-colse', editRow)
        if (!editRow) {
            let img_ids = getImgId(fileList);
            img_ids.split(',').forEach(item => {
                if (item) {
                    deleteImg({imgId: item}).then(resp => console.log(resp));
                }
            })
        }
    }

    /**
     * 关闭图片
     */
    const handleCancel = () => setUpload(prevState => ({...prevState, previewVisible: false}))


    const handlePreview = async (file) => {
        console.log('file', file);
        if (!file.url && !file.preview) {
            // file.preview = await getBase64(file.originFileObj);

            file.preview = file.thumbUrl;
        }
        // console.log('preview', file.preview);

        setUpload(prevState => ({
            ...prevState,
            previewImage: file.url || file.preview,
            previewVisible: true,
            previewTitle:
                file.name || file.url.substring(file.url.lastIndexOf("/") + 1)
        }));
    };

    const handleChange = ({file, fileList}) => {
        setUpload(prevState => ({...prevState, fileList}));
        if (file.status !== 'uploading') {
            // console.log(file, fileList);
        }
        if (file.status === 'done') {
            message.success(`${file.name} file uploaded successfully`)

            console.log('file', file, 'fileList', fileList);


        } else if (file.status === 'error') {
            message.error(`${file.name} file upload failed.`);
        }


        // console.log(file, fileList);
        // if (file?.response?.status === 200) {
        //     message.success(`${file.name} file uploaded successfully`);
        // } else {
        //     message.error(`${file.name} file upload failed.`);
        // }


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
                            label="名称"
                            rules={[{required: true, message: 'Please enter user name'}]}
                        >
                            <Input placeholder="Please enter user name"/>
                        </Form.Item>
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
                            label="标签"
                            rules={[{required: true, message: 'Please select an tagIds'}]}
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
                            label="分类"
                            rules={[{required: true, message: 'Please choose the classIds'}]}

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
                    <Col span={12}>
                        <Form.Item
                            name="hot"
                            label="热度(点击量)"
                            rules={[{required: false, message: '热度'}]}
                        >
                            <InputNumber style={{width: '100%'}} placeholder="热度"/>
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            name="weight"
                            label="权重"
                            rules={[{required: false, message: '权重（数字越大，权重越大）'}]}
                        >
                            <InputNumber style={{width: '100%'}} placeholder="权重（数字越小，权重越大）"/>
                        </Form.Item>
                    </Col>
                </Row>
                <Row style={{margin: '15px 0 15px 0'}}>
                    <h1 style={{fontSize: '15px'}}>上传图片</h1>
                    <>
                        <Upload
                            action="/merchant/uploadImg"
                            method="post"
                            listType="picture-card"
                            fileList={fileList}
                            name="menu"
                            multiple
                            onPreview={handlePreview}
                            onChange={handleChange}
                            onRemove={onRemove}

                        >
                            {fileList.length >= 5 ? null : uploadButton}
                        </Upload>
                        <Modal
                            visible={previewVisible}
                            title={previewTitle}
                            footer={null}
                            onCancel={handleCancel}
                        >
                            <img alt="example" style={{width: "100%"}} src={previewImage}/>
                        </Modal>
                    </>
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

