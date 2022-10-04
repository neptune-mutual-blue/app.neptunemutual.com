import * as arrays from '@/src/utils/arrays'

const { mergeAlternatively, chunk } = arrays

describe('arrays test', () => {
  test('mergeAlternatively test', () => {
    const merged = mergeAlternatively([1], [2])
    expect(merged).toMatchObject([1, 2])
    expect(merged.length).toBe(2)
  })

  test('chunk test', () => {
    const arrayList = chunk(2, [1, 2, 3, 4, 5, 6])
    expect(arrayList).toMatchObject([
      [1, 2],
      [3, 4],
      [5, 6]
    ])
    expect(arrayList.length).toBe(3)
  })

  test('chunk test without second parameter', () => {
    const arrayList = chunk(2)
    expect(arrayList).toMatchObject([])
    expect(arrayList.length).toBe(0)
  })
})
