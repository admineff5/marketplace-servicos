const otplib = require('otplib');
const secret = otplib.generateSecret();
const token = otplib.generate(secret); // Gera o PIN
const isValid = otplib.verify({ token, secret });
console.log("Secret:", secret);
console.log("Token:", token);
console.log("isValid:", isValid ? "✅ SUCCESS" : "❌ FAIL");
if (otplib.generateURI) {
    console.log("generateURI exists");
}
