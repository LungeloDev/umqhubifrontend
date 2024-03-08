import { BsChevronDown } from 'react-icons/bs';
import { Dropdown, Space, Menu } from 'antd';
import React from "react";


const Dropdowns = ({ name, items, icon = true, placement = "" }) => (

    <Dropdown
        overlayClassName="h-10"
        overlay={items}
        placement={placement}
    >
        <a onClick={(e) => e.preventDefault()}>
            <Space
                className='cursor-pointer md:mr-[16px] xl:mr-10 text-base lg:text-base text-twContent font-medium hover:text-twSecondary-shade800'>
                {name}
                {icon && <BsChevronDown />}
            </Space>
        </a>
    </Dropdown>
);
export default Dropdowns;