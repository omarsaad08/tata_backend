const mongoose = require('mongoose');

const BookingSchema = mongoose.Schema({

})
const hospitalSchema = mongoose.Schema({
  doctorsList: {
    type: Array,
    required: true
  },
  todaysBookings: {
    type: Map,
    required: false
  },
  historyofBookings: {
    type: Map,
    required: false
  },
  staff: {
    type: Map,
    required: false
  }
});
