import { MenuDataType } from "../store/reducers/menu";

export const getSelectedMenuID = (menuData: MenuDataType[], route: any): [string, string] => {
  let _route = route?.trim();
  let selectedMenuID = "";
  let selectedSubMenuID = "";
  menuData?.forEach((m) => {
    // console.log("[product helper] checking menu ", m, _route);
    if (m.link.trim() === _route) {
      // console.log("[product helper] match found parent >>", m.link);
      selectedMenuID = m._id;
    } else {
      // console.log("[product helper] child categories >>", m.categories);
      const selectedMenu = m.categories.filter((sub) => sub.link === _route);
      // console.log("[product helper] selectedMenu >>", selectedMenu);
      if (selectedMenu.length) {
        // console.log("----------------- [product helper] match found >>", selectedMenu[0]);
        selectedMenuID = m._id;
        selectedSubMenuID = selectedMenu[0]._id;
      }
    }
  });
  return [selectedMenuID, selectedSubMenuID];
};

export const getCDNURL = (s3URL: string) => {
  const bucketURL =
    process.env.NEXT_PUBLIC_S3_BUCKET_URL ||
    "https://flowerschap-prod.s3.ap-southeast-1.amazonaws.com";
  const cdnURL =
    process.env.NEXT_PUBLIC_CDN_URL || "https://d31cdzcoulfas9.cloudfront.net";
  if (!s3URL) {
    return "https://placehold.co/305x305/c4c7cd/0b111e?text=FlowersChamp.com&font=Playfair%20Display";
  }
  return s3URL.replace(bucketURL, cdnURL)
}
