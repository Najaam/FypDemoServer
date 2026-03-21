const { add } = require("./sample")

describe("add function", () => {
  test("normal input case", () => {
    expect(add(1, 2)).toBe(3)
  })

  test("large numbers", () => {
    expect(add(10000, 20000)).toBe(30000)
  })

  test("negative numbers", () => {
    expect(add(-10, -20)).toBe(-30)
  })

  test("zero input", () => {
    expect(add(0, 0)).toBe(0)
  })

  test("one positive and one negative", () => {
    expect(add(-5, 5)).toBe(0)
  })

  test("invalid input (non-numeric)", () => {
    expect(() => add("a", 1)).toThrow()
  })
})