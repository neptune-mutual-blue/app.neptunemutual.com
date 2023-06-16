import {
  DISCORD_LINK,
  GITHUB_REPONAME,
  GITHUB_USERNAME
} from '@/src/config/constants'
import React from 'react'

export default class ErrorBoundary extends React.Component {
  constructor (props) {
    super(props)
    this.state = { error: null }
  }

  static getDerivedStateFromError (error) {
    return { error }
  }

  render () {
    const { error } = this.state
    if (error !== null) {
      const encodedBody = encodeURIComponent(issueBody(error))

      return (
        <div className='p-12'>
          <div className='flex flex-col gap-4 p-12 m-auto bg-gray-800 rounded-lg'>
            <div className='text-2xl font-semibold'>Something went wrong</div>
            <div className='p-4 overflow-x-auto text-white bg-black rounded-md'>
              <code className='text-xs '>
                <pre>{error.stack}</pre>
              </code>
            </div>
            <div className='flex flex-col items-center gap-3'>
              <div>
                <a
                  id='create-github-issue-link'
                  href={`https://github.com/${GITHUB_USERNAME}/${GITHUB_REPONAME}/issues/new?assignees=&labels=bug&body=${encodedBody}&title=${encodeURIComponent(
                    `Crash report: \`${error.name}${
                      error.message && `: ${error.message}`
                    }\``
                  )}`}
                  target='_blank'
                  rel='noreferrer'
                >
                  <span>
                    Create an issue on GitHub
                    <span>↗</span>
                  </span>
                </a>
              </div>
              <div>
                <a
                  id='get-support-on-discord'
                  href={DISCORD_LINK}
                  target='_blank'
                  rel='noreferrer'
                >
                  <span>
                    Get support on Discord
                    <span>↗</span>
                  </span>
                </a>
              </div>
            </div>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

function getRelevantState () {
  const path = window.location.hash
  if (!path.startsWith('#/')) {
    return null
  }

  const pieces = path.substring(2).split(/[/\\?]/)
  switch (pieces[0]) {
    case 'swap':
      return 'swap'
    case 'add':
      if (pieces[1] === 'v2') { return 'mint' } else { return 'mintV3' }
    case 'remove':
      if (pieces[1] === 'v2') { return 'burn' } else { return 'burnV3' }
  }

  return null
}

function issueBody (error) {
  const relevantState = getRelevantState()
  const deviceData = window?.navigator?.userAgent ?? 'Unknown user agent'

  return `## URL
  
${window.location.href}

${
  relevantState
    ? `## \`${relevantState}\` state
    
\`\`\`json
${JSON.stringify({}, null, 2)}
\`\`\`
`
    : ''
}
${
  error.name &&
  `## Error

\`\`\`
${error.name}${error.message && `: ${error.message}`}
\`\`\`
`
}
${
  error.stack &&
  `## Stacktrace

\`\`\`
${error.stack}
\`\`\`
`
}
${
  deviceData &&
  `## Device data

\`\`\`json
${JSON.stringify(deviceData, null, 2)}
\`\`\`
`
}
`
}
