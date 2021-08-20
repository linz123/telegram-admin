import {useEffect, useState} from "react";
import {Popconfirm, Table, Typography, Input, Form, message} from "antd";
import {getClasses, updateClass} from "../../api/user";
import './class.scss';

export default function () {

    const [form] = Form.useForm();
    const [data, setData] = useState([]);
    const [editingKey, setEditingKey] = useState('');

    function getData() {
        getClasses().then(resp => {
            if (resp.status === 200) {
                console.log(resp.data)
                const newData = resp.data.map(item => {
                    item.key = item.class_id
                    return item;
                })
                setData(newData)
            }
        })
    }

    function handleDelete(class_id) {

    }


    const save = async (key, record) => {
        console.log('key', key, record);
        try {
            const row = await form.validateFields();
            const newData = [...data];
            const index = newData.findIndex((item) => key === item.key);
            if (index > -1) {
                const item = newData[index];

                updateClass({...item, ...row}).then(resp => {
                    if (resp.status === 200) {
                        newData.splice(index, 1, {...item, ...row});
                        setData(newData);
                        message.success(resp.msg);
                    }
                })
                setEditingKey('');

            } else {
                newData.push(row);
                setData(newData);
                setEditingKey('');
            }

        } catch (errInfo) {
            console.log('Validate Failed:', errInfo);
        }
    }


    const edit = record => {
        console.log('record', record);
        form.setFieldsValue({
            class_name: '',
            class_description: '',
            ...record
        })
        setEditingKey(record.key);

    }

    function cancel() {
        setEditingKey('');
    }

    const isEditing = record => record.key === editingKey;


    const EditableCell = ({
                              editing,
                              dataIndex,
                              title,
                              record,
                              index,
                              children,
                              ...restProps
                          }) => {
        console.log('EditableCell', {
            editing,
            dataIndex,
            title,
            record,
            index,
            children,
            restProps
        })
        return (
            <td {...restProps}>
                {editing ? (
                    <Form.Item
                        name={dataIndex}
                        style={{
                            margin: 0,
                        }}
                        rules={[
                            {
                                required: true,
                                message: `Please Input ${title}!`,
                            },
                        ]}
                    >
                        <Input/>
                    </Form.Item>
                ) : (
                    children
                )}
            </td>
        );
    }


    const columns = [
        {
            title: 'Id',
            dataIndex: 'class_id',
            key: 'class_id',
        },
        {
            title: '名称',
            dataIndex: 'class_name',
            key: 'class_name',
            editable: true,
        },
        {
            title: '描述',
            dataIndex: 'class_description',
            key: 'class_description',
            editable: true,
        },
        {
            title: '操作',
            dataIndex: 'edit',
            render: (_, record, index) => {
                const editable = isEditing(record);
                return editable ? (
                    <span>
                        <a
                            href="javascript:;"
                            onClick={() => save(record.key, record)}
                            style={{
                                marginRight: 8,
                            }}
                        >
                          Save
                        </a>
                          <a onClick={cancel}>Cancel</a>
                    </span>
                ) : (<>
                        <Typography.Link disabled={editingKey !== ''} onClick={() => edit(record)}
                                         style={{marginRight: '10px'}}>
                            Edit
                        </Typography.Link>
                        <Popconfirm title="Sure to delete?" onConfirm={() => handleDelete(record.key)}>
                            <a>Delete</a>
                        </Popconfirm>
                    </>
                )
            }
        }
    ];

    const mergedColumns = columns.map((col) => {
        console.log('col', col);
        if (!col.editable) {
            return col;
        }

        return {
            ...col,
            onCell: (record) => ({
                record,
                dataIndex: col.dataIndex,
                title: col.title,
                editing: isEditing(record),
            }),
        };
    });

    useEffect(() => {
        getData()
    }, []);

    return (
        <div>
            <Form form={form} component={false}>
                <Table
                    components={{
                        body: {
                            cell: EditableCell,
                        },
                    }}
                    rowClassName="editable-row"
                    bordered
                    dataSource={data}
                    columns={mergedColumns}
                    pagination={{
                        onChange: cancel,
                    }}
                />
            </Form>
        </div>
    )
}
