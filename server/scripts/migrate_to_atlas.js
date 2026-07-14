const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const migrate = async () => {
  const localUri = process.env.MONGO_URI; // Your current local URI
  const atlasUri = process.env.MONGO_URI_ATLAS;

  if (!localUri || !localUri.includes('127.0.0.1') && !localUri.includes('localhost')) {
    console.error('❌ MONGO_URI in .env does not look like a local connection.');
    process.exit(1);
  }

  if (!atlasUri || !atlasUri.includes('mongodb+srv')) {
    console.error('❌ MONGO_URI_ATLAS is missing or invalid in your .env file.');
    console.error('Please add MONGO_URI_ATLAS=mongodb+srv://... to your server/.env');
    process.exit(1);
  }

  console.log('🔄 Starting Data Migration to MongoDB Atlas...');
  
  let localConnection;
  let atlasConnection;

  try {
    // 1. Connect to Local DB
    console.log(`Connecting to Local Database: ${localUri}`);
    localConnection = await mongoose.createConnection(localUri).asPromise();
    console.log('✅ Connected to Local Database');

    // 2. Connect to Atlas DB
    console.log(`Connecting to Atlas Database: ${atlasUri}`);
    atlasConnection = await mongoose.createConnection(atlasUri).asPromise();
    console.log('✅ Connected to Atlas Database');

    // 3. Get all collections from Local DB
    const collections = await localConnection.db.listCollections().toArray();
    
    if (collections.length === 0) {
      console.log('⚠️ No collections found in the local database to migrate.');
    }

    // 4. Migrate each collection
    for (const collectionInfo of collections) {
      const collectionName = collectionInfo.name;
      console.log(`\n📦 Migrating collection: ${collectionName}...`);

      const localCollection = localConnection.collection(collectionName);
      const atlasCollection = atlasConnection.collection(collectionName);

      // Fetch all documents from local
      const documents = await localCollection.find({}).toArray();
      
      if (documents.length === 0) {
        console.log(`   └─ No documents found in ${collectionName}. Skipping.`);
        continue;
      }

      console.log(`   └─ Found ${documents.length} documents. Copying to Atlas...`);

      // Clear existing data in Atlas for this collection to avoid duplicates during migration
      await atlasCollection.deleteMany({});
      
      // Insert into Atlas
      await atlasCollection.insertMany(documents);
      console.log(`   └─ ✅ Successfully migrated ${documents.length} documents to Atlas.`);
    }

    console.log('\n🎉 MIGRATION COMPLETE! All local data is now in MongoDB Atlas.');
    console.log('⚠️ NEXT STEP: Change MONGO_URI in your .env to your Atlas connection string to start using it!');
  } catch (error) {
    console.error('\n❌ Migration Failed:', error);
  } finally {
    // 5. Cleanup connections
    if (localConnection) await localConnection.close();
    if (atlasConnection) await atlasConnection.close();
    process.exit(0);
  }
};

migrate();
