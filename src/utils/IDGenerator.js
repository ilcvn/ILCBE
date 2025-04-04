function generateId(length = 6) {
  let id = "";
  const numbers = "0123456789";

  for (let i = 0; i < length; i++) {
    id += numbers.charAt(Math.floor(Math.random() * numbers.length));
  }

  return id;
}

module.exports = generateId;
