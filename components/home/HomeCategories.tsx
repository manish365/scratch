import { useRouter } from "next/router";
import React, { useState, useEffect } from 'react';

function HomeCategories(props: any) {
  const [homeCategoriesData, setHomeCategoriesData] = useState<any>(null);
  const router = useRouter();
  const onClick = (event: any, link: any) => {
    event.preventDefault();
    if (link) {
      router.push(link);
    } else {
      router.push('/coming-soon'); // Assuming '/coming-soon' is the route for the coming soon page
    }
  }

  useEffect(() => {
    setHomeCategoriesData(props.categoriesData || []);
  }, [props.categoriesData]);

  return (
    <section className="py-16 w-full bg-white">
      <div className="container mx-auto px-4 md:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-5xl font-serif text-charcoal mb-4">Shop by Category</h2>
          <div className="w-16 h-0.5 bg-primary mx-auto"></div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-8">
          {homeCategoriesData?.map((item: any) => (
            <div className="relative group cursor-pointer overflow-hidden bg-beige" key={item?._id} onClick={(event) => onClick(event, item?.link)}>
              <div className="w-full aspect-square md:aspect-[4/5] overflow-hidden">
                <img
                  className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                  src={item?.url}
                  title={`image-${item?._id}`}
                  alt={`image-${item?._id}`}
                  loading="lazy"
                />
              </div>
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-500"></div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default HomeCategories;
