// Caesar Cipher (ROT13 cipher)
export function decryptRot13(str) {
  let decryptedStr = "";
  for (let i = 0; i < str.length; i++) {
    let code = str.charCodeAt(i);
    // Check if it's a letter uppercase only
    if (code >= 65 && code <= 90) {
      // Find that character’s location within the alphabet.
      code -= 65;
      code = modHelper(code + 13, 26);
      code += 65;
    }
    decryptedStr += String.fromCharCode(code);
  }
  return decryptedStr;
}

export function encryptRot13(str) {
  let encryptedStr = "";
  for (let i = 0; i < str.length; i++) {
    let code = str.charCodeAt(i);
    // Check if it's a letter uppercase only
    if (code >= 65 && code <= 90) {
      // Find that character’s location within the alphabet.
      code -= 65;
      code = modHelper(code - 13, 26);
      code += 65;
    }
    encryptedStr += String.fromCharCode(code);
  }
  return encryptedStr;
}

function modHelper(n, p) {
  if (n < 0) n = p - (Math.abs(n) % p);
  return n % p;
}
