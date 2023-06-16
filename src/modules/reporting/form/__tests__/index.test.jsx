import { screen, fireEvent } from '@testing-library/react'
import { initiateTest } from '@/utils/unit-tests/helpers'
import {
  InputField,
  InputDescription,
  ProofOfIncident
} from '@/modules/reporting/form'

describe('InputField test with all the attributes', () => {
  const { initialRender } = initiateTest(InputField, {
    label: 'Test Label',
    desc: 'Test Description',
    inputProps: {
      id: 'test_input',
      name: 'test',
      placeholder: 'Test Placeholder',
      required: true
    }
  })

  beforeEach(() => {
    initialRender()
  })

  test('Should render input, label, and description', () => {
    const label = screen.getByTestId('label-mock-component')
    expect(label).toHaveTextContent('Test Label')
    expect(label).toHaveAttribute('for', 'test_input')
    expect(label).toBeInTheDocument()

    const input = screen.getByRole('textbox')
    expect(input).toHaveAttribute('placeholder', 'Test Placeholder')
    expect(input).toHaveAttribute('name', 'test')
    expect(input).toHaveAttribute('id', 'test_input')
    expect(input).toBeRequired()
    expect(input).toBeInTheDocument()

    const desc = screen.getByText('Test Description')
    expect(desc).toBeInTheDocument()
  })
})

describe('InputField test with all the attributes', () => {
  const { initialRender } = initiateTest(InputField, {
    desc: 'Test Description',
    inputProps: {
      id: 'test_input',
      name: 'test',
      placeholder: 'Test Placeholder',
      required: true
    }
  })

  beforeEach(() => {
    initialRender()
  })

  test('Should render input and description without label', () => {
    const input = screen.getByRole('textbox')
    expect(input).toHaveAttribute('placeholder', 'Test Placeholder')
    expect(input).toHaveAttribute('name', 'test')
    expect(input).toHaveAttribute('id', 'test_input')
    expect(input).toBeRequired()
    expect(input).toBeInTheDocument()

    const desc = screen.getByText('Test Description')
    expect(desc).toBeInTheDocument()
  })
})

describe('InputDescription test with all the attributes', () => {
  const { initialRender } = initiateTest(InputDescription, {
    label: 'Test Label',
    inputProps: {
      id: 'test_input',
      name: 'test',
      placeholder: 'Test Placeholder',
      required: true
    }
  })

  beforeEach(() => {
    initialRender()
  })

  test('Should render input and description without label', () => {
    const label = screen.getByTestId('label-mock-component')
    expect(label).toHaveTextContent('Test Label')
    expect(label).toHaveAttribute('for', 'test_input')
    expect(label).toBeInTheDocument()

    const input = screen.getByRole('textbox')
    expect(input).toHaveAttribute('placeholder', 'Test Placeholder')
    expect(input).toHaveAttribute('name', 'test')
    expect(input).toHaveAttribute('id', 'test_input')
    expect(input).toHaveAttribute('required', '')
    expect(input).toBeInTheDocument()
  })
})

