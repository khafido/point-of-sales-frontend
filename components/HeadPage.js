import Head from 'next/head'

export default function HeadPage(props) {
    return (
        <Head>
            <title>Admin - { (props.title)?props.title:"HIPPOS" }</title>
            <meta name="description" content="HIPPOS - CDC Team 3" />
            <link rel="icon" href="/favicon.ico" />
            <link href="https://unpkg.com/tailwindcss@^2/dist/tailwind.min.css" rel="stylesheet" />
        </Head>
    )
}