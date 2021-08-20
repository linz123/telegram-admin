import {useEffect, useState} from "react";
import {Popconfirm, Table, Typography, Input, Form, message} from "antd";
import {deleteClass, deleteTag, getClasses, getTags, updateClass, updateTags} from "../../api/user";
import './tags.scss';

export default function () {

    const [form] = Form.useForm();
    const [data, setData] = useState([]);
    const [editingKey, setEditingKey] = useState('');

    function getData() {
        getTags().then(resp => {
            if (resp.status === 200) {
                const newData = resp.data.map(item => {
                    item.key = item.tag_id
                    return item;
                })
                setData(newData)
            }
        })
    }

    function handleDelete(class_id) {
        deleteTag(class_id).then(resp => {
            if (resp.status === 200) {
                message.success(resp.msg);
                getData();
            }
        })
    }


    const save = async (key, record) => {
        try {
            const row = await form.validateFields();
            const newData = [...data];
            const index = newData.findIndex((item) => key === item.key);
            if (index > -1) {
                const item = newData[index];

                updateTags({...item, ...row}).then(resp => {
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
            dataIndex: 'tag_id',
            key: 'tag_id',
        },
        {
            title: '名称',
            dataIndex: 'tag_name',
            key: 'tag_name',
            editable: true,
        },
        {
            title: '描述',
            dataIndex: 'tag_description',
            key: 'tag_description',
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
