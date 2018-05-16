import React from 'react'
import { Machine } from './machine'
import renderer from 'react-test-renderer'

const allWheelsSpinning = state => state.wheels.every(wheel => wheel.isSpinning)
const allWheelsStopped = state => state.wheels.every(wheel => !wheel.isSpinning)
const spinningIsStopping = state => {
  return (
    state.wheels.some(wheel => !wheel.isSpinning) &&
    !allWheelsStopped(state)
  )
}

jest.useFakeTimers()

test('All wheels are spinning after spinning was started', () => {
  const component = renderer.create(<Machine />)
  const instance = component.getInstance()

  instance.startSpinning()

  let tree = component.toJSON()

  expect(allWheelsSpinning(instance.state)).toBe(true)
});

test('Spinning started after 5 seconds', () => {
  const component = renderer.create(<Machine />)
  const instance = component.getInstance()
  
  jest.advanceTimersByTime(5000)
  expect(allWheelsSpinning(instance.state)).toBe(true)
})

test('Spinning is being stopped after 10 seconds', () => {
  const component = renderer.create(<Machine />)
  const instance = component.getInstance()

  instance.startSpinning()
  jest.advanceTimersByTime(10000)
  expect(spinningIsStopping(instance.state)).toBe(true)
})

const getResultsForSlotsCombination = values => {
  const component = renderer.create(<Machine />)
  const instance = component.getInstance()
  return instance.getResults(
    values.map(
      (v, index) => ({
        id: index,
        currentSymbol: v
      })
    )
  )
}

test('Not matching slots should result in no reward', () => {
  const results = getResultsForSlotsCombination([1, 0, 3])
  expect(results.reward).toBe(0)
})

test('Two slots should result in $10 reward', () => {
  const results = getResultsForSlotsCombination([3, 1, 3])
  expect(results.reward).toBe(10)
})

test('Two consecutive slots should result in $20 reward', () => {
  const results = {
    option1: getResultsForSlotsCombination([3, 3, 2]).reward,
    option2: getResultsForSlotsCombination([1, 2, 2]).reward
  }
  
  expect(results).toEqual({
    option1: 20,
    option2: 20
  })
})

test('Three equal slots should result in $100 reward', () => {
  const results = getResultsForSlotsCombination([2, 2, 2])
  expect(results.reward).toBe(100)
})