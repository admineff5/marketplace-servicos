import otplib from 'otplib';
console.log("Otplib default export keys:", Object.keys(otplib || {}));
if (otplib && otplib.authenticator) {
    console.log("✅ Authenticator found in default export!");
} else {
    console.log("❌ Authenticator NOT found in default export.");
}
