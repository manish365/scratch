// import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

function InternationalDeliverySection() {
  const { websiteMeta } = useSelector((state: any) => state.cms);
  const [country, setCountry] = useState<string>("Indonesia");

  useEffect(() => {
    if (websiteMeta) {
      setCountry(websiteMeta?.payload.basic.assignedCountry);
    }
    return () => {
      setCountry("");
    };
  }, [setCountry]);
  
  return (
    <div className="row">
      <div className="col-xs-12">
        <p className='mx-3'>
          <span style={{fontSize: '16px', fontWeight: '600'}}>{country} </span>
          {/* <span className="text-blue-600">
            <Link href={"/international-delivery"}>Change Location.</Link>
          </span> */}
        </p>
      </div>
    </div>
  );
}

export default InternationalDeliverySection
