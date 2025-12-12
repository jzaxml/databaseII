{
  "$jsonSchema": {
    "bsonType": "object",
    "title": "Validación de Productos GlobalMarket",
    "required": [
      "product_name",
      "discounted_price",
      "actual_price",
      "category"
    ],
    "properties": {
      "product_name": {
        "bsonType": "string",
        "description": "El nombre es obligatorio y debe ser texto"
      },
      "discounted_price": {
        "bsonType": ["double", "int", "decimal"],
        "minimum": 0,
        "description": "El precio con descuento debe ser un número positivo (>= 0)"
      },
      "actual_price": {
        "bsonType": ["double", "int", "decimal"],
        "minimum": 0,
        "description": "El precio real debe ser un número positivo (>= 0)"
      },
      "discount_percentage": {
        "bsonType": ["double", "int", "decimal" , "string"],
        "minimum": 0,
        "maximum": 100,
        "description": "El porcentaje de descuento debe estar entre 0 y 100"
      },
      "rating": {
        "bsonType": ["double", "int", "decimal"],
        "minimum": 0,
        "maximum": 5,
        "description": "El rating debe ser un número entre 0 y 5"
      },
      "rating_count": {
        "bsonType": ["int", "double", "long"],
        "minimum": 0,
        "description": "La cantidad de votos no puede ser negativa"
      },
      "reviews": {
        "bsonType": "array",
        "description": "Lista de reseñas embebidas según el diagrama",
        "items": {
          "bsonType": "object",
          "required": ["review_content", "user_id"],
          "properties": {
            "review_id": { "bsonType": "string" },
            "review_content": { "bsonType": "string" },
            "user_id": { "bsonType": "string" },
            "user_name": { "bsonType": "string" }
          }
        }
      }
    }
  }
}

{
  "$jsonSchema": {
    "bsonType": "object",
    "title": "Validación Estricta de Productos y Reseñas",
    "required": ["product_name", "discounted_price", "category"],
    "properties": {
      "product_name": { "bsonType": "string" },
      "discounted_price": { "bsonType": ["double", "int", "decimal"], "minimum": 0 },
      "category": { "bsonType": "string" },

      "reviews": {
        "bsonType": "array",
        "description": "Lista de reseñas embebidas",
        "items": {
          "bsonType": "object",
          "required": ["user_id", "user_name", "review_content", "review_title"],
          "properties": {
            "user_id": {
              "bsonType": "string",
              "minLength": 1,
              "description": "El ID del usuario es obligatorio y no puede estar vacío"
            },
            "user_name": {
              "bsonType": "string",
              "minLength": 1,
              "description": "El nombre del usuario es obligatorio y no puede estar vacío"
            },
            "review_content": {
              "bsonType": "string",
              "minLength": 10,
              "description": "El contenido debe tener al menos 10 caracteres"
            },
            "review_title": {
              "bsonType": "string",
              "minLength": 1,
              "description": "El título no puede estar vacío"
            }
          }
        }
      }
    }
  }
}
