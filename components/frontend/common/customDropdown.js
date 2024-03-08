import { PlusOutlined } from '@ant-design/icons';
import { Button, Divider, Input, Select, Space } from 'antd';
import { useRef, useState } from 'react';

let index = 0;
const CustomDropdown = ({ gateways }) => {
    const [items, setItems] = useState(gateways);
    const [name, setName] = useState('');
    const inputRef = useRef(null);
    const onNameChange = (event) => {
        setName(event.target.value);
    };
    const addItem = (e) => {
        e.preventDefault();
        setItems([...items, name || `New item ${index++}`]);
        setName('');
        setTimeout(() => {
            inputRef.current?.focus();
        }, 0);
    };

    return (
        <Select
            style={{
                width: 300,
            }}
            placeholder="Payment Method"
            dropdownRender={(menu) => (
                <>
                    {menu}
                    <Divider
                        style={{
                            margin: '8px 0',
                        }}
                    />
                    <Space
                        style={{
                            padding: '0 8px 4px',
                        }}
                    >
                        <Input
                            placeholder="Please enter item"
                            ref={inputRef}
                            value={name}
                            onChange={onNameChange}
                        />
                        <Button type="text" icon={<PlusOutlined />} onClick={addItem}>
                            Add item
                        </Button>
                    </Space>
                </>
            )}
            options={items.map((item) => ({
                label: item,
                value: item,
            }))}
        />
    );
};
export default CustomDropdown;