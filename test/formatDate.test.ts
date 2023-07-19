import { test, expect } from 'vitest'
import formatDate from '../formatDate'

test('formatDate returns correct formatted string for 1st, 2nd, 3rd and 4th', () => {
  const first = formatDate('2023-07-01T00:00:00Z')
  expect(first).toEqual(`1st July 2023`)

  const second = formatDate('2023-07-02T00:00:00Z')
  expect(second).toEqual(`2nd July 2023`)

  const third = formatDate('2023-07-03T00:00:00Z')
  expect(third).toEqual(`3rd July 2023`)

  const fourth = formatDate('2023-07-04T00:00:00Z')
  expect(fourth).toEqual(`4th July 2023`)
})

test('formatDate returns correct formatted string for different months', () => {
  const january = formatDate('2023-01-15T00:00:00Z')
  expect(january).toEqual(`15th January 2023`)

  const june = formatDate('2023-06-15T00:00:00Z')
  expect(june).toEqual(`15th June 2023`)

  const december = formatDate('2023-12-15T00:00:00Z')
  expect(december).toEqual(`15th December 2023`)
})

test('formatDate returns correct formatted string for different years', () => {
  const year2021 = formatDate('2021-07-20T00:00:00Z')
  expect(year2021).toEqual(`20th July 2021`)

  const year2023 = formatDate('2023-07-20T00:00:00Z')
  expect(year2023).toEqual(`20th July 2023`)

  const year2025 = formatDate('2025-07-20T00:00:00Z')
  expect(year2025).toEqual(`20th July 2025`)
})
