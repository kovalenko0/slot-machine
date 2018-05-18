import * as React from 'react'
import { Machine, State as MachineState } from './machine'
import { Props as MachineViewProps } from '../components/machine'
import * as renderer from 'react-test-renderer'

const allWheelsSpinning = (state: MachineState) => state.wheels.every(wheel => wheel.isSpinning)
const allWheelsStopped = (state: MachineState) => state.wheels.every(wheel => !wheel.isSpinning)
const spinningIsStopping = (state: MachineState) => {
  return (
    state.wheels.some(wheel => !wheel.isSpinning) &&
    !allWheelsStopped(state)
  )
}

const getViewMock = () => {
  const mock = jest.fn<MachineViewProps>()
  mock.mockReturnValue(<div></div>)
  return mock
}

const getSuite = () => {
  const view = getViewMock()
  const component = renderer.create(<Machine render={view} />)
  const instance = component.toTree().instance as Machine

  return {
    view,
    lastViewProps() {
      return view.mock.calls[0][0] as MachineViewProps
    },
    component,
    instance
  }
}

jest.useFakeTimers()

test('All wheels are spinning after spinning was started', () => {
  const suite = getSuite()

  suite.lastViewProps().onStartClick()

  expect(allWheelsSpinning(suite.instance.state)).toBe(true)
});

test('Spinning started after 5 seconds', () => {
  const suite = getSuite()
  
  jest.advanceTimersByTime(5000)
  expect(allWheelsSpinning(suite.instance.state)).toBe(true)
})

test('Spinning is being stopped after 10 seconds', () => {
  const suite = getSuite()

  suite.lastViewProps().onStartClick()
  jest.advanceTimersByTime(10000)

  expect(spinningIsStopping(suite.instance.state)).toBe(true)
})

const getResultsForSlotsCombination = (values: number[]) => {
  const suite = getSuite()

  return suite.instance.getResults(
    values.map(
      (v, index) => ({
        id: index,
        currentSymbol: v,
        isSpinning: false
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