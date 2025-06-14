// const jwt = require('jsonwebtoken');
// const multer = require('multer');
// const fs = require('fs');
// const path = require('path');

// // Ensure the uploads directory exists
// const uploadDir = path.join(__dirname, '../uploads');
// if (!fs.existsSync(uploadDir)) {
//   fs.mkdirSync(uploadDir, { recursive: true });
// }

// // Configure multer storage
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, uploadDir);
//   },
//   filename: (req, file, cb) => {
//     const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
//     const ext = path.extname(file.originalname);
//     cb(null, `${uniqueSuffix}${ext}`);
//   },
// });

// // File filter for images only
// const fileFilter = (req, file, cb) => {
//   const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
//   if (allowedTypes.includes(file.mimetype)) {
//     cb(null, true);
//   } else {
//     cb(new Error('Invalid file type. Only JPEG, PNG, GIF, and WEBP images are allowed.'), false);
//   }
// };

// // Initialize multer instance once
// const multerInstance = multer({
//   storage,
//   limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
//   fileFilter,
// });

// // File upload middleware
// const upload = (options = {}) => (req, res, next) => {
//   const maxCount = options.maxCount || 5;
//   const field = options.field || (options.multiple ? 'images' : 'image');
  
//   const uploadHandler = options.multiple
//     ? multerInstance.array(field, maxCount)
//     : multerInstance.single(field);

//   uploadHandler(req, res, (err) => {
//     if (err instanceof multer.MulterError) {
//       if (err.code === 'LIMIT_UNEXPECTED_FILE') {
//         return res.status(400).json({
//           message: `Too many files uploaded. Maximum allowed is ${maxCount}.`,
//           errorCode: 'TOO_MANY_FILES',
//           timestamp: new Date().toISOString(),
//         });
//       }
//       return res.status(400).json({
//         message: err.message,
//         errorCode: err.code,
//         timestamp: new Date().toISOString(),
//       });
//     } else if (err) {
//       return res.status(400).json({
//         message: err.message,
//         errorCode: 'INVALID_FILE',
//         timestamp: new Date().toISOString(),
//       });
//     }
//     next();
//   });
// };

// // Authentication middleware
// const authMiddleware = async (req, res, next) => {
//   try {
//     // Validate JWT_SECRET
//     if (!process.env.JWT_SECRET) {
//       console.error('JWT_SECRET is not defined in environment variables');
//       return res.status(500).json({
//         message: 'Server configuration error',
//         errorCode: 'CONFIG_ERROR',
//         timestamp: new Date().toISOString(),
//       });
//     }

//     // Parse Authorization header
//     const authHeader = req.headers.authorization;
//     if (!authHeader || !authHeader.startsWith('Bearer ')) {
//       // If no token is provided, proceed without setting req.user
//       return next();
//     }

//     const token = authHeader.split(' ')[1];
//     if (!token) {
//       // If token is empty, proceed without setting req.user
//       return next();
//     }

//     // Verify token
//     const decoded = await jwt.verify(token, process.env.JWT_SECRET);
//     req.user = decoded;
//     console.log(`User authenticated: ${decoded.id}`); // Debug log
//     next();
//   } catch (err) {
//     console.error('Token verification failed:', err.message);
//     if (err.name === 'TokenExpiredError') {
//       return res.status(401).json({
//         message: 'Token has expired.',
//         errorCode: 'TOKEN_EXPIRED',
//         timestamp: new Date().toISOString(),
//       });
//     }
//     res.status(401).json({
//       message: 'Invalid token',
//       errorCode: 'INVALID_TOKEN',
//       timestamp: new Date().toISOString(),
//     });
//   }
// };

// // Role-based access control middleware
// const restrictTo = (...roles) => {
//   return (req, res, next) => {
//     if (!req.user) {
//       return res.status(401).json({
//         message: 'Authentication required',
//         errorCode: 'NOT_AUTHENTICATED',
//         timestamp: new Date().toISOString(),
//       });
//     }

//     if (!req.user.role) {
//       return res.status(403).json({
//         message: 'User role not defined',
//         errorCode: 'ROLE_NOT_DEFINED',
//         timestamp: new Date().toISOString(),
//       });
//     }

