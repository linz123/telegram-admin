import './merchant.scss';
import {Button, Popconfirm, Table, Tag} from "antd";
import {useEffect, useState} from "react";
import {deleteMerchant, getClasses, getMerchant, getTags} from "../../api/user";
import AddMerchant from "../../components/addMerchant/addMerchant";
import {PlusOutlined} from "@ant-design/icons";


export default function () {
    const [data, setData] = useState([]);
    const [total, setTotal] = useState(0);
    const [visible, setVisible] = useState(false);

    const [tagItem, setTagItem] = useState([]);
    const [classItem, setClassItem] = useState([]);
    const [editRow, setEditRow] = useState(undefined);

    const columns = [
        {
            title: 'Id',
            dataIndex: 'tel_id',
        },
        {
            title: '名称',
            dataIndex: 'name',
        },
        {
            title: 'telegram',
            dataIndex: 'merchant_id',
        },
        {
            title: '描述',
            dataIndex: 'describe',
        },
        {
            title: '标签',
            dataIndex: 'tag_ids',
            render: tags => {
                let tagArr = typeof (tags) === "string" ? tags.split(',') : tags;
                return tagArr.map(tag => {
                    return (
                        <Tag color='green' key={tag}>{tagItem[tag] && tagItem[tag].tag_name}</Tag>
                    )
                })
            }
        },
        {
            title: '分类',
            dataIndex: 'class_ids',
            render: item => (
                <Tag color='blue' key={item}>{classItem[item] && classItem[item].class_name}</Tag>
            )
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
                            onConfirm={() => itemDeleteConfirm(record.tel_id)}
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


    function itemDeleteConfirm(tel_id) {
        deleteMerchant(tel_id).then(resp => {
            if (resp.status === 200) {
                getData();
            }
        })
    }


    let pageSize = 10;
    let pageIndex = 1;

    function getData() {
        getMerchant({pageSize, pageIndex}).then(r => {
            if (r.status === 200) {
                setTotal(r.total);
                setData(r.data)
            }
        })
    }

    function onchange(current, pageSize) {
        pageIndex = current;
        getMerchant({pageSize, pageIndex}).then(r => {
            if (r.status === 200) {
                setData(r.data);
                setTotal(r.total);
            }
        })
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

    useEffect(() => {
        console.log('hello');
        getData();
        getClassItem();
        getTagItem();
    }, [])

    function onChange(isVisible) {
        console.log('onChange', isVisible)
        setVisible(isVisible)
        setEditRow(undefined);
        getData();
    }


    function onEdit(record) {
        console.log('record', record);
        setVisible(true);
        setEditRow(record)
    }

    return (
        <div className='wrap'>
            <Button type="primary" style={{marginBottom: '20px'}} onClick={() => onChange(true)}>
                <PlusOutlined/> New Item
            </Button>

            <Table dataSource={data} columns={columns} pagination={{
                position: 'bottomRight', total, pageSize, onChange: (current, size) => onchange(current, size)
            }}/>
            <AddMerchant editRow={editRow} visible={visible} toggleVisible={onChange}/>
        </div>
    )
}
