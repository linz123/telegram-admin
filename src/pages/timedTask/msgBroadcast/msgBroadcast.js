import './msgBroadcast.scss';
import {Modal, Button, Switch, message, Tag, Popconfirm, Table} from "antd";
import React, {useEffect, useState} from "react";
import {deleteTaskById, getTaskList, insetTaskList, updateTaskById} from "../../../api/user";
import {CheckOutlined, CloseOutlined, ExclamationCircleOutlined} from "@ant-design/icons";
import AddTask from '../../../components/addTask/AddTask';
import moment from "moment";

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


    function onTaskChange(isVisible) {
        setVisible(isVisible)
        setEditRow(undefined);
        doGet();
    }

    const onEdit = (record) => {
        setVisible(true);
        console.log('record', record);
        setEditRow(record)
    }

    const itemDeleteConfirm = (task_id) => {
        deleteTaskById({task_id}).then(resp => {
            if (resp.status === 200) {
                message.success(resp.msg);
                doGet();
            } else {
                message.error(resp.msg);
            }
        })
    }


    const updateTask = (params) => {
        updateTaskById(params).then(resp => {
            if (resp.status === 200) {
                message.success(resp.msg);
                doGet()
            }
        })
    }

    const doGet = () => {
        const {pageSize, pageIndex} = recordConfig;
        getTaskList({pageSize, pageIndex}).then(resp => {
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
        getTaskList({pageSize, pageIndex}).then(resp => {
            if (resp.status === 200) {
                const {data, total} = resp;
                setResult({data, total});
            }
        })
    }


    useEffect(() => {
        doGet();
    }, [])


    const taskColumns = [
        {
            title: 'Id',
            dataIndex: 'task_id',
            key: 'task_id',
        },
        {
            title: '名称',
            dataIndex: 'name',
            key: 'name',
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
            title: '触发时间',
            dataIndex: 'timing',
            key: 'timing',
            render: text => moment(text).format('HH:mm:ss')

        },

        {
            title: '创建时间',
            dataIndex: 'update_time',
            key: 'update_time',
        },
        {
            title: '内容',
            dataIndex: 'remark',
            key: 'remark',
            width: 400
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
                                        updateTask({
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
                            onConfirm={() => itemDeleteConfirm(record.task_id)}
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
        <div className="broadcast">
            <Button type="primary" onClick={() => onTaskChange(true)}>添加任务</Button>


            <Table dataSource={result.data} style={{marginTop: '10px'}} columns={taskColumns} pagination={{
                position: 'bottomRight',
                total: result.total,
                pageSize: recordConfig.pageSize,
                onChange: (current, size) => onchange(current, size)
            }}/>

            <AddTask editRow={editRow} visible={visible} toggleVisible={onTaskChange}/>
        </div>
    )
}
