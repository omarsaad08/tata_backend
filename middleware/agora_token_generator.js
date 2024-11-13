const { RtcTokenBuilder, RtcRole } = require('agora-access-token');

app.post('/generate-token', (req, res) => {
  const appId = 'd3cd34df63c14ee0853c1063429148ae';
  const appCertificate = '9dd0bfd91e7444399b27f6f8a1ecf55d'; // Get this from Agora Console
  const channelName = req.body.channelName; // Room ID
  const uid = req.body.uid; // User ID from the request body
  const role = RtcRole.PUBLISHER; // Role of the user (Publisher or Subscriber)
  const expirationTimeInSeconds = 3600; // Token expiration time

  const privilegeExpiredTs = Math.floor(Date.now() / 1000) + expirationTimeInSeconds;

  // Generate the token
  const token = RtcTokenBuilder.buildTokenWithUid(appId, appCertificate, channelName, uid, role, privilegeExpiredTs);

  res.json({ token });
});
