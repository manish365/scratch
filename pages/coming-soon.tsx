import React from 'react'
import NextLink from 'next/link'

function comingSoon() {
  return (
    <section className="container-fluid bg-coming-soon">
      <div className="row">
        <div className="col-xs-12 w-full h-screen relative">
          <div className="flex w-full items-center justify-center mt-0">
            <img
              src="/images/Coming soon copy.jpg"
              alt="Coming Soon Banner"
              className="w-full h-screen"
            />
            <button className="back-to-home-btn">
              <NextLink href={"/"}>Home</NextLink>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

export default comingSoon
