import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useState, useEffect } from "react";
// import { FaPlayCircle } from "react-icons/fa";

const HomeNewArrivals = (props: any) => {
  const [homeNewArrivalData, setHomeNewArrivalData] = useState<any>(null);
  // const [homeNewArrivalVideoData, setHomeNewArrivalVideoData] = useState<string | null>(null);
  const router = useRouter();
  const onClick = (event: any, link: any) => {
    event.preventDefault();
    if (link) {
      router.push(link);
    } else {
      router.push("/coming-soon");
    }
  };
  useEffect(() => {
    setHomeNewArrivalData(props.newArrivalsData || []);
    // setHomeNewArrivalVideoData(props.newArrivalsVideoData);
  }, [props.newArrivalsData, props.newArrivalsVideoData]);

  return (
    <section className="new-arrivals-section">
      <div className="container-fluid">
        <div className="new-arrival">
          {false && (
            <div className="row new-arrival-head">
              <div className="col-xl-12 col-lg-12 col-md-12 p-0">
                <a
                  href="https://www.youtube.com/channel/UCfPDd31jpQWWyKCgf6WFokg/featured"
                  target="_blank"
                  className="cursor-pointer new-arrivals-big w-full inline-block"
                >
                  <Image
                    src="/images/new-arrival-sm.webp"
                    className="img-fluid w-100"
                    loading="lazy"
                    alt="New Arrivals"
                    title="New Arrivals"
                    height="100"
                    width={"1550"}
                    placeholder="blur"
                    blurDataURL="/images/new-arrival-sm.webp"
                  />
                </a>
              </div>
            </div>
          )}
          <div className="row">
            <div className="col-xl-12 col-lg-12 col-md-12">
              <div className="d-flex w-100">
                {homeNewArrivalData?.map((item: any) => (
                  <a
                    key={item?._id}
                    className="new-arrivals-box cursor-pointer"
                    onClick={(event) => onClick(event, item?.link)}
                  >
                    <img
                      src={item?.url}
                      className="img-fluid"
                      loading="lazy"
                      alt="New Arrivals Flowers"
                      title="New Arrivals Flowers"
                      width="433"
                      height="400"
                    />
                  </a>
                ))}

                <Link
                  className="new-arrivals-box cursor-pointer"
                  href={"/list/premium-flowers"}
                  key={"new-arrival-luxury-flower"}
                >
                  <Image
                    src={
                      "https://qrmy1hdghljc85ym.public.blob.vercel-storage.com/new-arrivals-luxury-flowers-Suz8ucmISLg1PqJb0V3Z9EI4Jks3ID.jpg"
                    }
                    className="img-fluid"
                    loading="lazy"
                    alt="New Arrivals Luxury Flowers"
                    title="New Arrivals Luxury Flowers"
                    width="433"
                    height="400"
                  />
                </Link>
              </div>
            </div>
            {/* <div className="col-xl-4 col-lg-4 col-md-4 pl-lg-0">
                <div className="video-section">
                  <div className="watch-area mobile-view">
                    <h2>
                      Get Your Floral Updates Here <br></br>
                      <a
                        href="https://www.youtube.com/watch?v=Giq7QN4pdOs"
                        target="_blank"
                      >
                        Watch Now{" "}
                        <i>
                          <i>
                            <FaPlayCircle />
                          </i>
                        </i>
                      </a>
                    </h2>
                  </div>
                  <div className="video-col">
                    {homeNewArrivalVideoData && (
                      <Suspense fallback={<p>Loading video...</p>}>
                        <video
                          controls
                          preload="none"
                          aria-label="Video player"
                          poster="/images/video-poster.webp"
                        >
                          <source
                            src={
                              "https://qrmy1hdghljc85ym.public.blob.vercel-storage.com/videoplayback-1ulsZkQbN1QO7uldt1CiJuW1w5DLdB.mp4"
                            }
                            type="video/mp4"
                          />
                          Your browser does not support the video tag.
                        </video>
                      </Suspense>
                    )}
                  </div>
                </div>
              </div> */}
          </div>
        </div>
      </div>
    </section>
  );
};

export { HomeNewArrivals };
