const mongoose = require('mongoose');

const DEFAULT_URI = 'mongodb://127.0.0.1:27017/civiceye';

const connectToDB = async (uri = DEFAULT_URI) => {
  const effectiveUri = uri || DEFAULT_URI;
  const fallbackAtlasUri = process.env.MONGO_URI_FALLBACK;

  console.log(`Connecting to MongoDB URI: ${effectiveUri}`);

  try {
    await mongoose.connect(effectiveUri);
    console.log('mongodb connected successfully');
    return effectiveUri;
  } catch (error) {
    console.error(`mongodb error while connecting to ${effectiveUri}`, error);

    if (fallbackAtlasUri && fallbackAtlasUri !== effectiveUri) {
      console.warn(`Attempting non-SRV Atlas fallback URI`);
      try {
        await mongoose.connect(fallbackAtlasUri);
        console.log('mongodb connected successfully with Atlas non-SRV fallback');
        return fallbackAtlasUri;
      } catch (fallbackError) {
        console.error('Atlas non-SRV fallback failed', fallbackError);
      }
    }

    if (effectiveUri !== DEFAULT_URI) {
      console.warn(`Attempting fallback to local MongoDB at ${DEFAULT_URI}`);
      try {
        await mongoose.connect(DEFAULT_URI);
        console.log('mongodb connected successfully with local fallback');
        return DEFAULT_URI;
      } catch (localError) {
        console.error('local mongodb fallback failed', localError);
      }
    }

    throw error;
  }
};

module.exports = connectToDB;
