//Productos
[
  {
    $addFields: {
      sale_date: {
        $dateAdd: {
          startDate: { $toDate: "2024-01-01" },
          unit: "day",
          amount: { $floor: { $multiply: [{ $rand: {} }, 365] } },
        },
      },
      price_value: { $toDouble: "$discounted_price" },
    },
  },

  {
    $match: {
      price_value: { $gt: 0 },
      category: { $ne: null },
    },
  },

  {
    $project: {
      main_category: {
        $arrayElemAt: [{ $split: ["$category", "|"] }, 0],
      },
      sale_month: { $month: "$sale_date" },
      sale_year: { $year: "$sale_date" },
      price: "$price_value",
    },
  },

  {
    $group: {
      _id: {
        category: "$main_category",
        month: "$sale_month",
      },
      total_sales: { $sum: "$price" },
      total_items: { $count: {} },
    },
  },


  {
    $sort: {
      "_id.category": 1,
      "_id.month": 1,
    },
  },
];

[
  {
    $addFields: {
      cleaned_rating: {
        $toDouble: "$rating",
      },
      cleaned_count: {
        $toInt: {
          $replaceAll: {
            input: { $toString: "$rating_count" },
            find: ",",
            replacement: "",
          },
        },
      },
    },
  },
  {
    $match: {
      cleaned_count: { $gt: 50 },
      cleaned_rating: { $ne: null },
    },
  },
  {
    $sort: {
      cleaned_rating: -1,
      cleaned_count: -1,
    },
  },
  {
    $limit: 20,
  },
  {
    $project: {
      _id: 0,
      Producto: "$product_name",
      Categoria: "$category",
      Puntaje: "$cleaned_rating",
      Total_Reseñas: "$cleaned_count",
      Precio: "$discounted_price",
    },
  },
];

[

  {
    $addFields: {
      cleaned_rating: {
        $toDouble: "$rating"
      },
      cleaned_count: {
        $toInt: {
          $replaceAll: {
            input: { $toString: "$rating_count" },
            find: ",",
            replacement: ""
          }
        }
      }
    }
  },

  {
    $match: {
      cleaned_rating: { $lt: 3.0 },
      cleaned_count: { $gt: 100 }
    }
  },

  {
    $sort: {
      cleaned_rating: 1, /
      cleaned_count: -1
    }
  },

  {
    $project: {
      _id: 0,
      Producto: "$product_name",
      Categoria: "$category",
      Puntaje_Promedio: "$cleaned_rating",
      Total_Reseñas: "$cleaned_count",
      Descripcion_Corta: { $substrCP: ["$about_product", 0, 100] }
    }
  }
]

[

  {
    $addFields: {
      price_numeric: {
        $toDouble: {
          $trim: {
            input: {
              $replaceAll: {
                input: { $toString: "$discounted_price" },
                find: ",",
                replacement: ""
              }
            }
          }
        }
      }
    }
  },


  {
    $match: {
      price_numeric: { $gt: 0 }
    }
  },

  {
    $bucket: {
      groupBy: "$price_numeric",
      boundaries: [0, 1000, 5000],
      default: "Alto (> 5000)",
      output: {

        total_products: { $sum: 1 },
        avg_rating: { $avg: { $toDouble: "$rating" } },

        examples: { $push: "$product_name" }
      }
    }
  },

  {
    $project: {
      _id: 0,
      Rango_Precio: {
        $switch: {
          branches: [
            { case: { $eq: ["$_id", 0] }, then: "Bajo (< 1000)" },
            { case: { $eq: ["$_id", 1000] }, then: "Medio (1000 - 5000)" },
            { case: { $eq: ["$_id", "Alto (> 5000)"] }, then: "Alto (> 5000)" }
          ],
          default: "Desconocido"
        }
      },
      Cantidad: "$total_products",
      Rating_Promedio: { $round: ["$avg_rating", 2] },
      Ejemplos: { $slice: ["$examples", 3] }
    }
  },

  {
    $sort: { Cantidad: -1 }
  }
]

[
  {
    $addFields: {
      cleaned_rating: {
        $toDouble: "$rating"
      },
      cleaned_count: {
        $toInt: {
          $replaceAll: {
            input: { $toString: "$rating_count" },
            find: ",",
            replacement: ""
          }
        }
      }
    }
  },

  {
    $match: {
      cleaned_rating: { $gte: 4.8 },
      cleaned_rating: { $lte: 5.0 },
      cleaned_count: { $lt: 10 }
    }
  },

  {
    $sort: {
      cleaned_count: 1,
      cleaned_rating: -1
    }
  },

  {
    $project: {
      _id: 0,
      Producto: "$product_name",
      Categoria: "$category",
      Puntaje: "$cleaned_rating",
      Total_Reseñas: "$cleaned_count",
      Precio_Descontado: "$discounted_price"
    }
  }
]
