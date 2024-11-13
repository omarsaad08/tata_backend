const { RtcTokenBuilder, RtcRole } = require('agora-access-token');

// Your Agora App ID and App Certificate
const appID = 'd3cd34df63c14ee0853c1063429148ae';
const appCertificate = '701256341e5847a68266d640744dd945';
const channelName = 'test_channel'; // Channel name
const uid = 0; // User ID (unique per user)
const role = RtcRole.PUBLISHER; // Role (e.g., Publisher, Subscriber)

// Set token expiration (1 hour)
const expirationTimeInSeconds = 3600 * 100;
const currentTimestamp = Math.floor(Date.now() / 1000);
const privilegeExpiredTs = currentTimestamp + expirationTimeInSeconds;

// Generate the token
const token = RtcTokenBuilder.buildTokenWithUid(appID, appCertificate, channelName, uid, role, privilegeExpiredTs);

console.log('Generated Token:', token);
