import Layout from '@components/Layout'
import StoreDetail from '@components/StoreDetail/StoreDetail'
import { useEffect, useState } from 'react'
import * as api from 'api/Store'
import { message } from 'antd'
const { useRouter } = require('next/router')

const Detail = () => {
	const router = useRouter()
	const { storeId } = router.query
	const [store, setStore] = useState(null)
	const [employee, setEmployee] = useState(null)
	const [loading, setLoading] = useState({ store: true, employee: true })

	useEffect(() => {
		if (storeId) fetchStore()
	}, [storeId])

	const fetchStore = () => {
		api.getById(storeId)
			.then((res) => {
				if (res) {
					const store = res.data.result
					store.key = res.data.result.id
					store.totalEmployee = null
					store.manager =
						res.data.result.manager.firstName +
						' ' +
						res.data.result.manager.lastName
					setStore([store])
				}
				setLoading({ ...loading, store: false })
			})
			.catch((err) => {
				if (err) {
					console.log(err)
					message.error(err.response.data.message)
				}
				setLoading(false)
			})
	}

	const fetchEmployee = () => {
		api.getEmployeeById(storeId)
			.then((res) => {
				if (res) {
					// const stores = res.data.result.map((val) => {
					// 	return { ...val, key: val.id }
					// })
					// setStoreData(stores)
					// setPage(res.data.result.currentPage + 1)
					// setTotalPage(res.data.result.totalPages * pageSize)
					// console.log('Total page fetched', res.data.result.totalPages)
				}
				setLoading({ ...loading, employee: false })
			})
			.catch((err) => {
				if (err) {
					console.log(err)
					message.error(err.response.data.message)
				}
				setLoading(false)
			})
	}

	return (
		<Layout title={'Detail'}>
			<StoreDetail
				store={store}
				employee={employee}
				loading={loading}
			></StoreDetail>
		</Layout>
	)
}

export default Detail
