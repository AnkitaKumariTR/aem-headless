import Head from 'next/head';
import Layout from "../../components/layout";
import {
    ResponsiveGrid,
    fetchModel,
} from '@adobe/aem-react-editable-components';
import getPages from '../../lib/getPages';
import { PrintStoreClient } from '../../lib/printstore';

const { NEXT_PUBLIC_AEM_HOST, NEXT_PUBLIC_AEM_ROOT } = process.env;


export default function ProductDetails({ model, pagePath, pages, products }) {
    return (
        <Layout pages={pages}>
            <Head>
                <title>Product Detail Page</title>
            </Head>
            <section>
                <div className="px-2 py-4 mx-auto max-w-7xl sm:px-6 lg:px-8 sm:py-2 lg:py-6">
                    <ResponsiveGrid
                        key={pagePath}
                        model={model}
                        pagePath={pagePath}
                        itemPath="root/responsivegrid"
                    />
                </div>
                <div>
                    <ul>
                        {
                            products.map(pro => {
                                return (<li key={pro.title}>{pro.title}</li>)
                            })
                        }
                    </ul>
                </div>
            </section>
        </Layout>
    )
}

export async function getServerSideProps(context) {
    const pagePath = `/content/global-print-store/us/en/${context.query.page?.join('/') || 'product-details'
        }`;

    const client = PrintStoreClient.fromEnv();
    const products = await client.getProductsData();

    const pages = await getPages(NEXT_PUBLIC_AEM_ROOT);
    const model = await fetchModel({
        pagePath,
        itemPath: 'root/responsivegrid',
        host: NEXT_PUBLIC_AEM_HOST,
        options: {
            headers: {
                Authorization: 'Basic YWRtaW46YWRtaW4=',
            },
        },
    });
    return {
        props: {
            model,
            pagePath,
            pages,
            products
        },
    };
}
