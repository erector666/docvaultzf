/**
 * Import function triggers from their respective submodules:
 *
 * import {onCall} from "firebase-functions/v2/https";
 * import {onDocumentWritten} from "firebase-functions/v2/firestore";
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

import {setGlobalOptions} from "firebase-functions";
import {onRequest} from "firebase-functions/https";
import {onCall} from "firebase-functions/v2/https";
import * as logger from "firebase-functions/logger";
import {initializeApp} from "firebase-admin/app";
import {getStorage} from "firebase-admin/storage";
import {getAuth} from "firebase-admin/auth";

// Start writing functions
// https://firebase.google.com/docs/functions/typescript

// For cost control, you can set the maximum number of containers that can be
// running at the same time. This helps mitigate the impact of unexpected
// traffic spikes by instead downgrading performance. This limit is a
// per-function limit. You can override the limit for each function using the
// `maxInstances` option in the function's options, e.g.
// `onRequest({ maxInstances: 5 }, (req, res) => { ... })`.
// NOTE: setGlobalOptions does not apply to functions using the v1 API. V1
// functions should each use functions.runWith({ maxInstances: 10 }) instead.
// In the v1 API, each function can only serve one request per container, so
// this will be the maximum concurrent request count.
setGlobalOptions({maxInstances: 10});

// Initialize Firebase Admin
initializeApp();

// Function to test Storage access
export const testStorage = onCall(async () => {
  try {
    // Check if storage is enabled via environment variable
    const storageEnabled = process.env.STORAGE_ENABLED === 'true';
    
    if (!storageEnabled) {
      logger.warn("Storage is disabled via environment configuration");
      return {
        success: false,
        message: "Storage is disabled",
        error: "Storage functionality is disabled",
      };
    }

    logger.info("Testing Storage access...");
    const storage = getStorage();
    const bucket = storage.bucket();

    logger.info("Storage bucket accessed successfully",
      {bucketName: bucket.name});
    return {
      success: true,
      message: "Storage is accessible",
      bucketName: bucket.name,
    };
  } catch (error) {
    logger.error("Storage access failed", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : String(error),
    };
  }
});

export const helloWorld = onRequest((request, response) => {
  logger.info("Hello logs!", {structuredData: true});
  response.send("Hello from Firebase!");
});

// Function to delete test users
export const deleteTestUsers = onCall(async () => {
  try {
    const auth = getAuth();
    
    // Get test user UIDs from environment variable
    const testUserUidsEnv = process.env.TEST_USER_UIDS;
    if (!testUserUidsEnv) {
      return {
        success: false,
        error: "TEST_USER_UIDS environment variable not set",
      };
    }
    
    const testUserUids = testUserUidsEnv.split(',').map(uid => uid.trim());

    logger.info("Deleting test users", {uids: testUserUids});
    
    const deleteUsersResult = await auth.deleteUsers(testUserUids);
    
    logger.info("Test users deletion completed", {
      successCount: deleteUsersResult.successCount,
      failureCount: deleteUsersResult.failureCount,
      errors: deleteUsersResult.errors
    });

    return {
      success: true,
      message: `Successfully deleted ${deleteUsersResult.successCount} test users`,
      successCount: deleteUsersResult.successCount,
      failureCount: deleteUsersResult.failureCount,
      errors: deleteUsersResult.errors
    };
  } catch (error) {
    logger.error("Failed to delete test users", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : String(error),
    };
  }
});
