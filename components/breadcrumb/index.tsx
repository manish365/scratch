import Link from "next/link";
const Breadcrumb = (props: { mainPath?: string; pName: string }) => (
  <section className="breadcrumb">
    <div className="container">
      <ul className="breadcrumb-list">
        <li>
          <Link href="#">
            <i className="icon-home"></i>
          </Link>
        </li>
        <li>{props.mainPath || 'All Products'}</li>
        <li>{props.pName}</li>
      </ul>
    </div>
  </section>
);

export default Breadcrumb
