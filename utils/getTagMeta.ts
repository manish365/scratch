export const getMetaForProductCategory = (id: string) => {
  let title: string = "";
  let description: string = "";
  let keywords: string = "";

  const cid = id?.toLocaleLowerCase()?.trim();

  switch (cid) {
    case "chocolates":
      title =
        "Send Chocolates to Indonesia | Online Chocolates Delivery Jakarta, Bali";
      description =
        "Order online chocolates for delivery to Indonesia, Jakarta, Bali with FlowersChamp. Delightful and delectable chocolates delivered swiftly to your loved ones.";
      keywords =
        "chocolates, chocolates delivery, ferrero rocher, cadbury dairy milk, kit kat, lindt hampers, lindt lindor milk";
      break;

    case "teddy%20bears":
    case "teddy bears":
    case "teddy-bears":
      title =
        "Send Teddy Bears to Indonesia | Online Teddy Delivery Jakarta, Bali";
      description =
        "Send teddy bears to Indonesia with online delivery options to Jakarta and Bali. Beautifully crafted teddies delivered to your loved ones.";
      keywords = "teddy bears, online teddy delivery";
      break;

    case "fruit%20hamper":
    case "fruit hamper":
    case "fruit-hamper":
      title =
        "Fruit Basket Delivery to Indonesia | Send Order Online Fruit Basket";
      description =
        "Send fruit baskets to Indonesia, Jakarta & Bali with online ordering. Fresh, assorted fruit delivered directly to your loved ones for any occasion.";
      keywords =
        "fruit basket, send fruit baskets to indonesia, assorted fruit delivered";
      break;

    case "plants":
    case "plant":
      title =
        "Send Home Decor Plants to Indonesia | Online Delivery Lucky Bamboo Plants";
      description =
        "Send home decor plants to Indonesia, including Jakarta and Bali, with online delivery. Choose lucky bamboo plants for a stylish touch.";
      keywords =
        "home decor plants, lucky bamboo plants, online plants delivery to indonesia";
      break;

    case "flowers":
      title = "Send Flowers to Indonesia | Online Flowers Delivery ";
      description =
        "Send stunning flowers to Indonesia with our reliable online delivery service. We offer beautiful arrangements for every occasion, delivering to Jakarta and Bali. Order your flowers today!";
      keywords =
        "flowers, Send fresh flowers, same-day delivery, flowers bouquet, flowers indonesia";
      break;

    case "cake":
      title =
        "Online Cake Delivery in Indonesia | Send Cakes to Indonesia Same-Day Jakarta, Bali";
      description =
        "Enjoy same-day online cake delivery in Indonesia with FlowersChamp. Fresh, delicious cakes delivered promptly to celebrate your special moments.";
      keywords = "cake, cake delivery, fresh cake, delicious cakes";
      break;

    default:
      title =
        "Send Flowers to Indonesia | Online Flower Delivery Jakarta, Bali";
      description =
        "Order online Flowers for delivery to Indonesia, Jakarta, Bali with FlowersChamp. Delightful and delectable Flowers delivered swiftly to your loved ones.";
      keywords =
        "flowers indonesia, flower delivery in indonesia, florist in indonesia";
      break;
  }

  return {
    title,
    description,
    keywords,
  };
};

