import Head from 'next/head'

export default function HeadPage(props) {
    return (
        <Head>
            <title>HIPPOS { (props.title)?" - "+props.title:"" }</title>
            <meta name="description" content="HIPPOS - CDC Team 3" />
            <link rel="icon" href="/hippo.ico" />
            {/* <link href="https://unpkg.com/tailwindcss@^2/dist/tailwind.min.css" rel="stylesheet" /> */}
        </Head>
    )
}