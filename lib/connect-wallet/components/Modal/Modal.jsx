import { Root, Overlay, Content, Portal } from '@radix-ui/react-dialog'

export const Modal = ({ isOpen = false, children, onClose }) => {
  return (
    <Root open={isOpen} onOpenChange={onClose}>
      <Portal>
        <Overlay className='fixed inset-0 z-40 bg-black bg-opacity-50 backdrop-blur-md' />

        <Content className='fixed z-50 flex items-center justify-center w-full h-full px-4 transform -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2 max-h-90vh'>
          {children}
        </Content>
      </Portal>
    </Root>
  )
}