describe('ProofOfIncident test with all the attributes', () => {
  const { initialRender } = initiateTest(ProofOfIncident, { required: true })

  beforeEach(() => {
    initialRender()
  })

  test('Should render input, description, label, and a button for adding additional link', () => {
    const label = screen.getByTestId('label-mock-component')
    expect(label).toHaveTextContent('Proof of incident')
    expect(label).toHaveAttribute('for', 'incident_url')
    expect(label).toBeInTheDocument()

    const input = screen.getByRole('textbox')
    expect(input).toHaveAttribute('placeholder', 'https://')
    expect(input).toHaveAttribute('name', 'incident_url')
    expect(input).toHaveAttribute('id', 'incident_url')
    expect(input).toHaveAttribute('required', '')
    expect(input).toBeInTheDocument()

    const desc = screen.getByText(
      'Provide a URL confirming the nature of the incident.'
    )
    expect(desc).toBeInTheDocument()

    const button = screen.getByRole('button', { name: '+ Add new link' })
    expect(button).toHaveTextContent('+ Add new link')
    expect(button).toBeInTheDocument()
  })

  test('Add 2 more links', () => {
    const button = screen.getByRole('button', { name: '+ Add new link' })
    fireEvent.click(button)
    fireEvent.click(button)

    const inputs = screen.getAllByRole('textbox')
    expect(inputs.length).toEqual(3)

    expect(inputs[0]).toHaveAttribute('placeholder', 'https://')
    expect(inputs[0]).toHaveAttribute('name', 'incident_url')
    expect(inputs[0]).toHaveAttribute('id', 'incident_url')
    expect(inputs[0]).toHaveAttribute('required', '')
    expect(inputs[0]).toBeInTheDocument()

    expect(inputs[1]).toHaveAttribute('placeholder', 'https://')
    expect(inputs[1]).toHaveAttribute('name', 'incident_url')
    expect(inputs[1]).toHaveAttribute('id', 'incident_url_0')
    expect(inputs[1]).toHaveAttribute('required', '')
    expect(inputs[1]).toBeInTheDocument()

    expect(inputs[2]).toHaveAttribute('placeholder', 'https://')
    expect(inputs[2]).toHaveAttribute('name', 'incident_url')
    expect(inputs[2]).toHaveAttribute('id', 'incident_url_1')
    expect(inputs[2]).toHaveAttribute('required', '')
    expect(inputs[2]).toHaveAttribute('value', '')
    expect(inputs[2]).toBeInTheDocument()

    const buttons = screen.getAllByRole('button')
    expect(buttons.length).toEqual(3)

    const deleteButtons = screen.getAllByTitle('Delete')
    expect(deleteButtons.length).toEqual(2)
    expect(screen.queryByTestId('button-0')).not.toBeNull()
    expect(screen.queryByTestId('button-1')).not.toBeNull()
  })

  test('Remove one added link', () => {
    const button = screen.getByRole('button', { name: '+ Add new link' })
    fireEvent.click(button)
    fireEvent.click(button)

    const inputs = screen.getAllByRole('textbox')
    expect(inputs.length).toEqual(3)

    const buttons = screen.getAllByRole('button')
    expect(buttons.length).toEqual(3)

    const deleteButtons = screen.getAllByTitle('Delete')
    expect(deleteButtons.length).toEqual(2)
    expect(screen.queryByTestId('button-0')).not.toBeNull()
    expect(screen.queryByTestId('button-1')).not.toBeNull()

    fireEvent.click(deleteButtons[1])

    const newInputsAfterDelete = screen.getAllByRole('textbox')
    expect(newInputsAfterDelete.length).toEqual(2)

    const buttonsAfterDelete = screen.getAllByRole('button')
    expect(buttonsAfterDelete.length).toEqual(2)

    const deleteButtonsAfterDelete = screen.getAllByTitle('Delete')
    expect(deleteButtonsAfterDelete.length).toEqual(1)
  })

  test('Remove one added link without value in the middle', () => {
    const input = screen.getByRole('textbox')

    fireEvent.change(input, {
      target: { value: 'https://www.example.com/report_1' }
    })

    expect(input).toHaveAttribute('placeholder', 'https://')
    expect(input).toHaveAttribute('name', 'incident_url')
    expect(input).toHaveAttribute('id', 'incident_url')
    expect(input).toBeRequired()
    expect(input).toHaveValue('https://www.example.com/report_1')
    expect(input).toBeInTheDocument()

    const button = screen.getByRole('button', { name: '+ Add new link' })
    fireEvent.click(button)
    fireEvent.click(button)

    const inputs = screen.getAllByRole('textbox')
    expect(inputs.length).toEqual(3)

    fireEvent.change(inputs[2], {
      target: { value: 'https://www.example.com/report_3' }
    })

    expect(inputs[0]).toHaveAttribute('placeholder', 'https://')
    expect(inputs[0]).toHaveAttribute('name', 'incident_url')
    expect(inputs[0]).toHaveAttribute('id', 'incident_url')
    expect(inputs[0]).toHaveAttribute('required', '')
    expect(inputs[0]).toHaveValue('https://www.example.com/report_1')
    expect(inputs[0]).toBeInTheDocument()

    expect(inputs[1]).toHaveAttribute('placeholder', 'https://')
    expect(inputs[1]).toHaveAttribute('name', 'incident_url')
    expect(inputs[1]).toHaveAttribute('id', 'incident_url_0')
    expect(inputs[1]).toHaveAttribute('required', '')
    expect(inputs[1]).toHaveValue('')
    expect(inputs[1]).toBeInTheDocument()

    expect(inputs[2]).toHaveAttribute('placeholder', 'https://')
    expect(inputs[2]).toHaveAttribute('name', 'incident_url')
    expect(inputs[2]).toHaveAttribute('id', 'incident_url_1')
    expect(inputs[2]).toHaveAttribute('required', '')
    expect(inputs[2]).toHaveValue('https://www.example.com/report_3')
    expect(inputs[2]).toBeInTheDocument()

    const deleteButtons = screen.getAllByTitle('Delete')
    expect(deleteButtons.length).toEqual(2)
    expect(screen.queryByTestId('button-0')).not.toBeNull()
    expect(screen.queryByTestId('button-1')).not.toBeNull()

    fireEvent.click(deleteButtons[0])

    expect(inputs[0]).toHaveAttribute('placeholder', 'https://')
    expect(inputs[0]).toHaveAttribute('name', 'incident_url')
    expect(inputs[0]).toHaveAttribute('id', 'incident_url')
    expect(inputs[0]).toHaveAttribute('required', '')
    expect(inputs[0]).toHaveValue('https://www.example.com/report_1')
    expect(inputs[0]).toBeInTheDocument()

    expect(inputs[1]).toHaveAttribute('placeholder', 'https://')
    expect(inputs[1]).toHaveAttribute('name', 'incident_url')
    expect(inputs[1]).toHaveAttribute('id', 'incident_url_0')
    expect(inputs[1]).toHaveAttribute('required', '')
    expect(inputs[1]).toHaveValue('https://www.example.com/report_3')
    expect(inputs[1]).toBeInTheDocument()

    const deleteButtonsAfterDelete = screen.getAllByTitle('Delete')
    expect(deleteButtonsAfterDelete.length).toEqual(1)
  })

  test('Remove all added link', () => {
    const input = screen.getByRole('textbox')

    fireEvent.change(input, {
      target: { value: 'https://www.example.com/report_1' }
    })

    expect(input).toHaveAttribute('placeholder', 'https://')
    expect(input).toHaveAttribute('name', 'incident_url')
    expect(input).toHaveAttribute('id', 'incident_url')
    expect(input).toBeRequired()
    expect(input).toHaveValue('https://www.example.com/report_1')
    expect(input).toBeInTheDocument()

    const button = screen.getByRole('button', { name: '+ Add new link' })
    fireEvent.click(button)
    fireEvent.click(button)

    const inputs = screen.getAllByRole('textbox')
    expect(inputs.length).toEqual(3)

    fireEvent.change(inputs[1], {
      target: { value: 'https://www.example.com/report_2' }
    })

    fireEvent.change(inputs[2], {
      target: { value: 'https://www.example.com/report_3' }
    })

    expect(inputs[0]).toHaveAttribute('placeholder', 'https://')
    expect(inputs[0]).toHaveAttribute('name', 'incident_url')
    expect(inputs[0]).toHaveAttribute('id', 'incident_url')
    expect(inputs[0]).toHaveAttribute('required', '')
    expect(inputs[0]).toHaveValue('https://www.example.com/report_1')
    expect(inputs[0]).toBeInTheDocument()

    expect(inputs[1]).toHaveAttribute('placeholder', 'https://')
    expect(inputs[1]).toHaveAttribute('name', 'incident_url')
    expect(inputs[1]).toHaveAttribute('id', 'incident_url_0')
    expect(inputs[1]).toHaveAttribute('required')
    expect(inputs[1]).toHaveValue('https://www.example.com/report_2')
    expect(inputs[1]).toBeInTheDocument()

    expect(inputs[2]).toHaveAttribute('placeholder', 'https://')
    expect(inputs[2]).toHaveAttribute('name', 'incident_url')
    expect(inputs[2]).toHaveAttribute('id', 'incident_url_1')
    expect(inputs[2]).toHaveAttribute('required', '')
    expect(inputs[2]).toHaveValue('https://www.example.com/report_3')
    expect(inputs[2]).toBeInTheDocument()

    const deleteButtons = screen.getAllByTitle('Delete')
    expect(deleteButtons.length).toEqual(2)
    expect(screen.queryByTestId('button-0')).not.toBeNull()
    expect(screen.queryByTestId('button-1')).not.toBeNull()

    fireEvent.click(deleteButtons[1])

    const inputsAfterFirstDelete = screen.getAllByRole('textbox')
    expect(inputsAfterFirstDelete.length).toEqual(2)

    expect(inputsAfterFirstDelete[0]).toHaveAttribute(
      'placeholder',
      'https://'
    )
    expect(inputsAfterFirstDelete[0]).toHaveAttribute('name', 'incident_url')
    expect(inputsAfterFirstDelete[0]).toHaveAttribute('id', 'incident_url')
    expect(inputsAfterFirstDelete[0]).toHaveAttribute('required', '')
    expect(inputsAfterFirstDelete[0]).toHaveValue(
      'https://www.example.com/report_1'
    )
    expect(inputsAfterFirstDelete[0]).toBeInTheDocument()

    expect(inputsAfterFirstDelete[1]).toHaveAttribute(
      'placeholder',
      'https://'
    )
    expect(inputsAfterFirstDelete[1]).toHaveAttribute('name', 'incident_url')
    expect(inputsAfterFirstDelete[1]).toHaveAttribute('id', 'incident_url_0')
    expect(inputsAfterFirstDelete[1]).toHaveAttribute('required', '')
    expect(inputsAfterFirstDelete[1]).toHaveValue(
      'https://www.example.com/report_2'
    )
    expect(inputsAfterFirstDelete[1]).toBeInTheDocument()

    const deleteButtonsAfterDelete = screen.getAllByTitle('Delete')
    expect(deleteButtonsAfterDelete.length).toEqual(1)

    fireEvent.click(deleteButtons[0])

    const inputsAfterSecondDelete = screen.getAllByRole('textbox')
    expect(inputsAfterSecondDelete.length).toEqual(1)

    expect(inputsAfterSecondDelete[0]).toHaveAttribute(
      'placeholder',
      'https://'
    )
    expect(inputsAfterSecondDelete[0]).toHaveAttribute('name', 'incident_url')
    expect(inputsAfterSecondDelete[0]).toHaveAttribute('id', 'incident_url')
    expect(inputsAfterSecondDelete[0]).toHaveAttribute('required', '')
    expect(inputsAfterSecondDelete[0]).toHaveValue(
      'https://www.example.com/report_1'
    )
    expect(inputsAfterSecondDelete[0]).toBeInTheDocument()
  })
})
