import { dbContext } from "../db/DbContext"
import { BadRequest } from "../utils/Errors"


class TaskService {

  async getTaskByListId(id) {
    let data = await dbContext.Task.find({ _id: id })
    if (!data) {
      throw new BadRequest("Invalid ID or you do not own this board")
    }
    return data
  }

  async create(rawData) {
    let data = await dbContext.Task.create(rawData)
    return data
  }

  async edit(id, userEmail, update) {
    let data = await dbContext.Task.findOneAndUpdate({ _id: id, creatorEmail: userEmail }, update, { new: true })
    if (!data) {
      throw new BadRequest("Invalid ID or you do not own this board");
    }
    return data;
  }

  async delete(id, userEmail) {
    let data = await dbContext.Task.findOneAndRemove({ _id: id, creatorEmail: userEmail });
    if (!data) {
      throw new BadRequest("Invalid ID or you do not own this board");
    }
  }

}


export const taskService = new TaskService()