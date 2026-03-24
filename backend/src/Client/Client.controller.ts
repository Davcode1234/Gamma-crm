import { ClientModel } from './Client.model';

export const ClientController = {
  async getClients() {
    const clients = await ClientModel.find().exec();
    return clients;
  },

  async getClient(id) {
    const client = await ClientModel.findById(id).exec();
    return client;
  },

  async addClient(client) {
    await ClientModel.validate(client);
    return await ClientModel.create(client);
  },

  async addManyClients(clients) {
    const inserted = await ClientModel.insertMany(clients);
    return await inserted;
  },

  async deleteManyClients(clientIds) {
    const deleted = await ClientModel.deleteMany({ _id: { $in: clientIds } });
    return await deleted;
  },

  async addNote(clientID, noteBody) {
    const client = await ClientModel.findById(clientID).exec();
    if (!client) {
      throw new Error(`Client with ID ${clientID} not found.`);
    }

    if (!Array.isArray(client.notes)) {
      client.notes = [];
    }
    client.notes.push(noteBody);
    await client.save();
    return client.notes;
  },

  async deleteNote(clientID, noteID) {
    const client = await ClientModel.findById(clientID).exec();
    if (!client) {
      throw new Error(`Client with ID ${clientID} not found.`);
    }
    client.notes = client.notes.filter(
      (note) => String(note._id) !== String(noteID),
    );
    await client.save();
    return client.notes;
  },

  async updateClient(id, clientBody) {
    return await ClientModel.findByIdAndUpdate(id, clientBody);
  },

  async deleteClient(id) {
    return await ClientModel.findByIdAndDelete(id);
  },

  async getClientsPerCompany(company) {
    const clients = await ClientController.getClients();

    const filteredClients = clients.filter((client) => {
      return client.company.toLowerCase() === company;
    });

    return await filteredClients;
  },
};
