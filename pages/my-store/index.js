import Layout from '@components/Layout'
import StoreDetail from '@components/StoreDetail/StoreDetail'
import jsCookie from 'js-cookie'

const Detail = () => {
	const storeId = jsCookie.get('store_id_manager')
		? jsCookie.get('store_id_manager')
		: jsCookie.get('store_id_employee')

	return (
		storeId && (
			<Layout title={'My Store'}>
				<StoreDetail storeId={storeId}></StoreDetail>
			</Layout>
		)
	)
}

export default Detail
