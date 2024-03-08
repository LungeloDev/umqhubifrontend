import React from 'react'
import {Card, CardBody, CardTitle} from "reactstrap"

const MyCard = ({title, rightAction, children, ...props}) => {
    return (
        <Card {...props}>
            <CardBody>
                <CardTitle>
                    <div className="d-flex justify-content-between align-items-center mb-3">
                        <h5>{title}</h5>
                        {rightAction}
                    </div>
                </CardTitle>
                {children}
            </CardBody>
        </Card>
    )
}
export default MyCard
