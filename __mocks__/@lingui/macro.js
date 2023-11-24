module.exports = ({
  Trans: jest.fn(({ children }) => { return children }),
  t: jest.fn((x) => { return x })
})
