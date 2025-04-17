const mongoose = require("mongoose");
const MemberRepository = require("../../interfaces/AccountRepository");
const {
  RolePriority,
  penNamePriority,
} = require("../../enums/HumanResourceEnum");

const MemberSchema = new mongoose.Schema({
  id: { type: Number, required: true, unique: true },
  fullName: { type: String, required: true },
  penName: { type: String },
  typeMember: { type: String },
  imgUrl: { type: String },
  phone: { type: String },
  gmail: { type: String },
  description: { type: String },
  department: { type: String, required: true },
  role: { type: String, required: true },
  isShow: { type: Boolean, default: true },
  language: { type: String, default: "VI" },
  createDate: { type: Date, default: Date.now },
  updateDate: { type: Date, default: Date.now },
  coppied_id: { type: Number, default:0 },
});

const MemberModel = mongoose.model("Member", MemberSchema);

class MongoMemberRepository extends MemberRepository {
  async create(data) {
    const newMember = new MemberModel(data);
    return await newMember.save();
  }

  async update(id, updateData) {
    return await MemberModel.findOneAndUpdate(
      { id },
      { ...updateData, updateDate: Date.now() },
      { new: true }
    );
  }

  async updateImgByIDnCoppiedID(id, img) {
    try {

  
      const result = await MemberModel.updateMany(
        {
          $or: [
            { id: id },
            { coppied_id: id }
          ]
        },
        {
          $set: {
            imgUrl: img,
            lastModified: Date.now()
          }
        }
      );
  
      return result;
    } catch (error) {
      console.error("Update error:", error);
      throw error;
    }
  }

  async delete(id) {
    return await MemberModel.findOneAndDelete({ id });
  }

  async findById(id) {
    return await MemberModel.findOne({ id });
  }

  async getLastId() {
    const lastMember = await MemberModel.findOne()
      .sort({ id: -1 })
      .select("id");
    return lastMember ? lastMember.id : 0;
  }

  async dynamicSearch2222(skip = 0, limit = 20, query) {
    const filter = {};

    if (query.search) {
      filter.$or = [{ fullName: { $regex: new RegExp(query.search, "i") } }];
    }

    if (query.role) {
      filter.role = query.role;
    }

    if (query.isShow) {
      filter.isShow = query.isShow;
    }

    if (query.language) {
      filter.language = query.language;
    }

    const results = await MemberModel.find(filter)
      .skip(skip)
      .limit(limit)
      .sort({ createDate: -1 });

    const roleOrder = ['PRESIDENT', 'VICE_PRESIDENT', 'CHAIRPERSON', 'GROUP_PRESIDENT',
         'ROOM_PRESIDENT', 'VICE_CHAIRMAN', 'GROUP_VICE_PRESIDENT', 'ROOM_VICE_PRESIDENT', 'MEMBER'];

    return results.sort((member1, member2) => {

      const roles1 = member1.role.split(', ').map(role => role.toUpperCase());
      
      const roles2 = member2.role.split(', ').map(role => role.toUpperCase());
      
      // Find the highest priority role in the roleOrder array
      const priority1 = Math.min(...roles1.map(role => roleOrder.indexOf(role)));
      const priority2 = Math.min(...roles2.map(role => roleOrder.indexOf(role)));
    
      return priority1 - priority2;
    });
  }

  async dynamicSearch(skip = 0, limit = 20, query) {
    const filter = {};
    if (query.search) {
      filter.$or = [{ fullName: { $regex: new RegExp(query.search, "i") } }];
    }

    let members = await MemberModel.find(filter);
    // auto sort 
    const roleOrder = ['PRESIDENT', 'VICE_PRESIDENT', 'CHAIRPERSON', 'GROUP_PRESIDENT',
      'ROOM_PRESIDENT', 'VICE_CHAIRMAN', 'GROUP_VICE_PRESIDENT', 'ROOM_VICE_PRESIDENT', 'MEMBER'];

      members =  members.sort((member1, member2) => {

        const roles1 = member1.role.split(', ').map(role => role.toUpperCase());
        
        const roles2 = member2.role.split(', ').map(role => role.toUpperCase());
        
        // Find the highest priority role in the roleOrder array
        const priority1 = Math.min(...roles1.map(role => roleOrder.indexOf(role)));
        const priority2 = Math.min(...roles2.map(role => roleOrder.indexOf(role)));
      
        return priority1 - priority2;
      });

    if (query.role && query.role !== '----') {
      members = members.filter(member => {
        return member.role.split(", ").includes(query.role);
      });
    }

    if (query.isShow) members = members.filter(member => member.isShow.toString() === query.isShow.toString());
    
    if (query.language) members = members.filter(member => member.language.toUpperCase() === query.language.toUpperCase());
   
    if (Number.isNaN(skip)) skip = 0;
    if (Number.isNaN(limit)) limit = 20;
    
    return members.slice(skip, skip + limit);
  }


  async getTotalByDynamicQuery(query) {
    const filter = {};

    if (query.search) {
      filter.$or = [{ fullName: { $regex: new RegExp(query.search, "i") } }];
    }

    if (query.role) {
      filter.role = query.role;
    }

    if (query.isShow) {
      filter.isShow = query.isShow;
    }

    if (query.language) {
      filter.language = query.language;
    }

    return await MemberModel.countDocuments(filter);
  }

  async getAllMembers() {
    return await MemberModel.find({});
  }
}

module.exports = MongoMemberRepository;
