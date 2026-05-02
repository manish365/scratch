import Link from 'next/link';
import React from 'react'

function CartFooter() {
  return (
    <div className="row mt-4 mb-4 justify-between items-center cart-footer">
      <p className="pr-4 text-sm">
        Need Assistance? Call +62 8159005178 or Email us:&nbsp;
        <Link href="mailto:admin@flowerschamp.com" className="text-info">
          admin@flowerschamp.com
        </Link>
        . <Link href={"/cms/faq"}>Frequantly Ask Question</Link>
      </p>
      <div className="flex justify-center items-center">
        <img
          src="https://www.uaeflowers.com/assets/template/templateuae/image/card.png"
          alt="Footer banner"
          style={{ width: "360px" }}
        />
      </div>
    </div>
  );
}

export default CartFooter
