import HeadPage from './HeadPage'
import GeneralLayout from './GeneralLayout'
import { Footer } from 'antd/lib/layout/layout'

export default function Layout({ children }) {
    return (
        <>
            <HeadPage />
            <GeneralLayout content={children} />
        </>
    )
}