import { Container } from '@/common/Container/Container'
import { Tab } from '@/common/Tab/Tab'
import Link from 'next/link'

export const TabNav = ({ activeTab, headers }) => {
  return (
    <div className='border-b border-b-B0C4DB' data-testid='tab-nav-container'>
      <Container className='flex'>
        {headers.map((header) => (
          <Tab key={header.name} active={activeTab == header.name}>
            <Link href={header.href}>
              <a className='inline-block px-2 py-2 xs:px-5 sm:px-6'>
                {header.displayAs}
              </a>
            </Link>
          </Tab>
        ))}
      </Container>
    </div>
  )
}
