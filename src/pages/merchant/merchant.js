import './merchant.scss';
import {Button, Popconfirm, Table, Tag, Input, message} from "antd";
import {useEffect, useState} from "react";
import {deleteMerchant, getClasses, getMerchant, getTags, findMerchantByName} from "../../api/user";
import AddMerchant from "../../components/addMerchant/addMerchant";
import {PlusOutlined} from "@ant-design/icons";


export default function () {
    const [data, setData] = useState([]);
    const [total, setTotal] = useState(0);
    const [visible, setVisible] = useState(false);

    const [tagItem, setTagItem] = useState([]);
    const [classItem, setClassItem] = useState([]);
    const [editRow, setEditRow] = useState(undefined);

    let [recordConfig, setRecordConfig] = useState({
        pageSize: 10, pageIndex: 1
    });

    const {Search} = Input;

    const columns = [
        {
            title: 'Id',
            dataIndex: 'tel_id',
            key: 'tel_id',
        },
        {
            title: '名称',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'telegram',
            dataIndex: 'merchant_id',
            key: 'merchant_id',
        },
        {
            title: '描述',
            dataIndex: 'describe',
            key: 'describe',
        },
        {
            title: '标签',
            dataIndex: 'tag_ids',
            key: 'tag_ids',
            render: tags => {
                let tagArr = typeof (tags) === "string" ? tags.split(',') : [tags];
                return tagArr.map(tag => {
                    let specItem = tagItem.filter(item => parseInt(tag) === item.tag_id);
                    return (
                        <Tag color='green' key={tag}>{specItem[0] && specItem[0].tag_name}</Tag>
                    )
                })
            }
        },
        {
            title: '分类',
            dataIndex: 'class_ids',
            key: 'class_ids',
            render: item => {
                // console.log('class_ids', item, classItem);
                let specItem = classItem.filter(classItem => parseInt(item) === classItem.class_id);
                // console.log('specItem', specItem)
                return (<Tag color='blue' key={item}>{specItem[0] && specItem[0].class_name}</Tag>);
            }
        },
        {
            title: '热度',
            dataIndex: 'hot',
            key: 'hot',
        },
        {
            title: '权重',
            dataIndex: 'weight',
            key: 'weight',
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


    function getData() {
        const {pageSize, pageIndex} = recordConfig;
        getMerchant({pageSize, pageIndex}).then(r => {
            if (r.status === 200) {
                setTotal(r.total);
                setData(r.data)
            }
        })
    }

    function onchange(pageIndex, pageSize) {
        setRecordConfig(prevState => ({
            ...prevState,
            pageIndex,
            pageSize
        }))
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
        getData();
        getClassItem();
        getTagItem();
    }, [])

    function onChange(isVisible) {
        setVisible(isVisible)
        setEditRow(undefined);
        if(!isVisible){
            getData();
        }
    }


    function onEdit(record) {
        setVisible(true);
        setEditRow(record)
    }

    function onSearch(name, event) {
        if (name !== '') {
            findMerchantByName({name}).then(resp => {
                setData(resp.data);
                setTotal(resp.total);
            })
        } else {
            getData()
            message.info('已更新');
        }
    }

    return (
        <div className='wrap'>
            <div className="top-box">
                <Button type="primary" style={{marginBottom: '20px'}} onClick={() => onChange(true)}>
                    <PlusOutlined/> New Item
                </Button>

                <Search placeholder="input search text" style={{width: '200px'}} onSearch={onSearch} enterButton/>
            </div>

            <Table dataSource={data} columns={columns} pagination={{
                position: 'bottomRight',
                total,
                pageSize: recordConfig.pageSize,
                onChange: (current, size) => onchange(current, size)
            }}/>
            <AddMerchant editRow={editRow} visible={visible} toggleVisible={onChange}/>
        </div>
    )
}
