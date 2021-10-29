import moment from "moment";
import {Button, message, Modal, Popconfirm, Switch, Table} from "antd";
import {CheckOutlined, CloseOutlined, ExclamationCircleOutlined} from "@ant-design/icons";
import AddRank from "../../../components/addRank/addRank";
import React, {useEffect, useState} from "react";
import {deleteRankById, getRankList, updateRankById, updateTaskById} from "../../../api/user";

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

    const itemDeleteConfirm = (rank_id) => {
        deleteRankById({rank_id}).then(resp => {
            if (resp.status === 200) {
                message.success(resp.msg);
                doGet();
            } else {
                message.error(resp.msg);
            }
        })
    }


    const updateRank = (params) => {
        updateRankById(params).then(resp => {
            if (resp.status === 200) {
                message.success(resp.msg);
                doGet()
            }
        })
    }

    const doGet = () => {
        const {pageSize, pageIndex} = recordConfig;
        getRankList({pageSize, pageIndex}).then(resp => {
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
        getRankList({pageSize, pageIndex}).then(resp => {
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
            dataIndex: 'rank_id',
            key: 'rank_id',
        },
        {
            title: '商家Id',
            dataIndex: 'merchant_id',
            key: 'merchant_id',
        },
        {
            title: '关键词类型',
            dataIndex: 'key_type',
            key: 'key_type',
            render: text => text === 0 ? '分类' : '标签'
        },
        {
            title: '关键词ID',
            dataIndex: 'key_id',
            key: 'key_id'
        },
        {
            title: '排名',
            dataIndex: 'rank_number',
            key: 'rank_number',
        },
        {
            title: '开始时间',
            dataIndex: 'start_time',
            key: 'start_time',
        },
        {
            title: '结束时间',
            dataIndex: 'end_time',
            key: 'end_time',
        },
        {
            title: '备注',
            dataIndex: 'rmk',
            key: 'rmk',
        },
        {
            title: '创建时间',
            dataIndex: 'create_time',
            key: 'create_time',
        },
        {
            title: '状态',
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
                                    content: '是否确认要更改状态',
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
            title: '操作',
            dataIndex: 'edit',
            render: (text, record, index) => {
                return (
                    <>
                        <Button type="default" size='small' style={{marginRight: '5px'}}
                                onClick={() => onEdit(record)}>Edit</Button>
                        <Popconfirm
                            placement="leftBottom"
                            title='Are you sure to delete this item?'
                            onConfirm={() => itemDeleteConfirm(record.rank_id)}
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
            <Button type="primary" onClick={() => onRankChange(true)}>添加排名</Button>


            <Table dataSource={result.data} style={{marginTop: '10px'}} columns={rankColumns} pagination={{
                position: 'bottomRight',
                total: result.total,
                pageSize: recordConfig.pageSize,
                onChange: (current, size) => onchange(current, size)
            }}/>

            <AddRank editRow={editRow} visible={visible} toggleVisible={onRankChange}/>
        </div>
    )
}
