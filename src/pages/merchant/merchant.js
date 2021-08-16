import './merchant.scss';
import {Button, Table, Tag} from "antd";
import {useEffect, useState} from "react";
import {getClasses, getMerchant, getTags} from "../../api/user";
import AddMerchant from "../../components/addMerchant/addMerchant";
import {PlusOutlined} from "@ant-design/icons";


export default function () {
    const [data, setData] = useState([]);
    const [total, setTotal] = useState(0);
    const [visible, setVisible] = useState(false);

    const [tagItem, setTagItem] = useState([]);
    const [classItem, setClassItem] = useState([]);

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
                let tagArr = tags.split(',');
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
    ];


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

    function onchange(pageIndex, pageSize) {
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
    }

    return (
        <div className='wrap'>
            <Button type="primary" style={{marginBottom: '20px'}} onClick={() => onChange(true)}>
                <PlusOutlined/> New Item
            </Button>

            <Table dataSource={data} columns={columns} pagination={{
                position: 'bottomRight', total, pageSize, onChange: (current, size) => onchange(current, size)
            }}/>
            <AddMerchant visible={visible} toggleVisible={onChange}/>
        </div>
    )
}
