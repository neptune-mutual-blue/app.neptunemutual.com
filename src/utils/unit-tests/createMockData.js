export function createRandomString(length) {
  let result = "";
  let characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * length));
  }

  return result;
}

export function createMockTableData({ count = 3, fields = [] }) {
  return [...Array(count)].map((_) => {
    let objectValue = {};

    fields.forEach((field) => {
      objectValue[field] = createRandomString();
    });

    return objectValue;
  });
}
