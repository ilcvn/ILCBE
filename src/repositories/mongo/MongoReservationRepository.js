const mongoose = require("mongoose");

const reservationSchema = new mongoose.Schema({
  id: { type: Number, required: true, unique: true },
  fullName: { type: String, required: true },
  content: { type: String, required: true },
  status: { type: String, required: true },
  phone: { type: String },
  gmail: { type: String },
  address: { type: String },
  subject: { type: String },
  file: { type: String },
  consultDate: { type: Date, required: true },
  createdDate: { type: Date, default: Date.now },
  updatedDate: { type: Date, default: Date.now },
});

const ReservationEntity = mongoose.model("Reservation", reservationSchema);

class MongoReservationRepository {
  async create(data) {
    const newReservation = new ReservationEntity(data);
    return await newReservation.save();
  }

  async update(id, updateData) {
    return await ReservationEntity.findOneAndUpdate(
      { id: id },
      { ...updateData, updatedDate: Date.now() },
      { new: true }
    );
  }

  async delete(id) {
    return await ReservationEntity.findOneAndDelete({ id: id });
  }

  async findById(id) {
    return await ReservationEntity.findOne({ id: id });
  }

  async getLastId() {
    const lastReservation = await ReservationEntity.findOne()
      .sort({ id: -1 })
      .select("id");
    return lastReservation ? lastReservation.id : 0;
  }

  async dynamicSearch(skip = 0, limit = 20, query) {
    const filter = {};

    if (query.search) {
      filter.$or = [{ fullName: { $regex: new RegExp(query.search, "i") } }];
    }

    if (query.status) {
      filter.status = query.status;
    }

    if (query.type) {
      filter.type = query.type;
    }

    if (query.startDate || query.endDate) {
      filter.consultDate = {};
      if (query.startDate) filter.consultDate.$gte = new Date(query.startDate);
      if (query.endDate) filter.consultDate.$lte = new Date(query.endDate);
    }

    const results = await ReservationEntity.find(filter)
      .skip(skip)
      .limit(limit)
      .sort({ consultDate: +1 }); // sort theo consult r nhé

    return results;
  }

  async getTotalByDynamicQuery(query) {
    const filter = {};

    if (query.search) {
      filter.$or = [{ fullName: { $regex: new RegExp(query.search, "i") } }];
    }

    if (query.status) {
      filter.status = query.status;
    }

    if (query.type) {
      filter.type = query.type;
    }

    if (query.startDate || query.endDate) {
      filter.consultDate = {};
      if (query.startDate) filter.consultDate.$gte = new Date(query.startDate);
      if (query.endDate) filter.consultDate.$lte = new Date(query.endDate);
    }

    return await ReservationEntity.countDocuments(filter);
  }

  async getAllReservations() {
    return await ReservationEntity.find({});
  }
}

module.exports = MongoReservationRepository;
