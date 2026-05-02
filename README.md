# Updates!

This new version contains an integration with redux-toolkit instead of redux and it's witch Typescript :)

# Next.js Ecommerce

This repo contains a work in progress Ecommerce responsive made with Next.js, Redux, Redux-persist, Hooks, SCSS and BEM. If you like it please give it a star :)

## Available pages

Route (pages)                              Size     First Load JS
┌ ○ /                                      1.09 kB         246 kB
├   /_app                                  0 B             134 kB
├ ○ /404                                   692 B           231 kB
├ λ /api/auth/[...nextauth]                0 B             134 kB
├ λ /api/login                             0 B             134 kB
├ ○ /auth/change-password                  2.53 kB         175 kB
├ ○ /auth/forgot-password                  1.72 kB         234 kB
├ ○ /auth/login                            2.38 kB         235 kB
├ ○ /auth/register                         2.53 kB         235 kB
├ ○ /cart/direct-payment                   8.68 kB         241 kB
├ ○ /cart/payment-failure                  905 B           233 kB
├ ○ /cart/payment-success                  926 B           233 kB
├ ○ /cart/summary                          1.32 kB         234 kB
├ ○ /cart/western-union                    1.36 kB         234 kB
├ ○ /city/[id]                             4.29 kB         237 kB
├ ○ /cms/[page]                            944 B           233 kB
├ λ /cms/faq                               566 B           233 kB
├ ○ /coming-soon                           474 B           136 kB
├ ○ /custom-roses                          3.21 kB         235 kB
├ ○ /customer-review                       867 B           233 kB
├ ○ /dashboard                             3.31 kB         202 kB
├ ○ /delivery-cities                       1.25 kB         233 kB
├ ○ /florist-login                         2.85 kB         235 kB
├ ○ /international-delivery                485 B           136 kB
├ ○ /list/category/[id]                    1.82 kB         254 kB
├ λ /list/flowers-indonesia                1.91 kB         242 kB
├ ○ /list/offers                           1.82 kB         254 kB
├ ○ /list/premium-flowers                  1.84 kB         254 kB
├ ○ /list/price/[id]                       2.06 kB         255 kB
├ ○ /list/search                           4.8 kB          237 kB
├ ○ /list/tag/[id]                         1.82 kB         254 kB
├ ○ /order-review                          6.01 kB         238 kB
├ ○ /order-tracking                        2.05 kB         234 kB
├ ○ /products/[id]                         4.67 kB         256 kB
├ λ /products/details/[id]                 4.65 kB         256 kB
├ ○ /profile/address-book                  2.13 kB         198 kB
├ ○ /profile/edit-user-profile             4.58 kB         177 kB
├ ○ /profile/order-history                 2.08 kB         195 kB
├ ○ /profile/orders                        2.22 kB         195 kB
└ ○ /profile/view-user-profile             3.28 kB         169 kB
+ First Load JS shared by all              153 kB
  ├ chunks/framework-d51ece3d757c7ed2.js   45.3 kB
  ├ chunks/main-b2f5161206003379.js        31.9 kB
  ├ chunks/pages/_app-a3f08bd426ba1e03.js  55.6 kB
  ├ chunks/webpack-a146a8ef8f1e9d05.js     891 B
  └ css/64e404626df22f07.css               19.3 kB

λ  (Server)  server-side renders at runtime (uses getInitialProps or getServerSideProps)
○  (Static)  automatically rendered as static HTML (uses no initial props)

npm install --legacy-peer-deps
