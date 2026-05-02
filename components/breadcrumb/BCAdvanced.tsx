import React from "react";
import Link from "next/link";
import { BreadCrumbType } from "../../types/General";

export interface PropTypes {
  items: BreadCrumbType[];
}

function BCAdvanced({ items }: PropTypes) {
  return (
    <section className="breadcrumb">
      <div className="container">
        <ul className="breadcrumb-list">
          <li>
            <Link href="/">
              <i className="icon-home"></i>
            </Link>
          </li>
          {items.map((item) => (
            <li key={item.title}>
              <Link href={item.link}>{item.title}</Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

export default BCAdvanced;
