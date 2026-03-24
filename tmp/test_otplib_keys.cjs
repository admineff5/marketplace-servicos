const otplib = require('otplib');
console.log("Otplib keys:", Object.keys(otplib || {}));
if (otplib && otplib.Authenticator) {
    console.log("✅ Authenticator Class found!");
}
