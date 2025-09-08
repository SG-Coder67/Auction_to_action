const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  // We can add a plugin for a simple auto-incrementing ID if you like
  type: {
    type: String,
    required: true,
    enum: ['BID_WON', 'TRADE', 'MANUAL_ADJUSTMENT']
  },
  notes: { type: String },
  // This 'details' object will change based on the transaction type
  details: {
    type: mongoose.Schema.Types.Mixed,
    required: true
  }
}, { timestamps: true });

/*
Example `details` for a 'BID_WON':
{
  teamCode: "T05",
  itemCode: "R1-BID-07",
  amount: 7500
}

Example `details` for a 'TRADE':
{
  fromTeamCode: "T01",
  toTeamCode: "T08",
  fromTeamItems: ["R1-BID-03"],
  fromTeamMoney: 500,
  toTeamItems: [],
  toTeamMoney: 0
}
*/

module.exports = mongoose.model('Transaction', transactionSchema);