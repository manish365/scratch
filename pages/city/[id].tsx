import { useEffect, useState } from "react";

import Layout from "../../layouts/Main";
import Breadcrumb from "../../components/breadcrumb";
import { useRouter } from "next/router";
import { saveState } from '../../utils/localstorage'
import ProductLists from "../../components/product-lists";

const City = () => { 
  const router = useRouter();
  const [city, setCity] = useState<string>(router.query.id as string);

  useEffect(() => {
    setCity(router.query.id as string);
    saveState("selectedCity", router.query.id);
  }, [router])

  return (
    <Layout>
      <Breadcrumb pName={city} />
      {city && <ProductLists city={city} key={city} />}
    </Layout>
  );
}

export default City