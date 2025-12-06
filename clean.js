//Creación de Product
db.raw_import.aggregate([
  {
    $group: {
      _id: "$product_id",
      product_name: { $first: "$product_name" },
      category: { $first: "$category" },
      discounted_price: { $first: "$discounted_price" },
      actual_price: { $first: "$actual_price" },
      discount_percentage: { $first: "$discount_percentage" },
      rating: { $first: "$rating" },
      rating_count: { $first: "$rating_count" },
      about_product: { $first: "$about_product" },
      img_link: { $first: "$img_link" },
      product_link: { $first: "$product_link" },
    },
  },
  { $out: "products" },
]);
//Creación de review y user
db.raw_import.aggregate([
  {
    $project: {
      _id: 0,
      review_id: "$review_id",
      product_id: "$product_id",
      title: "$review_title",
      content: "$review_content",
      user: {
        id: "$user_id",
        name: "$user_name",
      },
    },
  },
  { $out: "reviews" },
]);

db.products.find().forEach(function (doc) {
  // Función auxiliar para limpiar números
  var cleanPrice = function (priceStr) {
    if (!priceStr) return 0;
    var clean = priceStr.toString().replace(/[^0-9.]/g, "");
    return parseFloat(clean);
  };

  var cleanRating = function (ratingStr) {
    if (!ratingStr) return 0;
    return parseFloat(ratingStr);
  };

  db.products.updateOne(
    { _id: doc._id },
    {
      $set: {
        discounted_price: cleanPrice(doc.discounted_price),
        actual_price: cleanPrice(doc.actual_price),
        rating: cleanRating(doc.rating),
        rating_count: cleanPrice(doc.rating_count),
      },
    },
  );
});
