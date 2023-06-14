import { DiversifiedCoverRules } from '@/modules/my-liquidity/content/rules'
import { initiateTest } from '@/utils/unit-tests/helpers'
import { testData } from '@/utils/unit-tests/test-data'
import { screen } from '@testing-library/react'

const data = testData.coversAndProducts2.data

describe('DiversifiedCoverRules', () => {
  const props = {
    projectName: data.coverInfoDetails.projectName,
    coverKey: data.coverInfoDetails.coverKey,
    productKey: data.productInfoDetails.productKey
  }
  const { initialRender, rerenderFn } = initiateTest(DiversifiedCoverRules, props)

  beforeEach(() => {
    initialRender()
  })

  test('should render the download button', () => {
    const downloadButton = screen.getByTestId('download-button')
    expect(downloadButton).toBeInTheDocument()
  })

  test('should render the notes component', () => {
    const wrapper = screen.getByTestId('notes')
    expect(wrapper).toBeInTheDocument()
  })

  test('should render correct cover name', () => {
    rerenderFn({
      projectName: data.coverInfoDetails.coverName
    })
    const wrapper = screen.getByTestId('notes')
    expect(wrapper.textContent).toContain(data.coverInfoDetails.coverName)
  })
})