export const getMetaForProductTag = (id: string) => {
  let title: string = "";
  let description: string = "";
  let keywords: string = "";

  const cid = id?.toLocaleLowerCase()?.trim();

  switch (cid) {
    case "plants":
      title =
        "Send Home Decor Plants to Indonesia | Online Delivery Lucky Bamboo Plants";
      description =
        "Send home decor plants to Indonesia, including Jakarta and Bali, with online delivery. Choose lucky bamboo plants for a stylish touch.";
      keywords =
        "home decor plants, lucky bamboo plants, online plants delivery to indonesia";
      break;

    case "hand bouquet":
    case "hand%20bouquet":
    case "hand-bouquet":
      title = "Hand-Tied Bouquet Delivery to Indonesia";
      description =
        "Send a beautiful hand-tied bouquet to Indonesia with our reliable delivery service. Perfect for any occasion, our fresh flowers will brighten anyone's day. Order today!";
      keywords =
        "hand tied bouquet, fresh flowers, same-day delivery, flowers bouquet, flowers indonesia";
      break;

    case "flower boxes":
    case "flower%20boxes":
    case "flower-boxes":
      title =
        "Send Flowers Boxes in Indonesia | Flower Boxes Delivery Online Jakarta and Bali";
      description =
        "Send beautiful flower boxes to Indonesia with our online delivery service. Perfect for any occasion, our fresh blooms arrive elegantly packaged. Order your floral box today!";
      keywords = "flower boxes, Send beautiful flower box, floral box";
      break;

    case "flowers in basket":
    case "flowers%20in%20basket":
    case "flowers-in-basket":
      title = "Send Flowers in a Basket Online Delivery to Indonesia";
      description =
        "Send flowers in a basket with our online delivery service to Indonesia, including Jakarta and Bali. Perfect for any occasion. Order your basket today!";
      keywords = "flowers in a basket, floral basket";
      break;

    case "same-day-delivery":
    case "same day delivery":
      title = "Order Roses Online in Indonesia | Same Day Roses Delivery";
      description =
        "Order roses online in Indonesia with our same-day delivery service. Fresh, stunning roses for any occasion. Surprise someone special today with our quick delivery to Jakarta and Bali!";
      keywords =
        "roses, online order roses, fresh roses, stunning roses, roses delivery indonesia";
      break;

    case "birthday":
      title =
        "Same-Day Birthday Gifts & Cakes Delivery to Indonesia | Send Birthday Flowers Online";
      description =
        "Same-day delivery of birthday gifts and cakes to Indonesia, Jakarta & Bali. Order birthday flowers online for your loved ones and make their day special.";
      keywords = "birthday gifts, cakes, birthday cakes, flowers, bouquet";
      break;

    case "anniversary":
      title =
        "Send Anniversary Flowers to Indonesia | Same Day Flower Bouquet Delivery";
      description =
        "Send anniversary flowers to Indonesia with same-day delivery jakarta & bali. Order a beautiful flower bouquet online and surprise your loved ones on their special day.";
      keywords =
        "anniversary flowers iIndonesia, same-day flowers delivery, flower bouquet online";
      break;

    case "wedding":
      title =
        "Send Wedding Flowers to Indonesia | Wedding Flower Delivery Same Day";
      description =
        "Send wedding flowers to Indonesia with same-day delivery. Order online for a beautiful wedding flower arrangement to celebrate the special occasion.";
      keywords = "wedding flower, wedding bouquet, same-day flowers delivery";
      break;

    case "new baby":
    case "new%20baby":
    case "new-baby":
      title =
        "New Born Gifts Delivery to Indonesia | Online Order New Baby Born Gifts";
      description =
        "Celebrate the arrival of a new baby with same-day delivery of gifts to Indonesia. Choose from a variety of thoughtful presents and send your best wishes to the happy family.";
      keywords =
        "baby born gifts, new born gifts, same day delivery, wishes, celebrate";
      break;

    case "love":
      title =
        "Send Love Flowers Delivery to Indonesia | Online Order Love Flower";
      description =
        "Send love flowers to Indonesia with same-day delivery. Order stunning love flowers and rosed bouquet online to show your affection and brighten your loved one's day.";
      keywords =
        "romance flowers, love, flowers online, send love flowers, rose";
      break;

    case "love%20&%20romance":
    case "love & romance":
    case "love and romance":
    case "love-&-romance":
    case "love-and-romance":
      title =
        "Send Romance Flowers to Indonesia | Online Delivery Romance Flower";
      description =
        "Send romance flowers, roses to Indonesia with online delivery. Order beautiful romance flowers to express your love and make your special someone's day even more memorable.";
      keywords =
        "romance flowers, romance roses bouquet, send flowers indonesia";
      break;

    case "sympathy":
      title =
        "Sympathy Flowers Delivery to Indonesia | Send Sympathy Flower Bouquet";
      description =
        "Send sympathy flowers to Indonesia with same-day delivery. Order a sympathy flower bouquet online to offer your condolences and support during difficult times.";
      keywords = "sympathy flowers, same-day delivery, sympathy bouquet online";
      break;

    case "funeral":
      title = "Funeral Flowers Delivery Indonesia | Send Funeral Flowers";
      description =
        "Order funeral flowers online for delivery to Indonesia. Send a thoughtful funeral arrangement to express your condolences and support during this difficult time.";
      keywords =
        "funeral flowers, Order funeral flower, funeral flower bouquet";
      break;

    case "thank%20you":
    case "thank you":
    case "thank-you":
      title = "Send Thank You Flowers Indonesia | Say Thank You";
      description =
        "Send thank you flowers to Indonesia with online ordering. Choose a beautiful bouquet to express your gratitude and make a lasting impression on someone special.";
      keywords = "say thank you, thank you flowers";
      break;

    case "get%20well%20soon":
    case "get well soon":
    case "get-well-soon":
      title =
        "Get Well Soon Flowers | Get Well Soon Flowers Online in Indonesia";
      description =
        "Send/ order get well soon flowers online to Indonesia. Choose a vibrant bouquet to brighten someone's day and offer your warm wishes for a speedy recovery.";
      keywords = "get well soon flowers, bouquet, wishes";
      break;

    case "i%20am%20sorry":
    case "i am sorry":
    case "i-am-sorry":
    case "sorry":
    case "apologies":
      title =
        "Say I am Sorry | Online Sorry Flower Delivery Indonesia | Condolence Flower Arrangements";
      description =
        'Say "I\'m sorry" with online flower delivery to Indonesia. Choose a thoughtful bouquet to express your apologies and show you care during challenging times.';
      keywords =
        "condolence, i am sorry, apologies flower, sorry flower delivery";
      break;

    case "combo":
      title =
        "Send Flower Combos in Indonesia | Order Flowers, Cakes Teddy, Chocolate Combos";
      description =
        "Send flower combos to Indonesia with online ordering. Choose from flowers, cakes, teddy bears, and chocolate combos to create a delightful gift package for any occasion.";
      keywords = "flower combos, combos online order, combos delivery";
      break;

    case "special%20deals":
    case "special deals":
    case "special-deals":
      title =
        "Order Flowers Online on Discount |  Flower Delivery in Indonesia";
      description =
        "Enjoy special offers on flowers with online discounts. Experience convenient flower delivery in Indonesia and surprise your loved ones with beautiful arrangements.";
      keywords =
        "special deals, special offers, flowers, roses, cakes, teddy, gifts";
      break;

    case "premium%20cake":
    case "premium cake":
    case "premium-cake":
      title =
        "Premium Cake Delivery Indonesia | Send Premium Birthday & Anniversary Cakes";
      description =
        "Send premium cakes to Indonesia with online ordering. Choose from a selection of premium birthday and anniversary cakes for a special celebration.";
      keywords = "premium cake, cake delivery, fresh cake, delicious cakes";
      break;

    case "flowers%20and%20cake":
    case "flowers and cake":
    case "flowers-and-cake":
      title =
        "Send Flowers & Cakes Combos in Indonesia | Same Day Delivery Flower & Cakes Combos";
      description =
        "Send flowers and cakes combos in Indonesia with same-day delivery. Perfect for any occasion, our beautiful flower arrangements and delicious cakes will brighten anyone's day!";
      keywords = "flowers and cakes combos, flowers combos, cakes combos";
      break;

    case "flowers%20and%20cake%20and%20chocolate":
    case "flowers and cake and chocolate":
    case "flowers-and-cake-and-chocolate":
      title = "Send Flowers, Cakes & Chocolate Combos in Indonesia Same Day";
      description =
        "Send order flowers, cakes, and chocolate combos in Indonesia with same-day delivery. Delight your loved ones with our beautiful arrangements and delicious treats today!";
      keywords = "flowers combos, cakes combos, chocolate combos, gifts";
      break;

    case "flowers&cake&balloons":
    case "flowers-cake-balloons":
      title = "Send Flowers, Cakes & Balloons Combos in Indonesia Same Day";
      description =
        "Send flowers, cakes, and balloons combos in Indonesia with same-day delivery. Perfect for celebrating any occasion with joy and delight!";
      keywords = "flowers, cakes & balloons combos";
      break;

    case "combo":
      title = "Send Flower Combos in Indonesia | Flowers, Cakes Combo Gifts";
      description =
        "Send flower combos in Indonesia with flowers, cakes, chocolate & teddy. Enjoy same-day delivery of our delightful combo gifts, perfect for any celebration or special occasion.";
      keywords = "combos, flower combos, cakes, chocolate, teddy";
      break;

    case "alcohol":
      title = "Alcohol Gift Delivery to Indonesia | Same-Day Delivery Alcohol";
      description =
        "Send alcohol gift deliveries to Indonesia with same-day delivery. Choose from our premium selection to make any occasion special and memorable.";
      keywords = "alcohol gift, alcohol same-day delivery, premium alcohol";
      break;

    default:
      title =
        "Send Flowers in Indonesia | Flower Delivery Online Jakarta and Bali";
      description =
        "Send beautiful flowers to Indonesia with our online delivery service. Perfect for any occasion, our fresh blooms arrive elegantly packaged. Order your floral box today!";
      keywords = "flowers, flower boxes, Send beautiful flowers, Indonesia";
      break;
  }

  return {
    title,
    description,
    keywords,
  };
};
