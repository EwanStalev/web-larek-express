import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IFile {
  fileName: string;
  originalName: string;
}

export interface IProduct extends Document {
  description?: string;
  image: IFile;
  title: string;
  category: string;
  price: number | null;
}

const productSchema: Schema<IProduct> = new mongoose.Schema(
  {
    description: {
      type: String,
    },
    image: {
      type: {
        fileName: { type: String, required: true },
        originalName: { type: String, required: true },
      },
      required: true,
    },
    title: {
      type: String,
      unique: true,
      minlength: 2,
      maxlength: 30,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      default: null,
    },
  },
  { versionKey: false },
);

const Product: Model<IProduct> = mongoose.model<IProduct>(
  'product',
  productSchema,
);

export default Product;
