
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
 * @param {{parameters: Array, titleClassName?: string}} props
 * @returns
 */
const CoverParameters = ({ parameters, titleClassName = 'mt-10 mb-6 font-semibold text-h4 font-sora' }) => {
  if (!Array.isArray(parameters) || parameters.length === 0) {
    return null
  }

  return (
    <>
      {
        parameters.map((param, i) => (
          <div key={`parameter-${i}`}>
            <h4 className={titleClassName}>
              {param.parameter}
            </h4>

            {param.text && <p key={`parameter-paragraph-${i}`}>{param.text}</p>}

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
