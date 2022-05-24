import Layout from '@components/Layout'
import StoreDetail from '@components/StoreDetail/StoreDetail'

const { useRouter } = require('next/router')

const Detail = () => {
	const router = useRouter()
	const { storeId } = router.query

	return (
		<Layout title={'Detail'}>
			<StoreDetail storeId={storeId}></StoreDetail>
		</Layout>
	)
}

export default Detail
