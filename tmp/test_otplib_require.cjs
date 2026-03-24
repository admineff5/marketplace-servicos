const { authenticator } = require('otplib');
console.log(authenticator ? "✅ Authenticator found via require!" : "❌ Authenticator NOT found via require.");
if (authenticator) {
    console.log("Method check:", typeof authenticator.generateSecret);
}
