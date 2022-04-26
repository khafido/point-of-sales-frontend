import HeadPage from './HeadPage'
import Navbar from './Navbar'
import { Footer } from 'antd/lib/layout/layout'

export default function Layout({ children }) {
    return (
        <>
            <HeadPage />
            <Navbar content={children} />
            <Footer style={{ textAlign: 'center' }}>HIPPOS ©2022 Created by CDC - Team 3</Footer>
        </>
    )
}