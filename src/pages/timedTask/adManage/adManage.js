import {Button, message, Modal, Popconfirm, Switch, Table} from "antd";
import {CheckOutlined, CloseOutlined, ExclamationCircleOutlined} from "@ant-design/icons";
import AddAd from "../../../components/addAd/addAd";
import React, {useEffect, useState} from "react";
import {deleteAdById, getAdList, updateAdById} from "../../../api/user";

export default function () {

    const [visible, setVisible] = useState(false);


    const [result, setResult] = useState({
        data: [],
        total: 0
    })

    let [recordConfig, setRecordConfig] = useState({
        pageSize: 10, pageIndex: 1
    });

    const [editRow, setEditRow] = useState(undefined);


    function onRankChange(isVisible) {
        setVisible(isVisible)
        setEditRow(undefined);
        doGet();
    }

    const onEdit = (record) => {
        setVisible(true);
        console.log('record', record);
        setEditRow(record)
    }

    const itemDeleteConfirm = (ad_id) => {
        deleteAdById({ad_id}).then(resp => {
            if (resp.status === 200) {
                message.success(resp.msg);
                doGet();
            } else {
                message.error(resp.msg);
            }
        })
    }


    const updateRank = (params) => {
        updateAdById(params).then(resp => {
            if (resp.status === 200) {
                message.success(resp.msg);
                doGet()
            }
        })
    }

    const doGet = () => {
        const {pageSize, pageIndex} = recordConfig;
        getAdList({pageSize, pageIndex}).then(resp => {
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
        getAdList({pageSize, pageIndex}).then(resp => {
            if (resp.status === 200) {
                const {data, total} = resp;
                setResult({data, total});
            }
        })
    }


    useEffect(() => {
        doGet();
    }, [])

    const rankColumns = [
        {
            title: 'Id',
            dataIndex: 'ad_id',
            key: 'ad_id',
        },
        {
            title: '??????',
            dataIndex: 'ad_title',
            key: 'ad_title',
        },
        {
            title: '??????',
            dataIndex: 'content',
            key: 'content'
        },
        {
            title: '????????????',
            dataIndex: 'start_time',
            key: 'start_time',
        },
        {
            title: '????????????',
            dataIndex: 'end_time',
            key: 'end_time',
        },
        {
            title: '????????????',
            dataIndex: 'create_time',
            key: 'create_time',
        },
        {
            title: '??????',
            dataIndex: 'status',
            key: 'status',
            render: (text, record, index) => {
                // console.log('class_ids', item, classItem);
                // let specItem = classItem.filter(classItem => parseInt(item) === classItem.class_id);
                // // console.log('specItem', specItem)
                return (
                    <Switch style={{marginLeft: '0px'}}
                            size={'small'}
                            onChange={(checked) => {
                                Modal.confirm({
                                    icon: <ExclamationCircleOutlined/>,
                                    content: '???????????????????????????',
                                    onOk() {
                                        updateRank({
                                            ...record,
                                            status: Number(checked),
                                            range: [record.start_time, record.end_time]
                                        })
                                        console.log('OK', checked);
                                    },
                                    onCancel() {
                                        console.log('Cancel');
                                    },
                                })
                                // setInput(!input)
                            }}
                            checked={text}
                            checkedChildren={<CheckOutlined/>}
                            unCheckedChildren={<CloseOutlined/>}
                            defaultChecked/>
                );
            }
        },
        {
            title: '??????',
            dataIndex: 'edit',
            render: (text, record, index) => {
                return (
                    <>
                        <Button type="default" size='small' style={{marginRight: '5px'}}
                                onClick={() => onEdit(record)}>Edit</Button>
                        <Popconfirm
                            placement="leftBottom"
                            title='Are you sure to delete this item?'
                            onConfirm={() => itemDeleteConfirm(record.ad_id)}
                            okText="Yes"
                            cancelText="No"
                        >
                            <Button type="link" size='small' danger>Delete</Button>
                        </Popconfirm>
                    </>
                )
            }
        }
    ];


    return (
        <div className="ad">
            <Button type="primary" onClick={() => onRankChange(true)}>????????????</Button>


            <Table dataSource={result.data} style={{marginTop: '10px'}} columns={rankColumns} pagination={{
                position: 'bottomRight',
                total: result.total,
                pageSize: recordConfig.pageSize,
                onChange: (current, size) => onchange(current, size)
            }}/>

            <AddAd editRow={editRow} visible={visible} toggleVisible={onRankChange}/>
        </div>
    )
}

