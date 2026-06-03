const Joi = require('joi');

// Valid complaint statuses
const VALID_STATUSES = ['pending', 'assigned', 'in_progress', 'resolved', 'rejected'];

// Complaint creation validation
exports.createComplaintSchema = Joi.object({
  title: Joi.string()
    .required()
    .trim()
    .min(5)
    .max(200)
    .messages({
      'string.empty': 'Title is required',
      'string.min': 'Title must be at least 5 characters',
      'string.max': 'Title must not exceed 200 characters'
    }),
  
  description: Joi.string()
    .optional()
    .trim()
    .max(2000)
    .messages({
      'string.max': 'Description must not exceed 2000 characters'
    }),
  
  category: Joi.string()
    .required()
    .trim()
    .min(2)
    .max(50)
    .messages({
      'string.empty': 'Category is required',
      'string.min': 'Category must be at least 2 characters'
    }),
  
  location: Joi.object({
    latitude: Joi.number().required().min(-90).max(90),
    longitude: Joi.number().required().min(-180).max(180),
    address: Joi.string().max(255)
  }).optional(),
  
  images: Joi.array()
    .items(Joi.string().uri())
    .optional()
    .max(10)
    .messages({
      'array.max': 'Maximum 10 images allowed'
    })
});

// Complaint status update validation
exports.updateStatusSchema = Joi.object({
  status: Joi.string()
    .required()
    .valid(...VALID_STATUSES)
    .messages({
      'any.only': `Status must be one of: ${VALID_STATUSES.join(', ')}`
    }),
  
  remarks: Joi.string()
    .optional()
    .trim()
    .max(1000)
    .messages({
      'string.max': 'Remarks must not exceed 1000 characters'
    })
}).unknown(true);

// Complaint assignment validation
exports.assignComplaintSchema = Joi.object({
  departmentId: Joi.string()
    .optional()
    .trim()
    .pattern(/^[a-f\d]{24}$/)
    .messages({
      'string.pattern.base': 'Invalid department ID format'
    }),
  
  officerId: Joi.string()
    .optional()
    .trim()
    .pattern(/^[a-f\d]{24}$/)
    .messages({
      'string.pattern.base': 'Invalid officer ID format'
    })
}).unknown(true);

// Validation middleware
exports.validate = (schema) => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req.body, {
      abortEarly: false,
      stripUnknown: true
    });
    
    if (error) {
      const messages = error.details.map(detail => detail.message);
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: messages
      });
    }
    
    // Replace req.body with validated value
    req.body = value;
    next();
  };
};
