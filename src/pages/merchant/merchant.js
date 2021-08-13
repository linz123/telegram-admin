import './merchant.scss';
import {Button, Table} from "antd";
import {useEffect, useState} from "react";
import {getMerchant} from "../../api/user";
import AddMerchant from "../../components/addMerchant/addMerchant";
import {PlusOutlined} from "@ant-design/icons";


export default function () {

    const columns = [
        {
            title: 'Id',
            dataIndex: 'Id',
        },
        {
            title: '名称',
            dataIndex: 'name',
        },
        {
            title: '描述',
            dataIndex: 'describe',
        },
        {
            title: '标签id',
            dataIndex: 'tagIds',
        },
        {
            title: '分类id',
            dataIndex: 'classId',
        },
    ];

    const [data, setData] = useState([]);
    const [total, setTotal] = useState(0);
    const [visible, setVisible] = useState(false);

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

    useEffect(() => {
        console.log('hello');
        getData();
    }, [])

    function onChange(isVisible) {
        console.log('onChange', isVisible)
        setVisible(isVisible)
    }

    return (
        <div className='wrap'>
            <Button type="primary" style={{marginBottom: '20px'}} onClick={() => onChange(true)}>
                <PlusOutlined/> New
            </Button>

            <Table dataSource={data} columns={columns} pagination={{
                position: 'bottomRight', total, pageSize, onChange: (current, size) => onchange(current, size)
            }}/>
            <AddMerchant visible={visible} toggleVisible={onChange}/>
        </div>
    )
}
