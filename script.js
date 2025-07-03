// Character sets
const characterSets = {
  uppercase: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
  lowercase: "abcdefghijklmnopqrstuvwxyz",
  numbers: "0123456789",
  symbols: "!@#$%^&*()_+-=[]{}|;:,.<>?",
};

// DOM Elements
const passwordOutput = document.getElementById("passwordOutput");
const lengthSlider = document.getElementById("lengthSlider");
const lengthValue = document.getElementById("lengthValue");
const generateBtn = document.getElementById("generateBtn");
const copyBtn = document.getElementById("copyBtn");
const copyFeedback = document.getElementById("copyFeedback");
const strengthLabel = document.getElementById("strengthLabel");

// Checkbox elements
const uppercaseCheck = document.getElementById("uppercase");
const lowercaseCheck = document.getElementById("lowercase");
const numbersCheck = document.getElementById("numbers");
const symbolsCheck = document.getElementById("symbols");

// Initialize
document.addEventListener("DOMContentLoaded", () => {
  generatePassword();
  updateStrengthIndicator();
});

// Event Listeners
generateBtn.addEventListener("click", generatePassword);
copyBtn.addEventListener("click", copyToClipboard);
lengthSlider.addEventListener("input", updateLength);

// Add change listeners to all checkboxes
[uppercaseCheck, lowercaseCheck, numbersCheck, symbolsCheck].forEach(
  (checkbox) => {
    checkbox.addEventListener("change", () => {
      if (validateOptions()) {
        generatePassword();
      }
    });
  }
);

// Update length display and regenerate password
function updateLength() {
  lengthValue.textContent = lengthSlider.value;
  generatePassword();
}

// Validate at least one option is selected
function validateOptions() {
  const hasSelection =
    uppercaseCheck.checked ||
    lowercaseCheck.checked ||
    numbersCheck.checked ||
    symbolsCheck.checked;

  if (!hasSelection) {
    alert("Please select at least one character type!");
    uppercaseCheck.checked = true;
    return false;
  }
  return true;
}

// Generate password based on selected options
function generatePassword() {
  if (!validateOptions()) return;

  let availableChars = "";
  let password = "";

  // Build character set based on selections
  if (uppercaseCheck.checked) availableChars += characterSets.uppercase;
  if (lowercaseCheck.checked) availableChars += characterSets.lowercase;
  if (numbersCheck.checked) availableChars += characterSets.numbers;
  if (symbolsCheck.checked) availableChars += characterSets.symbols;

  const length = parseInt(lengthSlider.value);

  // Generate password
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * availableChars.length);
    password += availableChars[randomIndex];
  }

  // Ensure at least one character from each selected type
  password = ensureCharacterTypes(password, length);

  passwordOutput.value = password;
  updateStrengthIndicator();
}

// Ensure password contains at least one character from each selected type
function ensureCharacterTypes(password, length) {
  let newPassword = password.split("");
  let index = 0;

  if (
    uppercaseCheck.checked &&
    !hasCharacterType(password, characterSets.uppercase)
  ) {
    newPassword[index++] = getRandomChar(characterSets.uppercase);
  }
  if (
    lowercaseCheck.checked &&
    !hasCharacterType(password, characterSets.lowercase)
  ) {
    newPassword[index++] = getRandomChar(characterSets.lowercase);
  }
  if (
    numbersCheck.checked &&
    !hasCharacterType(password, characterSets.numbers)
  ) {
    newPassword[index++] = getRandomChar(characterSets.numbers);
  }
  if (
    symbolsCheck.checked &&
    !hasCharacterType(password, characterSets.symbols)
  ) {
    newPassword[index++] = getRandomChar(characterSets.symbols);
  }

  // Shuffle the password
  return shuffleArray(newPassword).join("");
}

// Check if password contains character from specific set
function hasCharacterType(password, charSet) {
  return password.split("").some((char) => charSet.includes(char));
}

// Get random character from set
function getRandomChar(charSet) {
  return charSet[Math.floor(Math.random() * charSet.length)];
}

// Shuffle array (Fisher-Yates algorithm)
function shuffleArray(array) {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

// Copy password to clipboard
async function copyToClipboard() {
  if (!passwordOutput.value) {
    alert("Please generate a password first!");
    return;
  }

  try {
    // Modern clipboard API
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(passwordOutput.value);
      showCopyFeedback();
    } else {
      // Fallback for older browsers
      passwordOutput.select();
      passwordOutput.setSelectionRange(0, 99999);
      document.execCommand("copy");
      passwordOutput.blur();
      showCopyFeedback();
    }
  } catch (err) {
    console.error("Failed to copy password:", err);
    alert(
      "Failed to copy password. Please try selecting and copying manually."
    );
  }
}

// Show copy feedback message
function showCopyFeedback() {
  copyFeedback.classList.add("show");
  setTimeout(() => {
    copyFeedback.classList.remove("show");
  }, 2000);
}

// Calculate and update password strength
function updateStrengthIndicator() {
  const password = passwordOutput.value;
  const strength = calculateStrength(password);

  // Remove all strength classes
  const strengthIndicator = document.querySelector(".strength-indicator");
  strengthIndicator.classList.remove(
    "strength-weak",
    "strength-medium",
    "strength-strong"
  );

  // Add appropriate class and update label
  if (strength === "strong") {
    strengthIndicator.classList.add("strength-strong");
    strengthLabel.textContent = "Strong";
  } else if (strength === "medium") {
    strengthIndicator.classList.add("strength-medium");
    strengthLabel.textContent = "Medium";
  } else if (strength === "weak") {
    strengthIndicator.classList.add("strength-weak");
    strengthLabel.textContent = "Weak";
  } else {
    strengthLabel.textContent = "-";
  }
}

// Calculate password strength
function calculateStrength(password) {
  if (!password) return null;

  const length = password.length;
  let typesCount = 0;

  // Count character types present
  if (hasCharacterType(password, characterSets.uppercase)) typesCount++;
  if (hasCharacterType(password, characterSets.lowercase)) typesCount++;
  if (hasCharacterType(password, characterSets.numbers)) typesCount++;
  if (hasCharacterType(password, characterSets.symbols)) typesCount++;

  // Determine strength based on length and character types
  if (length >= 13 && typesCount >= 3) {
    return "strong";
  } else if (length >= 8 && typesCount >= 2) {
    return "medium";
  } else {
    return "weak";
  }
}

// Keyboard shortcuts
document.addEventListener("keydown", (e) => {
  // Ctrl/Cmd + G to generate
  if ((e.ctrlKey || e.metaKey) && e.key === "g") {
    e.preventDefault();
    generatePassword();
  }
  // Ctrl/Cmd + C to copy when password field is focused
  if (
    (e.ctrlKey || e.metaKey) &&
    e.key === "c" &&
    document.activeElement === passwordOutput
  ) {
    e.preventDefault();
    copyToClipboard();
  }
});
