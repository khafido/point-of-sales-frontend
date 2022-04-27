import HeadPage from './HeadPage'
import GeneralLayout from './GeneralLayout'
import { Footer } from 'antd/lib/layout/layout'
import SideMenu from './SideMenu'

export default function Layout({ children }) {
    return (
        <>
            <HeadPage />
            <GeneralLayout content={children} />
            <Footer style={{ textAlign: 'center' }}>HIPPOS ©2022 Created by CDC - Team 3</Footer>
        </>
    )
}