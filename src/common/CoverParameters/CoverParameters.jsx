import { SeeMoreParagraph } from '@/common/SeeMoreParagraph'

const List = ({ type, children }) => {
  if (type === 'unordered') {
    return <ul className='pl-5 mt-5 list-disc'>{children}</ul>
  }
  if (type === 'ordered') {
    return <ol className='pl-5 mt-5 list-decimal'>{children}</ol>
  }
}

/**
 *
 * @param {{parameters: Array}} props
 * @returns
 */
const CoverParameters = ({ parameters }) => {
  if (!Array.isArray(parameters) || parameters.length === 0) {
    return null
  }

  return (
    <>
      {
        parameters.map((param, i) => (
          <div key={`parameter-${i}`}>
            <h4 className='mt-10 mb-6 font-semibold text-h4 font-sora'>
              {param.parameter}
            </h4>

            {param.text && <SeeMoreParagraph key={`parameter-paragraph-${i}`} text={param.text} />}

            <List type={param.list.type}>
              {param.list.items.map((item, x) => (
                <li key={x}>{item}</li>
              ))}
            </List>
          </div>
        ))
      }
    </>
  )
}

export { CoverParameters }
