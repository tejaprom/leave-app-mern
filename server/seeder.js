// seeder.js
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Leave = require('./models/Leave'); // adjust path
dotenv.config();

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB Connected'))
  .catch((err) => console.log(err));

const dummyLeaves = [
  {
    name: 'Alice Johnson',
    reason: 'Sick Leave',
    fromDate: '2025-05-10',
    toDate: '2025-05-12',
    status: 'Pending',
  },
  {
    name: 'Bob Smith',
    reason: 'Vacation',
    fromDate: '2025-06-01',
    toDate: '2025-06-07',
    status: 'Approved',
  },
  {
    name: 'Charlie Brown',
    reason: 'Family Emergency',
    fromDate: '2025-05-20',
    toDate: '2025-05-21',
    status: 'Rejected',
  },
  {
    name: 'David Miller',
    reason: 'Conference',
    fromDate: '2025-05-25',
    toDate: '2025-05-27',
    status: 'Pending',
  },
];

const importData = async () => {
  try {
    await Leave.deleteMany();
    await Leave.insertMany(dummyLeaves);
    console.log('Dummy leave data inserted');
    process.exit();
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

importData();
