import { Schema, model, Document } from 'mongoose';
export interface IAuctionItem extends Document {
  title: string;
  description: string;
  startingPrice: number;
  isSold: boolean;
}
const auctionItemSchema = new Schema<IAuctionItem>({
  title: { type: String, required: true },
  description: String,
  startingPrice: { type: Number, required: true },
  isSold: { type: Boolean, default: false }
});
export const AuctionItem = model<IAuctionItem>('AuctionItem', auctionItemSchema);