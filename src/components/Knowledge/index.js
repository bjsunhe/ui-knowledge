import { Button, Form, Input, Result } from "antd"
import Layout from "../Layout"

const Knowledge=()=>{
    const onFinish = () => {
        console.log('hi')
    }
    return (
        <Layout title="knowledge" subTitle="entry">
            <Form onFinish={onFinish}>
                <Form.Item name="email" label="邮箱">
                    <Input />
                </Form.Item>
                <Form.Item name="password" label="密码">
                    <Input.Password />
                </Form.Item>
                <Form.Item>
                    <Button type="primary" htmlType="submit">
                    登录
                    </Button>
                </Form.Item>
            </Form>

        </Layout>
    )
}

export default Knowledge
