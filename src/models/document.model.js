const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');

const documentSchema = new mongoose.Schema(
  {
    files: [
      {
        filename: {
          type: String,
          required: true,
          trim: true,
        },
        firebaseUrl: {
          type: String,
          required: true,
          trim: true,
        },
      },
    ],
    notarizationService: {
      id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'NotarizationService',
        required: true,
      },
      name: {
        type: String,
        required: true,
      },
      fieldId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'NotarizationField',
        required: true,
      },
      description: {
        type: String,
        required: true,
      },
      price: {
        type: Number,
        required: true,
      },
      required_documents: {
        type: [
          {
            type: String,
            required: true,
          },
        ],
        validate: {
          validator(v) {
            return v.every((doc) => typeof doc === 'string' || (typeof doc === 'object' && doc.name));
          },
          message: 'Required documents must be strings or objects with name property',
        },
      },

      code: {
        type: String,
        required: true,
      },
    },
    notarizationField: {
      id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'NotarizationField',
        required: true,
      },
      name: {
        type: String,
        required: true,
        unique: true,
      },
      description: {
        type: String,
        required: true,
      },
      name_en: {
        type: String,
        required: true,
      },
      code: {
        type: String,
        required: true,
      },
    },
    requesterInfo: {
      fullName: {
        type: String,
        required: true,
      },
      citizenId: {
        type: String,
        required: true,
      },
      phoneNumber: {
        type: String,
        required: true,
      },
      email: {
        type: String,
        required: true,
      },
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    output: [
      {
        filename: {
          type: String,
          required: true,
          trim: true,
        },
        firebaseUrl: {
          type: String,
          required: true,
          trim: true,
        },
        transactionHash: {
          type: String,
          required: false,
          default: null,
        },
        uploadedAt: {
          type: Date,
          required: true,
          default: Date.now,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

documentSchema.plugin(toJSON);
documentSchema.plugin(paginate);

const Document = mongoose.model('Document', documentSchema);

module.exports = Document;
