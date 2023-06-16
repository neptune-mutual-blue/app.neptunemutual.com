module.exports = ({
  Trans: jest.fn(({ children }) => children),
  t: jest.fn((x) => x)
})