//     if (!roles.includes(req.user.role)) {
//       return res.status(403).json({
//         message: `Access denied. Required role(s): ${roles.join(', ')}. Your role: ${req.user.role}`,
//         errorCode: 'ACCESS_DENIED',
//         timestamp: new Date().toISOString(),
//       });
//     }

//     next();
//   };
// };

// module.exports = { authMiddleware, restrictTo, upload };
const jwt = require('jsonwebtoken');
const multer = require('multer');
const fs = require('fs');
const path = require('path');

// Ensure the uploads directory exists
const uploadDir = path.join(__dirname, '../Uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Configure multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    const ext = path.extname(file.originalname);
    cb(null, `${uniqueSuffix}${ext}`);
  },
});

// File filter for images and PDFs
const fileFilter = (req, file, cb) => {
  const allowedTypes = [
    'image/jpeg',
    'image/png',
    'image/gif',
    'image/webp',
    'application/pdf',
  ];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only JPEG, PNG, GIF, WEBP images, and PDF files are allowed.'), false);
  }
};

// Initialize multer instance
const multerInstance = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter,
});

// File upload middleware
const upload = (options = {}) => (req, res, next) => {
  let uploadHandler;

  // If a single field is specified, use .single() for that field
  if (options.field) {
    uploadHandler = multerInstance.single(options.field);
  } else {
    // Otherwise, use fields or default to images array
    const fields = options.fields || [
      { name: 'images', maxCount: 5 },
      { name: 'datasheet', maxCount: 1 },
    ];
    uploadHandler = fields
      ? multerInstance.fields(fields)
      : multerInstance.array('images', 5);
  }

  uploadHandler(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      if (err.code === 'LIMIT_UNEXPECTED_FILE') {
        return res.status(400).json({
          message: `Too many files uploaded or incorrect field name. Expected field: ${options.field || 'images or datasheet'}. Maximum allowed is ${
            options.field ? 1 : fields.find(f => f.name === err.field)?.maxCount || 5
          }.`,
          errorCode: 'TOO_MANY_FILES',
          timestamp: new Date().toISOString(),
        });
      }
      return res.status(400).json({
        message: err.message,
        errorCode: err.code,
        timestamp: new Date().toISOString(),
      });
    } else if (err) {
      return res.status(400).json({
        message: err.message,
        errorCode: 'INVALID_FILE',
        timestamp: new Date().toISOString(),
      });
    }
    next();
  });
};

// Authentication middleware
const authMiddleware = async (req, res, next) => {
  try {
    if (!process.env.JWT_SECRET) {
      console.error('JWT_SECRET is not defined in environment variables');
      return res.status(500).json({
        message: 'Server configuration error',
        errorCode: 'CONFIG_ERROR',
        timestamp: new Date().toISOString(),
      });
    }

    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return next();
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
      return next();
    }

    const decoded = await jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    console.log(`User authenticated: ${decoded.id}`);
    next();
  } catch (err) {
    console.error('Token verification failed:', err.message);
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({
        message: 'Token has expired.',
        errorCode: 'TOKEN_EXPIRED',
        timestamp: new Date().toISOString(),
      });
    }
    res.status(401).json({
      message: 'Invalid token',
      errorCode: 'INVALID_TOKEN',
      timestamp: new Date().toISOString(),
    });
  }
};

// Role-based access control middleware
const restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        message: 'Authentication required',
        errorCode: 'NOT_AUTHENTICATED',
        timestamp: new Date().toISOString(),
      });
    }

    if (!req.user.role) {
      return res.status(403).json({
        message: 'User role not defined',
        errorCode: 'ROLE_NOT_DEFINED',
        timestamp: new Date().toISOString(),
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        message: `Access denied. Required role(s): ${roles.join(', ')}. Your role: ${req.user.role}`,
        errorCode: 'ACCESS_DENIED',
        timestamp: new Date().toISOString(),
      });
    }

    next();
  };
};

module.exports = { authMiddleware, restrictTo, upload };