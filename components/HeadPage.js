import Head from 'next/head'

export default function HeadPage(props) {
    return (
        <Head>
            <title>Admin - { (props.title)?props.title:"HIPPOS" }</title>
            <meta name="description" content="HIPPOS - CDC Team 3" />
            <link rel="icon" href="/favicon.ico" />
        </Head>
    )
}