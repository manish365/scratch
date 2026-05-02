import React, { useState, useEffect } from "react";
import { FaPhoneVolume, FaWhatsapp } from "react-icons/fa";
import { useSelector } from 'react-redux';
import { RootState } from "store";

const Footer = () => {
  const { footerData }: any = useSelector((state: RootState) => state.cms);
  // console.log('footerData in Footer Component===>>>', footerData);
  const { websiteMeta }: any = useSelector((state: RootState) => state.cms);
  // console.log('websiteMeta in Footer Component===>>>', websiteMeta);
  const [footerDetails, setFooterDetails] = useState<any>([]);
  

  useEffect(() => {
    // console.log('footerData===>>>>', footerData);
    if (footerData?.success) {
      setFooterDetails(footerData?.results);
    }
  }, [footerData, websiteMeta]);
  // console.log('footerDetails===>>>', footerDetails);

  return (
    <div className="bg-charcoal text-white/80 font-sans mt-20 pt-16 border-t-[8px] border-primary">
      {/* Newsletter Section */}
      <div className="container mx-auto px-6 lg:px-12 mb-16">
        <div className="max-w-3xl mx-auto text-center border-b border-white/10 pb-16">
          <h2 className="text-3xl font-serif text-white mb-4">Join Our Inner Circle</h2>
          <p className="text-white/60 mb-8 font-light tracking-wide">
            Subscribe to receive exclusive offers, floral styling tips, and early access to new collections.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 max-w-lg mx-auto">
            <input
              type="email"
              placeholder="Enter your email address"
              className="flex-1 bg-transparent border border-white/20 px-6 py-3 text-white placeholder-white/40 focus:outline-none focus:border-primary transition-colors rounded-none"
            />
            <button className="bg-primary text-white font-medium tracking-widest uppercase px-8 py-3 hover:bg-primary/90 transition-colors">
              Subscribe
            </button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 lg:px-12 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 lg:gap-8">
          
          {/* Brand Column */}
          <div className="lg:col-span-2">
            <h3 className="text-2xl font-serif text-white mb-6">FlowersChamp</h3>
            <p className="text-white/60 font-light leading-relaxed mb-8 max-w-sm">
              Curating emotions through exquisite floral artistry. Delivering premium, hand-tied bouquets and luxurious gifts to celebrate life's most precious moments.
            </p>
            <div className="flex items-center gap-6">
              <a href={footerDetails[0]?.links?.fb} target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors opacity-80 hover:opacity-100">
                <img src="/images/icons/facebook-icon.png" alt="Facebook" className="w-6 h-6 object-contain invert opacity-70 hover:opacity-100 transition-opacity" />
              </a>
              <a href={footerDetails[0]?.links?.instagram} target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors opacity-80 hover:opacity-100">
                <img src="/images/icons/insta.png" alt="Instagram" className="w-6 h-6 object-contain invert opacity-70 hover:opacity-100 transition-opacity" />
              </a>
              <a href={footerDetails[0]?.links?.pinterest} target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors opacity-80 hover:opacity-100">
                <img src="/images/icons/pintrest.png" alt="Pinterest" className="w-6 h-6 object-contain invert opacity-70 hover:opacity-100 transition-opacity" />
              </a>
              <a href={footerDetails[0]?.links?.youtube} target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors opacity-80 hover:opacity-100">
                <img src="/images/icons/youtube.png" alt="YouTube" className="w-6 h-6 object-contain invert opacity-70 hover:opacity-100 transition-opacity" />
              </a>
            </div>
            <div className="mt-8 flex gap-4">
              <a href={`tel:${websiteMeta?.payload?.companyDetails?.phno}`} className="flex items-center gap-2 text-sm text-white/70 hover:text-primary transition-colors">
                <FaPhoneVolume /> Call Us
              </a>
              <a href={`https://wa.me/${websiteMeta?.payload?.companyDetails?.phno}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm text-white/70 hover:text-primary transition-colors">
                <FaWhatsapp /> WhatsApp
              </a>
            </div>
          </div>

          {/* Links Column 1 */}
          <div>
            <h4 className="text-sm font-semibold tracking-widest uppercase text-white mb-6">Explore</h4>
            <ul className="space-y-4">
              {footerDetails[0]?.items?.sectionOne?.map((item: any) => (
                <li key={item?._id}>
                  <a href={item?.link} className="text-white/60 hover:text-primary transition-colors font-light text-sm">
                    {item?.title}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Links Column 2 */}
          <div>
            <h4 className="text-sm font-semibold tracking-widest uppercase text-white mb-6">Information</h4>
            <ul className="space-y-4">
              {footerDetails[0]?.items?.sectionTwo?.map((item: any) => (
                <li key={item?._id}>
                  <a href={item?.link} className="text-white/60 hover:text-primary transition-colors font-light text-sm">
                    {item?.title}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Secure Payment Column */}
          <div>
            <h4 className="text-sm font-semibold tracking-widest uppercase text-white mb-6">Secure Payment</h4>
            <div className="bg-white/5 p-4 rounded-sm border border-white/10">
              <img
                src="/images/icons/crd.png"
                alt="Secure Payment Methods"
                className="w-full h-auto object-contain opacity-80"
                loading="lazy"
              />
            </div>
          </div>

        </div>
      </div>

      {/* Copyright */}
      <div className="bg-[#0b111e] py-6 border-t border-white/10 text-center">
        <p className="text-xs text-white/40 tracking-wider font-light">
          {footerDetails[0]?.copright || `© ${new Date().getFullYear()} FlowersChamp. All rights reserved.`}
        </p>
      </div>
    </div>
  );
};

export default Footer;