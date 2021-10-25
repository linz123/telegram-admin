import './imageMange.scss';
import React, {useEffect, useState} from "react";
import {deleteImg, getImageList, getTaskList} from "../../../api/user";
import {Button, message, Modal, Popconfirm, Table, Upload} from "antd";
import request from "../../../utils/request";
import {ExclamationCircleOutlined, PlusOutlined, RedoOutlined} from "@ant-design/icons";
import {Config} from "../../../config"

const {serverImageUrl} = Config;

export default function () {

    const [result, setResult] = useState({
        data: [],
        total: 0
    })

    let [recordConfig, setRecordConfig] = useState({
        pageSize: 10, pageIndex: 1
    });

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
        ]
    })
    const [url, setUrl] = useState(undefined);

    const initImageList = () => {
        const {pageSize, pageIndex} = recordConfig;
        getImageList({pageSize, pageIndex}).then(resp => {
            if (resp.status === 200) {
                const {data, total} = resp;
                setResult({data, total});
            }
        })
    }
    const onchange = (pageIndex, pageSize) => {
        setRecordConfig(prevState => ({
            ...prevState,
            pageIndex,
            pageSize
        }))
        getImageList({pageSize, pageIndex}).then(resp => {
            if (resp.status === 200) {
                const {data, total} = resp;
                setResult({data, total});
            }
        })
    }


    const deleteImage = (imgId) => {
        deleteImg({imgId}).then(resp => {
            if (resp.status === 200) {
                message.success(resp.msg)
                initImageList();
            } else {
                message.warn(resp.msg)
            }
        });
    }

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


    const handleCancel = () => {
        setUpload(prevState => ({...prevState, previewVisible: false}))
        setUrl(undefined);
    }
    const handleUrl = (item) => {
        setUpload(prevState => ({...prevState, previewVisible: true, previewTitle: item.img_relative_url}))

        setUrl(serverImageUrl + item.img_relative_url);
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
                    deleteImage(imgId);
                }
            })
        })
    }

    const handleChange = ({file, fileList}) => {
        setUpload(prevState => ({...prevState, fileList}));
        if (file.status !== 'uploading') {
            // console.log(file, fileList);
        }
        if (file.status === 'done') {
            message.success(`${file.name} file uploaded successfully`)
            console.log('file', file, 'fileList', fileList);
            initImageList();

        } else if (file.status === 'error') {
            message.error(`${file.name} file upload failed.`);
        }

    }

    useEffect(() => {
        initImageList();
    }, [])
    const {previewVisible, previewImage, fileList, previewTitle} = upload;

    const imageColumns = [
        {
            title: 'Id',
            dataIndex: 'img_id',
            key: 'img_id',
        },
        {
            title: '绝对路径',
            dataIndex: 'img_url',
            key: 'img_url',
        },
        {
            title: '相对路径',
            dataIndex: 'img_relative_url',
            key: 'img_relative_url',
        },
        {
            title: '预览',
            dataIndex: 'preview',
            key: 'preview',
            render: (text, record, index) => {

                return (
                    <img width='40px' onClick={() => handleUrl(record)}
                         src={serverImageUrl + record.img_relative_url} alt=""/>
                )
            }
        },
        {
            title: '操作',
            dataIndex: 'edit',
            render: (text, record, index) => {
                return (
                    <>
                        <Button type="primary" onClick={() => handleUrl(record)}>预览</Button>
                        <Popconfirm
                            placement="leftBottom"
                            title='Are you sure to delete this item?'
                            onConfirm={() => deleteImage(record.img_id)}
                            okText="Yes"
                            cancelText="No"
                        >
                            <Button type="link" size='small' danger>Delete</Button>
                        </Popconfirm>
                    </>
                )
            }
        }
    ]

    const uploadButton = (
        <div>
            <PlusOutlined/>
            <div style={{marginTop: 8}}>Upload</div>
        </div>
    );

    const refreshButton = (
        <div onClick={(e) => {
            setUpload(prevState => ({
                ...prevState,
                fileList: []
            }));
            e.stopPropagation();
        }}>
            <RedoOutlined/>
            <div style={{marginTop: 8}}>清空</div>
        </div>
    );

    return (
        <div className="imgMargin">

            <div className="upload">
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
                        {fileList.length >= 3 ? refreshButton : uploadButton}
                    </Upload>
                    <Modal
                        visible={previewVisible}
                        title={previewTitle}
                        footer={null}
                        onCancel={handleCancel}
                    >
                        <img alt="example" style={{width: "100%"}} src={url || previewImage}/>
                    </Modal>
                </>
            </div>
            <Table dataSource={result.data} style={{marginTop: '10px'}} columns={imageColumns} pagination={{
                position: 'bottomRight',
                total: result.total,
                pageSize: recordConfig.pageSize,
                onChange: (current, size) => onchange(current, size)
            }}/>
        </div>
    )


}

