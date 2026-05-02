import React from "react";
import Layout from "../layouts/Main";
import { server } from "@utils/server";
import { CMSFAQType } from "~types/General";
import { SingleAccordion } from "@components/shared";

export async function getServerSideProps() {
  const res = await fetch(`${server}/cms-faq`);
  const rawResponse = await res.json();
  const faq: CMSFAQType[] = rawResponse?.results || [];
  return { props: { faq } };
}

function FaqCMS({ faq = [] }: { faq: CMSFAQType[] }) {
  const metaDesc =
    "Find answers to common questions about orders, deliveries, payments, and refunds on FlowersChamp's comprehensive FAQ page.";
  const metaKeywords =
    "FAQs, questions answers, flowers champ, flowers indonesia";

  return (
    <Layout
      title="FAQs | FlowersChamp Indonesia"
      description={metaDesc}
      keywords={metaKeywords}
    >
      <section className="container mt-4">
        <div className="row">
          <div className="col-xs-12 ml-4 text-2xl mb-4">
            Frequently asked questions
          </div>
        </div>
        {faq && (
          <div className="row">
            {faq?.map((f) => (
              <div className="col-lg-4 col-xs-12 mb-4" key={f._id}>
                <SingleAccordion head={f.question} body={f.answer} />
              </div>
            ))}
          </div>
        )}
      </section>
    </Layout>
  );
}

export default FaqCMS;
