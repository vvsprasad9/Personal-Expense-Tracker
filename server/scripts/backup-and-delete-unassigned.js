/*
  Backup and delete unassigned expenses script
  - Copies all expenses where `user` is missing/null to `expenses_backup_unassigned` collection
  - Then deletes them from `expenses` collection

  Usage:
    node scripts/backup-and-delete-unassigned.js

  IMPORTANT: This will permanently remove documents from `expenses` after copying them to backup.
*/

const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Expense = require('../models/Expense');

dotenv.config({ path: require('path').resolve(__dirname, '..', '.env') });

async function run() {
  if (!process.env.MONGO_URI) {
    console.error('MONGO_URI not set in environment (.env)');
    process.exit(1);
  }

  await mongoose.connect(process.env.MONGO_URI);
  console.log('Connected to MongoDB');

  const db = mongoose.connection.db;

  try {
    // Find unassigned expenses
    const unassigned = await Expense.find({ $or: [{ user: { $exists: false } }, { user: null }] }).lean();
    console.log(`Found ${unassigned.length} unassigned expense(s)`);

    if (unassigned.length === 0) {
      console.log('Nothing to backup/delete. Exiting.');
      await mongoose.disconnect();
      return;
    }

    // Insert into backup collection
    const backupColl = db.collection('expenses_backup_unassigned');
    const insertResult = await backupColl.insertMany(unassigned);
    console.log(`Backed up ${insertResult.insertedCount} documents to expenses_backup_unassigned`);

    // Delete from original collection
    const ids = unassigned.map(d => d._id);
    const deleteResult = await db.collection('expenses').deleteMany({ _id: { $in: ids } });
    console.log(`Deleted ${deleteResult.deletedCount} documents from expenses`);

    console.log('Backup and delete completed successfully.');
  } catch (err) {
    console.error('Error during backup/delete:', err);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
}

run();
